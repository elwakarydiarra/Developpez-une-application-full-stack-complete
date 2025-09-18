import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService, PostDto, CommentDto } from '../../core/services/post.service';

@Component({
  standalone: true,
  selector: 'app-post-detail',
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  templateUrl: './post-detail.component.html',
  styles: [`
    .wrap{max-width:980px;margin:0 auto;padding:24px;}
    .back{display:inline-flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:12px}
    h1{font-size:28px;margin:8px 0 12px}
    .meta{display:flex;gap:12px; color:#555; font-weight:600; margin-bottom:18px}
    .content{line-height:1.6; margin-bottom:24px}
    hr{border:none;border-top:1px solid #e7e7ea;margin:16px 0 24px}
    .comment{display:grid;grid-template-columns:120px 1fr;gap:16px;margin-bottom:16px}
    .bubble{background:#eee; border-radius:14px; padding:14px 16px}
    .new{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;margin-top:8px}
    textarea{width:100%;min-height:96px;border:1px solid #dcdce3;border-radius:12px;padding:14px;outline:none}
    button.send{border:none;background:none;cursor:pointer;font-size:24px;line-height:1}
    .muted{color:#999;font-weight:600}
  `]
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

  private load() {
    this.loading = true;
    this.postSvc.getById(this.id).subscribe(p => { this.post = p; this.loading = false; });
    this.postSvc.getComments(this.id).subscribe(cs => this.comments = cs);
  }

  goBack() { this.router.navigate(['/articles']); }

  send() {
    const content = this.text?.trim();
    if (!content) return;
    this.sending = true;
    this.postSvc.addComment(this.id, content).subscribe({
      next: c => { this.comments.push(c); this.text = ''; this.sending = false; },
      error: () => { this.sending = false; }
    });
  }

  labelUser(c: CommentDto) {
    return c.authorUsername ?? (c.authorId != null ? `user#${c.authorId}` : 'username');
  }

  labelAuthor(p: PostDto) {
    return p.authorUsername ?? `Auteur`;
  }

  labelTopic(p: PostDto) {
    return p.topicName ?? `Thème`;
  }
}
