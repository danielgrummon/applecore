import { Component, Input, Output, EventEmitter, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../models/question.model';
import { FlashCardState } from '../models/flash-card.model';

@Component({
  selector: 'app-flash-card',
  imports: [CommonModule],
  templateUrl: './flash-card.component.html',
  styleUrl: './flash-card.component.css'
})
export class FlashCardComponent implements OnInit {
  @Input() questions: Question[] = [];
  @Output() backToHome = new EventEmitter<void>();
  @Output() backToArcade = new EventEmitter<void>();

  // Session state
  cardStates: FlashCardState[] = [];
  currentLoopCards: FlashCardState[] = []; // Cards in current loop (captured at loop start)
  currentIndex = signal(0);
  currentLoop = signal(1);
  isRevealed = signal(false);
  sessionComplete = signal(false);
  cardTheme = signal(0);

  // Computed properties
  totalCards = computed(() => this.cardStates.length);
  masteredCards = computed(() => this.cardStates.filter(c => c.mastered).length);
  remainingCards = computed(() => this.totalCards() - this.masteredCards());
  currentCard = computed(() => {
    return this.currentLoopCards[this.currentIndex()] || null;
  });
  currentLoopSize = computed(() => this.currentLoopCards.length);

  ngOnInit(): void {
    this.initializeSession();
  }

  initializeSession(): void {
    // Shuffle questions
    const shuffled = this.shuffleArray([...this.questions]);

    // Create FlashCardState for each question
    this.cardStates = shuffled.map(q => ({
      question: q,
      attemptCount: 0,
      mastered: false,
      lastResult: null
    }));

    // Capture cards for first loop (all cards)
    this.currentLoopCards = [...this.cardStates];

    this.currentIndex.set(0);
    this.currentLoop.set(1);
    this.sessionComplete.set(false);
    this.isRevealed.set(false);
    this.cardTheme.set(Math.floor(Math.random() * 8));
  }

  getRemainingCards(): FlashCardState[] {
    return this.cardStates.filter(cs => !cs.mastered);
  }

  revealAnswer(): void {
    this.isRevealed.set(true);
    const card = this.currentCard();
    if (card) {
      card.attemptCount++;
    }
    this.playRevealSound();
  }

  handleKnewIt(): void {
    const card = this.currentCard();
    if (!card) return;

    card.mastered = true;
    card.lastResult = 'knew';
    this.playSuccessSound();
    this.moveToNextCard();
  }

  handleDidntKnowIt(): void {
    const card = this.currentCard();
    if (!card) return;

    card.lastResult = 'didnt-know';
    this.playEncourageSound();
    this.moveToNextCard();
  }

  moveToNextCard(): void {
    this.isRevealed.set(false);

    const nextIndex = this.currentIndex() + 1;

    if (nextIndex >= this.currentLoopCards.length) {
      // End of current loop - check if there are any cards still not mastered
      const remaining = this.getRemainingCards();

      if (remaining.length === 0) {
        // All cards mastered!
        this.sessionComplete.set(true);
        this.playCompletionSound();
      } else {
        // Start new loop with remaining failed cards
        this.currentLoopCards = [...remaining]; // Capture new loop cards
        this.currentLoop.update(l => l + 1);
        this.currentIndex.set(0);
        this.playLoopSound();
      }
    } else {
      // Move to next card in current loop
      this.currentIndex.set(nextIndex);
    }
  }

  goToPreviousCard(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
      this.isRevealed.set(false);
    }
  }

  resetSession(): void {
    this.initializeSession();
  }

  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Audio feedback methods
  playRevealSound(): void {
    this.playAudio([400, 600], 0.1, 'sine');
  }

  playSuccessSound(): void {
    this.playAudio([523, 659, 784], 0.15, 'sine');
  }

  playEncourageSound(): void {
    this.playAudio([440, 330], 0.15, 'triangle');
  }

  playLoopSound(): void {
    this.playAudio([300, 400, 500], 0.1, 'square');
  }

  playCompletionSound(): void {
    this.playAudio([523, 659, 784, 1047, 1319], 0.2, 'sine');
  }

  private playAudio(frequencies: number[], duration: number, type: OscillatorType): void {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    let startTime = audioContext.currentTime;

    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);

      startTime += duration;
    });
  }
}
