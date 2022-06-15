import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmationSheetComponent } from './bestuurder-delete-confirmation-sheet.component';

describe('DeleteConfirmationSheetComponent', () => {
  let component: DeleteConfirmationSheetComponent;
  let fixture: ComponentFixture<DeleteConfirmationSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteConfirmationSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConfirmationSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
