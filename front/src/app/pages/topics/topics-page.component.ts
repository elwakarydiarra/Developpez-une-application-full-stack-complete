import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicsService, TopicDto } from '../../core/services/topics.service';

@Component({
  selector: 'app-topics-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topics-page.component.html',
  styleUrls: ['./topics-page.component.scss']
})
export class TopicsPageComponent {
  private topicsSrv = inject(TopicsService);

  topics: TopicDto[] = [];
  loading = false;
  error = '';
  loadingId: number | null = null;

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading = true; this.error = '';
    this.topicsSrv.list().subscribe({
      next: t => { this.topics = t; this.loading = false; },
      error: () => { this.error = 'Impossible de charger les thèmes.'; this.loading = false; }
    });
  }

  trackById = (_: number, t: TopicDto) => t.id;

  onSubscribe(t: TopicDto) {
    if (t.subscribed) return;
    this.loadingId = t.id;
    this.topicsSrv.subscribe(t.id).subscribe({
      next: () => { t.subscribed = true; this.loadingId = null; },
      error: () => { this.loadingId = null; alert("Échec de l'abonnement"); }
    });
  }
}
