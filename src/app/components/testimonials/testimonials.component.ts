import { Component, OnInit } from '@angular/core';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  service: string;
  date: Date;
  image?: string;
  verified: boolean;
}

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {
  testimonials: Testimonial[] = [];
  filteredTestimonials: Testimonial[] = [];
  selectedFilter: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.loadTestimonials();
    this.applyFilter();
  }

  loadTestimonials(): void {
    this.testimonials = [
      {
        id: 1,
        name: 'Sarah Ahmed',
        location: 'Dubai Marina',
        rating: 5,
        comment: 'MaidFinder has been a lifesaver! Maria is absolutely wonderful with my children and keeps the house spotless. Highly recommended!',
        service: 'Childcare & House Cleaning',
        date: new Date('2024-01-15'),
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      {
        id: 2,
        name: 'Ahmed Hassan',
        location: 'Abu Dhabi',
        rating: 5,
        comment: 'Excellent service! Priya is an amazing cook and very professional. The whole family loves her cooking.',
        service: 'Cooking Services',
        date: new Date('2024-01-20'),
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      {
        id: 3,
        name: 'Fatima Al-Rashid',
        location: 'Sharjah',
        rating: 4,
        comment: 'Very reliable and trustworthy. Grace takes excellent care of my elderly mother. I can go to work with peace of mind.',
        service: 'Elderly Care',
        date: new Date('2024-01-18'),
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      {
        id: 4,
        name: 'Michael Johnson',
        location: 'Dubai Downtown',
        rating: 5,
        comment: 'Outstanding service! The team is professional, punctual, and the quality of work is exceptional. Worth every dirham.',
        service: 'House Cleaning',
        date: new Date('2024-01-22'),
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      {
        id: 5,
        name: 'Aisha Mohammed',
        location: 'Ajman',
        rating: 5,
        comment: 'Siti is amazing! She\'s been with us for 6 months and we couldn\'t be happier. Very clean, organized, and great with kids.',
        service: 'House Management',
        date: new Date('2024-01-25'),
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      {
        id: 6,
        name: 'David Wilson',
        location: 'Al Ain',
        rating: 4,
        comment: 'Great experience! The maid was very professional and did an excellent job cleaning our villa. Will definitely use again.',
        service: 'Deep Cleaning',
        date: new Date('2024-01-28'),
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      {
        id: 7,
        name: 'Noor Al-Zahra',
        location: 'Ras Al Khaimah',
        rating: 5,
        comment: 'Excellent service! The cooking is amazing and the house is always clean. Very happy with the service.',
        service: 'Cooking & Cleaning',
        date: new Date('2024-02-01'),
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      {
        id: 8,
        name: 'James Brown',
        location: 'Dubai JBR',
        rating: 5,
        comment: 'Fantastic service! The maid is very professional and the quality of work is outstanding. Highly recommended!',
        service: 'House Cleaning',
        date: new Date('2024-02-05'),
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      {
        id: 9,
        name: 'Layla Ibrahim',
        location: 'Fujairah',
        rating: 4,
        comment: 'Very satisfied with the service. The maid is reliable and does a great job. Will continue using MaidFinder.',
        service: 'Childcare',
        date: new Date('2024-02-08'),
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      {
        id: 10,
        name: 'Robert Taylor',
        location: 'Umm Al Quwain',
        rating: 5,
        comment: 'Outstanding! The service exceeded our expectations. Professional, reliable, and excellent quality work.',
        service: 'Garden Maintenance',
        date: new Date('2024-02-10'),
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      {
        id: 11,
        name: 'Mariam Al-Sabah',
        location: 'Dubai Hills',
        rating: 5,
        comment: 'Amazing service! The maid is very professional and the house looks perfect. Very happy with MaidFinder.',
        service: 'House Cleaning',
        date: new Date('2024-02-12'),
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      {
        id: 12,
        name: 'Omar Khalil',
        location: 'Abu Dhabi Corniche',
        rating: 4,
        comment: 'Great experience! The service is professional and the maid is very reliable. Will definitely recommend to friends.',
        service: 'Pet Care',
        date: new Date('2024-02-15'),
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        verified: true
      }
    ];
  }

  applyFilter(): void {
    if (this.selectedFilter === 'all') {
      this.filteredTestimonials = [...this.testimonials];
    } else {
      this.filteredTestimonials = this.testimonials.filter(t => 
        t.service.toLowerCase().includes(this.selectedFilter.toLowerCase())
      );
    }
    this.totalPages = Math.ceil(this.filteredTestimonials.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  get paginatedTestimonials(): Testimonial[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredTestimonials.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = Math.min(5, this.totalPages);
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }
}

