import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyEditModalComponent } from './technology-edit-modal.component';

describe('TechnologyEditModalComponent', () => {
  let component: TechnologyEditModalComponent;
  let fixture: ComponentFixture<TechnologyEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologyEditModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
