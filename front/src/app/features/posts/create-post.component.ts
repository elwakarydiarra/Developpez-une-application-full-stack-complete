import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { TopicsService, TopicDto } from '../../core/services/topics.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent {
  private post = inject(PostService);
  private topicsSrv = inject(TopicsService);
  private router = inject(Router);

  topics: TopicDto[] = [];
  topicId: number | null = null;
  title = '';
  content = '';
  loading = false;
  error = '';

  ngOnInit() {
  this.topicsSrv.list().subscribe({
    next: (t: TopicDto[]) => { this.topics = t; },
    error: () => this.error = 'Impossible de charger les thèmes.'
  });
}


  trackById(_i: number, item: TopicDto) { return item.id; }

  goBack() { this.router.navigateByUrl('/articles'); }

  canSubmit(): boolean {
    return !!this.topicId && !!this.title.trim() && !!this.content.trim() && !this.loading;
  }

  onSubmit() {
    if (!this.canSubmit()) return;
    this.loading = true; this.error = '';
    this.post.create({
      topicId: this.topicId as number,
      title: this.title.trim(),
      content: this.content.trim()
    }).subscribe({
      next: () => this.router.navigateByUrl('/articles'),
      error: () => { this.loading = false; this.error = 'Création impossible.'; }
    });
  }
}
