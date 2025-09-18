import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicsService, TopicDto } from '../../core/services/topics.service';

@Component({
  selector: 'app-themes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent {
  private topicsSrv = inject(TopicsService);

  topics: TopicDto[] = [];
  loading = true;
  error = '';
  working = new Set<number>();

  ngOnInit() {
    this.topicsSrv.listForMe().subscribe({
      next: ts => { this.topics = ts; this.loading = false; },
      error: () => { this.error = 'Impossible de charger les thèmes.'; this.loading = false; }
    });
  }

  onSubscribe(t: TopicDto) {
    if (t.subscribed || this.working.has(t.id)) return;
    this.working.add(t.id);
    this.topicsSrv.subscribe(t.id).subscribe({
      next: () => { t.subscribed = true; this.working.delete(t.id); },
      error: () => { this.working.delete(t.id); }
    });
  }
}
