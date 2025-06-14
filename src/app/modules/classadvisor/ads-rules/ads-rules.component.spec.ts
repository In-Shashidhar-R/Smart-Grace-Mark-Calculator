import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsRulesComponent } from './ads-rules.component';

describe('AdsRulesComponent', () => {
  let component: AdsRulesComponent;
  let fixture: ComponentFixture<AdsRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdsRulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdsRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
