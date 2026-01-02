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
    'WORKING-WITH-ADVANCED-JAVA-CLASS-DESIGN-120Q-D-1.csv',
    'WORKING-WITH-COLLECTIONS-API-120Q-D-1.csv',
    'WORKING-WITH-COLLECTIONS-API-250Q-E-1.csv',
    'WORKING-WITH-COLLECTIONS-API-250Q-E-2.csv',
    'WORKING-WITH-AUTOBOXING-AND-AUTOCASTING-120Q-D-1.csv', 
    'WORKING-WITH-CONCURRENT-CODE-EXECUTION-260Q-E-1.csv',
    'WORKING-WITH-CONCURRENT-CODE-EXECUTION-252Q-E-2.csv',
    'WORKING-WITH-DATABASE-JDBC-120Q-D-1.csv',
    'WORKING-WITH-DATES-AND-TIMES-250Q-E-2.csv',
    'WORKING-WITH-ENUMERATIONS-120Q-D-1.csv',
    'WORKING-WITH-GENERICS-250Q-E-1.csv',
    'WORKING-WITH-GENERICS-250Q-E-2.csv',
    'WORKING-WITH-HANDLING-EXCEPTIONS-120Q-D-1.csv',
    'WORKING-WITH-HANDLING-TEXT-120Q-D-1.csv',
    'WORKING-WITH-JAVA-IO-API-120Q-D-1.csv',
    'WORKING-WITH-JAVA-IO-API-120Q-D-2.csv',
    'WORKING-WITH-JAVA-OPERATORS-130Q-D-1.csv',
    'WORKING-WITH-MODULE-SYSTEM-120Q-D-1.csv',
    'WORKING-WITH-MODULE-SYSTEM-260Q-E-1.csv',
    'WORKING-WITH-JAVA-STREAM-API-120Q-D-1.csv',
    'WORKING-WITH-JAVA-STREAM-API-120Q-D-2.csv',
    'WORKING-WITH-JAVA-STREAM-API-120Q-D-3.csv'
    
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
    this.http.get('assets/sample-questions.csv', { responseType: 'text' }).subscribe({
      next: (content) => {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sample-questions.csv';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Failed to load sample CSV:', error);
      }
    });
  }

  downloadFormattingGuide(): void {
    this.http.get('assets/PROMPT-CSV-FORMATTING-GUIDE.md', { responseType: 'text' }).subscribe({
      next: (content) => {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'PROMPT-CSV-FORMATTING-GUIDE.md';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Failed to load formatting guide:', error);
      }
    });
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
