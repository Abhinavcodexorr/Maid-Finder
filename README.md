# MaidFinder - Angular Web Application

A modern web application for connecting families with trusted domestic helpers in the UAE, built with Angular 17.

## Features

- **User Authentication**: Secure login and registration system
- **Maid Search & Filtering**: Advanced search with multiple filters
- **Profile Management**: User and maid profile management
- **Subscription System**: Premium access to contact maid profiles
- **Booking System**: Direct booking and communication
- **Responsive Design**: Mobile-first responsive design
- **Modern UI**: Clean and intuitive user interface

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
│   │   │   ├── login/
│   │   │   └── register/
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
   git clone <repository-url>
   cd maidfinder-clone
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
- **Login Component**: User authentication with email/password
- **Register Component**: New user registration with role selection
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
private readonly API_URL = 'http://localhost:3000/api';
```

## Styling

The application uses:
- **Bootstrap 5**: For responsive grid and components
- **Custom SCSS**: For application-specific styling
- **Font Awesome**: For icons
- **Google Fonts**: Inter font family

## Environment Configuration

Create environment files for different configurations:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## Deployment

### Build for Production
```bash
npm run build --prod
```

### Deploy to Static Hosting
The built application can be deployed to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist/` folder
- **GitHub Pages**: Use Angular CLI deployment
- **AWS S3**: Upload the `dist/` folder contents

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

- [ ] Real-time chat functionality
- [ ] Mobile app development
- [ ] Advanced payment integration
- [ ] Multi-language support
- [ ] Video call integration
- [ ] Background check automation
