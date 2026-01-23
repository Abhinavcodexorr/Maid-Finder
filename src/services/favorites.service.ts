import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<number[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    // Load favorites from localStorage on service initialization
    const storedFavorites = localStorage.getItem('favoriteMaids');
    if (storedFavorites) {
      this.favoritesSubject.next(JSON.parse(storedFavorites));
    }
  }

  getFavorites(): Observable<number[]> {
    return this.favorites$;
  }

  addToFavorites(maidId: number): Observable<boolean> {
    const currentFavorites = this.favoritesSubject.value;
    if (!currentFavorites.includes(maidId)) {
      const updatedFavorites = [...currentFavorites, maidId];
      this.favoritesSubject.next(updatedFavorites);
      localStorage.setItem('favoriteMaids', JSON.stringify(updatedFavorites));
    }
    return of(true).pipe(delay(100));
  }

  removeFromFavorites(maidId: number): Observable<boolean> {
    const currentFavorites = this.favoritesSubject.value;
    const updatedFavorites = currentFavorites.filter(id => id !== maidId);
    this.favoritesSubject.next(updatedFavorites);
    localStorage.setItem('favoriteMaids', JSON.stringify(updatedFavorites));
    return of(true).pipe(delay(100));
  }

  toggleFavorite(maidId: number): Observable<boolean> {
    const currentFavorites = this.favoritesSubject.value;
    if (currentFavorites.includes(maidId)) {
      return this.removeFromFavorites(maidId);
    } else {
      return this.addToFavorites(maidId);
    }
  }

  isFavorite(maidId: number): boolean {
    return this.favoritesSubject.value.includes(maidId);
  }

  getFavoriteCount(): number {
    return this.favoritesSubject.value.length;
  }

  clearFavorites(): Observable<boolean> {
    this.favoritesSubject.next([]);
    localStorage.removeItem('favoriteMaids');
    return of(true).pipe(delay(100));
  }
}

