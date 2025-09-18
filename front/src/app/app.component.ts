import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';
import { AuthService } from './core/services/auth.service';


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

   logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
