import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService) { }

  login() {
    this.cookieService.set('isAuthenticated', 'true');
    this.cookieService.set('isAdmin', 'true');
  }

  logout() {
    this.cookieService.delete('isAuthenticated');
    this.cookieService.delete('isAdmin');
  }

  isAuthenticatedUser(): boolean {
    return this.cookieService.get('isAuthenticated') === 'true';
  }
  
  isAdminUser(): boolean {
    return this.cookieService.get('isAdmin') === 'true';
  }
}
