import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TechnologyEditModalComponent} from './technology-edit-modal.component';
import {TechnologyService} from '../technology.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Technology, TechnologyCreateOrUpdate} from '../technology';
import {of, throwError} from 'rxjs';
import {expect, vi} from 'vitest';

describe('TechnologyEditModalComponent', () => {
  let component: TechnologyEditModalComponent;
  let fixture: ComponentFixture<TechnologyEditModalComponent>;
  let mockTechnologyService: Partial<TechnologyService>;
  let mockDialogRef: Partial<MatDialogRef<TechnologyEditModalComponent>>;
  let mockTechnology: Technology;

  beforeEach(async () => {
    mockTechnology = {
      _id: '1',
      name: 'React',
      category: 'Languages & Frameworks',
      ring: 'Adopt',
      description: 'A JavaScript library for building user interfaces',
      reason: 'Widely adopted and maintained',
      isPublished: true,
      createdAt: new Date('2024-01-01'),
      changedAt: new Date('2024-01-15')
    };

    mockTechnologyService = {
      put: vi.fn(),
      delete: vi.fn()
    };

    mockDialogRef = {
      close: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TechnologyEditModalComponent],
      providers: [
        {provide: TechnologyService, useValue: mockTechnologyService},
        {provide: MatDialogRef, useValue: mockDialogRef},
        {provide: MAT_DIALOG_DATA, useValue: mockTechnology}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with injected technology data', () => {
      expect(component.data).toEqual(mockTechnology);
    });

    it('should initialize with empty messages', () => {
      expect(component.errorMessage).toBe('');
      expect(component.successMessage).toBe('');
    });
  });

  describe('onFormSubmit', () => {
    let formData: Partial<Technology>;

    beforeEach(() => {
      formData = {
        name: 'Updated React',
        category: 'Languages & Frameworks',
        ring: 'Trial',
        description: 'Updated description',
        reason: 'Updated reason',
        isPublished: false
      };
    });

    it('should call techService.put with correct parameters', () => {
      vi.mocked(mockTechnologyService.put as any).mockReturnValue(of({}));

      component.onFormSubmit(formData);

      const expectedUpdate: TechnologyCreateOrUpdate = {
        name: 'Updated React',
        category: 'Languages & Frameworks',
        ring: 'Trial',
        description: 'Updated description',
        reason: 'Updated reason',
        isPublished: false
      };

      expect(mockTechnologyService.put).toHaveBeenCalledWith('1', expectedUpdate);
    });

    it('should set success message on successful update', () => {
      vi.mocked(mockTechnologyService.put as any).mockReturnValue(of({}));

      component.onFormSubmit(formData);

      expect(component.successMessage).toBe('Technology updated successfully!');
      expect(component.errorMessage).toBe('');
    });

    it('should close dialog after successful update', async () => {
      vi.mocked(mockTechnologyService.put as any).mockReturnValue(of({}));
      vi.useFakeTimers();

      component.onFormSubmit(formData);

      expect(mockDialogRef.close).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);

      expect(mockDialogRef.close).toHaveBeenCalledWith(true);

      vi.useRealTimers();
    });

    it('should set error message on failed update', () => {
      const error = new Error('Update failed');
      vi.mocked(mockTechnologyService.put as any).mockReturnValue(throwError(() => error));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      });

      component.onFormSubmit(formData);

      expect(component.errorMessage).toBe('Failed to update technology. Please try again.');
      expect(component.successMessage).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith('Error updating technology:', error);

      consoleSpy.mockRestore();
    });

    it('should not close dialog on failed update', () => {
      const error = new Error('Update failed');
      vi.mocked(mockTechnologyService.put as any).mockReturnValue(throwError(() => error));

      component.onFormSubmit(formData);

      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('onDelete', () => {
    let confirmSpy: any;

    beforeEach(() => {
      confirmSpy = vi.spyOn(window, 'confirm');
    });

    afterEach(() => {
      confirmSpy.mockRestore();
    });

    it('should show confirmation dialog with technology name', () => {
      confirmSpy.mockReturnValue(false);

      component.onDelete();

      expect(confirmSpy).toHaveBeenCalledWith(
        'Are you sure you want to delete "React"? This action cannot be undone.'
      );
    });

    it('should not delete if user cancels confirmation', () => {
      confirmSpy.mockReturnValue(false);

      component.onDelete();

      expect(mockTechnologyService.delete).not.toHaveBeenCalled();
    });

    it('should call techService.delete with correct ID if confirmed', () => {
      confirmSpy.mockReturnValue(true);
      vi.mocked(mockTechnologyService.delete as any).mockReturnValue(of({}));

      component.onDelete();

      expect(mockTechnologyService.delete).toHaveBeenCalledWith('1');
    });

    it('should set success message on successful deletion', () => {
      confirmSpy.mockReturnValue(true);
      vi.mocked(mockTechnologyService.delete as any).mockReturnValue(of({}));

      component.onDelete();

      expect(component.successMessage).toBe('Technology deleted successfully!');
      expect(component.errorMessage).toBe('');
    });

    it('should close dialog after successful deletion', async () => {
      confirmSpy.mockReturnValue(true);
      vi.mocked(mockTechnologyService.delete as any).mockReturnValue(of({}));
      vi.useFakeTimers();

      component.onDelete();

      expect(mockDialogRef.close).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);

      expect(mockDialogRef.close).toHaveBeenCalledWith(true);

      vi.useRealTimers();
    });

    it('should set error message on failed deletion', () => {
      confirmSpy.mockReturnValue(true);
      const error = new Error('Delete failed');
      vi.mocked(mockTechnologyService.delete as any).mockReturnValue(throwError(() => error));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      });

      component.onDelete();

      expect(component.errorMessage).toBe('Failed to delete technology. Please try again.');
      expect(component.successMessage).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith('Error deleting technology:', error);

      consoleSpy.mockRestore();
    });

    it('should not close dialog on failed deletion', () => {
      confirmSpy.mockReturnValue(true);
      const error = new Error('Delete failed');
      vi.mocked(mockTechnologyService.delete as any).mockReturnValue(throwError(() => error));

      component.onDelete();

      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should close dialog with false value', () => {
      component.onCancel();

      expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });

    it('should close dialog without saving changes', () => {
      component.onCancel();

      expect(mockTechnologyService.put).not.toHaveBeenCalled();
      expect(mockTechnologyService.delete).not.toHaveBeenCalled();
    });
  });

  describe('Template rendering', () => {
    it('should render dialog title', () => {
      const title = fixture.nativeElement.querySelector('h2[mat-dialog-title]');
      expect(title).toBeTruthy();
      expect(title.textContent).toBe('Edit Technology');
    });

    it('should render technology form component', () => {
      const form = fixture.nativeElement.querySelector('app-technology-form');
      expect(form).toBeTruthy();
    });

    it('should pass technology data to form component', () => {
      const formComponent = fixture.debugElement.query(
        (el) => el.componentInstance instanceof Object && 'technology' in el.componentInstance
      );
      expect(formComponent).toBeTruthy();
    });

    it('should render created date', () => {
      const dates = fixture.nativeElement.querySelectorAll('.date');
      const createdDate = Array.from(dates).find((el: any) =>
        el.textContent.includes('Added on')
      );
      expect(createdDate).toBeTruthy();
    });

    it('should render changed date if present', () => {
      const dates = fixture.nativeElement.querySelectorAll('.date');
      const changedDate = Array.from(dates).find((el: any) =>
        el.textContent.includes('Last changed on')
      );
      expect(changedDate).toBeTruthy();
    });

    it('should render Delete button', () => {
      const deleteButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.trim() === 'Delete');

      expect(deleteButton).toBeTruthy();
    });

    it('should render Cancel button', () => {
      const cancelButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.trim() === 'Cancel');

      expect(cancelButton).toBeTruthy();
    });
  });
});
