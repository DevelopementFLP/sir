import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionPreciosKosherComponent } from './configuracion-precios-kosher.component';

describe('ConfiguracionPreciosKosherComponent', () => {
  let component: ConfiguracionPreciosKosherComponent;
  let fixture: ComponentFixture<ConfiguracionPreciosKosherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguracionPreciosKosherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracionPreciosKosherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
