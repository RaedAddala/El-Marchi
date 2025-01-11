import { Component, inject, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaConfig, FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from '../shared/font-awesome-icons';

@Component({
  imports: [RouterModule,FontAwesomeModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent implements OnInit{
  title = 'el-marchi-ui';

  private readonly faIconLibrary = inject(FaIconLibrary);
  private readonly faConfig = inject(FaConfig);

  ngOnInit(): void {
    this.initFontAwesome();
  }
  initFontAwesome() {
    this.faConfig.defaultPrefix = 'far';
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }

}
