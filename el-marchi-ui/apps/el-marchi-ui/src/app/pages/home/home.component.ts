import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class HomeComponent {
  email: string = '';

  categories = [
    {
      name: 'Smartphones',
      image: 'smartphone.jpg',
    },
    {
      name: 'Tablets',
      image: 'ipad.jpg',
    },
    {
      name: 'Accessories',
      image: 'accessories.jpg',
    },
  ];

  testimonials = [
    {
      text: 'Amazing products and even better customer service! Will definitely shop here again.',
      author: 'Amine Affi',
      rating: 5,
    },
    {
      text: 'The quality of their products is outstanding. Fast shipping too!',
      author: 'Raed Addala',
      rating: 5,
    },
    {
      text: 'Great experience from start to finish. Highly recommend!',
      author: 'Ala Achach',
      rating: 4,
    },
  ];
}
