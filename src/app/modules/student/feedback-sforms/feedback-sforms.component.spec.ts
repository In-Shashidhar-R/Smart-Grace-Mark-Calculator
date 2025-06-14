import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackSformsComponent } from './feedback-sforms.component';

describe('FeedbackSformsComponent', () => {
  let component: FeedbackSformsComponent;
  let fixture: ComponentFixture<FeedbackSformsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackSformsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackSformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
