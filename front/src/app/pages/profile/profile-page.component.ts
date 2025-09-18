import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { TopicsService, TopicDto } from '../../core/services/topics.service';

@Component({
  standalone: true,
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  imports: [CommonModule, NgFor, NgIf]
})
export class ProfilePageComponent {
  myTopics: TopicDto[] = [];
  loading = false;
  error = '';
  private unsubscribingId: number | null = null;

  constructor(private topicsSrv: TopicsService) {}

  ngOnInit() {
    this.loadMyTopics();
  }

  loadMyTopics() {
    this.loading = true;
    this.error = '';
    this.topicsSrv.listMine().subscribe({
      next: ts => { this.myTopics = ts; this.loading = false; },
      error: () => { this.error = 'Impossible de charger vos thèmes.'; this.loading = false; }
    });
  }

  trackById = (_: number, t: TopicDto) => t.id;

  unsubscribe(t: TopicDto) {
    if (this.unsubscribingId) return;
    this.unsubscribingId = t.id;
    this.topicsSrv.unsubscribe(t.id).subscribe({
      next: () => {
        this.myTopics = this.myTopics.filter(x => x.id !== t.id);
        this.unsubscribingId = null;
      },
      error: () => {
        this.error = "Échec du désabonnement";
        this.unsubscribingId = null;
      }
    });
  }
}
