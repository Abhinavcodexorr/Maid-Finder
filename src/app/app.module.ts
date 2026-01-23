import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
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
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    SubscriptionsComponent,
    AboutComponent,
    MaidProfileComponent,
    FaqsComponent,
    ReviewsComponent,
    ContactComponent,
    ProfileDashboardComponent,
    FavoritesComponent,
    HowItWorksComponent,
    PricingComponent,
    ServicesComponent,
    TestimonialsComponent,
    BlogComponent,
    BreadcrumbComponent,
    BackToTopComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true
    }),
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
