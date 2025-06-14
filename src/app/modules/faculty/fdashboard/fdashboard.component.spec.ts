import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdashboardComponent } from './fdashboard.component';

describe('FdashboardComponent', () => {
  let component: FdashboardComponent;
  let fixture: ComponentFixture<FdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
