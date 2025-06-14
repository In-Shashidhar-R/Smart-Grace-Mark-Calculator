import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubjectToFacultyComponent } from './add-subject-to-faculty.component';

describe('AddSubjectToFacultyComponent', () => {
  let component: AddSubjectToFacultyComponent;
  let fixture: ComponentFixture<AddSubjectToFacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSubjectToFacultyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubjectToFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
