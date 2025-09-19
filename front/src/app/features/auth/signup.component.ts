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

  onSubmit() {
    if (this.loading) return;
    this.loading = true;
    this.error = '';

    this.auth.signup(this.email, this.username, this.password).subscribe({
      next: () => this.router.navigateByUrl('/articles'),
      error: (e) => {
        this.error =
          e?.status === 409 ? 'Email/username déjà utilisé' : 'Inscription impossible';
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
