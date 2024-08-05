#!/bin/bash

# Navigate to the src directory
cd src

# Start the codebase.md file
echo "# Codebase Contents" > ../codebase.md

# Add the tree structure to the file
echo "## Project Structure" >> ../codebase.md
echo '```' >> ../codebase.md
tree -I "node_modules" .. >> ../codebase.md
echo '```' >> ../codebase.md
echo "" >> ../codebase.md

# Loop through all files in the directory and subdirectories
find . -type f | while read -r file; do
    # Add file path
    echo "## File: $file" >> ../codebase.md
    
    # Add file contents wrapped in triple backticks for code formatting
    echo '```' >> ../codebase.md
    cat "$file" >> ../codebase.md
    echo '```' >> ../codebase.md
    echo "" >> ../codebase.md
done

# Navigate back to original directory
cd ..