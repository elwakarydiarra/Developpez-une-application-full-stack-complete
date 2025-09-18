import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';

// src/app/features/auth/signup.component.ts
@Component({
  standalone:true, imports:[CommonModule, FormsModule, RouterLink],
  template: `
  <h1>S’inscrire</h1>
  <form (ngSubmit)="onSubmit()">
    <input [(ngModel)]="email" name="email" type="email" placeholder="Email" required>
    <input [(ngModel)]="username" name="username" placeholder="Nom d'utilisateur" required>
    <input [(ngModel)]="password" name="password" type="password" placeholder="Mot de passe (≥6)" required>
    <button [disabled]="loading">Créer le compte</button>
    <a routerLink="/login">Déjà inscrit ?</a>
    <div class="err" *ngIf="error">{{error}}</div>
  </form>`
})
export class SignupComponent {
  email=''; username=''; password=''; loading=false; error='';
  constructor(private auth:AuthService, private router:Router){}
  onSubmit(){ this.loading=true; this.error='';
    this.auth.signup(this.email, this.username, this.password).subscribe({
      next: () => this.router.navigateByUrl('/articles'),
      error: (e) => { this.error = e.status===409 ? 'Email/username déjà utilisé' : 'Inscription impossible'; this.loading=false; }
    });
  }
}
