# CSV Test Question Formatting Guide

## Critical Formatting Rules for Question Banks

This guide ensures that test question CSV files are properly formatted and can be parsed without errors. Follow these rules precisely to avoid validation failures.

## CSV File Structure

### Basic Requirements

1. **File Format**: UTF-8 encoded CSV
2. **Column Count**: Exactly 5 columns per row (no more, no less)
3. **Header Row**: First row must be: `Question,Correct Answer,Wrong Answer 1,Wrong Answer 2,Wrong Answer 3`
4. **Row Structure**: Every data row must have exactly 5 comma-separated fields

### Valid Example
```csv
Question,Correct Answer,Wrong Answer 1,Wrong Answer 2,Wrong Answer 3
"What is 2+2?",4,3,5,22
"What is the capital of France?",Paris,London,Berlin,Madrid
```

## Quoting Rules

### Rule 1: When to Use Quotes

**ALWAYS quote a field if it contains ANY of these characters:**
- Comma (,)
- Double quote (")
- Newline (\n)
- Carriage return (\r)

**SAFE to leave unquoted:**
- Simple single-word answers with no special characters
- Numbers
- Basic text without punctuation that includes commas

### Examples

✅ **Correct - Unquoted (safe)**
```csv
"What is 2+2?",4,3,5,22
```

✅ **Correct - Quoted (contains special chars)**
```csv
"What is the result?","Compilation error","Runtime error","Prints 5","true"
```

❌ **Wrong - Unquoted with comma**
```csv
"What is the result?",Compilation error: missing semicolon,Runtime error,Success,Failure
```
This creates 6 fields instead of 5!

✅ **Correct - Quoted to handle comma**
```csv
"What is the result?","Compilation error: missing semicolon",Runtime error,Success,Failure
```

## Handling Special Characters

### Commas in Answers

**Problem**: Commas split fields in CSV
**Solution**: Wrap the entire field in double quotes

❌ **Wrong - Creates extra fields**
```csv
Question,Answer with comma, in it,Wrong1,Wrong2,Wrong3
```
This creates 6 fields!

✅ **Correct - Quoted field**
```csv
Question,"Answer with comma, in it",Wrong1,Wrong2,Wrong3
```

**Common Cases Requiring Quotes:**
```csv
"What is X?","Colon (:)",Wrong1,Wrong2,Wrong3
"What is Y?","Semicolon (;)",Wrong1,Wrong2,Wrong3
"What is Z?","Comma (,)",Wrong1,Wrong2,Wrong3
"What is W?","Period (.), then comma (,)",Wrong1,Wrong2,Wrong3
```

### Parentheses with Special Characters Inside

**Dangerous Pattern**: `Comma (,)` - The comma inside parentheses still counts as a delimiter!

❌ **Wrong**
```csv
"What is the path separator on Windows?",Semicolon (;),Colon (:),Comma (,),Pipe (|)
```
This creates 7 fields because of the unquoted commas!

✅ **Correct - Quote all fields with parenthetical punctuation**
```csv
"What is the path separator on Windows?","Semicolon (;)","Colon (:)","Comma separator","Pipe (|)"
```

Or use alternative text:
```csv
"What is the path separator on Windows?","Semicolon character","Colon character","Comma character","Pipe character"
```

### Double Quotes in Answers

**Problem**: Double quotes need to be escaped
**Solution**: Double them up (use "" to represent a single ")

❌ **Wrong - Unescaped quote**
```csv
"What is printed?","Hello "World"",Other,Other2,Other3
```

✅ **Correct - Escaped quotes**
```csv
"What is printed?","Hello ""World""",Other,Other2,Other3
```

**Example with code:**
```csv
"What is the result?","Prints ""Success""",Compilation error,Runtime error,Nothing
```

### Multi-line Questions (Code Examples)

**Problem**: Newlines are allowed in quoted fields
**Solution**: Wrap the entire multi-line content in double quotes

✅ **Correct - Multi-line question**
```csv
"Given the following code:
public class Test {
    public static void main(String[] args) {
        System.out.println(""Hello"");
    }
}

What is the result?",Prints Hello,Compilation error,Runtime error,Nothing prints
```

**Key Points for Multi-line:**
1. Opening quote on the first line
2. Actual newline characters in the file
3. Closing quote after the last line of the field
4. Then comma, then next field

### Code with Quotes

When including code that contains quotes, you must:
1. Wrap the field in double quotes (outer quotes)
2. Escape internal quotes by doubling them

✅ **Correct - Code with quotes**
```csv
"What is the result?
public class Test {
    public static void main(String[] args) {
        System.out.println(""Hello World"");
    }
}","Prints ""Hello World""",Compilation error,Runtime error,Nothing
```

Notice:
- `System.out.println(""Hello World"")` - doubled quotes in code
- `"Prints ""Hello World"""` - doubled quotes in answer

## Common Formatting Errors and Solutions

### Error 1: Too Many Fields

**Symptom**: Validation shows "Row X: 6 fields" (or more)

**Cause**: Unquoted comma in a field

**Example:**
```csv
"What is X?",Answer with, comma,W1,W2,W3
```
Result: 6 fields (comma splits "Answer with" and "comma")

**Fix**: Quote the field
```csv
"What is X?","Answer with, comma",W1,W2,W3
```

### Error 2: Too Few Fields

**Symptom**: Validation shows "Row X: 4 fields" (or fewer)

**Cause**: Missing a field or incorrectly placed quotes

**Example:**
```csv
"What is X?",CorrectAnswer,Wrong1,Wrong2
```
Result: 4 fields (missing Wrong Answer 3)

**Fix**: Add the missing field
```csv
"What is X?",CorrectAnswer,Wrong1,Wrong2,Wrong3
```

### Error 3: Unterminated Quotes

**Symptom**: Multiple rows parsed as one, or errors about unclosed quotes

**Cause**: Opening quote without matching closing quote

**Example:**
```csv
"What is the result?
public class Test {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
,CorrectAnswer,Wrong1,Wrong2,Wrong3
```
Missing closing quote before the comma!

**Fix**: Add closing quote
```csv
"What is the result?
public class Test {
    public static void main(String[] args) {
        System.out.println(""Hello"");
    }
}",CorrectAnswer,Wrong1,Wrong2,Wrong3
```

### Error 4: Unescaped Quotes in Field

**Symptom**: Parsing errors or extra fields

**Cause**: Single quote inside a quoted field

**Example:**
```csv
"What is printed?","Hello "World"",W1,W2,W3
```

**Fix**: Double the internal quotes
```csv
"What is printed?","Hello ""World""",W1,W2,W3
```

## Validation Methods

### Method 1: Python CSV Reader (Recommended)

This is the most reliable method to validate CSV formatting:

```python
import csv

file_path = 'your-test-bank.csv'
with open(file_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = list(reader)

print(f"Total rows: {len(rows)}")
print(f"Header: {rows[0]}")

# Check each row has exactly 5 fields
invalid_rows = []
for i, row in enumerate(rows[1:], start=2):  # Skip header
    if len(row) != 5:
        invalid_rows.append((i, len(row), row))

if invalid_rows:
    print(f"\n❌ Found {len(invalid_rows)} rows with incorrect field count:")
    for row_num, field_count, row_data in invalid_rows[:10]:
        print(f"\nRow {row_num}: {field_count} fields")
        print(f"  Data: {row_data[:100]}...")  # First 100 chars
else:
    print(f"\n✅ All {len(rows)-1} data rows have exactly 5 fields")
    print(f"✅ CSV validation passed!")
```

**What this checks:**
- Total row count
- Field count per row
- Identifies specific problematic rows

### Method 2: Visual Inspection

**Look for these patterns:**

1. **Commas outside quotes** in the middle of expected fields
2. **Odd number of quotes** in a row (should be even - open and close)
3. **Rows that look too short or too long**

### Method 3: Text Editor Features

Most code editors show CSV structure:
- VS Code: Install CSV extension to highlight columns
- Excel/Google Sheets: Import CSV to see if columns align
  - Should have exactly 5 columns
  - All rows should fill all 5 columns
  - No cells should spill over

## Fixing Validation Errors

### Step 1: Run Validation Script

```python
import csv

file_path = 'test-bank.csv'
with open(file_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = list(reader)

for i, row in enumerate(rows[1:], start=2):
    if len(row) != 5:
        print(f"\n❌ Row {i}: {len(row)} fields")
        for j, field in enumerate(row):
            print(f"  Field {j+1}: {field[:50]}...")
```

This shows you EXACTLY which fields are being parsed.

### Step 2: Identify the Problem

**If you see 6+ fields:**
- Look for unquoted commas
- Check for pattern like `Text (,)` or `A, B, and C`

**If you see 4- fields:**
- Look for missing answers
- Check for improperly closed quotes

**If fields look wrong:**
- Check quote escaping
- Look for `"` that should be `""`

### Step 3: Apply the Fix

**For unquoted commas:**
```python
# Find the problematic row in CSV
# Before:
"What is X?",Answer with (,) in it,W1,W2,W3

# After:
"What is X?","Answer with (,) in it",W1,W2,W3
```

**For unescaped quotes:**
```python
# Before:
"What prints?","Says "Hello"",W1,W2,W3

# After:
"What prints?","Says ""Hello""",W1,W2,W3
```

**For missing fields:**
```python
# Before:
"What is X?",Correct,W1,W2

# After:
"What is X?",Correct,W1,W2,W3
```

### Step 4: Re-validate

Run the validation script again to confirm all errors are fixed.

## Safe Patterns

### Pattern 1: Always Quote Multi-line Content

```csv
"What is the result?
public class Test {
    public static void main(String[] args) {
        int x = 5;
    }
}",CorrectAnswer,Wrong1,Wrong2,Wrong3
```

### Pattern 2: Quote Any Field with Special Characters

```csv
"What does -p mean?",Module path option,"Class path option","Describe option","Module name option"
```

### Pattern 3: Avoid Problematic Characters in Answers

Instead of `Comma (,)`, use:
- `Comma separator`
- `Comma character`
- `The comma symbol`

### Pattern 4: Consistent Escaping for Code

```csv
"What is printed?
System.out.println(""Hello"");","Prints ""Hello""",Compilation error,Runtime error,Nothing
```

All quotes inside code and answers are doubled.

## Dangerous Patterns to Avoid

### ❌ Dangerous: Unquoted Punctuation in Parentheses

```csv
"What is the separator?",Semicolon (;),Colon (:),Comma (,),Pipe (|)
```
**Problem**: The commas inside `(,)` and `(;)` etc. still count as delimiters!

✅ **Safe Alternative 1: Quote Everything**
```csv
"What is the separator?","Semicolon (;)","Colon (:)","Comma character","Pipe (|)"
```

✅ **Safe Alternative 2: Rewrite Without Parenthetical Punctuation**
```csv
"What is the separator?",Semicolon character,Colon character,Comma character,Pipe character
```

### ❌ Dangerous: Mixed Quoted/Unquoted in Same Row

```csv
"What is X?","Quoted answer",Unquoted,Unquoted,"Quoted again"
```
**Problem**: Harder to read and maintain

✅ **Better: Consistent Quoting**
```csv
"What is X?","Quoted answer","Unquoted","Unquoted","Quoted again"
```

### ❌ Dangerous: Complex Nested Quotes

```csv
"What prints?",System.out.println("He said "Hello""),W1,W2,W3
```
**Problem**: Triple nesting is error-prone

✅ **Better: Use Doubled Quotes Consistently**
```csv
"What prints?","System.out.println(""He said """"Hello"""""")","W1","W2","W3"
```
Each level of nesting doubles: `"Hello"` → `""Hello""` → `""""Hello""""""`

## Testing Your CSV File

### Quick Test Checklist

- [ ] Run Python validation script - 0 errors
- [ ] All rows have exactly 5 fields
- [ ] Header row is correct
- [ ] No row has visible unquoted commas in middle of expected field
- [ ] All multi-line questions are properly quoted
- [ ] All code examples with quotes have doubled quotes
- [ ] Total question count matches expected (check `len(rows) - 1`)

### Full Test Process

```python
import csv

def validate_csv(file_path):
    """Complete CSV validation for test banks"""
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        rows = list(reader)

    print(f"📊 File: {file_path}")
    print(f"📝 Total rows: {len(rows)}")
    print(f"❓ Questions: {len(rows) - 1}")

    # Check header
    expected_header = ['Question', 'Correct Answer', 'Wrong Answer 1', 'Wrong Answer 2', 'Wrong Answer 3']
    if rows[0] != expected_header:
        print(f"\n❌ Header mismatch!")
        print(f"   Expected: {expected_header}")
        print(f"   Got: {rows[0]}")
        return False

    # Check field counts
    invalid_rows = []
    for i, row in enumerate(rows[1:], start=2):
        if len(row) != 5:
            invalid_rows.append((i, len(row), row))

    if invalid_rows:
        print(f"\n❌ Found {len(invalid_rows)} invalid rows:")
        for row_num, field_count, row_data in invalid_rows[:5]:
            print(f"\n   Row {row_num}: {field_count} fields")
            for j, field in enumerate(row_data):
                preview = field[:40] + "..." if len(field) > 40 else field
                print(f"      Field {j+1}: {preview}")
        return False

    print(f"\n✅ Validation passed!")
    print(f"✅ All {len(rows)-1} questions properly formatted")
    return True

# Usage
validate_csv('WORKING-WITH-MODULE-SYSTEM-260Q-E-1.csv')
```

## Common Real-World Examples

### Example 1: Command Line Questions

```csv
"Given the following command line:
javac -p mods -d out src/module-info.java

What does -p specify?",Module path,Class path,Destination directory,Package name
```

**Key points:**
- Multi-line question is quoted
- Simple answers don't need quotes (no special characters)

### Example 2: Code with Output

```csv
"What is the result?
public class Test {
    public static void main(String[] args) {
        System.out.println(""Hello"");
    }
}","Prints ""Hello""",Compilation error,Runtime error,Nothing prints
```

**Key points:**
- Code quotes are doubled: `"Hello"` → `""Hello""`
- Answer quote is doubled: same pattern
- Outer quotes wrap the entire field

### Example 3: Answers with Punctuation

```csv
"What is the module separator on Windows?","Semicolon (;)","Colon (:)","Comma separator","Pipe (|)"
```

**Key points:**
- All fields quoted to be safe
- Avoid `Comma (,)` - use alternative text instead

### Example 4: Multiple Code Sections

```csv
"Given:
module com.example {
    exports com.example.api;
}

package com.example.api;
public class Service {}

From module com.client that requires com.example

Can com.client access Service?",Yes,"No: not exported",Compilation error,Runtime error
```

**Key points:**
- Entire multi-section question in quotes
- Blank lines preserved
- Simple answers quoted for consistency

## Emergency Fixes for Common Errors

### If You See: "Row X: 6 fields"

1. **Find the row** (search for text from the validation output)
2. **Look for unquoted commas** in that row
3. **Quote the problematic field**:
   ```
   Before: ...,Answer with, comma,...
   After:  ...,"Answer with, comma",...
   ```

### If You See: "Row X: 4 fields"

1. **Count the commas** in that row (should be 4 commas for 5 fields)
2. **Check for missing answer**
3. **Add placeholder** if needed:
   ```
   Before: Question,Correct,W1,W2
   After:  Question,Correct,W1,W2,W3
   ```

### If You See: Strange multi-row errors

1. **Look for unclosed quote** several rows before the error
2. **Find the opening quote** without matching close
3. **Add closing quote**:
   ```
   Before: "Multi-line
            question
            ,Answer,...

   After:  "Multi-line
            question",Answer,...
   ```

## Final Pre-Submission Checklist

Before deploying your test bank:

- [ ] ✅ Python validation script reports 0 errors
- [ ] ✅ Row count = question count + 1 (header)
- [ ] ✅ All rows have exactly 5 fields
- [ ] ✅ No visible unquoted special characters
- [ ] ✅ File opens correctly in text editor
- [ ] ✅ No weird characters or encoding issues
- [ ] ✅ Header row matches exactly: `Question,Correct Answer,Wrong Answer 1,Wrong Answer 2,Wrong Answer 3`
- [ ] ✅ All code examples properly escaped
- [ ] ✅ All multi-line questions properly quoted

## Summary of Critical Rules

1. **5 fields per row, always** (Question + 4 answers)
2. **Quote any field with:** comma, quote, or newline
3. **Escape quotes by doubling:** `"` becomes `""`
4. **Avoid:** `Comma (,)` - use `Comma separator` instead
5. **Multi-line:** Wrap entire field in quotes, use real newlines
6. **Validate:** Use Python csv.reader to verify
7. **Fix immediately:** Don't accumulate formatting errors
8. **Test:** Run validation after every batch of questions

Following these rules ensures your CSV file will parse correctly every time!
