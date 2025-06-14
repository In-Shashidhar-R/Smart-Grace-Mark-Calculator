import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraceMarkApprovalComponent } from './grace-mark-approval.component';

describe('GraceMarkApprovalComponent', () => {
  let component: GraceMarkApprovalComponent;
  let fixture: ComponentFixture<GraceMarkApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraceMarkApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraceMarkApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
