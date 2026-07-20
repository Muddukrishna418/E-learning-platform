import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  private authService = inject(Auth);
  private router = inject(Router);
  isAuthenticated = false;
  searchTerm = '';
  mobileMenuOpen = false;

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  searchCourses(): void {
    const term = this.searchTerm.trim();
    if (!term) {
      return;
    }

    this.router.navigate(['/courses'], { queryParams: { search: term }, queryParamsHandling: 'merge' });
    this.closeMobileMenu();
  }
}
