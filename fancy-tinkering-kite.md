# Comprehensive Prompt to Recreate Flash Owls Angular Application

## Application Overview

Create "Flash Owls" (Junebug) - an interactive, retro arcade-themed quiz game application built with Angular 21. The application features a neon aesthetic with glowing effects, owl mascot branding, and gamified learning through timed multiple-choice question challenges.

---

## Technical Stack

- **Framework**: Angular 21 (standalone components, no NgModule)
- **TypeScript**: 5.9.2
- **State Management**: Angular Signals (reactive state)
- **Styling**: Pure CSS3 (no frameworks like Bootstrap/Material/Tailwind)
- **Testing**: Vitest 4.0.8
- **Build**: Angular CLI 21.0.0
- **Target**: ES2022+, modern browsers

---

## Project Structure

```
junebug/
├── src/
│   ├── app/
│   │   ├── home/
│   │   │   ├── home.component.ts           # Main menu screen
│   │   │   ├── home.component.html
│   │   │   └── home.component.css
│   │   ├── question-challenge-home/
│   │   │   ├── question-challenge-home.component.ts  # Game config/upload
│   │   │   ├── question-challenge-home.component.html
│   │   │   └── question-challenge-home.component.css
│   │   ├── question-challenge/
│   │   │   ├── question-challenge.component.ts       # Game logic
│   │   │   ├── question-challenge.component.html
│   │   │   └── question-challenge.component.css
│   │   ├── app.ts                          # Root component
│   │   ├── app.html
│   │   ├── app.css
│   │   ├── app.config.ts                   # DI config
│   │   └── app.routes.ts                   # Empty routes array
│   ├── assets/
│   │   ├── questions.csv                   # Default Java questions
│   │   └── sample-questions.csv            # Sample questions
│   ├── main.ts                             # Bootstrap
│   └── styles.css                          # Global styles
├── angular.json
├── package.json
└── tsconfig.json
```

---

## Core Features to Implement

### 1. Data Model

```typescript
interface Question {
    question: string;      // Question text (supports multi-line)
    answers: string[];     // 4 shuffled answer options
    correct: number;       // Index of correct answer
}

interface QuestionState {
    question: Question;
    selected: number | null;
}
```

### 2. CSV Format Support

**Format**: `Question, Correct Answer, Wrong1, Wrong2, Wrong3`

**Parsing Requirements**:
- Support quoted fields with commas inside
- Handle multi-line questions in quotes (for code snippets)
- Support escaped quotes (`""` = literal quote)
- Handle both Windows (`\r\n`) and Unix (`\n`) line endings
- Validate minimum 5 columns
- Shuffle answers randomly so correct answer isn't always in same position

**Example CSV**:
```csv
Question,Correct Answer,Wrong Answer 1,Wrong Answer 2,Wrong Answer 3
What is the capital of France?,Paris,London,Berlin,Madrid
"What keyword is used to define a class in Java?
A) function
B) class
C) def",class,function,def,object
```

### 3. Application Flow

```
Home Component (Main Menu)
    ↓ [User clicks "Question Challenge"]
QuestionChallengeHome (Config Screen)
    ↓ [Upload CSV, configure settings, click "START GAME"]
QuestionChallenge (Game Screen)
    ↓ [Answer questions, submit, view results]
    ↓ [Next Round or Back to Menu]
```

---

## Component Specifications

### **1. App Component (Root)**
- Minimal wrapper component
- Imports and renders `HomeComponent`
- No routing (uses component-level signals)

### **2. HomeComponent (Main Menu)**

**State Management**:
```typescript
selectedGame: Signal<string | null> = signal(null)
```

**UI Elements**:
- **Title**: "FLASH OWLS" (72px on desktop, 48px mobile)
  - Color: Magenta (`#ff00ff`)
  - Glow effect with `owlGlow` animation (cycles magenta → green)
  - Letter spacing: 12px
  - Owl emoji decorations (🦉) in corners with float animations

