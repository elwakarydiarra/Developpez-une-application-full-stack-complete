// src/app/pages/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FeedService, PostDto } from '../../core/services/feed.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, FormsModule, RouterLink, DatePipe, NgFor, NgIf,RouterModule]
})
export class HomeComponent {
  posts: PostDto[] = [];
  sort: 'asc' | 'desc' = 'desc';
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    public  auth: AuthService,
    private feed: FeedService
  ) {}

  ngOnInit() { console.log('HomeComponent chargé');
  this.load(); }

  load() {
    this.loading = true;
    this.feed.list(this.sort).subscribe({
      next: d => { this.posts = d; this.loading = false; },
      error: _ => { this.error = 'Impossible de charger les articles.'; this.loading = false; }
    });
  }

  onSortChange() { this.load(); }
  goToCreate() { this.router.navigate(['/new-post']); }
}
