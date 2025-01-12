import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../services/comment.service'; // Import du service CommentService

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, FormsModule], // Ajout de FormsModule pour [(ngModel)]
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css'],
})
export class CommentFormComponent {
  successMessage: string | null = null;
  errorMessage: string | null = null;
  // Contenu du commentaire
  content: string = '';
   // Injection du service CommentService
   constructor(private commentService: CommentService) {}
   // ID de l'article associé au commentaire
   @Input() articleId!: number;
 

  // Événement émis lors de l'envoi du commentaire
  @Output() commentAdded = new EventEmitter<{
    content: string;
    parent_id: number | null;
  }>();

  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Réinitialise la hauteur pour éviter l'accumulation
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajuste la hauteur au contenu
  }
  @Input() parentId?: number; // ID du commentaire parent (null pour un commentaire principal)

  // Liste des mots inappropriés (par exemple)
  private inappropriateWords = ['suicide', 'violence', 'drugs', 'abuse'];

  // Soumettre un commentaire ou une réponse
  submitComment(): void {
    if (this.content.trim()) {
      // Vérifiez si le contenu contient des mots inappropriés
      const containsInappropriateWord = this.inappropriateWords.some((word) =>
        this.content.toLowerCase().includes(word.toLowerCase())
      );
      if (containsInappropriateWord) {
        this.showError('Contenu inapproprié détecté. Veuillez modifier le commentaire.');
        return; // Arrête l'exécution si un mot inapproprié est détecté
      }
      this.commentAdded.emit({
        content: this.content.trim(), // Assurez-vous que c'est une chaîne
        parent_id: this.parentId || null, // Null pour un commentaire principal
      });
      this.content = ''; // Réinitialiser le champ
    }
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => (this.successMessage = null), 3000);
  }
  
  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = null), 3000);
  }
}
