import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import {Routes, RouterModule} from "@angular/router";

import { Home } from './app.home';
import { VoertuigComponent } from './voertuigen/voertuig/voertuig.component';
import { VoertuigListComponent } from './voertuigen/voertuig-list/voertuig-list.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { VoertuigDetailDialogComponent } from './voertuigen/voertuig-detail-dialog/voertuig-detail-dialog.component';
import { NavigationComponent } from './navigation/navigation.component';
import { BestuurderComponent } from './bestuurders/bestuurder/bestuurder.component';
import { TankkaartComponent } from './tankkaarten/tankkaart/tankkaart.component';
import { HomeComponent } from './home/home.component';
import { TankkaartListComponent } from './tankkaarten/tankkaart-list/tankkaart-list.component';
import { TankkaartDetailDialogComponent } from './tankkaarten/tankkaart-detail-dialog/tankkaart-detail-dialog.component'

const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'voertuigen', component: VoertuigComponent},
  { path: 'tankkaarten', component: TankkaartComponent},
  { path: 'bestuurders', component: BestuurderComponent}
]

@NgModule({
  declarations: [
    Home,
    VoertuigComponent,
    VoertuigListComponent,
    SearchbarComponent,
    VoertuigDetailDialogComponent,
    NavigationComponent,
    BestuurderComponent,
    TankkaartComponent,
    HomeComponent,
    TankkaartListComponent,
    TankkaartDetailDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [],
  providers: [
    {provide: "API_Url", useValue: "https://localhost:5001/api/"}
  ],
  bootstrap: [Home],
})
export class AppModule { }
