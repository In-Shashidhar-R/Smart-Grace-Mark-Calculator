import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqasPageForStudentsComponent } from './fqas-page-for-students.component';

describe('FqasPageForStudentsComponent', () => {
  let component: FqasPageForStudentsComponent;
  let fixture: ComponentFixture<FqasPageForStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqasPageForStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqasPageForStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
