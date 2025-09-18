import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommentCreateRequest, CommentDto } from '../models/comment.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private base = `${environment.apiUrl}/api/posts`;
  constructor(private http: HttpClient) {}
  add(postId: number, req: CommentCreateRequest): Observable<CommentDto> {
    return this.http.post<CommentDto>(`${this.base}/${postId}/comments`, req);
  }
}
