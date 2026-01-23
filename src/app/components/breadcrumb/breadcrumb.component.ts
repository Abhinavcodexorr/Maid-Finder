import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

interface BreadcrumbItem {
  label: string;
  url: string;
  active: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: BreadcrumbItem[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute)
      )
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      });
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: BreadcrumbItem[] = []): BreadcrumbItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = this.getBreadcrumbLabel(child.snapshot.data, child.snapshot.url);
      if (label) {
        breadcrumbs.push({
          label,
          url,
          active: child.snapshot.children.length === 0
        });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private getBreadcrumbLabel(data: any, url: any[]): string {
    if (data['breadcrumb']) {
      return data['breadcrumb'];
    }

    const path = url[url.length - 1]?.path;
    if (!path) return '';

    // Convert path to readable label
    const labelMap: { [key: string]: string } = {
      'home': 'Home',
      'search': 'Find Maids',
      'services': 'Our Services',
      'testimonials': 'Customer Reviews',
      'blog': 'Blog',
      'about': 'About Us',
      'contact': 'Contact',
      'login': 'Login',
      'register': 'Register',
      'profile': 'Profile',
      'favorites': 'Favorites',
      'subscriptions': 'Subscriptions',
      'pricing': 'Pricing',
      'how-it-works': 'How It Works',
      'faqs': 'FAQs',
      'reviews': 'Reviews'
    };

    return labelMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
  }
}

