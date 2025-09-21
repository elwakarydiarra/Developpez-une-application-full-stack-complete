import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';
import { filter, map, startWith } from 'rxjs';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NgIf, AsyncPipe, RouterModule],
})
export class AppComponent {
  private router = inject(Router);
  auth = inject(AuthService);

  /** true si on est sur /login, /signup, /welcome ou / */
  isAuthPage$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map(e => this.isAuthUrl(e.urlAfterRedirects)),
    startWith(this.isAuthUrl(this.router.url))
  );

  private isAuthUrl(url: string): boolean {
    // normalise (retire query/fragment)
    const path = url.split('?')[0].split('#')[0];
    return path === '/' || /^\/(login|signup|welcome)$/.test(path);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
