import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Nécessaire pour *ngFor
import { ArticleService } from '../../services/article.service'; // Service pour consommer l'API
import { HeaderComponent } from '../../components/header/header.component'; // Composant Header
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true, // Composant standalone
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  articles: any[] = []; // Stockage des articles
  filteredArticles: any[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'All';
  currentPage = 1; // Page actuelle
  itemsPerPage = 4; // Nombre d'articles par page

  // Injecter le `Router` et le `ArticleService`
  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer les articles depuis le backend
    this.articleService.getArticles().subscribe((data) => {
      // Sort articles by created_at date in descending order (newest first)
    this.articles = data.sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    // Initialiser la pagination (afficher les articles de la première page)
    this.updatePagination();
    });
  }

  // Méthode pour mettre à jour les articles affichés en fonction de la pagination
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredArticles = this.articles.slice(startIndex, endIndex);
  }

  // Changer de page
  changePage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  // Méthode pour calculer le nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.articles.length / this.itemsPerPage);
  }

  // Filtrer les articles
  filterArticles(): void {
    this.filteredArticles = this.articles.filter((article) => {
      return (
        (this.selectedCategory === 'All' ||
          article.category === this.selectedCategory) &&
        article.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    })
    .sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ); // Ensure the filtered list is also sorted by date
  }

  // Filtrer par catégorie
  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filterArticles();
  }

  // Naviguer vers la page d'un article sélectionné
  viewArticle(article: any): void {
    this.router.navigate(['/article', article.id]);
  }

  get noArticlesFound(): boolean {
    return this.filteredArticles.length === 0;
  }
  
}