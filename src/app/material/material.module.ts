import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatGridListModule,
    MatFormFieldModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatTableModule
  ],

  exports: [
    MatButtonModule,
    MatGridListModule,
    MatFormFieldModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatTableModule
  ]
})

export class MaterialModule { }
