import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
  standalone: true,
})
export class NotFoundComponent {
  goBack() {
    window.history.back();
  }
}
