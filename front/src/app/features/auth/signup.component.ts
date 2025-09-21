import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  email = '';
  username = '';
  password = '';
  loading = false;
  error = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  // Regex déplacées ici (pas dans le template)
  private readonly reLower = /[a-z]/;
  private readonly reUpper = /[A-Z]/;
  private readonly reDigit = /\d/;
  private readonly reSpecial = /[^A-Za-z0-9]/;
  private readonly reNoSpace = /^\S+$/;

  // Getters pour le template
  get lenOk()     { return (this.password?.length ?? 0) >= 8; }
  get lowerOk()   { return this.reLower.test(this.password || ''); }
  get upperOk()   { return this.reUpper.test(this.password || ''); }
  get digitOk()   { return this.reDigit.test(this.password || ''); }
  get specialOk() { return this.reSpecial.test(this.password || ''); }
  get noSpaceOk() { return this.reNoSpace.test(this.password || ''); }

  // Validation complète (utilisée dans onSubmit)
  private isPasswordStrong(pwd: string): boolean {
    return pwd.length >= 8
        && this.reLower.test(pwd)
        && this.reUpper.test(pwd)
        && this.reDigit.test(pwd)
        && this.reSpecial.test(pwd)
        && this.reNoSpace.test(pwd);
  }

  onSubmit() {
    if (this.loading) return;
    this.error = '';

    // Seconde barrière côté front
    if (!this.isPasswordStrong(this.password)) {
      this.error =
        'Le mot de passe doit contenir au moins 8 caractères, avec une majuscule, une minuscule, un chiffre, un caractère spécial et aucun espace.';
      return;
    }

    this.loading = true;
    this.auth.signup(this.email, this.username, this.password).subscribe({
      next: () => this.router.navigateByUrl('/articles'),
      error: (e) => {
        this.error = e?.status === 409
          ? 'Email/username déjà utilisé'
          : 'Inscription impossible';
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }

  goWelcome(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.router.navigateByUrl('/'); // welcome
  }
}
