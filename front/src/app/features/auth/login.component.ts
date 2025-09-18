import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  standalone: true, imports:[CommonModule, FormsModule, RouterLink],
  template: `
  <h1>Se connecter</h1>
  <form (ngSubmit)="onSubmit()">
    <input [(ngModel)]="login" name="login" placeholder="Email ou nom d'utilisateur" required>
    <input [(ngModel)]="password" name="password" type="password" placeholder="Mot de passe" required>
    <button [disabled]="loading">Connexion</button>
    <a routerLink="/signup">Créer un compte</a>
    <div class="err" *ngIf="error">{{error}}</div>
  </form>`
})
export class LoginComponent {
  login=''; password=''; loading=false; error='';
  constructor(private auth:AuthService, private router:Router){}
  onSubmit(){ this.loading=true; this.error='';
    this.auth.login(this.login, this.password).subscribe({
      next: () => this.router.navigateByUrl('/articles'),
      error: () => { this.error='Identifiants invalides'; this.loading=false; }
    });
  }
}
