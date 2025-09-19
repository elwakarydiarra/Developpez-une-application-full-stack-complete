import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService, PostDto, CommentDto } from '../../core/services/post.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  imports: [CommonModule, FormsModule, DatePipe]
})
export class PostDetailComponent {
  post?: PostDto;
  comments: CommentDto[] = [];
  loading = true;
  sending = false;
  text = '';

  private id = Number(this.route.snapshot.paramMap.get('id'));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postSvc: PostService
  ) {
    this.load();
  }

  /** Charge le post + coms et NORMALISE les champs (authorUsername/topicName) */
  private load() {
    this.loading = true;

    this.postSvc.getById(this.id).subscribe(p => {
      const anyP: any = p as any;

      // Assure la présence de authorUsername et topicName, quel que soit le payload
      (p as any).authorUsername =
        p.authorUsername ??
        anyP.author?.username ??
        anyP.user?.username ??
        anyP.createdBy?.username ??
        anyP.owner?.username ??
        anyP.author_name ??
        anyP.user_name ??
        null;

      (p as any).topicName =
        p.topicName ??
        anyP.topic?.name ??
        anyP.theme?.name ??
        anyP.topic_name ??
        anyP.theme_name ??
        null;

      this.post = p;
      this.loading = false;
    });

    this.postSvc.getComments(this.id).subscribe(cs => {
      this.comments = cs.map((c: any) => ({
        ...c,
        authorUsername:
          c.authorUsername ??
          c.author?.username ??
          c.user?.username ??
          c.createdBy?.username ??
          c.owner?.username ??
          c.author_name ??
          c.user_name ??
          (c.authorId ? `user#${c.authorId}` : 'username')
      }));
      // DEBUG (optionnel) :
      // console.log('comments normalized:', this.comments);
    });
  }

  goBack() {
    this.router.navigate(['/articles']);
  }

  /** Envoi d'un commentaire + normalisation de la réponse ajoutée à la liste */
  send() {
    const content = this.text?.trim();
    if (!content || this.sending) return;

    this.sending = true;
    this.postSvc.addComment(this.id, content).subscribe({
      next: (c: any) => {
        const normalized: CommentDto = {
          ...c,
          authorUsername:
            c.authorUsername ??
            c.author?.username ??
            c.user?.username ??
            c.createdBy?.username ??
            c.owner?.username ??
            c.author_name ??
            c.user_name ??
            (c.authorId ? `user#${c.authorId}` : 'username')
        };
        this.comments.push(normalized);
        this.text = '';
        this.sending = false;
      },
      error: () => {
        this.sending = false;
      }
    });
  }

  // Helpers d'affichage
  labelUser(c: CommentDto) {
    return c.authorUsername ?? (c.authorId != null ? `user#${c.authorId}` : 'username');
  }
  labelAuthor(p: PostDto) {
    return (p as any).authorUsername ?? 'Auteur';
  }
  labelTopic(p: PostDto) {
    return (p as any).topicName ?? 'Thème';
  }
}
