import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  teamMembers = [
    {
      name: 'Sarah Johnson',
      position: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      bio: 'Passionate about connecting families with trusted domestic helpers.'
    },
    {
      name: 'Ahmed Al-Rashid',
      position: 'CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: 'Technology expert focused on building secure and user-friendly platforms.'
    },
    {
      name: 'Maria Santos',
      position: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      bio: 'Ensuring quality service and customer satisfaction across all operations.'
    }
  ];

  stats = [
    { number: '10,000+', label: 'Happy Families' },
    { number: '2,500+', label: 'Verified Maids' },
    { number: '50,000+', label: 'Successful Bookings' },
    { number: '4.8/5', label: 'Average Rating' }
  ];
}
