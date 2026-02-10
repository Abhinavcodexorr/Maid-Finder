import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FavoritesService } from '../services/favorites.service';
import { User } from '../models';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MaidFinder';
  currentUser: User | null = null;
  favoriteCount = 0;
  isLoading = false;
  private userSubscription: Subscription = new Subscription();
  private favoritesSubscription: Subscription = new Subscription();
  private routerSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to current user changes
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Subscribe to favorites changes
    this.favoritesSubscription = this.favoritesService.getFavorites().subscribe(favorites => {
      this.favoriteCount = favorites.length;
    });

    // Smooth page transitions
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Add fade-in animation to main content
        const main = document.querySelector('main');
        if (main) {
          main.classList.add('fade-in');
          setTimeout(() => main.classList.remove('fade-in'), 600);
        }
      });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.favoritesSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}
