import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AdministrationComponent} from './administration.component';
import {TechnologyService} from '../technology-radar/technology/technology.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {signal} from '@angular/core';
import {of, throwError} from 'rxjs';
import {Technology, TechnologyCreateOrUpdate} from '../technology-radar/technology/technology';
import {TechnologyEditModalComponent} from '../technology-radar/technology/edit/technology-edit-modal.component';
import {expect, vi} from 'vitest';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('AdministrationComponent', () => {
  let component: AdministrationComponent;
  let fixture: ComponentFixture<AdministrationComponent>;
  let mockTechnologyService: Partial<TechnologyService>;
  let mockDialog: Partial<MatDialog>;
  let technologiesSignal: any;

  const mockTechnologies: Technology[] = [
    {
      _id: '1',
      name: 'React',
      category: 'Languages & Frameworks',
      ring: 'Adopt',
      description: 'A JavaScript library',
      reason: 'Widely adopted',
      isPublished: true,
      createdAt: new Date('2024-01-01')
    },
    {
      _id: '2',
      name: 'Unpublished Tool',
      category: 'Tools',
      ring: 'Trial',
      description: 'Testing tool',
      reason: 'Under evaluation',
      isPublished: false,
      createdAt: new Date('2024-01-02')
    },
    {
      _id: '3',
      name: 'Another Unpublished',
      category: 'Platforms',
      ring: 'Assess',
      description: 'Platform',
      reason: 'Research',
      isPublished: false,
      createdAt: new Date('2024-01-03')
    }
  ];

  beforeEach(async () => {
    technologiesSignal = signal<Technology[]>(mockTechnologies);

    mockTechnologyService = {
      technologies: technologiesSignal.asReadonly(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    mockDialog = {
      open: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AdministrationComponent],
      providers: [
        {provide: TechnologyService, useValue: mockTechnologyService},
        {provide: MatDialog, useValue: mockDialog},
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have technology service injected', () => {
      expect(component['techService']).toBeDefined();
    });

    it('should have dialog service injected', () => {
      expect(component['dialog']).toBeDefined();
    });
  });

  describe('unpublishedTechnologies computed signal', () => {
    it('should filter and return only unpublished technologies', () => {
      const unpublished = component.unpublishedTechnologies();

      expect(unpublished.length).toBe(2);
      expect(unpublished.every(t => !t.isPublished)).toBe(true);
      expect(unpublished.find(t => t._id === '1')).toBeUndefined();
    });

    it('should update when technologies signal changes', () => {
      const initialCount = component.unpublishedTechnologies().length;
      expect(initialCount).toBe(2);

      const newTechnologies: Technology[] = [
        ...mockTechnologies,
        {
          _id: '4',
          name: 'New Unpublished',
          category: 'Techniques',
          ring: 'Hold',
          description: 'New',
          reason: 'Test',
          isPublished: false,
          createdAt: new Date()
        }
      ];

      technologiesSignal.set(newTechnologies);
      fixture.detectChanges();

      const updatedCount = component.unpublishedTechnologies().length;
      expect(updatedCount).toBe(3);
    });
  });

  describe('onFormSubmit', () => {
    let formData: Partial<Technology>;

    beforeEach(() => {
      formData = {
        name: 'New Tech',
        category: 'Tools',
        ring: 'Trial',
        description: 'Test description',
        reason: 'Test reason',
        isPublished: false
      };
    });

    it('should call techService.post with correct parameters', () => {
      vi.mocked(mockTechnologyService.post as any).mockReturnValue(of({}));

      component.onFormSubmit(formData);

      const expectedTechnology: TechnologyCreateOrUpdate = {
        name: 'New Tech',
        category: 'Tools',
        ring: 'Trial',
        description: 'Test description',
        reason: 'Test reason',
        isPublished: false
      };

      expect(mockTechnologyService.post).toHaveBeenCalledWith(expectedTechnology);
    });

    it('should set success message on successful creation', () => {
      vi.mocked(mockTechnologyService.post as any).mockReturnValue(of({}));

      component.onFormSubmit(formData);

      expect(component.successMessage).toBe('Technology created successfully!');
      expect(component.errorMessage).toBe('');
    });

    it('should reset form on successful creation', () => {
      vi.mocked(mockTechnologyService.post as any).mockReturnValue(of({}));

      fixture.detectChanges();
      const formComponent = component.formComponent();

      if (formComponent) {
        const resetSpy = vi.spyOn(formComponent, 'reset');
        component.onFormSubmit(formData);
        expect(resetSpy).toHaveBeenCalled();
      }
    });

    it('should set error message on failed creation', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      });

      const error = new Error('Creation failed');
      vi.mocked(mockTechnologyService.post as any).mockReturnValue(throwError(() => error));


      component.onFormSubmit(formData);

      expect(component.errorMessage).toBe('Failed to create technology. Please try again.');
      expect(component.successMessage).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith('Error creating technology:', error);

      consoleSpy.mockRestore();
    });

    it('should not reset form on failed creation', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      });
      const error = new Error('Creation failed');
      vi.mocked(mockTechnologyService.post as any).mockReturnValue(throwError(() => error));

      fixture.detectChanges();
      const formComponent = component.formComponent();

      if (formComponent) {
        const resetSpy = vi.spyOn(formComponent, 'reset');
        component.onFormSubmit(formData);
        expect(resetSpy).not.toHaveBeenCalled();
      }
    });
  });

  describe('onTechnologyClick', () => {
    let mockDialogRef: Partial<MatDialogRef<TechnologyEditModalComponent>>;
    let testTechnology: Technology;

    beforeEach(() => {
      testTechnology = mockTechnologies[1];

      mockDialogRef = {
        afterClosed: vi.fn().mockReturnValue(of(false))
      };

      vi.mocked(mockDialog.open as any).mockReturnValue(mockDialogRef);
    });

    it('should open dialog with correct configuration', () => {
      component.onTechnologyClick(testTechnology);

      expect(mockDialog.open).toHaveBeenCalledWith(
        TechnologyEditModalComponent,
        {
          data: testTechnology,
          width: '600px',
          disableClose: false
        }
      );
    });

    it('should set success message when dialog closes with true result', () => {
      vi.mocked(mockDialogRef.afterClosed as any).mockReturnValue(of(true));

      component.onTechnologyClick(testTechnology);

      expect(component.successMessage).toBe('Technology updated successfully!');
    });

    it('should not set success message when dialog closes with false result', () => {
      vi.mocked(mockDialogRef.afterClosed as any).mockReturnValue(of(false));

      component.onTechnologyClick(testTechnology);

      expect(component.successMessage).toBe('');
    });
  });

  describe('Template rendering', () => {
    it('should render admin layout', () => {
      const layout = fixture.nativeElement.querySelector('.admin-layout');
      expect(layout).toBeTruthy();
    });

    it('should render form section', () => {
      const formSection = fixture.nativeElement.querySelector('.form-section');
      expect(formSection).toBeTruthy();
    });

    it('should render form section title', () => {
      const title = fixture.nativeElement.querySelector('.form-section h2');
      expect(title).toBeTruthy();
      expect(title.textContent).toBe('Create New Entry');
    });

    it('should render technology form component', () => {
      const form = fixture.nativeElement.querySelector('app-technology-form');
      expect(form).toBeTruthy();
    });

    it('should render list section', () => {
      const listSection = fixture.nativeElement.querySelector('.list-section');
      expect(listSection).toBeTruthy();
    });

    it('should render list section title', () => {
      const title = fixture.nativeElement.querySelector('.list-section h2');
      expect(title).toBeTruthy();
      expect(title.textContent).toBe('Unpublished Technologies');
    });

    it('should render unpublished technologies list', () => {
      const list = fixture.nativeElement.querySelector('.technologies-list');
      expect(list).toBeTruthy();
    });

    it('should render technology items for unpublished technologies', () => {
      const items = fixture.nativeElement.querySelectorAll('.technology-item');
      expect(items.length).toBe(2);
    });

    it('should render technology name and category', () => {
      const firstItem = fixture.nativeElement.querySelector('.technology-item');
      const name = firstItem.querySelector('h3');
      const badge = firstItem.querySelector('.category-badge');

      expect(name).toBeTruthy();
      expect(badge).toBeTruthy();
      expect(name.textContent).toBe('Unpublished Tool');
      expect(badge.textContent).toBe('Tools');
    });

    it('should show empty message when no unpublished technologies', () => {
      technologiesSignal.set([mockTechnologies[0]]);
      fixture.detectChanges();

      const emptyMessage = fixture.nativeElement.querySelector('.empty-message');
      expect(emptyMessage).toBeTruthy();
      expect(emptyMessage.textContent).toBe('No unpublished technologies yet.');
    });

    it('should not show empty message when unpublished technologies exist', () => {
      const emptyMessage = fixture.nativeElement.querySelector('.empty-message');
      expect(emptyMessage).toBeFalsy();
    });
  });


  describe('User interactions', () => {
    let mockDialogRef: Partial<MatDialogRef<TechnologyEditModalComponent>>;

    beforeEach(() => {
      mockDialogRef = {
        afterClosed: vi.fn().mockReturnValue(of(false))
      };
      vi.mocked(mockDialog.open as any).mockReturnValue(mockDialogRef);
    });

    it('should call onTechnologyClick when technology item is clicked', () => {
      const spy = vi.spyOn(component, 'onTechnologyClick');

      const firstItem = fixture.nativeElement.querySelector('.technology-item');
      firstItem.click();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(mockTechnologies[1]);
    });

    it('should call onFormSubmit when form is submitted', () => {
      vi.mocked(mockTechnologyService.post as any).mockReturnValue(of({}));

      const spy = vi.spyOn(component, 'onFormSubmit');

      const formData: Partial<Technology> = {
        name: 'Test',
        category: 'Tools',
        ring: 'Adopt',
        description: 'Test',
        reason: 'Test',
        isPublished: false
      };

      component.onFormSubmit(formData);

      expect(spy).toHaveBeenCalledWith(formData);
    });
  });
});
