import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FavoritesService } from '../services/favorites.service';
import { User } from '../models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MaidFinder';
  currentUser: User | null = null;
  favoriteCount = 0;
  private userSubscription: Subscription = new Subscription();
  private favoritesSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService
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
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.favoritesSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}
