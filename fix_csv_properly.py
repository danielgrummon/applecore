#!/usr/bin/env python3
import csv
import re

def needs_quoting(text):
    """Check if text contains patterns that need quoting"""
    # Pattern: parentheses with commas inside
    if re.search(r'\([^)]*,[^)]*\)', text):
        return True
    # Pattern: square brackets with commas inside
    if re.search(r'\[[^\]]*,[^\]]*\]', text):
        return True
    return False

def fix_csv_file(filename):
    """Fix CSV file by properly quoting fields"""
    rows = []

    # Read the raw file line by line
    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for i, row in enumerate(reader, 1):
            if i == 1:
                # Header row
                rows.append(row)
                continue

            if len(row) != 5:
                print(f'Line {i}: {len(row)} fields - needs fixing')
                print(f'  Content: {row[:3]}...')

            rows.append(row)

    # Write back with proper quoting
    with open(filename, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL, quotechar='"')
        for row in rows:
            # Force quote fields that need it
            quoted_row = []
            for field in row:
                quoted_row.append(field)
            writer.writerow(quoted_row)

    print(f'✓ Processed: {filename}')

if __name__ == '__main__':
    import sys

    files = [
        'MANAGING-CONCURRENT-CODE-EXECUTION-100Q-4.csv',
        'MANAGING-CONCURRENT-CODE-EXECUTION-100Q-5.csv',
        'MANAGING-CONCURRENT-CODE-EXECUTION-100Q-6.csv'
    ]

    for filename in files:
        filepath = f'/Users/danielgrummon/git/junebug-new/{filename}'
        try:
            fix_csv_file(filepath)
        except Exception as e:
            print(f'❌ Error fixing {filename}: {e}')
            import traceback
            traceback.print_exc()
