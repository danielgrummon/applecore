# Prompt for Creating WORKING-WITH-MODULE-SYSTEM-260Q-E-1.csv

## Overview
Create a comprehensive E-series question bank for Java 17 Module System (JPMS) covering topics for the Oracle Java SE 17 Certification Exam 1Z0-829. The question bank must contain **at least 250 questions** with full code examples.

## File Format Requirements

### CSV Structure
- **Filename**: `WORKING-WITH-MODULE-SYSTEM-260Q-E-1.csv`
- **Format**: 5-column CSV with header row
- **Header**: `Question,Correct Answer,Wrong Answer 1,Wrong Answer 2,Wrong Answer 3`
- **Field Count**: Each row must have exactly 5 fields
- **Encoding**: UTF-8

### Question Format
Each question MUST:
1. Include full multi-line code examples when applicable
2. Include all necessary imports
3. Use class name `Test` for all code examples
4. Include `public static void main(String[] args)` where applicable
5. Be properly escaped for CSV format (quotes around fields with commas, newlines, etc.)

### Example CSV Row
```csv
"Given:
module com.example {
    exports com.example.api;
}

package com.example.api;
public class Service {}

From module com.client that requires com.example

Can com.client access com.example.api.Service?",Yes,No: not exported,Compilation error,Runtime error
```

## Content Requirements

### 1. Module-info.java Syntax Questions (60+ questions)

Cover ALL directives with emphasis on edge cases:

**exports directive**
- Basic exports: `exports com.example.api;`
- Qualified exports: `exports com.example.api to com.client;`
- Multiple qualified targets: `exports com.example.api to com.client1, com.client2;`
- Invalid syntax: missing semicolon, using wildcards, exporting non-existent packages
- Duplicate exports (compilation error)
- Cannot export java.* packages

**requires directive**
- Basic requires: `requires com.other;`
- requires transitive: `requires transitive com.other;`
- requires static: `requires static com.other;`
- Combination: `requires transitive static com.other;`
- Duplicate requires (compilation error)
- java.base is implicit (but can be explicitly required)
- Cyclic dependencies (compilation error)

**opens directive**
- Basic opens: `opens com.example.internal;`
- Qualified opens: `opens com.example.internal to java.base;`
- open module: `open module com.example { }`
- opens vs exports differences
- opens for reflection access

**uses directive**
- `uses com.example.api.Service;`
- Service interface must be accessible

**provides directive**
- `provides com.example.api.Service with com.example.impl.ServiceImpl;`
- Implementation must implement interface
- No-arg constructor requirement
- Implementation package should NOT be exported

### 2. Command Line Questions (120+ questions)

Create AT LEAST 100 questions involving command line operations. Include full directory structures and file listings where relevant.

#### javac commands (30+ questions)
```bash
# Basic module compilation
javac -p mods -d out src/module-info.java src/com/example/Main.java

# Wrong: using -cp for modules
javac -cp mods -d out src/module-info.java  # Should use -p

# Module source path
javac --module-source-path src -d out --module com.example
```

Cover:
- `-p` / `--module-path` for module dependencies
- `-d` for output directory
- `-cp` vs `-p` (classpath vs module path)
- `--module-source-path`
- `--module` for compiling specific modules
- `--release` version compatibility
- `@argfile` for argument files
- Compilation errors when dependencies missing

#### java commands (35+ questions)
```bash
# Running a module
java -p mods -m com.example/com.example.Main

# Describing a module
java -p mods -d com.example
java -p mods --describe-module com.example

# Listing modules
java --list-modules
java -p mods --list-modules

# Show module resolution
java --show-module-resolution -p mods -m com.example/com.example.Main
```

