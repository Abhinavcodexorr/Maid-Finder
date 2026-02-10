# MaidFinder - Angular Web Application

A modern web application for connecting families with trusted domestic helpers in the UAE, built with Angular 17.

## Features

- **User Authentication**: Secure login and registration system for both customers and maids
- **Separate Authentication Flows**: Distinct login/register pages for customers and maids
- **Maid Search & Filtering**: Advanced search with multiple filters
- **Profile Management**: User and maid profile management
- **Subscription System**: Premium access to contact maid profiles
- **Booking System**: Direct booking and communication
- **Responsive Design**: Mobile-first responsive design
- **Modern UI**: Clean and intuitive user interface with enhanced UX

## Technology Stack

- **Frontend**: Angular 17, TypeScript, SCSS
- **UI Framework**: Bootstrap 5, Font Awesome
- **State Management**: RxJS Observables
- **Forms**: Angular Reactive Forms
- **Routing**: Angular Router with lazy loading
- **Notifications**: ngx-toastr
- **Pagination**: ngx-pagination

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── login/          # Customer login
│   │   │   ├── maid-login/     # Maid login
│   │   │   ├── register/       # Customer registration
│   │   │   └── maid-register/  # Maid registration
│   │   ├── home/
│   │   ├── search/
│   │   ├── profile/
│   │   ├── subscriptions/
│   │   └── about/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── maid.service.ts
│   │   ├── subscription.service.ts
│   │   ├── booking.service.ts
│   │   └── notification.service.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── maid.model.ts
│   │   ├── subscription.model.ts
│   │   └── booking.model.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── app-routing.module.ts
│   ├── app.module.ts
│   └── app.component.*
├── assets/
│   └── images/
├── styles.scss
└── index.html
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abhinavcodexorr/Maid-Finder.git
   cd Maid-Finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Key Components

### Authentication
- **Customer Login** (`/login`): Customer authentication with email/password and Google Sign-In
- **Maid Login** (`/maid-login`): Maid authentication with email/password and Google Sign-In
- **Customer Register** (`/register`): New customer registration
- **Maid Register** (`/maid-register`): New maid registration with detailed profile information
- **Auth Guard**: Route protection for authenticated users

### Maid Management
- **Search Component**: Advanced maid search with filters
- **Maid Detail Component**: Detailed maid profile view
- **Profile Component**: User profile management

### Subscription System
- **Subscriptions Component**: Plan selection and purchase
- **Payment Integration**: Secure payment processing

## API Integration

The application is designed to work with a RESTful API. Update the API URLs in the service files:

```typescript
// Example: src/services/auth.service.ts
private readonly API_URL = 'https://themdbgroup.in:3001/api';
```

## Styling

The application uses:
- **Bootstrap 5**: For responsive grid and components
- **Custom SCSS**: For application-specific styling
- **Font Awesome**: For icons
- **Google Fonts**: Inter font family

## Environment Configuration

Environment files are configured for different environments:

```typescript
// src/environments/environment.ts (Development)
export const environment = {
  production: false,
  apiUrl: 'https://themdbgroup.in:3001/api',
  appName: 'MaidFinder',
  version: '1.0.0'
};

// src/environments/environment.prod.ts (Production)
export const environment = {
  production: true,
  apiUrl: 'https://themdbgroup.in:3001/api',
  appName: 'MaidFinder',
  version: '1.0.0'
};
```

## Deployment

### Build for Production
```bash
npm run build --prod
```

### Deploy to Vercel
The application is configured for Vercel deployment:

1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel will automatically deploy on every push

Configuration files:
- `vercel.json`: Vercel deployment configuration
- `.vercelignore`: Files to exclude from deployment

## Routes

### Customer Routes
- `/login` - Customer login page
- `/register` - Customer registration page

### Maid Routes
- `/maid-login` - Maid login page
- `/maid-register` - Maid registration page

### Other Routes
- `/home` - Home page
- `/search` - Search maids
- `/profile` - User profile (protected)
- `/subscriptions` - Subscription plans
- `/about` - About page
- `/contact` - Contact page

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: info@maidfinder.ae
- Phone: +971 4 123 4567

## Roadmap

- [x] Separate customer and maid authentication flows
- [x] Enhanced UI/UX with proper icons and routing
- [x] Google Sign-In integration
- [ ] Real-time chat functionality
- [ ] Mobile app development
- [ ] Advanced payment integration
- [ ] Multi-language support
- [ ] Video call integration
- [ ] Background check automation
