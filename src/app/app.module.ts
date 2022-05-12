import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { Home } from './app.home';
import { DataSetComponent } from './data-set/data-set.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { VoertuigComponent } from './voertuig/voertuig.component';
import { VoertuigListComponent } from './voertuig-list/voertuig-list.component'

@NgModule({
  declarations: [
    Home,
    DataSetComponent,
    VoertuigComponent,
    VoertuigListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  exports: [],
  providers: [],
  bootstrap: [Home],
})
export class AppModule { }
