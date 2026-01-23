import { Component, OnInit } from '@angular/core';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage: string;
  publishDate: Date;
  category: string;
  tags: string[];
  image: string;
  readTime: number;
  views: number;
  likes: number;
  featured: boolean;
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  blogPosts: BlogPost[] = [];
  filteredPosts: BlogPost[] = [];
  selectedCategory: string = 'all';
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;

  categories = [
    'all',
    'Housekeeping Tips',
    'Childcare Advice',
    'Cooking Tips',
    'Home Organization',
    'Safety & Security',
    'Lifestyle',
    'Industry News'
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadBlogPosts();
    this.applyFilters();
  }

  loadBlogPosts(): void {
    this.blogPosts = [
      {
        id: 1,
        title: '10 Essential Housekeeping Tips for a Spotless Home',
        excerpt: 'Discover professional housekeeping secrets that will keep your home clean and organized all year round.',
        content: 'Full article content here...',
        author: 'Sarah Johnson',
        authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
        publishDate: new Date('2024-02-15'),
        category: 'Housekeeping Tips',
        tags: ['cleaning', 'organization', 'tips'],
        image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=600&h=400&fit=crop',
        readTime: 5,
        views: 1250,
        likes: 89,
        featured: true
      },
      {
        id: 2,
        title: 'How to Choose the Right Nanny for Your Family',
        excerpt: 'A comprehensive guide to finding the perfect childcare provider for your children.',
        content: 'Full article content here...',
        author: 'Dr. Maria Santos',
        authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
        publishDate: new Date('2024-02-12'),
        category: 'Childcare Advice',
        tags: ['childcare', 'nanny', 'family'],
        image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=400&fit=crop',
        readTime: 8,
        views: 980,
        likes: 67,
        featured: true
      },
      {
        id: 3,
        title: 'Healthy Meal Planning for Busy Families',
        excerpt: 'Learn how to plan nutritious meals that save time and keep your family healthy.',
        content: 'Full article content here...',
        author: 'Chef Ahmed Hassan',
        authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
        publishDate: new Date('2024-02-10'),
        category: 'Cooking Tips',
        tags: ['cooking', 'meal planning', 'nutrition'],
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
        readTime: 6,
        views: 750,
        likes: 45,
        featured: false
      },
      {
        id: 4,
        title: 'Home Organization: Creating Functional Spaces',
        excerpt: 'Transform your home into an organized, functional space that works for your family.',
        content: 'Full article content here...',
        author: 'Lisa Chen',
        authorImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face',
        publishDate: new Date('2024-02-08'),
        category: 'Home Organization',
        tags: ['organization', 'home', 'storage'],
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
        readTime: 7,
        views: 650,
        likes: 38,
        featured: false
      },
      {
        id: 5,
        title: 'Safety First: Childproofing Your Home',
        excerpt: 'Essential safety measures to protect your children and create a secure home environment.',
        content: 'Full article content here...',
        author: 'Safety Expert John Wilson',
        authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
        publishDate: new Date('2024-02-05'),
        category: 'Safety & Security',
        tags: ['safety', 'childproofing', 'security'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
        readTime: 9,
        views: 890,
        likes: 52,
        featured: true
      },
      {
        id: 6,
        title: 'The Future of Domestic Services in the UAE',
        excerpt: 'Exploring trends and innovations in the domestic services industry.',
        content: 'Full article content here...',
        author: 'Industry Analyst Fatima Al-Rashid',
        authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face',
        publishDate: new Date('2024-02-03'),
        category: 'Industry News',
        tags: ['industry', 'trends', 'UAE'],
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
        readTime: 10,
        views: 1200,
        likes: 78,
        featured: false
      },
      {
        id: 7,
        title: 'Creating a Work-Life Balance with Domestic Help',
        excerpt: 'How professional domestic services can help you achieve better work-life balance.',
        content: 'Full article content here...',
        author: 'Life Coach Emma Thompson',
        authorImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop&crop=face',
        publishDate: new Date('2024-02-01'),
        category: 'Lifestyle',
        tags: ['lifestyle', 'work-life balance', 'productivity'],
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop',
        readTime: 6,
        views: 720,
        likes: 41,
        featured: false
      },
      {
        id: 8,
        title: 'Elderly Care: Providing Comfort and Dignity',
        excerpt: 'Best practices for caring for elderly family members with compassion and respect.',
        content: 'Full article content here...',
        author: 'Dr. Aisha Mohammed',
        authorImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop&crop=face',
        publishDate: new Date('2024-01-28'),
        category: 'Childcare Advice',
        tags: ['elderly care', 'healthcare', 'compassion'],
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
        readTime: 8,
        views: 950,
        likes: 63,
        featured: true
      }
    ];
  }

  applyFilters(): void {
    let filtered = [...this.blogPosts];

    // Category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === this.selectedCategory);
    }

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    this.filteredPosts = filtered;
    this.totalPages = Math.ceil(this.filteredPosts.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  get paginatedPosts(): BlogPost[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredPosts.slice(startIndex, endIndex);
  }

  get featuredPosts(): BlogPost[] {
    return this.blogPosts.filter(post => post.featured).slice(0, 3);
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

  onSearch(): void {
    this.applyFilters();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }
}

