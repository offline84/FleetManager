import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DataExchangeService } from '../../data-exchange.service';
import { DatastreamService } from '../../datastream.service';
import {TankkaartDetailDialogComponent} from "../tankkaart-detail-dialog/tankkaart-detail-dialog.component";

@Component({
  selector: 'app-tankkaart-delete-confirmation-sheet',
  templateUrl: './tankkaart-delete-confirmation-sheet.component.html',
  styleUrls: ['./tankkaart-delete-confirmation-sheet.component.css']
})
export class TankkaartDeleteConfirmationSheetComponent implements OnInit {
  entity: any;
  entitytype: string;

  constructor(private datastream: DatastreamService, private dataService: DataExchangeService, private tankkaartSheetRef: MatBottomSheetRef<TankkaartDetailDialogComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any )
  {
    this.entity = data.entity;
    this.entitytype = data.entitytype;
  }

  ngOnInit(): void {
  }

  onCancellation = () => {
    this.tankkaartSheetRef.dismiss(false);
  }

  onConfirmationDelete = () => {
    this.datastream.DeleteFuelCard(this.entity.kaartnummer).subscribe(null,
      (error) => {
        this.tankkaartSheetRef.dismiss(error.message);
      },
      () => {
        this.dataService.sendData("tankkaart", "delete", this.entity);
        this.tankkaartSheetRef.dismiss(true);
        alert("De tankkaart is successvol verwijderd");
      }
    );
  }

}
