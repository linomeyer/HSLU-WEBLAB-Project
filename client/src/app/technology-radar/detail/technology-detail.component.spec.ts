import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyDetailComponent } from './technology-detail.component';

describe('TechnologyDetailComponent', () => {
  let component: TechnologyDetailComponent;
  let fixture: ComponentFixture<TechnologyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologyDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
