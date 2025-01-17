import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-footer',
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  standalone: true,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
