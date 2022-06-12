import { ComponentFixture, TestBed } from '@angular/core/testing';

import {TankkaartDetailDialogComponent} from "./tankkaart-detail-dialog.component";

describe('TankkaartDetailDialogComponent', () => {
  let component: TankkaartDetailDialogComponent;
  let fixture: ComponentFixture<TankkaartDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TankkaartDetailDialogComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TankkaartDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
