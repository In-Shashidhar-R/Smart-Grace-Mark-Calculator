import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubjectStudentsComponent } from './add-subject-students.component';

describe('AddSubjectStudentsComponent', () => {
  let component: AddSubjectStudentsComponent;
  let fixture: ComponentFixture<AddSubjectStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSubjectStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubjectStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
