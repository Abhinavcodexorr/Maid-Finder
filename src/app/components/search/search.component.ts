import { Component, OnInit, OnDestroy } from '@angular/core';
import { Maid, MaidSearchFilters } from '../../../models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FavoritesService } from '../../../services/favorites.service';
import { MaidService } from '../../../services/maid.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  maids: Maid[] = [];
  filteredMaids: Maid[] = [];
  searchForm: FormGroup;
  availableSkills: string[] = [
    'Cleaning', 'Cooking', 'Childcare', 'Elderly Care', 
    'Pet Care', 'Driving', 'Laundry', 'First Aid', 'Ironing', 'Gardening'
  ];
  availableNationalities: string[] = [
    'Filipino', 'Indian', 'Sri Lankan', 'Indonesian', 'Ethiopian', 'Nepalese'
  ];
  availableLanguages: string[] = [
    'English', 'Arabic', 'Hindi', 'Tagalog', 'Urdu'
  ];
  availableLocations: string[] = [
    'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Al Ain', 'Ras Al Khaimah'
  ];
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 12;
  totalItems = 0;
  favorites: number[] = [];
  private favoritesSubscription: Subscription = new Subscription();
  private searchTimeout: any;

  constructor(
    private fb: FormBuilder,
    private favoritesService: FavoritesService,
    private maidService: MaidService,
    private toastr: ToastrService
  ) {
    this.searchForm = this.fb.group({
      nationality: [''],
      skills: [''],
      minExperience: [''],
      maxHourlyRate: [''],
      location: [''],
      availability: [''],
      languages: [''],
      isVerified: [false],
      minRating: ['']
    });
  }

  ngOnInit(): void {
    this.loadMaids();
    this.loadFavorites();
    
    // Watch for form changes with debounce for better performance
    this.searchForm.valueChanges.subscribe(() => {
      this.debounceSearch();
    });
  }

  ngOnDestroy(): void {
    this.favoritesSubscription.unsubscribe();
  }

  loadFavorites(): void {
    this.favoritesSubscription = this.favoritesService.getFavorites().subscribe(favorites => {
      this.favorites = favorites;
    });
  }

  loadMaids(): void {
    this.isLoading = true;
    
    // Use the enhanced maid service
    this.maidService.getMaids().subscribe({
      next: (maids: any) => {
        this.maids = maids;
        this.filteredMaids = maids;
        this.totalItems = maids.length;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading maids:', error);
        this.isLoading = false;
        this.toastr.error('Failed to load maids', 'Error');
      }
    });
  }

  private debounceSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.searchMaids();
    }, 300); // 300ms debounce
  }

  // Enhanced search with better filtering
  searchMaids(): void {
    const filters = this.searchForm.value;
    this.filteredMaids = this.maids.filter(maid => {
      // Nationality filter
      if (filters.nationality && maid.nationality !== filters.nationality) {
        return false;
      }
      
      // Skills filter
      if (filters.skills && !maid.skills.includes(filters.skills)) {
        return false;
      }
      
      // Experience filter
      if (filters.minExperience && maid.experience < parseInt(filters.minExperience)) {
        return false;
      }
      
      // Rate filter
      if (filters.maxHourlyRate && maid.hourlyRate > parseInt(filters.maxHourlyRate)) {
        return false;
      }
      
      // Location filter
      if (filters.location && !maid.location.city.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      // Availability filter
      if (filters.availability && maid.availability !== filters.availability) {
        return false;
      }
      
      // Language filter
      if (filters.languages && !maid.languages.includes(filters.languages)) {
        return false;
      }
      
      // Verification filter
      if (filters.isVerified && !maid.isVerified) {
        return false;
      }
      
      // Rating filter
      if (filters.minRating && maid.rating < parseFloat(filters.minRating)) {
        return false;
      }
      
      return true;
    });
    
    this.totalItems = this.filteredMaids.length;
    this.currentPage = 1;
    this.isLoading = false;
  }

  clearFilters(): void {
    this.searchForm.reset();
    this.filteredMaids = this.maids;
    this.totalItems = this.maids.length;
    this.currentPage = 1;
  }

  get paginatedMaids(): Maid[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredMaids.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  toggleFavorite(maidId: number): void {
    this.favoritesService.toggleFavorite(maidId).subscribe({
      next: (isFavorite) => {
        if (isFavorite) {
          this.toastr.success('Added to favorites!', 'Success');
        } else {
          this.toastr.info('Removed from favorites', 'Info');
        }
      },
      error: () => {
        this.toastr.error('Failed to update favorites', 'Error');
      }
    });
  }

  isFavorite(maidId: number): boolean {
    return this.favorites.includes(maidId);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    
    // Show up to 5 page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}