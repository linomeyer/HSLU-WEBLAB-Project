import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TechnologyDetailComponent} from './technology-detail.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Technology} from '../technology';
import {expect} from 'vitest';

describe('TechnologyDetailComponent', () => {
  let component: TechnologyDetailComponent;
  let fixture: ComponentFixture<TechnologyDetailComponent>;
  let mockData: { technology: Technology; color: string };

  const setupComponent = async (data: { technology: Technology; color: string }) => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TechnologyDetailComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: data}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    return {fixture, component};
  };

  beforeEach(async () => {
    mockData = {
      technology: {
        _id: '1',
        name: 'React',
        category: 'Languages & Frameworks',
        ring: 'Adopt',
        description: 'A JavaScript library for building user interfaces',
        reason: 'Widely adopted and maintained',
        isPublished: true,
        createdAt: new Date('2024-01-01'),
        changedAt: new Date('2024-01-15')
      },
      color: '#b3588e'
    };

    await TestBed.configureTestingModule({
      imports: [TechnologyDetailComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: mockData}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with injected technology data', () => {
      expect(component.data).toEqual(mockData);
      expect(component.data.technology).toEqual(mockData.technology);
      expect(component.data.color).toBe('#b3588e');
    });

    it('should have access to technology properties', () => {
      expect(component.data.technology.name).toBe('React');
      expect(component.data.technology.category).toBe('Languages & Frameworks');
      expect(component.data.technology.ring).toBe('Adopt');
      expect(component.data.technology.description).toBe('A JavaScript library for building user interfaces');
      expect(component.data.technology.reason).toBe('Widely adopted and maintained');
    });
  });

  describe('Template rendering', () => {
    it('should render dialog title with technology name', () => {
      const title = fixture.nativeElement.querySelector('h2[mat-dialog-title]');
      expect(title).toBeTruthy();
      expect(title.textContent).toBe('React');
      expect(title.classList.contains('detail-title')).toBe(true);
    });

    it('should render mat-chip-set', () => {
      const chipSet = fixture.nativeElement.querySelector('mat-chip-set');
      expect(chipSet).toBeTruthy();
    });

    it('should render category chip with correct background color', () => {
      const chips = fixture.nativeElement.querySelectorAll('mat-chip');
      const categoryChip = chips[0];

      expect(categoryChip).toBeTruthy();
      expect(categoryChip.textContent.trim()).toBe('Languages & Frameworks');
      expect(categoryChip.style.backgroundColor).toBe('rgb(179, 88, 142)'); // #b3588e in RGB
    });

    it('should render ring chip', () => {
      const chips = fixture.nativeElement.querySelectorAll('mat-chip');
      const ringChip = chips[1];

      expect(ringChip).toBeTruthy();
      expect(ringChip.textContent.trim()).toBe('Adopt');
    });

    it('should render description section', () => {
      const headings = fixture.nativeElement.querySelectorAll('h3');
      const descriptionHeading = Array.from(headings).find((h: any) =>
        h.textContent.trim() === 'Description'
      );

      expect(descriptionHeading).toBeTruthy();

      const paragraphs = fixture.nativeElement.querySelectorAll('p');
      const descriptionText = Array.from(paragraphs).find((p: any) =>
        p.textContent.includes('A JavaScript library for building user interfaces')
      );

      expect(descriptionText).toBeTruthy();
    });

    it('should render reason section', () => {
      const headings = fixture.nativeElement.querySelectorAll('h3');
      const reasonHeading = Array.from(headings).find((h: any) =>
        h.textContent.trim() === 'Reason'
      );

      expect(reasonHeading).toBeTruthy();

      const paragraphs = fixture.nativeElement.querySelectorAll('p');
      const reasonText = Array.from(paragraphs).find((p: any) =>
        p.textContent.includes('Widely adopted and maintained')
      );

      expect(reasonText).toBeTruthy();
    });

    it('should render created date', () => {
      const dates = fixture.nativeElement.querySelectorAll('.date');
      const createdDate = Array.from(dates).find((el: any) =>
        el.textContent.includes('Added on')
      ) as HTMLElement;

      expect(createdDate).toBeTruthy();
      expect(createdDate.textContent).toContain('Jan 1, 2024');
    });

    it('should render changed date if present', () => {
      const dates = fixture.nativeElement.querySelectorAll('.date');
      const changedDate = Array.from(dates).find((el: any) =>
        el.textContent.includes('Last changed on')
      ) as HTMLElement;

      expect(changedDate).toBeTruthy();
      expect(changedDate.textContent).toContain('Jan 15, 2024');
    });

    it('should not render changed date if not present', async () => {
      const dataWithoutChange = {
        technology: {
          ...mockData.technology,
          changedAt: undefined
        },
        color: '#b3588e'
      };

      await setupComponent(dataWithoutChange);

      const dates = fixture.nativeElement.querySelectorAll('.date');
      const changedDate = Array.from(dates).find((el: any) =>
        el.textContent.includes('Last changed on')
      );

      expect(changedDate).toBeFalsy();
    });

    it('should render Close button', () => {
      const closeButton = fixture.nativeElement.querySelector('button[mat-dialog-close]');

      expect(closeButton).toBeTruthy();
      expect(closeButton.textContent.trim()).toBe('Close');
      expect(closeButton.classList.contains('close-button')).toBe(true);
    });

    it('should render mat-dialog-actions', () => {
      const actions = fixture.nativeElement.querySelector('mat-dialog-actions');
      expect(actions).toBeTruthy();
    });
  });

  describe('Different technology data', () => {
    it('should render different technology correctly', async () => {
      const differentData = {
        technology: {
          _id: '2',
          name: 'Docker',
          category: 'Tools',
          ring: 'Trial',
          description: 'Container platform',
          reason: 'Industry standard',
          isPublished: true,
          createdAt: new Date('2024-02-01')
        },
        color: '#86b782'
      };

      await setupComponent(differentData);

      const title = fixture.nativeElement.querySelector('h2[mat-dialog-title]');
      expect(title.textContent).toBe('Docker');

      const chips = fixture.nativeElement.querySelectorAll('mat-chip');
      expect(chips[0].textContent.trim()).toBe('Tools');
      expect(chips[1].textContent.trim()).toBe('Trial');
      expect(chips[0].style.backgroundColor).toBe('rgb(134, 183, 130)'); // #86b782 in RGB
    });

    it('should handle all ring types', async () => {
      const rings = ['Adopt', 'Trial', 'Assess', 'Hold'];

      for (const ring of rings) {
        const data = {
          technology: {
            ...mockData.technology,
            ring: ring
          },
          color: '#000000'
        };

        await setupComponent(data);

        fixture = TestBed.createComponent(TechnologyDetailComponent);
        fixture.detectChanges();

        const chips = fixture.nativeElement.querySelectorAll('mat-chip');
        expect(chips[1].textContent.trim()).toBe(ring);
      }
    });

    it('should handle all category types', async () => {
      const categories = [
        {name: 'Techniques', color: '#1ebccd'},
        {name: 'Tools', color: '#86b782'},
        {name: 'Platforms', color: '#c9a857'},
        {name: 'Languages & Frameworks', color: '#b3588e'}
      ];

      for (const category of categories) {
        const data = {
          technology: {
            ...mockData.technology,
            category: category.name
          },
          color: category.color
        };

        await setupComponent(data);

        fixture = TestBed.createComponent(TechnologyDetailComponent);
        fixture.detectChanges();

        const chips = fixture.nativeElement.querySelectorAll('mat-chip');
        expect(chips[0].textContent.trim()).toBe(category.name);
      }
    });
  });
});
