import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DataExchangeService } from '../../data-exchange.service';
import { DatastreamService } from '../../datastream.service';
import { VoertuigDetailDialogComponent } from '../voertuig-detail-dialog/voertuig-detail-dialog.component';

@Component({
  selector: 'app-delete-confirmation-sheet',
  templateUrl: './voertuig-delete-confirmation-sheet.component.html',
  styleUrls: ['./voertuig-delete-confirmation-sheet.component.css']
})
export class DeleteConfirmationSheetComponent implements OnInit {
  entity: any;
  entitytype: string;

  constructor(private datastream: DatastreamService, private dataService: DataExchangeService, private voertuigSheetRef: MatBottomSheetRef<VoertuigDetailDialogComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any )
  {
    this.entity = data.entity;
    this.entitytype = data.entitytype;
  }

  ngOnInit(): void {
  }

  onCancellation = () => {
    this.voertuigSheetRef.dismiss(false);
  }

  onConfirmationDelete = () => {
    this.datastream.DeleteVehicle(this.entity.chassisnummer).subscribe(null,
      (error) => {
        this.voertuigSheetRef.dismiss(error.message);
      },
      () => {
        this.dataService.sendData("voertuig", "delete", this.entity);
        this.voertuigSheetRef.dismiss(true);
        alert("Het voertuig is successvol verwijderd");
      }
    );
  }

}
