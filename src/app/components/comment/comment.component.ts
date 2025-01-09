import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../services/comment.service';
@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent {
  @Input() comment!: {
    id: number;
    article_id: number;
    user: string;
    date: string;
    content: string;
    likes: number;
    replies: any[];
  };

  liked: boolean = false; // État du bouton "Like"
  showReplies: boolean = false; // Affichage des réponses
  replyMode: boolean = false; // Affichage du champ "Reply"

  constructor(private commentService: CommentService) {}

  // Méthode pour gérer les likes
  toggleLike() {
    this.liked = !this.liked;
    this.comment.likes += this.liked ? 1 : -1;
  }

  // Méthode pour afficher/masquer les réponses
  toggleReplies() {
    this.showReplies = !this.showReplies;
  }

  // Méthode pour afficher le champ de réponse
  toggleReplyMode() {
    this.replyMode = !this.replyMode;
  }

  // Méthode pour ajouter une réponse
  addReply(content: string): void {
    if (content.trim()) {
      const newReply = {
        article_id: this.comment.article_id,
        parent_id: this.comment.id,
        content: content.trim(),
      };

      this.commentService.addComment(newReply).subscribe(
        (reply) => {
          this.comment.replies.push(reply); // Ajouter la réponse
          this.replyMode = false; // Fermer le formulaire de réponse
        },
        (error) => {
          console.error("Erreur lors de l'ajout de la réponse :", error);
        }
      );
    }
  }

  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Réinitialise la hauteur pour éviter l'accumulation
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajuste la hauteur au contenu
  }
}
