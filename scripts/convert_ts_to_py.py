import json
import os
from pathlib import Path
from typing import Dict, List, Any
import re

def extract_ts_export(ts_content: str) -> str:
    """Extract the exported array from TypeScript file"""
    # Look for export const ... = [ ... ];
    match = re.search(r'export\s+const\s+\w+\s*=\s*\[(.*?)\];', ts_content, re.DOTALL)
    if not match:
        return '[]'
    return f'[{match.group(1)}]'

def convert_ts_to_py(ts_file: Path, output_dir: Path) -> None:
    """Convert TypeScript product file to Python format"""
    print(f"Converting {ts_file.name}...")
    
    # Read the TypeScript file
    with open(ts_file, 'r', encoding='utf-8') as f:
        ts_content = f.read()
    
    # Extract the products array
    products_json = extract_ts_export(ts_content)
    
    # Parse the JSON data
    try:
        products = json.loads(products_json)
    except json.JSONDecodeError as e:
        print(f"Error parsing {ts_file.name}: {e}")
        return
    
    # Create output filename
    py_filename = ts_file.stem + '.py'
    output_path = output_dir / py_filename
    
    # Write Python file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f'# Auto-generated from {ts_file.name}\n')
        f.write('from typing import List, Dict, Any, Optional\n\n')
        f.write('products: List[Dict[str, Any]] = [\n')
        
        for product in products:
            # Convert to Python dict format
            py_dict = json.dumps(product, indent=4, ensure_ascii=False)
            # Fix TypeScript-specific syntax
            py_dict = py_dict.replace('"category": "Fashion"', '"category": "Fashion"')
            py_dict = py_dict.replace('"category": "Home & Kitchen"', '"category": "Home & Kitchen"')
            py_dict = py_dict.replace('"category": "Beauty & Personal Care"', '"category": "Beauty & Personal Care"')
            py_dict = py_dict.replace('"category": "Groceries"', '"category": "Groceries"')
            
            f.write(f'    {py_dict},\n')
        
        f.write(']\n')
    
    print(f"Converted {len(products)} products to {output_path}")

def main():
    # Set up paths
    project_root = Path(__file__).parent.parent
    src_dir = project_root / 'src' / 'data'
    output_dir = project_root / 'data_py'
    
    # Create output directory if it doesn't exist
    output_dir.mkdir(exist_ok=True)
    
    # Find all TypeScript product files
    ts_files = list(src_dir.glob('*Products.ts'))
    
    if not ts_files:
        print("No TypeScript product files found!")
        return
    
    # Convert each file
    for ts_file in ts_files:
        convert_ts_to_py(ts_file, output_dir)

if __name__ == "__main__":
    main()
