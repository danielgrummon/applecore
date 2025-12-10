#!/usr/bin/env python3
import csv
import sys

def fix_csv_file(filename):
    """Read and rewrite CSV file with proper quoting"""
    rows = []

    # Read all rows
    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            rows.append(row)

    # Write back with proper quoting
    with open(filename, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        for row in rows:
            writer.writerow(row)

    print(f'Fixed: {filename}')

if __name__ == '__main__':
    files = [
        'MANAGING-CONCURRENT-CODE-EXECUTION-100Q-4.csv',
        'MANAGING-CONCURRENT-CODE-EXECUTION-100Q-5.csv',
        'MANAGING-CONCURRENT-CODE-EXECUTION-100Q-6.csv'
    ]

    for filename in files:
        try:
            fix_csv_file(f'/Users/danielgrummon/git/junebug-new/{filename}')
        except Exception as e:
            print(f'Error fixing {filename}: {e}')
