import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';

import { Home } from './app.home';
import { VoertuigComponent } from './voertuig/voertuig.component';
import { VoertuigListComponent } from './voertuig-list/voertuig-list.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { VoertuigDetailDialogComponent } from './voertuig-detail-dialog/voertuig-detail-dialog.component'

@NgModule({
  declarations: [
    Home,
    VoertuigComponent,
    VoertuigListComponent,
    SearchbarComponent,
    VoertuigDetailDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [],
  providers: [
    {provide: "API_Url", useValue: "https://localhost:5001/api/"}
  ],
  bootstrap: [Home],
})
export class AppModule { }