- **Tagline**: "WHERE LEARNING TAKES FLIGHT" (20px desktop, 16px mobile)
  - Color: Yellow (`#ffff00`)
  - `taglinePulse` animation (opacity 0.8 → 1.0)

- **Game Button**: "Question Challenge 🎯"
  - Gradient background: `#ff00ff → #ff6600 → #ffff00`
  - Border: 4px solid green (`#00ff00`)
  - Icon with float animation
  - Hover: Scale to 1.08, gradient shifts to `#ff00ff → #00ffff → #00ff00`
  - `shine` animation (gradient sweep every 3s)

**Methods**:
- `selectGame(game: string)`: Set selected game
- `backToMenu()`: Reset to null

### **3. QuestionChallengeHomeComponent (Configuration)**

**State Signals**:
```typescript
gameStarted: Signal<boolean>           // Game active?
questionsLoaded: Signal<boolean>       // CSV loaded?
uploadError: Signal<string | null>     // Error messages
fileName: Signal<string | null>        // Current CSV filename
questionCount: Signal<number>          // Valid questions loaded
questionsPerRound: Signal<number>      // Default: 4 (options: 4, 5, 10)
timeLimit: Signal<number>              // Default: 90s (options: 60, 90, 120, 180)
questions: Question[]                  // Parsed questions array
```

**Key Methods**:

1. **`onFileSelected(event)`**: Handle CSV file upload
   - Read file as text
   - Call `parseAndValidateCSV()`
   - Set error or success state

2. **`parseAndValidateCSV(csvText: string): Question[]`**:
   - Skip header row
   - Parse each line with custom parser
   - Validate 5 columns minimum
   - Validate non-empty fields
   - Shuffle answers (correct answer + 3 wrong answers)
   - Return array of Question objects

3. **`parseCSV(csvText: string): string[][]`**:
   - Advanced parser supporting:
     - Quoted fields with commas
     - Multi-line fields
     - Escaped quotes (`""`)
     - Both `\n` and `\r\n` line endings
   - Return 2D array of parsed fields

4. **`shuffleArray<T>(array: T[]): T[]`**:
   - Fisher-Yates shuffle algorithm
   - Returns shuffled copy

5. **`downloadSampleCSV()`**:
   - Generate sample CSV with Java questions
   - Create blob and download link
   - Trigger download

6. **`startGame()`**:
   - Validate questions loaded
   - Set `gameStarted = true`

7. **`setQuestionsPerRound(count: number)`**: Update config
8. **`setTimeLimit(seconds: number)`**: Update config

**UI Elements**:

- **Instructions Section**:
  - CSV format explanation
  - Example format display
  - How to play instructions

- **File Upload**:
  - Custom styled file input
  - Display filename when loaded
  - Show error messages with line numbers
  - Question count display

- **Configuration Buttons**:
  - Questions per round: 4, 5, 10 (radio-style buttons)
  - Time limits: 60s, 90s, 120s, 180s (radio-style buttons)
  - Active state: Yellow background with glow

- **Action Buttons**:
  - "START GAME" (disabled until CSV loaded)
  - "DOWNLOAD SAMPLE CSV"
  - "BACK" to main menu

### **4. QuestionChallengeComponent (Game Logic)**

**Input/Output**:
```typescript
@Input() questions: Question[]         // Questions from parent
@Output() backToHome: EventEmitter     // Return to config
@Output() backToArcade: EventEmitter   // Return to main menu
```

**State Signals**:
```typescript
questionSets: QuestionState[]          // Current round questions + selections
timeRemaining: Signal<number>          // Countdown timer
roundComplete: Signal<boolean>         // Round ended?
timeExpired: Signal<boolean>           // Time ran out?
showCongratulations: Signal<boolean>   // Show results?
currentRound: Signal<number>           // Round counter
currentRoundCorrect: Signal<number>    // Correct this round
currentRoundTotal: Signal<number>      // Total this round
cumulativeCorrect: Signal<number>      // Total correct all rounds
cumulativeTotal: Signal<number>        // Total answered all rounds
roundTheme: Signal<number>             // Background theme (0-7)
showBackButton: Signal<boolean>        // Show exit button?
```

