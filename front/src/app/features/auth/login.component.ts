import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UiService } from 'src/app/core/services/ui.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  login = '';
  password = '';
  loading = false;
  error = '';

  private auth = inject(AuthService);
  private router = inject(Router);
  private ui = inject(UiService);

  ngOnInit(): void {
    // Indique que l'on est sur une page d'auth (pour le comportement du topbar)
    this.ui.setAuthPage(true);
  }

  ngOnDestroy(): void {
    // On quitte la page d'auth
    this.ui.setAuthPage(false);
  }

  onSubmit(f?: NgForm) {
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

  goWelcome(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.router.navigateByUrl('/'); // ← welcome
  }
}
