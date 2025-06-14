import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackCformsComponent } from './feedback-cforms.component';

describe('FeedbackCformsComponent', () => {
  let component: FeedbackCformsComponent;
  let fixture: ComponentFixture<FeedbackCformsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackCformsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackCformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
