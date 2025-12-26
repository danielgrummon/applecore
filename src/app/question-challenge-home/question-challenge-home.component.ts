import { Component, EventEmitter, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { QuestionChallengeComponent } from '../question-challenge/question-challenge.component';
import { Question } from '../models/question.model';

@Component({
  selector: 'app-question-challenge-home',
  imports: [CommonModule, QuestionChallengeComponent],
  templateUrl: './question-challenge-home.component.html',
  styleUrl: './question-challenge-home.component.css'
})
export class QuestionChallengeHomeComponent {
  @Output() backToArcade = new EventEmitter<void>();

  private http = inject(HttpClient);

  gameStarted = signal(false);
  questionsLoaded = signal(false);
  uploadError = signal<string | null>(null);
  fileName = signal<string | null>(null);
  questionCount = signal(0);
  questionsPerRound = signal(4);
  secondsPerQuestion = signal(30);
  questions: Question[] = [];

  // Computed total time limit based on questions per round and seconds per question
  get totalTimeLimit(): number {
    return this.questionsPerRound() * this.secondsPerQuestion();
  }

  // Available CSV files in assets directory
  availableCSVFiles = [
    'ACCESSING-DATABASES-USING-JDBC-114Q-B-1.csv',
    'ACCESSING-DATABASES-USING-JDBC-147Q-C-2.csv',
    'ACCESSING-DATABASES-USING-JDBC-166Q-C-1.csv',
    'ANNOTATIONS-117Q-B-1.csv',
    'ARRAYS-AND-COLLECTIONS-181Q-C-1.csv',
    'CONTROLLING-PROGRAM-FLOW-117Q-B-1.csv',
    'CONTROLLING-PROGRAM-FLOW-297Q-C-1.csv',
    'DATE-TIME-API-353Q-A-1.csv',
    'HANDLING-DATE-TIME-118Q-B-1.csv',
    'HANDLING-DATE-TIME-TEXT-NUMERIC-BOOLEAN-124Q-C-1.csv',
    'HANDLING-EXCEPTIONS-122Q-B-1.csv',
    'HANDLING-EXCEPTIONS-212Q-C-1.csv',
    'HANDLING-NUMERIC-BOOLEAN-VALUES-131Q-B-1.csv',
    'HANDLING-TEXT-126Q-B-1.csv',
    'IMPLEMENTING-LOCALIZATION-106Q-B-1.csv',
    'INHERITANCE-AND-POLYMORPHISM-131Q-B-1.csv',
    'INTERFACES-AND-ABSTRACT-CLASSES-130Q-B-1.csv',
    'JAVA-OBJECT-ORIENTED-APPROACH-206Q-C-1.csv',
    'JAVA-OBJECT-ORIENTED-APPROACH-235Q-C-4.csv',
    'JAVA-OBJECT-ORIENTED-APPROACH-267Q-C-3.csv',
    'JAVA-OBJECT-ORIENTED-APPROACH-276Q-C-2.csv',
    'JAVA-OBJECT-ORIENTED-APPROACH-276Q-C-5.csv',
    'JAVA-PLATFORM-MODULE-SYSTEM-118Q-B-2.csv',
    'JAVA-PLATFORM-MODULE-SYSTEM-120Q-B-1.csv',
    'MANAGING-CONCURRENT-CODE-EXECUTION-107Q-B-2.csv',
    'MANAGING-CONCURRENT-CODE-EXECUTION-116Q-B-3.csv',
    'MANAGING-CONCURRENT-CODE-EXECUTION-121Q-B-1.csv',
    'MANAGING-CONCURRENT-CODE-EXECUTION-159Q-C-1.csv',
    'MANAGING-CONCURRENT-CODE-EXECUTION-182Q-A-3.csv',
    'MANAGING-CONCURRENT-CODE-EXECUTION-184Q-C-2.csv',
    'MANAGING-CONCURRENT-CODE-EXECUTION-192Q-A-2.csv',
    'MANAGING-CONCURRENT-CODE-EXECUTION-210Q-C-3.csv',
    'MANAGING-CONCURRENT-CODE-EXECUTION-220Q-A-1.csv',
    'MODULE-SYSTEM-175Q-A-2.csv',
    'MODULE-SYSTEM-317Q-A-1.csv',
    'PACKAGING-AND-DEPLOYING-PLATFORM-MODULE-SYSTEM-120Q-C-1.csv',
    'PACKAGING-AND-DEPLOYING-PLATFORM-MODULE-SYSTEM-78Q-C-2.csv',
    'PRIMATIVE-AND-WRAPPER-CLASSES-302Q-A-1.csv',
    'SEALED-CLASSES-AND-PATTERN-MATCHING-112Q-B-1.csv',
    'STREAMS-AND-LAMBDA-EXPRESSIONS-120Q-B-1.csv',
    'STREAMS-AND-LAMBDA-EXPRESSIONS-120Q-B-2.csv',
    'STREAMS-AND-LAMBDA-EXPRESSIONS-336Q-A-1.csv',
    'STREAMS-AND-LAMBDA-EXPRESSIONS-391Q-A-2.csv',
    'STREAMS-AND-LAMDA-EXPRESSIONS-188Q-C-1.csv',
    'STREAMS-AND-LAMDA-EXPRESSIONS-284Q-C-2.csv',
    'USING-JAVA-IO-API-112Q-B-3.csv',
    'USING-JAVA-IO-API-118Q-B-1.csv',
    'USING-JAVA-IO-API-135Q-C-1.csv',
    'USING-JAVA-IO-API-99Q-B-2.csv',
    'UTILIZING-JAVA-OBJECT-ORIENTED-APPROACH-121Q-B-1.csv',
    'UTILIZING-JAVA-OBJECT-ORIENTED-APPROACH-122Q-B-3.csv',
    'UTILIZING-JAVA-OBJECT-ORIENTED-APPROACH-132Q-B-2.csv',
    'UTILIZING-JAVA-OBJECT-ORIENTED-APPROACH-133Q-B-4.csv',
    'WORKING-WITH-ARRAYS-AND-COLLECTIONS-125Q-B-2.csv',
    'WORKING-WITH-ARRAYS-AND-COLLECTIONS-149Q-B-1.csv',
    'WORKING-WITH-ENUMERATIONS-130Q-B-1.csv',
    'WORKING-WITH-GENERICS-115Q-B-1.csv'
  ];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.fileName.set(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      try {
        this.questions = this.parseAndValidateCSV(csvText);
        this.questionCount.set(this.questions.length);
        this.questionsLoaded.set(true);
        this.uploadError.set(null);
      } catch (error) {
        this.uploadError.set(error instanceof Error ? error.message : 'Invalid CSV format');
        this.questionsLoaded.set(false);
        this.questionCount.set(0);
      }
    };
    reader.readAsText(file);
  }

  onCSVFileSelected(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const fileName = select.value;

    if (!fileName) {
      return;
    }

    this.fileName.set(fileName);
    this.uploadError.set(null);

    this.http.get(`assets/${fileName}`, { responseType: 'text' }).subscribe({
      next: (csvText) => {
        try {
          this.questions = this.parseAndValidateCSV(csvText);
          this.questionCount.set(this.questions.length);
          this.questionsLoaded.set(true);
          this.uploadError.set(null);
        } catch (error) {
          this.uploadError.set(error instanceof Error ? error.message : 'Invalid CSV format');
          this.questionsLoaded.set(false);
          this.questionCount.set(0);
        }
      },
      error: (error) => {
        this.uploadError.set(`Failed to load ${fileName}: ${error.message}`);
        this.questionsLoaded.set(false);
        this.questionCount.set(0);
      }
    });
  }

  parseAndValidateCSV(csvText: string): Question[] {
    const rows = this.parseCSV(csvText);
    console.log('Parsed rows:', rows.length, rows);

    if (rows.length === 0) {
      throw new Error('CSV file is empty');
    }

    // Skip header row
    const dataRows = rows.slice(1);
    console.log('Data rows:', dataRows.length);

    if (dataRows.length === 0) {
      throw new Error('No data rows found in CSV');
    }

    const questions: Question[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const fields = dataRows[i];
      const lineNumber = i + 2; // +2 because we skipped header and arrays are 0-indexed
      console.log(`Line ${lineNumber}: ${fields.length} fields`, fields);

      if (fields.length < 5) {
        throw new Error(`Line ${lineNumber}: Expected 5 columns, found ${fields.length}. Check for missing commas or unescaped quotes in the question text.`);
      }

      // Validate non-empty fields with more helpful error messages
      // Note: We allow empty strings for answer fields (columns 2-5) as they might be intentional (e.g., testing empty string literals)
      for (let j = 0; j < 5; j++) {
        if (fields[j] === undefined || fields[j] === null) {
          const fieldNames = ['Question', 'Correct Answer', 'Wrong Answer 1', 'Wrong Answer 2', 'Wrong Answer 3'];
          throw new Error(`Line ${lineNumber}: ${fieldNames[j]} is missing.`);
        }
        // Only validate question and correct answer as non-empty
        if (j <= 1 && fields[j].trim() === '') {
          const fieldNames = ['Question', 'Correct Answer', 'Wrong Answer 1', 'Wrong Answer 2', 'Wrong Answer 3'];
          throw new Error(`Line ${lineNumber}: ${fieldNames[j]} is empty.`);
        }
      }

      const questionText = fields[0].trim();
      const correctAnswer = fields[1].trim();
      const wrongAnswers = [fields[2].trim(), fields[3].trim(), fields[4].trim()];

      // Shuffle answers
      const allAnswers = [correctAnswer, ...wrongAnswers];
      const shuffledAnswers = this.shuffleArray(allAnswers);
      const correctIndex = shuffledAnswers.indexOf(correctAnswer);

      questions.push({
        question: questionText,
        answers: shuffledAnswers,
        correct: correctIndex
      });
    }

    console.log('Total questions parsed:', questions.length);
    return questions;
  }

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

  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  downloadSampleCSV(): void {
    const sampleCSV = `Question,Correct Answer,Wrong Answer 1,Wrong Answer 2,Wrong Answer 3
What is the size of int in Java?,4 bytes,2 bytes,8 bytes,1 byte
Which keyword is used to inherit a class?,extends,implements,inherits,super
What is the default value of boolean?,false,true,0,null
Which method is the entry point of a Java program?,main,start,run,init
What does JVM stand for?,Java Virtual Machine,Java Variable Method,Java Visual Machine,Java Verified Module
"What keyword is used to define a class in Java?
A) function
B) class
C) def",class,function,def,object
Which access modifier makes a member accessible only within the same class?,private,public,protected,default
What is the correct syntax for a Java comment?,// comment,# comment,<!-- comment -->,/* comment
Which collection allows duplicate elements?,ArrayList,HashSet,TreeSet,LinkedHashSet
What is polymorphism in Java?,Many forms of a single entity,Single form of many entities,Multiple inheritance,Method overloading only
Which operator is used to compare two values?,==,=,===,!=
What is encapsulation?,Hiding data within a class,Combining data and methods,Creating multiple classes,Inheriting from parent class
Which loop runs at least once?,do-while,while,for,foreach
What is the output of 5 / 2 in Java?,2,2.5,3,Error
Which exception is thrown for division by zero?,ArithmeticException,NullPointerException,ArrayIndexOutOfBoundsException,IOException`;

    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample-questions.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  startGame(): void {
    if (!this.questionsLoaded()) {
      this.uploadError.set('Please upload a CSV file first');
      return;
    }
    this.gameStarted.set(true);
  }

  setQuestionsPerRound(count: number): void {
    this.questionsPerRound.set(count);
  }

  setSecondsPerQuestion(seconds: number): void {
    this.secondsPerQuestion.set(seconds);
  }

  backToHome(): void {
    this.gameStarted.set(false);
  }

  backToMenuFromGame(): void {
    this.backToArcade.emit();
  }
}
