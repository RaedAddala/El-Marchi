import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FaConfig,
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './shared/font-awesome-icons';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ToastService } from '@shared/toast/toast.service';
import { NgClass } from '@angular/common';

@Component({
  imports: [
    RouterModule,
    FontAwesomeModule,
    NavbarComponent,
    FooterComponent,
    NgClass,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'el-marchi-ui';
  toastService = inject(ToastService);

  private readonly faIconLibrary = inject(FaIconLibrary);
  private readonly faConfig = inject(FaConfig);

  ngOnInit(): void {
    this.initFontAwesome();

    setTimeout(() => {
      this.toastService.show('Welcome to El-Marchi', 'SUCCESS');
    }, 3000);
  }

  initFontAwesome() {
    this.faConfig.defaultPrefix = 'far';
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }
}
