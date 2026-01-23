import { Component } from '@angular/core';

interface Service {
  name: string;
  description: string;
  icon: string;
  features: string[];
  priceRange: string;
  duration: string;
  category: string;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  selectedCategory = 'all';
  categories = ['all', 'cleaning', 'cooking', 'childcare', 'elderly-care', 'pet-care', 'laundry', 'gardening'];

  services: Service[] = [
    {
      name: 'House Cleaning',
      description: 'Comprehensive cleaning services for your entire home',
      icon: 'fa-broom',
      category: 'cleaning',
      features: [
        'Deep cleaning of all rooms',
        'Kitchen and bathroom sanitization',
        'Dusting and vacuuming',
        'Window cleaning',
        'Floor mopping and polishing'
      ],
      priceRange: 'AED 50-150',
      duration: '2-4 hours'
    },
    {
      name: 'Cooking Services',
      description: 'Delicious home-cooked meals prepared fresh daily',
      icon: 'fa-utensils',
      category: 'cooking',
      features: [
        'Meal planning and preparation',
        'Grocery shopping assistance',
        'Special dietary requirements',
        'Traditional and international cuisine',
        'Meal storage and organization'
      ],
      priceRange: 'AED 80-200',
      duration: '3-5 hours'
    },
    {
      name: 'Child Care',
      description: 'Professional and caring childcare services',
      icon: 'fa-baby',
      category: 'childcare',
      features: [
        'Supervision and safety',
        'Educational activities',
        'Meal preparation for children',
        'Homework assistance',
        'Outdoor activities and playtime'
      ],
      priceRange: 'AED 100-250',
      duration: '4-8 hours'
    },
    {
      name: 'Elderly Care',
      description: 'Compassionate care for elderly family members',
      icon: 'fa-user-md',
      category: 'elderly-care',
      features: [
        'Personal care assistance',
        'Medication reminders',
        'Meal preparation',
        'Companionship and conversation',
        'Light exercise and mobility support'
      ],
      priceRange: 'AED 120-300',
      duration: '6-12 hours'
    },
    {
      name: 'Pet Care',
      description: 'Dedicated care for your furry family members',
      icon: 'fa-paw',
      category: 'pet-care',
      features: [
        'Feeding and walking',
        'Grooming and bathing',
        'Playtime and exercise',
        'Litter box maintenance',
        'Veterinary appointment assistance'
      ],
      priceRange: 'AED 60-150',
      duration: '2-4 hours'
    },
    {
      name: 'Laundry Services',
      description: 'Complete laundry and ironing services',
      icon: 'fa-tshirt',
      category: 'laundry',
      features: [
        'Washing and drying',
        'Ironing and folding',
        'Dry cleaning coordination',
        'Clothing organization',
        'Stain removal'
      ],
      priceRange: 'AED 40-100',
      duration: '2-3 hours'
    },
    {
      name: 'Gardening Services',
      description: 'Maintain beautiful outdoor spaces',
      icon: 'fa-seedling',
      category: 'gardening',
      features: [
        'Lawn mowing and trimming',
        'Plant watering and care',
        'Weed removal',
        'Pruning and landscaping',
        'Garden cleanup'
      ],
      priceRange: 'AED 70-150',
      duration: '2-4 hours'
    },
    {
      name: 'Full-Time Domestic Help',
      description: 'Comprehensive daily household management',
      icon: 'fa-home',
      category: 'all',
      features: [
        'All-inclusive household services',
        'Daily meal preparation',
        'Regular cleaning and maintenance',
        'Child or elderly care',
        'Shopping and errands'
      ],
      priceRange: 'AED 200-500',
      duration: '8-12 hours'
    }
  ];

  get filteredServices(): Service[] {
    if (this.selectedCategory === 'all') {
      return this.services;
    }
    return this.services.filter(service => service.category === this.selectedCategory);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }
}

