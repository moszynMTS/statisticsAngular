import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private titleService: Title
  ) {
    this.translate.setDefaultLang('pl');
    this.translate.use(environment.lang);
  }

  ngOnInit(): void {
    this.setTitle();
    this.translate.onLangChange.subscribe(() => {
      this.setTitle();
    });
  }

  private setTitle(): void {
    const translatedTitle = this.translate.instant('App.Name');
    this.titleService.setTitle(translatedTitle);
  }
}
