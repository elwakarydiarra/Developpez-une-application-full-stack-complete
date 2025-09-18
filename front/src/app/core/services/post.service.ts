import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface PostCreate {
  topicId: number;
  title: string;
  content: string;
}

export interface PostDto {
  id: number;
  authorId: number;
  topicId: number;
  title: string;
  content: string;
  createdAt: string;
  authorUsername?: string;
  topicName?: string;
}

export interface CommentDto {
  id: number;
  authorId: number;
  content: string;
  createdAt: string;
  authorUsername?: string;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  private base = environment.apiUrl; // ex: http://localhost:8080/api

  constructor(private http: HttpClient) {}

  // création
  create(body: PostCreate) {
    return this.http.post<PostDto>(`${this.base}/posts`, body);
  }

  // détail d’un post
  getById(id: number): Observable<PostDto> {
    return this.http.get<PostDto>(`${this.base}/posts/${id}`);
  }

  // commentaires d’un post
  getComments(postId: number): Observable<CommentDto[]> {
    return this.http.get<CommentDto[]>(`${this.base}/posts/${postId}/comments`);
  }

  // ajouter un commentaire
  addComment(postId: number, content: string): Observable<CommentDto> {
    return this.http.post<CommentDto>(`${this.base}/posts/${postId}/comments`, { content });
  }
}
