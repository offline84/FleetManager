import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestuurderDeleteConfirmationSheetComponent } from './bestuurder-delete-confirmation-sheet.component';

describe('DeleteConfirmationSheetComponent', () => {
  let component: BestuurderDeleteConfirmationSheetComponent;
  let fixture: ComponentFixture<BestuurderDeleteConfirmationSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestuurderDeleteConfirmationSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BestuurderDeleteConfirmationSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
