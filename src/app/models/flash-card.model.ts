import { Question } from './question.model';

export interface FlashCardState {
  question: Question;           // Reuse existing Question interface
  attemptCount: number;          // How many times this card has been shown
  mastered: boolean;             // Has user marked as "I Knew It"
  lastResult: 'knew' | 'didnt-know' | null;  // Most recent self-assessment
}
