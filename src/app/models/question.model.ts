export interface Question {
  question: string;      // Question text (supports multi-line)
  answers: string[];     // 4 shuffled answer options
  correct: number;       // Index of correct answer
}

export interface QuestionState {
  question: Question;
  selected: number | null;
}
