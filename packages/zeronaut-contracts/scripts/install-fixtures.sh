#!/bin/bash

# Navigate to the root directory of the project
cd "$(dirname "$0")/.."

# Find all directories under test/fixture-projects
for dir in test/fixture-projects/*/; do
    if [ -d "$dir" ]; then
        echo "Building fixtures in $dir"

        # Navigate into the directory
        cd "$dir"

        # Run npm install
        npm i

        # Check if the installation was successful
        if [ $? -eq 0 ]; then
            echo "Installation successful for $dir"
        else
            echo "Installation failed for $dir"
            exit 1
        fi

        # Navigate back to the root directory
        cd - > /dev/null
    fi
done

echo "All fixtures installed successfully"
