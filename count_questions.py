#!/usr/bin/env python3
import csv

files = [
    'DATE-TIME-API-100Q.csv',
    'MANAGING-CONCURRENT-CODE-EXECUTION-100Q-4.csv',
    'MANAGING-CONCURRENT-CODE-EXECUTION-100Q-5.csv',
    'MANAGING-CONCURRENT-CODE-EXECUTION-100Q-6.csv',
    'MODULE-SYSTEM-100Q-3.csv',
    'MODULE-SYSTEM-100Q-4.csv',
    'PRIMATIVE-AND-WRAPPER-CLASSES-100Q.csv',
    'STREAMS-AND-LAMBDA-EXPRESSIONS-100Q-3.csv',
    'STREAMS-AND-LAMBDA-EXPRESSIONS-100Q-4.csv'
]

print("=" * 80)
print("QUESTION COUNT BREAKDOWN")
print("=" * 80)

total = 0
for filename in files:
    filepath = f'/Users/danielgrummon/git/junebug-new/{filename}'
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            rows = list(reader)
            # Subtract 1 for header row
            count = len(rows) - 1
            total += count
            diff = count - 100
            diff_str = f"+{diff}" if diff > 0 else str(diff)
            print(f"{filename:50} {count:3} questions ({diff_str:>4})")
    except Exception as e:
        print(f"{filename:50} ERROR: {e}")

print("=" * 80)
print(f"{'TOTAL':50} {total:3} questions")
print(f"{'EXPECTED (9 × 100)':50} 900 questions")
print(f"{'DIFFERENCE':50} {total - 900:+3} questions")
print("=" * 80)