**Lifecycle**:
1. **`ngOnInit()`**:
   - Load questions from input or fallback to `assets/questions.csv`
   - Start first round

2. **`startNewRound()`**:
   - Randomly select N questions (configurable)
   - Initialize QuestionState array with `selected: null`
   - Reset timer to configured limit
   - Random theme selection (0-7)
   - Start timer interval

**Game Methods**:

1. **`selectAnswer(questionIndex: number, answerIndex: number)`**:
   - Update `questionSets[questionIndex].selected = answerIndex`
   - Play selection sound (400Hz square wave, 0.05s)

2. **`submitAnswers()`**:
   - Stop timer
   - Calculate scores:
     - `currentRoundCorrect` = count correct answers
     - `currentRoundTotal` = total questions this round
     - Add to cumulative totals
   - Set `roundComplete = true`
   - Set `showCongratulations = true`
   - Play audio feedback (happy if good score, unhappy if time expired)

3. **`nextRound()`**:
   - Reset round state
   - Increment `currentRound`
   - Call `startNewRound()`

4. **`isCorrectAnswer(questionIndex, answerIndex): boolean`**:
   - Check if `answerIndex === question.correct`

5. **`isWrongAnswer(questionIndex, answerIndex): boolean`**:
   - Check if selected answer but incorrect

6. **`isSelected(questionIndex, answerIndex): boolean`**:
   - Check if this answer is currently selected

7. **`getCurrentRoundPercent(): number`**:
   - Return `(currentRoundCorrect / currentRoundTotal) * 100`

8. **`getCumulativePercent(): number`**:
   - Return `(cumulativeCorrect / cumulativeTotal) * 100`

9. **`getFormattedTime(): string`**:
   - Convert seconds to `M:SS` format (e.g., "1:30")

**Audio System** (Web Audio API):

```typescript
private playAudio(frequencies: number[], duration: number, type: OscillatorType)
```

