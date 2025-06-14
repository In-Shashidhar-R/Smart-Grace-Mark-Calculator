import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassadvisorProfileComponent } from './classadvisor-profile.component';

describe('ClassadvisorProfileComponent', () => {
  let component: ClassadvisorProfileComponent;
  let fixture: ComponentFixture<ClassadvisorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassadvisorProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassadvisorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
