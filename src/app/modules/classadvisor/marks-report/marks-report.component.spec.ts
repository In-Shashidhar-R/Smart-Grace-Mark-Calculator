import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksReportComponent } from './marks-report.component';

describe('MarksReportComponent', () => {
  let component: MarksReportComponent;
  let fixture: ComponentFixture<MarksReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarksReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarksReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
