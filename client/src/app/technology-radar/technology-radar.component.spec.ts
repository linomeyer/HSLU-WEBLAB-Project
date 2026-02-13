import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyRadarComponent } from './technology-radar.component';

describe('TechnologyRadarComponent', () => {
  let component: TechnologyRadarComponent;
  let fixture: ComponentFixture<TechnologyRadarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyRadarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologyRadarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
