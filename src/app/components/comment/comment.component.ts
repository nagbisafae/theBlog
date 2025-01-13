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
    user: {
      name: string;
      image: string;
    };
    date: string;
    content: string;
    likes: number;
    liked: boolean;
    replies: any[];
  };

  showReplies: boolean = false; // Affichage des réponses
  replyMode: boolean = false; // Affichage du champ "Reply"

  constructor(private commentService: CommentService) {}

  // Méthode pour gérer les likes
  toggleLike() {
    this.commentService.toggleLike(this.comment.id).subscribe(
      (response) => {
        this.comment.likes = response.likes; // Mettre à jour le nombre de likes
        this.comment.liked = response.liked; // Mettre à jour l'état du like
      },
      (error) => {
        console.error('Erreur lors de la mise à jour des likes :', error);
      }
    );
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

      const tempReply = {
        ...newReply,
        id: Date.now(),
        created_at: new Date().toISOString(),
        user: { name: 'You', image: 'https://via.placeholder.com/40' },
        likes: 0,
      };

      // Ajouter la réponse temporaire
      if (!this.comment.replies) {
        this.comment.replies = []; // Initialiser les réponses si elles sont undefined
      }
      this.commentService.addComment(newReply).subscribe(
        (reply) => {
          // Ajouter la réponse confirmée par l'API
          this.comment.replies = [...(this.comment.replies || []), reply];
          this.replyMode = false; // Fermer le formulaire
        },
        (error) => {
          console.error("Erreur lors de l'ajout de la réponse :", error);
          // En cas d'erreur, vous pouvez également supprimer la réponse temporaire
          this.comment.replies = this.comment.replies.filter(
            (r) => r.id !== tempReply.id
          );
        }
      );
    }
  }

  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Réinitialise la hauteur pour éviter l'accumulation
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajuste la hauteur au contenu
  }
  ngOnInit() {
    console.log('Commentaire reçu :', this.comment);
    if (!this.comment.replies) {
      this.comment.replies = []; // Initialisation par défaut
    }
  }
}
