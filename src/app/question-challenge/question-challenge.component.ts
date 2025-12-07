import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question, QuestionState } from '../models/question.model';

@Component({
  selector: 'app-question-challenge',
  imports: [CommonModule],
  templateUrl: './question-challenge.component.html',
  styleUrl: './question-challenge.component.css'
})
export class QuestionChallengeComponent implements OnInit, OnDestroy {
  @Input() questions: Question[] = [];
  @Input() questionsPerRound = 4;
  @Input() timeLimit = 90;
  @Output() backToHome = new EventEmitter<void>();
  @Output() backToArcade = new EventEmitter<void>();

  questionSets: QuestionState[] = [];
  timeRemaining = signal(90);
  roundComplete = signal(false);
  timeExpired = signal(false);
  showCongratulations = signal(false);
  showResultsOverlay = signal(false);
  currentRound = signal(1);
  currentRoundCorrect = signal(0);
  currentRoundTotal = signal(0);
  cumulativeCorrect = signal(0);
  cumulativeTotal = signal(0);
  roundTheme = signal(0);
  showBackButton = signal(true);

  private timerInterval?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    // Load default questions if none provided
    if (!this.questions || this.questions.length === 0) {
      this.loadDefaultQuestions();
    } else {
      this.startNewRound();
    }
  }

  async loadDefaultQuestions(): Promise<void> {
    try {
      const response = await fetch('assets/questions.csv');
      const csvText = await response.text();
      this.questions = this.parseCSV(csvText);
      this.startNewRound();
    } catch (error) {
      console.error('Failed to load default questions:', error);
      // Fallback to hardcoded questions
      this.questions = this.getHardcodedQuestions();
      this.startNewRound();
    }
  }

  parseCSV(csvText: string): Question[] {
    const lines = csvText.trim().split('\n');
    const questions: Question[] = [];

    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length >= 5) {
        const correctAnswer = parts[1].trim();
        const allAnswers = [
          correctAnswer,
          parts[2].trim(),
          parts[3].trim(),
          parts[4].trim()
        ];
        const shuffled = this.shuffleArray(allAnswers);

        questions.push({
          question: parts[0].trim(),
          answers: shuffled,
          correct: shuffled.indexOf(correctAnswer)
        });
      }
    }

    return questions;
  }

  getHardcodedQuestions(): Question[] {
    const rawQuestions = [
      { q: 'What is the size of int in Java?', correct: '4 bytes', wrong: ['2 bytes', '8 bytes', '1 byte'] },
      { q: 'Which keyword is used to inherit a class?', correct: 'extends', wrong: ['implements', 'inherits', 'super'] },
      { q: 'What is the default value of boolean?', correct: 'false', wrong: ['true', '0', 'null'] },
      { q: 'Which method is the entry point of a Java program?', correct: 'main', wrong: ['start', 'run', 'init'] },
      { q: 'What does JVM stand for?', correct: 'Java Virtual Machine', wrong: ['Java Variable Method', 'Java Visual Machine', 'Java Verified Module'] },
      { q: 'Which access modifier makes a member accessible only within the same class?', correct: 'private', wrong: ['public', 'protected', 'default'] },
      { q: 'What is the correct syntax for a Java comment?', correct: '// comment', wrong: ['# comment', '<!-- comment -->', '/* comment'] },
      { q: 'Which collection allows duplicate elements?', correct: 'ArrayList', wrong: ['HashSet', 'TreeSet', 'LinkedHashSet'] },
      { q: 'Which operator is used to compare two values?', correct: '==', wrong: ['=', '===', '!='] },
      { q: 'What is encapsulation?', correct: 'Hiding data within a class', wrong: ['Combining data and methods', 'Creating multiple classes', 'Inheriting from parent class'] },
    ];

    return rawQuestions.map(rq => {
      const allAnswers = [rq.correct, ...rq.wrong];
      const shuffled = this.shuffleArray(allAnswers);
      return {
        question: rq.q,
        answers: shuffled,
        correct: shuffled.indexOf(rq.correct)
      };
    });
  }

  startNewRound(): void {
    // Randomly select questions
    const selectedQuestions = this.getRandomQuestions(this.questionsPerRound);

    // Initialize question states
    this.questionSets = selectedQuestions.map(q => ({
      question: q,
      selected: null
    }));

    // Reset round state
    this.timeRemaining.set(this.timeLimit);
    this.roundComplete.set(false);
    this.timeExpired.set(false);
    this.showCongratulations.set(false);
    this.roundTheme.set(Math.floor(Math.random() * 8));

    // Start timer
    this.startTimer();
  }

  getRandomQuestions(count: number): Question[] {
    const shuffled = this.shuffleArray([...this.questions]);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  startTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      const current = this.timeRemaining();
      if (current <= 0) {
        this.stopTimer();
        this.timeExpired.set(true);
        this.submitAnswers();
      } else {
        this.timeRemaining.set(current - 1);
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
  }

  selectAnswer(questionIndex: number, answerIndex: number): void {
    if (this.roundComplete()) return;

    this.questionSets[questionIndex].selected = answerIndex;
    this.playSelectSound();
  }

  submitAnswers(): void {
    this.stopTimer();
    this.roundComplete.set(true);

    let correct = 0;
    this.questionSets.forEach(qs => {
      if (qs.selected === qs.question.correct) {
        correct++;
      }
    });

    this.currentRoundCorrect.set(correct);
    this.currentRoundTotal.set(this.questionSets.length);
    this.cumulativeCorrect.update(c => c + correct);
    this.cumulativeTotal.update(t => t + this.questionSets.length);

    this.showCongratulations.set(true);
    this.showResultsOverlay.set(true);

    // Play audio feedback
    const percent = this.getCurrentRoundPercent();
    if (this.timeExpired()) {
      this.playUnhappySound();
    } else if (percent >= 50) {
      this.playHappySound();
    } else {
      this.playUnhappySound();
    }
  }

  closeResultsOverlay(): void {
    this.showResultsOverlay.set(false);
  }

  nextRound(): void {
    this.currentRound.update(r => r + 1);
    this.currentRoundCorrect.set(0);
    this.currentRoundTotal.set(0);
    this.startNewRound();
  }

  isCorrectAnswer(questionIndex: number, answerIndex: number): boolean {
    if (!this.roundComplete()) return false;
    return this.questionSets[questionIndex].question.correct === answerIndex;
  }

  isWrongAnswer(questionIndex: number, answerIndex: number): boolean {
    if (!this.roundComplete()) return false;
    const qs = this.questionSets[questionIndex];
    return qs.selected === answerIndex && qs.selected !== qs.question.correct;
  }

  isSelected(questionIndex: number, answerIndex: number): boolean {
    return this.questionSets[questionIndex].selected === answerIndex;
  }

  allQuestionsAnswered(): boolean {
    return this.questionSets.every(qs => qs.selected !== null);
  }

  getCurrentRoundPercent(): number {
    const total = this.currentRoundTotal();
    return total > 0 ? Math.round((this.currentRoundCorrect() / total) * 100) : 0;
  }

  getCumulativePercent(): number {
    const total = this.cumulativeTotal();
    return total > 0 ? Math.round((this.cumulativeCorrect() / total) * 100) : 0;
  }

  getFormattedTime(): string {
    const seconds = this.timeRemaining();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  isPerfectScore(): boolean {
    return this.getCurrentRoundPercent() === 100;
  }

  getScoreTitle(): string {
    const percent = this.getCurrentRoundPercent();
    if (percent === 100) return 'PERFECT SCORE!';
    if (percent >= 75) return 'EXCELLENT JOB!';
    if (percent >= 50) return 'GOOD JOB!';
    return 'KEEP GOING!';
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.showCongratulations() && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.nextRound();
    }
  }

  // Audio methods using Web Audio API
  private playAudio(frequencies: number[], duration: number, type: OscillatorType): void {
    const audioContext = new AudioContext();
    let startTime = audioContext.currentTime;

    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = type;
      oscillator.frequency.value = freq;

      gainNode.gain.setValueAtTime(0.1, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);

      startTime += duration;
    });
  }

  playHappySound(): void {
    this.playAudio([523, 659, 784, 1047], 0.15, 'sine');
  }

  playUnhappySound(): void {
    this.playAudio([440, 370, 330], 0.2, 'triangle');
  }

  playSelectSound(): void {
    this.playAudio([400], 0.05, 'square');
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}
