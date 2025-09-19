import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/welcome/welcome.component').then(m => m.WelcomeComponent) },


  { path: 'login',  loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./features/auth/signup.component').then(m => m.SignupComponent) },


  { path: 'articles', canActivate: [AuthGuard],
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },

  { path: 'posts/:id', canActivate: [AuthGuard],
    loadComponent: () => import('./features/posts/post-detail.component').then(m => m.PostDetailComponent) },

  { path: 'new-post', canActivate: [AuthGuard],
    loadComponent: () => import('./features/posts/create-post.component').then(m => m.CreatePostComponent) },

  { path: 'themes', canActivate: [AuthGuard],
    loadComponent: () => import('./pages/topics/topics-page.component').then(m => m.TopicsPageComponent) },

  { path: 'profile', canActivate: [AuthGuard],
    loadComponent: () => import('./pages/profile/profile-page.component').then(m => m.ProfilePageComponent) },

  { path: '**', redirectTo: '' }
  /**Not Found */
];
