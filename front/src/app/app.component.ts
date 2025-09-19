import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { filter, map, startWith } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [ NgIf, AsyncPipe,RouterModule],
})
export class AppComponent {
  private router = inject(Router);
  auth = inject(AuthService);
  isWelcome$ = this.router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    map(() => this.router.url === '/' || this.router.url === ''),
    startWith(this.router.url === '/' || this.router.url === '')
  );

   logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
