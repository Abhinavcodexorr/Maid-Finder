import { Component, OnInit, OnDestroy } from '@angular/core';
import { Maid } from '../../../models';
import { FavoritesService } from '../../../services/favorites.service';
import { MaidService } from '../../../services/maid.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favoriteMaids: Maid[] = [];
  isLoading = true;
  private favoritesSubscription: Subscription = new Subscription();

  constructor(
    private favoritesService: FavoritesService,
    private maidService: MaidService
  ) {}

  ngOnInit(): void {
    this.loadFavoriteMaids();
  }

  ngOnDestroy(): void {
    this.favoritesSubscription.unsubscribe();
  }

  loadFavoriteMaids(): void {
    this.isLoading = true;
    
    this.favoritesSubscription = this.favoritesService.getFavorites().subscribe(favoriteIds => {
      if (favoriteIds.length === 0) {
        this.favoriteMaids = [];
        this.isLoading = false;
        return;
      }

      this.maidService.getAllMaids().subscribe(allMaids => {
        this.favoriteMaids = allMaids.filter(maid => favoriteIds.includes(maid.id));
        this.isLoading = false;
      });
    });
  }

  removeFromFavorites(maidId: number): void {
    this.favoritesService.removeFromFavorites(maidId).subscribe(() => {
      // The favorites list will automatically update due to the subscription
    });
  }

  clearAllFavorites(): void {
    this.favoritesService.clearFavorites().subscribe(() => {
      // The favorites list will automatically update due to the subscription
    });
  }
}

