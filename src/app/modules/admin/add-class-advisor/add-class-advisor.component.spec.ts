import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClassAdvisorComponent } from './add-class-advisor.component';

describe('AddClassAdvisorComponent', () => {
  let component: AddClassAdvisorComponent;
  let fixture: ComponentFixture<AddClassAdvisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddClassAdvisorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddClassAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
