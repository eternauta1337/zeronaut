#!/bin/bash

# Read the circuits.json file
input_file="./circuits/target/circuits.json"
output_file="./circuits/target/circuits.txt"

# Extract abi and bytecode properties and create a new JSON
jq '{abi: .abi, bytecode: .bytecode}' "$input_file" |
# Convert to a string with escaped quotes
jq -r 'tojson' |
# Remove leading and trailing quotes
# Remove leading and trailing quotes if present
sed 's/^"\(.*\)"$/\1/' |
# Escape any remaining quotes within the JSON
sed 's/"/\\"/g' |
# Save to the output file, replacing if it exists
tee "$output_file" > /dev/null

echo "Generated ACIR in $output_file"
