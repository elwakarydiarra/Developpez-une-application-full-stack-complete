import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicsService, TopicDto } from '../../core/services/topics.service';

type TopicVM = TopicDto & { description?: string };

@Component({
  selector: 'app-topics-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topics-page.component.html',
  styleUrls: ['./topics-page.component.scss']
})
export class TopicsPageComponent {
  private topicsSrv = inject(TopicsService);

  topics: TopicVM[] = [];
  loading = false;
  error = '';
  loadingId: number | null = null;

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.error = '';

    this.topicsSrv.list().subscribe({
      next: list => {
        // 🔧 Normalisation pour s'assurer que .description est remplie
        this.topics = (list ?? []).map((t: any) => ({
          ...t,
          description:
            t.description ??
            t.desc ??
            t.details ??
            t.content ??
            t?.topic?.description ??
            ''
        }));
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les thèmes.';
        this.loading = false;
      }
    });
  }

  trackById = (_: number, t: TopicVM) => t.id;

  onSubscribe(t: TopicVM) {
    if (t.subscribed) return;
    this.loadingId = t.id;
    this.topicsSrv.subscribe(t.id).subscribe({
      next: () => { t.subscribed = true; this.loadingId = null; },
      error: () => { this.loadingId = null; alert("Échec de l'abonnement"); }
    });
  }
}
