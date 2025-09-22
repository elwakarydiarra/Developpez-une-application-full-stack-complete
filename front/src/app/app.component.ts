import { Component, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { UiService } from './core/services/ui.service';
import { combineLatest, filter, map, startWith } from 'rxjs';

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
  private ui = inject(UiService);

  /** Détection par URL (sécurise même si on oublie d’appeler UiService dans un composant) */
  private urlIsAuth$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map(e => this.isAuthPath(e.urlAfterRedirects)),
    startWith(this.isAuthPath(this.router.url))
  );

  /** Flag final : true si page d’auth (login/signup/welcome) */
  isAuthPage$ = combineLatest([this.ui.isAuthPage$, this.urlIsAuth$]).pipe(
    map(([viaService, viaUrl]) => viaService || viaUrl)
  );

  private isAuthPath(url: string): boolean {
    const path = url.split('?')[0].split('#')[0];
    return path === '/' || path === '/welcome' || path === '/login' || path === '/signup';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
