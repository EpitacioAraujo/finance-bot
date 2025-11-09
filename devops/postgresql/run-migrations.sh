#!/bin/bash

# Smart migration script that runs inside PostgreSQL container
# This script checks which migrations have been applied and only runs new ones

set -e

# Database connection parameters
DB_NAME=${POSTGRES_DB:-basic_auth_db}
DB_USER=${POSTGRES_USER:-user}

echo "=== Smart Migration Runner ==="
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "================================"

# Function to check if a migration has been applied
migration_exists() {
    local migration_name=$1
    local count=$(psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM migrations WHERE migration_name = '$migration_name';" 2>/dev/null | tr -d ' ')
    
    # If migrations table doesn't exist, return 0 (migration not applied)
    if [ $? -ne 0 ]; then
        echo 0
    else
        echo $count
    fi
}

# Function to run a migration
run_migration() {
    local migration_file=$1
    local migration_name=$(basename "$migration_file" .sql)
    
    echo "Checking migration: $migration_name"
    
    # Check if migration has already been applied
    local exists=$(migration_exists $migration_name)
    
    if [ "$exists" -gt 0 ]; then
        echo "  ✓ Migration $migration_name already applied, skipping..."
        return 0
    fi
    
    echo "  → Running migration $migration_name..."
    
    # Run the migration
    if psql -U $DB_USER -d $DB_NAME -f "$migration_file"; then
        echo "  → Recording migration $migration_name in migrations table..."
        
        # Record the migration (only if migrations table exists)
        if psql -U $DB_USER -d $DB_NAME -c "SELECT 1 FROM information_schema.tables WHERE table_name = 'migrations';" | grep -q 1; then
            local description="Migration file: $migration_name"
            psql -U $DB_USER -d $DB_NAME -c "INSERT INTO migrations (migration_name, description) VALUES ('$migration_name', '$description') ON CONFLICT (migration_name) DO NOTHING;"
        fi
        
        echo "  ✓ Migration $migration_name completed successfully"
    else
        echo "  ✗ Migration $migration_name failed!"
        exit 1
    fi
}

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -U $DB_USER -d $DB_NAME; do
    sleep 1
done
echo "PostgreSQL is ready!"

# Find and run migrations in order
echo "Scanning for migration files..."
migration_files=$(find /migrations -name "*.sql" | sort)

if [ -z "$migration_files" ]; then
    echo "No migration files found in /migrations/"
    exit 0
fi

echo "Found migrations:"
for file in $migration_files; do
    echo "  - $(basename "$file")"
done
echo ""

# Run each migration
for migration_file in $migration_files; do
    run_migration "$migration_file"
done

echo ""
echo "=== Migration Summary ==="
# Show applied migrations
echo "Currently applied migrations:"
psql -U $DB_USER -d $DB_NAME -c "SELECT migration_name, applied_at FROM migrations ORDER BY applied_at;" 2>/dev/null || echo "No migrations table found"

echo ""
echo "All migrations processed successfully!"