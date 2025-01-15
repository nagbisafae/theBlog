import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { OurStoryComponent } from './pages/our-story/our-story.component';
import { LoginComponent } from './pages/login/login.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { WriteComponent } from './pages/write/write.component';
import { ProfileeComponent } from './pages/profilee/profilee.component';
import { SelectedArticleComponent } from './pages/selected-article/selected-article.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent }, // Landing Page
  { path: 'our-story', component: OurStoryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'write', component: WriteComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'article/:id', component: SelectedArticleComponent },
  { path: 'profilee', component: ProfileeComponent },
  { path: '**', redirectTo: '' },
];
