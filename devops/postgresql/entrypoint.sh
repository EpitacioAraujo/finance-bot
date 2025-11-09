#!/bin/bash

# Custom entrypoint that runs PostgreSQL and then executes migrations
set -e

echo "=== PostgreSQL Container Starting ==="

# Start PostgreSQL in the background using the original entrypoint
echo "Starting PostgreSQL server..."
docker-entrypoint.sh postgres &

# Store the PostgreSQL process ID
PG_PID=$!

# Function to run migrations and seeds after PostgreSQL is ready
run_database_setup() {
    echo "Waiting for PostgreSQL to be ready for database setup..."
    
    # Wait for PostgreSQL to be ready
    until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; do
        sleep 2
        echo "  Still waiting for PostgreSQL..."
    done
    
    echo "PostgreSQL is ready! Running database setup..."
    
    # Run migrations first
    echo "Step 1: Running migrations..."
    /usr/local/bin/run-migrations.sh
    
    # Run seeds after migrations
    echo "Step 2: Running seeds..."
    /usr/local/bin/run-seeds.sh
    
    echo "Database setup completed!"
}

# Run database setup in background after PostgreSQL starts
run_database_setup &

# Wait for PostgreSQL process to finish (keeps container running)
wait $PG_PID