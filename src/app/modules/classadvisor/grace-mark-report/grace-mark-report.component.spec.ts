import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraceMarkReportComponent } from './grace-mark-report.component';

describe('GraceMarkReportComponent', () => {
  let component: GraceMarkReportComponent;
  let fixture: ComponentFixture<GraceMarkReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraceMarkReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraceMarkReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
