import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  login = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.loading) return;
    this.loading = true;
    this.error = '';

    this.auth.login(this.login, this.password).subscribe({
      next: () => this.router.navigateByUrl('/articles'),
      error: () => {
        this.error = 'Identifiants invalides';
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
