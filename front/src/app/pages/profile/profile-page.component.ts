import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
  password = '';           // nouveau mot de passe (optionnel)
  saving = false;
  infoMsg = '';
  errorMsg = '';

  // ---- Abonnements ----
  myTopics: TopicDto[] = [];
  loadingTopics = false;
  unsubscribingId: number | null = null;

  // Regex: ≥8, au moins 1 min, 1 maj, 1 chiffre, 1 spécial, pas d'espace
  private static readonly PW_PATTERN =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?=\S+$).{8,}$/;

  ngOnInit() {
    this.loadProfile();
    this.loadMyTopics();
  }

  // Helpers affichage checklist
  get hasMinLen()      { return this.password?.length >= 8; }
  get hasLower()       { return /[a-z]/.test(this.password); }
  get hasUpper()       { return /[A-Z]/.test(this.password); }
  get hasDigit()       { return /\d/.test(this.password); }
  get hasSpecial()     { return /[^A-Za-z0-9]/.test(this.password); }
  get noSpace()        { return this.password ? !/\s/.test(this.password) : true; }
  get pwStrong()       { return !this.password || ProfilePageComponent.PW_PATTERN.test(this.password); }

  // Charge email/username
  loadProfile() {
    this.infoMsg = ''; this.errorMsg = '';
    this.http.get<UserDto>(`${environment.apiUrl}/me`).subscribe({
      next: u => { this.email = u.email; this.username = u.username; },
      error: () => this.errorMsg = 'Impossible de charger votre profil.'
    });
  }

  // Sauvegarde profil + met à jour le mot de passe si renseigné et valide
  save(form?: NgForm) {
    if (this.saving) return;
    this.saving = true; this.infoMsg = ''; this.errorMsg = '';

    // 1) maj email / username
    this.http.put<UserDto>(`${environment.apiUrl}/me`, {
      email: this.email, username: this.username
    }).subscribe({
      next: () => {
        // 2) si nouveau mot de passe fourni
        const newPw = this.password?.trim();
        if (newPw) {
          if (!this.pwStrong) {
            this.finishSave(false, 'Le mot de passe ne respecte pas les règles.');
            return;
          }
          this.http.put(`${environment.apiUrl}/me/password`, { newPassword: newPw }).subscribe({
            next: () => this.finishSave(true),
            error: (e) => this.finishSave(false, e?.error ?? 'Échec de la mise à jour du mot de passe.')
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
