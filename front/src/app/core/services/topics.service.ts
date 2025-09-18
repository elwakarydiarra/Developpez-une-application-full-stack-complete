// src/app/core/services/topics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TopicDto {
  id: number;
  name: string;
  description?: string | null;
  subscribed: boolean;
}

@Injectable({ providedIn: 'root' })
export class TopicsService {
  private base = environment.apiUrl; // ex: http://localhost:8080/api

  constructor(private http: HttpClient) {}

  /** Tous les thèmes avec le flag "subscribed" */
  listAll(): Observable<TopicDto[]> {
    return this.http.get<TopicDto[]>(`${this.base}/topics`);
  }

  /** Tous les thèmes (même ceux auxquels l’utilisateur n’est pas abonné) */
  list(): Observable<TopicDto[]> {
    return this.listAll();
  }

  /** Tous les thèmes (même ceux auxquels l’utilisateur n’est pas abonné) */
  listForMe(): Observable<TopicDto[]> {
    return this.listAll();
  }

  /** Tous les thèmes auxquels l’utilisateur est abonné */
  listMine(): Observable<TopicDto[]> {
    return this.listAll().pipe(map(ts => ts.filter(t => t.subscribed)));
  }

  subscribe(topicId: number): Observable<void> {
    return this.http.post<void>(`${this.base}/topics/${topicId}/subscribe`, {});
  }

  unsubscribe(topicId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/topics/${topicId}/subscribe`);
  }
}
