import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = "";
  password: string = "";

  constructor(private router: Router, private dataService: DataService, private authService: AuthService ) { }

  postUser() {
    const data = {
      username: this.username,
      password: this.password,
    };
    this.dataService.postUser(data)
      .subscribe(response => {
        if (response['success'] == true) {
          this.login()
          this.router.navigate(['/map']);
        }
      });
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

}
