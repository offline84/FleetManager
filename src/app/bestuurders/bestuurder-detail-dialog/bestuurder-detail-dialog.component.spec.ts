import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BestuurderDetailDialogComponent } from './bestuurder-detail-dialog.component';

describe('BestuurderDetailDialogComponent', () => {
  let component: BestuurderDetailDialogComponent;
  let fixture: ComponentFixture<BestuurderDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestuurderDetailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BestuurderDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