Cover:
- `-p` / `--module-path`
- `-m` / `--module` with module/class syntax
- `-d` / `--describe-module`
- `--list-modules` (exits immediately, doesn't run program)
- `--show-module-resolution`
- `--add-exports`, `--add-opens`, `--add-reads` (runtime module access)
- `--add-modules`, `--limit-modules`
- JVM options (-Xmx, etc.) vs module options
- Main class specification in module-info vs command line
- Missing main class errors

#### jar commands (20+ questions)
```bash
# Creating a JAR
jar -cvf mods/app.jar -C out/com.example .

# With vs without -C
jar -cvf app.jar out/com.example/  # Creates out/ directory in jar
jar -cvf app.jar -C out/com.example .  # Root contains module-info.class

# Describing a module
jar -f mods/app.jar -d
jar --file mods/app.jar --describe-module

# Module version and main class
jar --main-class com.example.Main --module-version 1.0 -cvf app.jar -C out .
```

Cover:
- `-c` / `--create`
- `-v` / `--verbose`
- `-f` / `--file`
- `-C` directory change
- `-d` / `--describe-module`
- `--main-class`, `--module-version`
- `--update` for updating existing JARs
- Running jar command twice (overwrites)

#### jdeps commands (15+ questions)
```bash
# Analyze dependencies
jdeps app.jar

# Summary
jdeps -s app.jar
jdeps --summary app.jar

# JDK internal APIs
jdeps --jdk-internals app.jar
jdeps -jdkinternals app.jar

# With module path
jdeps --module-path mods app.jar

# Other options
jdeps --list-deps app.jar
jdeps --list-reduced-deps app.jar
jdeps -R --module-path mods app.jar  # Recursive
jdeps --inverse app.jar
jdeps --check com.example --module-path mods
jdeps --generate-module-info src app.jar
```

#### jmod commands (10+ questions)
```bash
# Create JMOD
jmod create --class-path out mods/com.example.jmod

# Describe
jmod describe mods/com.example.jmod

# List contents
jmod list mods/com.example.jmod

# Extract
jmod extract --dir temp mods/com.example.jmod

# Hash
jmod hash --module-path mods mods/com.example.jmod
```

#### jlink commands (15+ questions)
```bash
# Basic runtime creation
jlink -p mods --add-modules com.example --output myruntime
jlink --module-path mods --add-modules com.example --output myruntime

# Special module names
jlink -p mods --add-modules ALL-MODULE-PATH --output runtime
jlink -p mods --add-modules java.base --output runtime

# Launcher script
jlink -p mods --add-modules com.example --launcher myapp=com.example/com.example.Main --output runtime

# Optimization options
jlink --compress=2 -p mods --add-modules com.example --output runtime
jlink --strip-debug -p mods --add-modules com.example --output runtime
jlink --no-header-files -p mods --add-modules com.example --output runtime
jlink --no-man-pages -p mods --add-modules com.example --output runtime

# Service binding
jlink --bind-services -p mods --add-modules com.example --output runtime

# Service providers
jlink --suggest-providers java.sql.Driver -p mods --output runtime

# Options file
jlink --save-opts options.txt -p mods --add-modules com.example --output runtime
jlink @options.txt
```

Cover:
- Missing `--output` (error)
- `--launcher` creates executable script
- ALL-MODULE-PATH behavior

#### Path Separators (4+ questions)
```bash
# Windows
javac -p mods1;mods2 -d out src/module-info.java

# Linux/Mac
javac -p mods1:mods2 -d out src/module-info.java
```

### 3. Module Types Questions (30+ questions)

**Named Modules**
- Contains module-info.java
- Appears on module path
- Exports only declared packages
- Can be required by other modules

**Automatic Modules**
- JAR on module path WITHOUT module-info.java
- Exports ALL packages
- Module name from Automatic-Module-Name in MANIFEST.MF or derived from JAR filename
- Name derivation rules: `my-app-1.0.jar` → `my.app`
- Can be required by named modules

**Unnamed Modules**
- JAR on classpath
- Exports NO packages
- Cannot be required by modules
- module-info.java is ignored if present
- Can access other unnamed modules on classpath

Comparison table questions:
```
| Feature          | Named | Automatic | Unnamed |
|------------------|-------|-----------|---------|
| Location         | -p    | -p        | -cp     |
| Exports          | Listed| All       | None    |
| Readable by mods | Yes   | Yes       | No      |
| Readable by cp   | Yes   | Yes       | Yes     |
```

### 4. Module Accessibility Questions (35+ questions)

**Public vs Exports**
- Class must be public AND package must be exported
- `public class` in non-exported package: NOT accessible from other modules
- Package-private class in exported package: NOT accessible

**Qualified Exports**
```java
module com.example {
    exports com.example.api to com.client1, com.client2;
}
// Only com.client1 and com.client2 can access
// com.client3 cannot access even with requires
```

**opens vs exports**
- `exports`: compile-time and runtime access
- `opens`: reflection access only
- Can use both on same package
- `open module`: all packages opened for reflection

**Reflection Access**
```java
module com.example {
    opens com.example.internal;
}
// Other modules can use reflection on internal package
// But cannot access directly (compilation error)
```

### 5. Service Provider Pattern Questions (30+ questions)

**Service Provider Interface**
```java
module com.api {
    exports com.api;
}

package com.api;
public interface Service {
    void execute();
}
```

**Service Locator (Consumer)**
```java
module com.consumer {
    requires com.api;
    uses com.api.Service;
}

ServiceLoader<Service> loader = ServiceLoader.load(Service.class);
loader.stream().map(Provider::get).forEach(Service::execute);
```

**Service Provider**
```java
module com.provider {
    requires com.api;
    provides com.api.Service with com.provider.ServiceImpl;
    // Do NOT export com.provider package
}

package com.provider;
public class ServiceImpl implements Service {
    // Must have public no-arg constructor
    public ServiceImpl() {}

    public void execute() {
        System.out.println("Executing");
    }
}
```

Cover:
- ServiceLoader.load() returns loader (not services directly)
- `.stream().map(Provider::get)` to get instances
- `.findFirst()` returns Optional<Provider<Service>> not Optional<Service>
- No providers → empty loader (not error)
- Provider with no no-arg constructor → runtime error during loading
- Provider constructor throws exception → exception during iteration
- Provides without requires → compilation error
- META-INF/services vs provides directive (use provides in modules)

### 6. Transitive Dependencies Questions (20+ questions)

```java
module com.a {
    requires transitive com.b;
}

module com.b {
    exports com.b.api;
}

module com.client {
    requires com.a;
    // Can now access com.b.api without requiring com.b
}
```

Multi-level transitive:
```java
module com.a { requires transitive com.b; }
module com.b { requires transitive com.c; }
module com.client { requires com.a; }
// Client can access both b and c
```

When NOT to use transitive:
```java
module com.example {
    exports com.example.api;
    requires com.other;  // Used internally only
}

// If api classes DON'T expose com.other types: no transitive needed
// If api classes DO expose com.other types: use transitive
```

### 7. Built-in JDK Modules Questions (15+ questions)

**java.* modules** (standard APIs):
- java.base (implicit, always available)
- java.sql
- java.logging
- java.desktop (AWT, Swing)
- java.xml
- java.naming
- java.prefs
- java.compiler
- java.se (aggregate module)

**jdk.* modules** (JDK-specific):
- jdk.compiler
- jdk.jshell
- jdk.jdeps
- jdk.javadoc
- jdk.httpserver

Questions:
- Which module for JDBC? (java.sql)
- Which module for logging? (java.logging)
- Which module is always implicit? (java.base)
- Can you require java.base? (Yes, but unnecessary)
- Which modules start with java vs jdk?

### 8. Cyclic Dependencies Questions (10+ questions)

**Direct cycle** - COMPILATION ERROR:
```java
module com.a { requires com.b; }
module com.b { requires com.a; }
```

**Indirect cycle** - COMPILATION ERROR:
```java
module com.a { requires com.b; }
module com.b { requires com.c; }
module com.c { requires com.a; }
```

**With transitive** - STILL ERROR:
```java
module com.a { requires transitive com.b; }
module com.b { requires transitive com.a; }
```

**Solution**: Introduce a common module
```java
module com.common {
    exports com.common.api;
}

module com.a {
    requires com.common;
}

module com.b {
    requires com.common;
}
```

### 9. Module Restrictions & Edge Cases (15+ questions)

**Invalid Operations**:
- Cannot export `java.*` packages (compilation error)
- Cannot export with wildcard: `exports com.example.*;`
- Split packages not allowed (same package in two modules)
- Module names cannot start with digits
- Empty qualified exports: `exports com.example to ;` (error)
- Empty package export still compiles if package doesn't exist (compilation error)

**Valid Edge Cases**:
- Hyphens allowed in module names: `com-example`
- Can both export and open same package
- Can require a module multiple times (but gives error)
- Empty module-info.java (valid, no exports, only requires java.base)

### 10. Migration Strategy Questions (10+ questions)

**Bottom-up Migration**:
1. Start with modules with no dependencies
2. Place as named modules on module path
3. Leave dependent modules on classpath as unnamed
4. Gradually move up dependency tree

**Top-down Migration**:
1. Start with top-level application module
2. Place all JARs on module path (become automatic modules)
3. Create module-info.java for top module first
4. Gradually add module-info.java to dependencies

Comparison:
- Bottom-up: unnamed modules on classpath at start
- Top-down: automatic modules on module path at start

### 11. Advanced Topics (20+ questions)

**Module API (Reflection)**:
```java
Module m = Test.class.getModule();
System.out.println(m.getName());  // Named: module name, Unnamed: null
System.out.println(m.isNamed());  // true or false
m.getPackages().forEach(System.out::println);  // All packages
```

**Runtime Module Modification**:
- `--add-exports` module/package=target
- `--add-opens` module/package=target
- `--add-reads` module=target
- `--add-modules` module
- `--limit-modules` module

**Multi-release JARs**:
- module-info in META-INF/versions/11/
- `jar --describe-module --release 11`

**JMOD vs JAR**:
- JMOD can contain native libraries, config files
- JMOD files on module path at compile time only
- JAR files for runtime
- jlink can use both

## E-Series Emphasis

Focus heavily on:

1. **What CANNOT be done** (30% of questions):
   - Invalid syntax
   - Operations that cause compilation errors
   - Operations that cause runtime errors
   - Restrictions and limitations

2. **Compilation vs Runtime Errors** (25% of questions):
   - Missing module dependencies: compile error
   - Missing providers: runtime (empty loader)
   - Cyclic dependencies: compile error
   - Bad provider constructor: runtime error when loading
   - Accessing non-exported package: compile error

3. **Command Line Edge Cases** (20% of questions):
   - Wrong options (-cp instead of -p)
   - Missing required options (--output for jlink)
   - Order of operations (--list-modules exits before running)
   - Option conflicts (-jar with -m)

4. **Subtle Differences** (25% of questions):
   - exports vs opens
   - requires vs requires transitive
   - Named vs Automatic vs Unnamed modules
   - -p vs -cp
   - What each command line tool does

## Validation Steps

After creating the CSV file:

1. **Field Count Validation**:
```python
import csv

with open('WORKING-WITH-MODULE-SYSTEM-260Q-E-1.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = list(reader)

for i, row in enumerate(rows[1:], start=2):
    if len(row) != 5:
        print(f"Row {i}: {len(row)} fields - ERROR")
```

2. **Question Count Check**: Must have at least 250 questions (251+ rows including header)

3. **CSV Escaping Check**: Ensure all fields with commas, quotes, or newlines are properly quoted

4. **Common Errors to Avoid**:
   - Unescaped commas in answers like "Comma (,)" → use "Comma separator" or quote properly
   - Missing closing quotes on multi-line questions
   - Extra fields (make sure exactly 5 per row)

## Example Questions by Category

### Module-info Syntax
```csv
"Given the following module-info.java:
module com.example {
    exports com.example.api;
    exports com.example.api;
}

What is the result?",Compilation error,Compilation succeeds,Runtime error,Module loads successfully
```

### Command Line
```csv
"Given the following command line:
javac -cp mods -d out myapp/module-info.java

What is the result for modular code?",Should use -p instead,Correct syntax,Compilation error,-cp works for modules
```

### Service Locator
```csv
"Given:
ServiceLoader<Service> loader = ServiceLoader.load(Service.class);
Service service = loader.get();

What is the result?",Compilation error: no get() method,Returns first service,Returns all services,Runtime error
```

### Accessibility
```csv
"Given a module com.example that does NOT export com.example.internal
And a class com.example.internal.Helper

From module com.client that requires com.example

Can com.client access com.example.internal.Helper?",No,Yes: requires is enough,Compilation error,Runtime error
```

## File Naming Convention

- Format: `WORKING-WITH-MODULE-SYSTEM-{count}Q-E-{version}.csv`
- Example: `WORKING-WITH-MODULE-SYSTEM-260Q-E-1.csv`
- E = E-series (emphasis on edge cases)
- Count should reflect actual question count (260Q for 260 questions)
- Version for iterative improvements

## Final Checklist

- [ ] At least 250 questions
- [ ] All questions have full code examples where applicable
- [ ] Class name is "Test" for consistency
- [ ] CSV has exactly 5 fields per row
- [ ] At least 100 command line questions
- [ ] Covers all major topics (module-info, command line, services, types, etc.)
- [ ] Emphasis on edge cases and what cannot be done
- [ ] Validation script passes
- [ ] No CSV parsing errors
- [ ] Proper escaping for special characters

## Deployment Steps

1. Validate CSV format
2. Copy to `src/assets/WORKING-WITH-MODULE-SYSTEM-260Q-E-1.csv`
3. Copy to `docs/assets/WORKING-WITH-MODULE-SYSTEM-260Q-E-1.csv`
4. Update `src/app/question-challenge-home/question-challenge-home.component.ts` availableCSVFiles array
5. Update `src/app/flash-card-home/flash-card-home.component.ts` availableCSVFiles array
6. Build: `npm run build`
7. Deploy: Copy `dist/junebug-new/browser/*` to `docs/`
8. Remove old main.js files
