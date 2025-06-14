import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkupdationComponent } from './markupdation.component';

describe('MarkupdationComponent', () => {
  let component: MarkupdationComponent;
  let fixture: ComponentFixture<MarkupdationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkupdationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkupdationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
