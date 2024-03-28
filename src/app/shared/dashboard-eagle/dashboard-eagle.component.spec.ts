import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEagleComponent } from './dashboard-eagle.component';

describe('DashboardEagleComponent', () => {
  let component: DashboardEagleComponent;
  let fixture: ComponentFixture<DashboardEagleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardEagleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardEagleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
