import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionChallengeHomeComponent } from '../question-challenge-home/question-challenge-home.component';
import { FlashCardHomeComponent } from '../flash-card-home/flash-card-home.component';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, QuestionChallengeHomeComponent, FlashCardHomeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private seoService = inject(SeoService);
  selectedGame = signal<string | null>(null);

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'Flash Owls - Interactive Quiz and Learning Platform',
      description: 'Test your knowledge with Flash Owls - an interactive quiz and flashcard platform. Includes a free Java 17 certification prep 1Z0-829 question bank! Practice questions across multiple categories and improve your skills through gamified learning.',
      keywords: 'quiz, flashcards, learning, education, practice questions, test preparation',
      url: 'https://flashowls.com/'
    });
  }

  selectGame(game: string): void {
    this.selectedGame.set(game);
  }

  backToMenu(): void {
    this.selectedGame.set(null);
  }
}
