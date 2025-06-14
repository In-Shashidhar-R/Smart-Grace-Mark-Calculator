import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqasPageForFacultyComponent } from './fqas-page-for-faculty.component';

describe('FqasPageForFacultyComponent', () => {
  let component: FqasPageForFacultyComponent;
  let fixture: ComponentFixture<FqasPageForFacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqasPageForFacultyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqasPageForFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
