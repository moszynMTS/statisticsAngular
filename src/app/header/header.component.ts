import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  titles:any =  ["Statistics system based on datasheet", "Analiza danych samochodów używanych z elementami statystyki oraz wizualizacji danych"]
  production: boolean = environment.production;
  constructor() {
  }
}
