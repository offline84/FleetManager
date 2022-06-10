import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TankkaartDeleteConfirmationSheetComponent } from './tankkaart-delete-confirmation-sheet.component';

describe('TankkaartDeleteConfirmationSheetComponent', () => {
  let component: TankkaartDeleteConfirmationSheetComponent;
  let fixture: ComponentFixture<TankkaartDeleteConfirmationSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TankkaartDeleteConfirmationSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TankkaartDeleteConfirmationSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
