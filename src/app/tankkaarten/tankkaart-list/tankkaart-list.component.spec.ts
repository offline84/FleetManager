import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TankkaartListComponent } from './tankkaart-list.component';

describe('TankkaartListComponent', () => {
  let component: TankkaartListComponent;
  let fixture: ComponentFixture<TankkaartListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TankkaartListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TankkaartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
