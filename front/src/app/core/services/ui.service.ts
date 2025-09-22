import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiService {
  private _authPage = new BehaviorSubject<boolean>(false);
  readonly isAuthPage$ = this._authPage.asObservable();

  /** Appelé par login/signup (ngOnInit/Destroy) */
  setAuthPage(value: boolean) {
    this._authPage.next(value);
  }
}
