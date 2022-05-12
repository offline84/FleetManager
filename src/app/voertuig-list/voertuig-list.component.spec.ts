import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoertuigListComponent } from './voertuig-list.component';

describe('VoertuigListComponent', () => {
  let component: VoertuigListComponent;
  let fixture: ComponentFixture<VoertuigListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoertuigListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoertuigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
