import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoertuigDetailDialogComponent } from './voertuig-detail-dialog.component';

describe('VoertuigDetailDialogComponent', () => {
  let component: VoertuigDetailDialogComponent;
  let fixture: ComponentFixture<VoertuigDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoertuigDetailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoertuigDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
