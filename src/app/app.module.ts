import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http'; // Make sure to import HttpClientModule
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TokenInterceptor } from './shared/tokenInterceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { ApiCaller } from './shared/apiCaller';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    HttpClientModule,
    MatDialogModule
  ],
  providers: [
    ApiCaller,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
