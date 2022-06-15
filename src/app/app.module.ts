import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { Routes, RouterModule } from "@angular/router";

import { Home } from './app.home';
import { VoertuigComponent } from './voertuigen/voertuig/voertuig.component';
import { VoertuigListComponent } from './voertuigen/voertuig-list/voertuig-list.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { VoertuigDetailDialogComponent } from './voertuigen/voertuig-detail-dialog/voertuig-detail-dialog.component';
import { NavigationComponent } from './navigation/navigation.component';
import { BestuurderComponent } from './bestuurders/bestuurder/bestuurder.component';
import { BestuurderListComponent } from './bestuurders/bestuurder-list/bestuurder-list.component';
import { BestuurderDetailDialogComponent } from './bestuurders/bestuurder-detail-dialog/bestuurder-detail-dialog.component';
import { TankkaartComponent } from './tankkaarten/tankkaart/tankkaart.component';
import { TankkaartListComponent } from './tankkaarten/tankkaart-list/tankkaart-list.component';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { TankkaartDetailDialogComponent } from './tankkaarten/tankkaart-detail-dialog/tankkaart-detail-dialog.component';
import { DeleteConfirmationSheetComponent } from './voertuigen/voertuig-delete-confirmation-sheet/voertuig-delete-confirmation-sheet.component';
import { TankkaartDeleteConfirmationSheetComponent } from './tankkaarten/tankkaart-delete-confirmation-sheet/tankkaart-delete-confirmation-sheet.component';

const appRoutes: Routes = [
  { path: '', component: BestuurderComponent },
  { path: 'voertuigen', component: VoertuigComponent },
  { path: 'tankkaarten', component: TankkaartComponent },
  { path: 'bestuurders', component: BestuurderComponent }
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
    BestuurderDetailDialogComponent,
    BestuurderListComponent,
    TankkaartComponent,
    TankkaartListComponent,
    TankkaartDetailDialogComponent,
    DeleteConfirmationSheetComponent,
    TankkaartDeleteConfirmationSheetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    RouterModule.forRoot(appRoutes),

  ],
  exports: [],
  providers: [
    { provide: "API_Url", useValue: "https://localhost:5001/api/" },
    { provide: "Adres_API_Url", useValue: "https://api.basisregisters.vlaanderen.be/v1" },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  bootstrap: [Home],
})
export class AppModule { }
