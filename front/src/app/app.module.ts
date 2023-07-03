import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';

import { AppRoutingModule  } from './app-routing.module';
import { AdminComponent } from './admin/admin.component';
// import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LoginComponent,
    AdminComponent,
    // HeaderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
