#!/bin/bash

# Smart seeding script that runs inside PostgreSQL container
# This script checks which seeds have been applied and only runs new ones

set -e

# Database connection parameters
DB_NAME=${POSTGRES_DB:-basic_auth_db}
DB_USER=${POSTGRES_USER:-user}

echo "=== Smart Seeding Runner ==="
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "================================"

# Function to check if a seed has been applied
seed_exists() {
    local seed_name=$1
    local count=$(psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM seeds WHERE seed_name = '$seed_name';" 2>/dev/null | tr -d ' ')
    
    # If seeds table doesn't exist, return 0 (seed not applied)
    if [ $? -ne 0 ]; then
        echo 0
    else
        echo $count
    fi
}

# Function to run a seed
run_seed() {
    local seed_file=$1
    local seed_name=$(basename "$seed_file" .sql)
    
    echo "Checking seed: $seed_name"
    
    # Check if seed has already been applied
    local exists=$(seed_exists $seed_name)
    
    if [ "$exists" -gt 0 ]; then
        echo "  ✓ Seed $seed_name already applied, skipping..."
        return 0
    fi
    
    echo "  → Running seed $seed_name..."
    
    # Run the seed
    if psql -U $DB_USER -d $DB_NAME -f "$seed_file"; then
        echo "  → Recording seed $seed_name in seeds table..."
        
        # Record the seed (only if seeds table exists)
        if psql -U $DB_USER -d $DB_NAME -c "SELECT 1 FROM information_schema.tables WHERE table_name = 'seeds';" | grep -q 1; then
            local description="Seed file: $seed_name"
            psql -U $DB_USER -d $DB_NAME -c "INSERT INTO seeds (seed_name, description) VALUES ('$seed_name', '$description') ON CONFLICT (seed_name) DO NOTHING;"
        fi
        
        echo "  ✓ Seed $seed_name completed successfully"
    else
        echo "  ✗ Seed $seed_name failed!"
        exit 1
    fi
}

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -U $DB_USER -d $DB_NAME; do
    sleep 1
done
echo "PostgreSQL is ready!"

# Find and run seeds in order
echo "Scanning for seed files..."
seed_files=$(find /seeds -name "*.sql" | sort)

if [ -z "$seed_files" ]; then
    echo "No seed files found in /seeds/"
    exit 0
fi

echo "Found seeds:"
for file in $seed_files; do
    echo "  - $(basename "$file")"
done
echo ""

# Run each seed
for seed_file in $seed_files; do
    run_seed "$seed_file"
done

echo ""
echo "=== Seeding Summary ==="
# Show applied seeds
echo "Currently applied seeds:"
psql -U $DB_USER -d $DB_NAME -c "SELECT seed_name, applied_at FROM seeds ORDER BY applied_at;" 2>/dev/null || echo "No seeds table found"

echo ""
echo "All seeds processed successfully!"