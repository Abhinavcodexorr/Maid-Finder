import { Component } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {
  reviews = [
    { name: 'Ayesha', rating: 5, text: 'Found a wonderful nanny within a week.' },
    { name: 'Omar', rating: 4, text: 'Great selection and easy to use platform.' },
    { name: 'Lina', rating: 5, text: 'Customer service was very helpful throughout.' }
  ];
}
















