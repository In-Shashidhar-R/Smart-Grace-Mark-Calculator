import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassAdvisorDashboardComponent } from './class-advisor-dashboard.component';

describe('ClassAdvisorDashboardComponent', () => {
  let component: ClassAdvisorDashboardComponent;
  let fixture: ComponentFixture<ClassAdvisorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassAdvisorDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassAdvisorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
