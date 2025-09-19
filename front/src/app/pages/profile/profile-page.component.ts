import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TopicsService, TopicDto } from '../../core/services/topics.service';

interface UserDto { id: number; email: string; username: string; }

@Component({
  standalone: true,
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class ProfilePageComponent {
  private http = inject(HttpClient);
  private topicsSrv = inject(TopicsService);

  // ---- Profil ----
  email = '';
  username = '';
  password = '';               // optionnel: nouveau mot de passe
  saving = false;
  infoMsg = '';
  errorMsg = '';
  currentPassword = '';

  // ---- Abonnements ----
  myTopics: TopicDto[] = [];
  loadingTopics = false;
  unsubscribingId: number | null = null;

  ngOnInit() {
    this.loadProfile();
    this.loadMyTopics();
  }

  // Charge email/username
  loadProfile() {
    this.infoMsg = ''; this.errorMsg = '';
    this.http.get<UserDto>(`${environment.apiUrl}/me`).subscribe({
      next: u => { this.email = u.email; this.username = u.username; },
      error: () => this.errorMsg = 'Impossible de charger votre profil.'
    });
  }

  // Sauvegarde profil (email/username) + mot de passe si renseigné
  save() {
    this.saving = true; this.infoMsg = ''; this.errorMsg = '';
    this.http.put<UserDto>(`${environment.apiUrl}/me`, {
      email: this.email, username: this.username
    }).subscribe({
      next: () => {
        if (this.password?.trim()) {
          this.http.put(`${environment.apiUrl}/me/password`, {
            currentPassword: this.currentPassword,
            newPassword: this.password.trim()
          }).subscribe({
            next: () => this.finishSave(true),
            error: () => this.finishSave(false, 'Échec de la mise à jour du mot de passe.')
          });
        } else {
          this.finishSave(true);
        }
      },
      error: (e) => {
        this.finishSave(false,
          e?.status === 409 ? 'Email ou nom d’utilisateur déjà utilisé.' : 'Échec de la mise à jour du profil.'
        );
      }
    });
  }

  private finishSave(ok: boolean, err?: string) {
    this.saving = false;
    if (ok) {
      this.infoMsg = 'Profil mis à jour.';
      this.password = '';
    } else {
      this.errorMsg = err ?? 'Une erreur est survenue.';
    }
  }

  // ---- Abonnements ----
  loadMyTopics() {
    this.loadingTopics = true;
    this.topicsSrv.listMine().subscribe({
      next: ts => { this.myTopics = ts; this.loadingTopics = false; },
      error: () => { this.loadingTopics = false; this.errorMsg = 'Impossible de charger vos thèmes.'; }
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
        this.errorMsg = "Échec du désabonnement.";
        this.unsubscribingId = null;
      }
    });
  }
}
