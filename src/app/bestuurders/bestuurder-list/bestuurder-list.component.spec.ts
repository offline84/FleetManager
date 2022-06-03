import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestuurderListComponent } from './bestuurder-list.component';

describe('BestuurderListComponent', () => {
  let component: BestuurderListComponent;
  let fixture: ComponentFixture<BestuurderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestuurderListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BestuurderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
