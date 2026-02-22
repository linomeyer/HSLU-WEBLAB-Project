import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TechnologyDetailComponent} from './technology-detail.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Technology} from '../technology';
import {expect, vi} from 'vitest';
import {AuthService} from '@auth0/auth0-angular';
import {BehaviorSubject, of} from 'rxjs';

describe('TechnologyDetailComponent', () => {
  let component: TechnologyDetailComponent;
  let fixture: ComponentFixture<TechnologyDetailComponent>;
  let mockData: { technology: Technology; color: string };
  let mockAuthService: any;
  let mockDialog: any;
  let mockDialogRef: any;
  let isAuthenticatedSubject: BehaviorSubject<boolean>;
  let getAccessTokenSilentlySpy: any;

  const setupComponent = async (
    data: { technology: Technology; color: string },
    isAdmin: boolean = false
  ) => {
    TestBed.resetTestingModule();

    isAuthenticatedSubject = new BehaviorSubject<boolean>(isAdmin);
    getAccessTokenSilentlySpy = vi.fn();

    if (isAdmin) {
      const adminToken = 'header.' + btoa(JSON.stringify({
        sub: 'admin123',
        'https://technology-radar.com/roles': ['admin']
      })) + '.signature';
      getAccessTokenSilentlySpy.mockReturnValue(of(adminToken));
    } else {
      const employeeToken = 'header.' + btoa(JSON.stringify({
        sub: 'employee123',
        'https://technology-radar.com/roles': ['employee']
      })) + '.signature';
      getAccessTokenSilentlySpy.mockReturnValue(of(employeeToken));
    }

    mockAuthService = {
      isAuthenticated$: isAuthenticatedSubject.asObservable(),
      getAccessTokenSilently: getAccessTokenSilentlySpy
    };

    mockDialogRef = {
      close: vi.fn()
    };

    mockDialog = {
      open: vi.fn().mockReturnValue({
        afterClosed: vi.fn().mockReturnValue(of(false))
      })
    };

    await TestBed.configureTestingModule({
      imports: [TechnologyDetailComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: data},
        {provide: AuthService, useValue: mockAuthService},
        {provide: MatDialog, useValue: mockDialog},
        {provide: MatDialogRef, useValue: mockDialogRef}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

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

    await setupComponent(mockData, false);
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

    it('should initialize isAdmin as false for non-admin user', () => {
      expect(component.isAdmin()).toBe(false);
    });

    it('should initialize isAdmin as true for admin user', async () => {
      await setupComponent(mockData, true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.isAdmin()).toBe(true);
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
      expect(categoryChip.style.backgroundColor).toBe('rgb(179, 88, 142)');
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

    it('should not render Edit button for non-admin users', () => {
      const editButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.includes('Edit'));

      expect(editButton).toBeFalsy();
    });

    it('should render Edit button for admin users', async () => {
      await setupComponent(mockData, true);
      fixture.detectChanges();

      const editButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.includes('Edit'));

      expect(editButton).toBeTruthy();
    });

    it('should render mat-dialog-actions', () => {
      const actions = fixture.nativeElement.querySelector('mat-dialog-actions');
      expect(actions).toBeTruthy();
    });
  });

  describe('onEdit method', () => {
    it('should close current dialog and open edit modal', async () => {
      await setupComponent(mockData, true);

      component.onEdit();

      expect(mockDialogRef.close).toHaveBeenCalled();
      expect(mockDialog.open).toHaveBeenCalledWith(
        expect.anything(),
        {
          data: mockData.technology,
          width: '600px',
          disableClose: false
        }
      );
    });

    it('should call onEdit when Edit button is clicked', async () => {
      await setupComponent(mockData, true);
      fixture.detectChanges();

      const spy = vi.spyOn(component, 'onEdit');

      const editButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.includes('Edit')) as HTMLElement;

      editButton.click();

      expect(spy).toHaveBeenCalled();
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
      expect(chips[0].style.backgroundColor).toBe('rgb(134, 183, 130)');
    });
  });
});
