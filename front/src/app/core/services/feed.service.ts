import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PostDto {
  id: number;
  authorId: number;
  topicId: number;
  title: string;
  content: string;
  createdAt: string; // ISO string
  authorUsername?: string | null;
  topicName?: string | null;
}

@Injectable({ providedIn: 'root' })
export class FeedService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  list(sort: 'asc' | 'desc' = 'desc'): Observable<PostDto[]> {
    return this.http.get<PostDto[]>(`${this.base}/feed`, {
      params: { sort },
      headers: this.getAuthHeaders()
    });
  }

  getFeed(sort: 'asc' | 'desc' = 'desc'): Observable<PostDto[]> {
    return this.list(sort);
  }
}