- **Happy sound**: `[523, 659, 784, 1047]` Hz (C-E-G-High C), sine wave, 0.15s each
- **Unhappy sound**: `[440, 370, 330]` Hz (A-F#-E), triangle wave, 0.2s each
- **Select sound**: `[400]` Hz, square wave, 0.05s

**Keyboard Handling**:
- Listen for Enter/Space when `showCongratulations = true`
- Call `nextRound()`

**UI Elements**:

- **Header Stats**:
  - Round number
  - Timer (format: M:SS, warning color when ≤ 10s)
  - "ALL QUESTIONS ANSWERED" indicator
  - Current round percentage

- **Questions Grid** (2 columns desktop, 1 column mobile):
  - Card per question with:
    - Question number badge (gradient, color-coded)
    - Question text
    - 4 radio button answers
    - Visual feedback after submission:
      - Green checkmark (✓) for correct
      - Red X (✗) for incorrect

- **Submit Button** (fixed bottom):
  - Enabled only when all questions answered
  - Pulse animation when ready
  - Click to submit answers

- **Congratulations Overlay**:
  - Semi-transparent backdrop with blur
  - Results card with:
    - Title based on score:
      - 100%: "PERFECT SCORE!" (rainbow animation)
      - 75%+: "EXCELLENT JOB!"
      - 50%+: "GOOD JOB!"
      - <50%: "KEEP GOING!"
    - Round stats (correct/total, percentage)
    - Cumulative stats (total correct/total, percentage)
    - Buttons: "NEXT ROUND", "BACK TO MENU"
  - Perfect score: Enhanced glow, sparkle decorations, yellow border

- **Background Themes** (8 gradients):
  - Purple-pink, pink-red, cyan, green, yellow-pink, cyan-purple, pink-red, red-pink
  - Randomly selected per round

---

## Styling Specifications

### **Color Palette**

**Primary Neon Colors**:
- Magenta: `#ff00ff` (titles, borders, primary accent)
- Green: `#00ff00` (highlights, success)
- Yellow: `#ffff00` (taglines, values)
- Cyan: `#00ffff` (question text, instructions)
- Orange: `#ff6600` (gradients)
- Purple: `#9933ff` (radio buttons)

**Backgrounds**:
- Black: `#000000` (body)
- Dark purple: `rgba(26, 0, 51, 0.9)` (cards)
- Radial gradient: `#1a0033 → #0d001a → #000000`

### **Typography**

- **Font Family**: `'Courier New', monospace` (all text)
- **Title**: 72px (desktop), 48px (mobile), magenta, letter-spacing 12px
- **Tagline**: 20px (desktop), 16px (mobile), yellow, letter-spacing 4px
- **Buttons**: 24px (desktop), 18px (mobile), white, uppercase
- **Question Text**: 18px (desktop), 16px (mobile), cyan
- **Answers**: 16px, white
- **Stats**: 14px labels (green), 32-48px values (yellow)

### **Effects**

**Glow/Shadow Effects**:
- Multiple layered `text-shadow` (0px, 10px, 20px, 40px, 80px spreads)
- Multiple `box-shadow` layers for neon glow
- `drop-shadow` filters on icons

**Animations** (CSS @keyframes):

1. **`owlGlow`** (3s infinite):
   - Color: magenta → green → magenta
   - Text-shadow intensity variation

2. **`sparkle`** (8s infinite):
   - Background position shift for twinkling stars

3. **`owlBounceLeft/Right`** (2s infinite):
   - translateY(-20px → 0px)
   - rotate(-10deg → 10deg)

4. **`taglinePulse`** (2s infinite):
   - opacity(0.8 → 1.0)

5. **`shine`** (3s infinite):
   - Gradient sweep across buttons

6. **`buttonPulse`** (1.5s infinite alternate):
   - translateY(0 → -3px)
   - Box-shadow intensity

7. **`submitReady`** (1s infinite alternate):
   - Box-shadow glow pulsing

8. **`timerPulse`** (0.5s infinite):
   - scale(1.0 → 1.05)
   - Enhanced glow when time ≤ 10s

9. **`rainbow`** (3s infinite):
   - Color cycle through 5 neon colors

10. **`perfectBounce`** (0.8s):
    - scale(0.5 → 1.2 → 1.0)

11. **`fadeIn`** (0.3s):
    - opacity(0 → 1)

12. **`slideIn`** (0.5s):
    - scale(0.5 → 1.0)

### **Responsive Breakpoints**

**Desktop (1024px+)**:
- 2-column question grid
- Full decorative elements
- Large fonts

**Tablet (768px - 1024px)**:
- 1-column question grid
- Header switches to column layout
- Reduced padding

**Mobile (< 768px)**:
- Title: 40-48px
- No owl decorations
- Single column
- Reduced padding/gaps
- Smaller buttons (18-20px font)

### **Transitions**

- All interactive elements: `transition: all 0.3s ease`
- Hover effects: `transform: scale(1.05-1.1)`, `translateY(-5px)`
- Active states: Slight scale reduction with displacement

---

## CSV Sample Data

**Java Programming Questions** (embed in `downloadSampleCSV()` and `assets/questions.csv`):

```csv
Question,Correct Answer,Wrong Answer 1,Wrong Answer 2,Wrong Answer 3
What is the size of int in Java?,4 bytes,2 bytes,8 bytes,1 byte
Which keyword is used to inherit a class?,extends,implements,inherits,super
What is the default value of boolean?,false,true,0,null
Which method is the entry point of a Java program?,main,start,run,init
What does JVM stand for?,Java Virtual Machine,Java Variable Method,Java Visual Machine,Java Verified Module
```

---

## Configuration Files

### **angular.json**
- Standard Angular 21 CLI configuration
- Development server on default port
- Production budgets: 500KB warning / 1MB error for initial bundle

### **package.json**
```json
{
  "dependencies": {
    "@angular/common": "^21.0.0",
    "@angular/core": "^21.0.0",
    "@angular/forms": "^21.0.0",
    "@angular/platform-browser": "^21.0.0",
    "@angular/router": "^21.0.0",
    "rxjs": "~7.8.0",
    "zone.js": "^0.16.0"
  },
  "devDependencies": {
    "@angular/cli": "^21.0.0",
    "@angular/compiler-cli": "^21.0.0",
    "typescript": "~5.9.2",
    "vitest": "^4.0.8"
  }
}
```

### **tsconfig.json**
- Target: ES2022
- Strict mode enabled
- Angular compiler options

---

## Implementation Steps

### **Phase 1: Project Setup**
1. Create Angular 21 project with standalone components
2. Configure TypeScript, Angular CLI
3. Set up global styles with black background, viewport sizing

### **Phase 2: Data Layer**
4. Create Question and QuestionState interfaces
5. Implement CSV parser with multi-line support
6. Create sample CSV files in assets/

### **Phase 3: Components**
7. Build App root component (minimal wrapper)
8. Build HomeComponent with arcade menu UI
9. Build QuestionChallengeHomeComponent:
   - File upload UI
   - CSV parsing and validation
   - Configuration buttons
   - Sample CSV download
10. Build QuestionChallengeComponent:
    - Question display grid
    - Timer logic
    - Answer selection
    - Submission and scoring
    - Results overlay

### **Phase 4: Styling**
11. Implement global CSS (radial gradient, reset)
12. Style HomeComponent (neon title, glowing buttons, owl decorations)
13. Style QuestionChallengeHomeComponent (upload interface, config buttons)
14. Style QuestionChallengeComponent:
    - Header stats
    - Question cards with color-coded borders
    - Radio buttons (custom styled)
    - Submit button with pulse
    - Congratulations overlay
15. Add all CSS animations (@keyframes)
16. Implement responsive design (768px, 1024px breakpoints)

### **Phase 5: Interactivity**
17. Wire up component communication (Input/Output)
18. Implement signal-based state management
19. Add Web Audio API sounds (happy, unhappy, select)
20. Add keyboard support (Enter/Space)
21. Implement timer countdown with interval
22. Add visual warning for low time (≤10s)

### **Phase 6: Polish**
23. Test CSV parsing with edge cases (multi-line, quotes, special chars)
24. Verify answer shuffling works correctly
25. Test responsive design on mobile/tablet
26. Add error handling for file upload failures
27. Ensure all animations run smoothly
28. Test cumulative scoring across multiple rounds

### **Phase 7: Testing & Optimization**
29. Set up Vitest tests for CSV parser
30. Test game flow end-to-end
31. Optimize bundle size
32. Verify accessibility (keyboard nav, contrast)

---

## Key Implementation Details

### **CSV Parser Algorithm** (UPDATED - Single-Pass Implementation)

**IMPORTANT**: Use this single-pass character-by-character parser instead of the two-stage approach. This correctly handles multi-line quoted fields containing code snippets.

```typescript
parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // End of row (handle both \n and \r\n)
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip \n in \r\n
      }
      currentRow.push(currentField.trim());
      if (currentRow.some(field => field.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      // Regular character (including newlines inside quotes)
      currentField += char;
    }
  }

  // Handle last field and row
  currentRow.push(currentField.trim());
  if (currentRow.some(field => field.length > 0)) {
    rows.push(currentRow);
  }

  return rows;
}
```

### **Fisher-Yates Shuffle**

```typescript
shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

### **Answer Shuffling Logic**

```typescript
// In parseAndValidateCSV:
const correctAnswer = fields[1];
const wrongAnswers = [fields[2], fields[3], fields[4]];
const allAnswers = [correctAnswer, ...wrongAnswers];
const shuffledAnswers = this.shuffleArray(allAnswers);
const correctIndex = shuffledAnswers.indexOf(correctAnswer);

questions.push({
  question: fields[0],
  answers: shuffledAnswers,
  correct: correctIndex
});
```

### **Timer Logic**

```typescript
private startTimer() {
  const interval = setInterval(() => {
    const current = this.timeRemaining();
    if (current <= 0) {
      clearInterval(interval);
      this.timeExpired.set(true);
      this.submitAnswers();
    } else {
      this.timeRemaining.set(current - 1);
    }
  }, 1000);
}
```

### **Score Calculation**

```typescript
submitAnswers() {
  let correct = 0;
  this.questionSets.forEach((qs, index) => {
    if (qs.selected === qs.question.correct) {
      correct++;
    }
  });

  this.currentRoundCorrect.set(correct);
  this.currentRoundTotal.set(this.questionSets.length);
  this.cumulativeCorrect.update(c => c + correct);
  this.cumulativeTotal.update(t => t + this.questionSets.length);

  // Play audio based on performance
  const percent = (correct / this.questionSets.length) * 100;
  if (percent >= 50) {
    this.playHappySound();
  } else {
    this.playUnhappySound();
  }
}
```

---

## User Experience Flow

1. **Landing**: User sees "FLASH OWLS" title with glowing effect and owl decorations
2. **Game Selection**: Click "Question Challenge" button (animated with shine effect)
3. **Configuration**:
   - Upload CSV file or use default questions
   - Choose questions per round (4, 5, or 10)
   - Choose time limit (60s, 90s, 120s, 180s)
   - Click "START GAME"
4. **Gameplay**:
   - See N questions with 4 multiple choice answers each
   - Timer counts down (visual warning at ≤10s)
   - Select answers (radio buttons with sound feedback)
   - Submit button enables when all answered
   - Click submit or wait for timer
5. **Results**:
   - Overlay shows performance (Perfect/Excellent/Good/Keep Going)
   - Round percentage and cumulative percentage displayed
   - Choose "NEXT ROUND" or "BACK TO MENU"
6. **Continue**: New round with different random questions, cumulative score tracking

---

## Edge Cases to Handle

1. **CSV Validation**:
   - Empty file
   - Wrong number of columns
   - Empty fields
   - Invalid characters
   - Missing header row

2. **Game State**:
   - Timer reaching 0 before submission
   - All questions answered correctly (perfect score)
   - User clicking back during game
   - Multiple rapid clicks on submit

3. **Responsive Design**:
   - Very small mobile screens (< 375px)
   - Landscape mode on mobile
   - Touch vs mouse interactions

4. **Audio**:
   - Browser autoplay policies (may need user interaction first)
   - Multiple sounds overlapping

---

## Success Criteria

✅ Retro arcade aesthetic with neon colors and glow effects
✅ Smooth animations (60fps)
✅ CSV upload and parsing with validation
✅ Configurable game settings (questions, time)
✅ Timed quiz gameplay with countdown
✅ Visual feedback for correct/wrong answers
✅ Cumulative scoring across rounds
✅ Audio feedback (success/failure sounds)
✅ Keyboard support (Enter/Space)
✅ Responsive design (desktop, tablet, mobile)
✅ Accessible error messages
✅ Sample CSV download functionality

---

## Future Enhancement Ideas (Not Required)

- Backend API integration for question storage
- User authentication and leaderboards
- Question difficulty levels
- Multiple quiz categories
- Local storage for score persistence
- Accessibility improvements (screen reader support)
- Additional game modes (flash cards, matching, etc.)
- Social sharing of scores
- Admin panel for question management

---

## Final Notes

This application prioritizes:
- **Visual appeal**: Retro arcade aesthetic with smooth animations
- **User experience**: Clear feedback, intuitive flow, responsive design
- **Code quality**: Modern Angular patterns, type safety, clean architecture
- **Performance**: Lightweight (no heavy frameworks), optimized animations
- **Flexibility**: Custom CSV uploads allow any subject matter

The result is an engaging, polished quiz game that makes learning fun through gamification and retro-inspired design.
