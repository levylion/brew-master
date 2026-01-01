import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  welcomeMessage: string | null = null;
  isLoggedIn = false;

  constructor() { }

  onSubmit() {
    // BUG: Logging credentials to console
    console.log('Login attempt:', 'Email:', this.email, 'Password:', this.password);

    // Simulate login success
    this.isLoggedIn = true;

    const name = this.email.split('@')[0];

    // In a real app, this would be sanitized. We purposefully bypass it.
    // this.welcomeMessage = this.sanitizer.bypassSecurityTrustHtml(unsafeHtml);
    this.welcomeMessage = `Welcome back, ${this.email}!`;
  }
}
