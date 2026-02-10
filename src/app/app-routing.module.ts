import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { MaidRegisterComponent } from './components/auth/maid-register/maid-register.component';
import { MaidLoginComponent } from './components/auth/maid-login/maid-login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { AboutComponent } from './components/about/about.component';
import { MaidProfileComponent } from './components/maid-profile/maid-profile.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { ContactComponent } from './components/contact/contact.component';
import { ProfileDashboardComponent } from './components/profile-dashboard/profile-dashboard.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { ServicesComponent } from './components/services/services.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { BlogComponent } from './components/blog/blog.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'maid/:id', component: MaidProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'maid-login', component: MaidLoginComponent },
  { path: 'maid-register', component: MaidRegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/dashboard', component: ProfileDashboardComponent, canActivate: [AuthGuard] },
  { path: 'subscriptions', component: SubscriptionsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'faqs', component: FaqsComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'blog', component: BlogComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
