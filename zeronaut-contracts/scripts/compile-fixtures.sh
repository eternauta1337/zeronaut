#!/bin/bash

# Navigate to the root directory of the project
cd "$(dirname "$0")/.."

# Find all directories under test/fixture-projects
for dir in test/fixture-projects/*/; do
    if [ -d "$dir" ]; then
        echo "Compiling fixtures in $dir"

        # Navigate into the directory
        cd "$dir"

        # Run npx hardhat compile
        npx hardhat compile

        # Check if the compilation was successful
        if [ $? -eq 0 ]; then
            echo "Compilation successful for $dir"
        else
            echo "Compilation failed for $dir"
            exit 1
        fi

        # Navigate back to the root directory
        cd - > /dev/null
    fi
done

echo "All fixtures compiled successfully"
