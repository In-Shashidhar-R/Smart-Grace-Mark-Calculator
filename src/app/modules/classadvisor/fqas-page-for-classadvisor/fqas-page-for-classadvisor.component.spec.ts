import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqasPageForClassadvisorComponent } from './fqas-page-for-classadvisor.component';

describe('FqasPageForClassadvisorComponent', () => {
  let component: FqasPageForClassadvisorComponent;
  let fixture: ComponentFixture<FqasPageForClassadvisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqasPageForClassadvisorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqasPageForClassadvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
