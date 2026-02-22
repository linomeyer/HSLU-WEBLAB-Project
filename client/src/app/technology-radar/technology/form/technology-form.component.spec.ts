import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TechnologyFormComponent} from './technology-form.component';
import {Technology} from '../technology';
import {expect, vi} from 'vitest';
import {ComponentRef} from '@angular/core';

describe('TechnologyFormComponent', () => {
  let component: TechnologyFormComponent;
  let fixture: ComponentFixture<TechnologyFormComponent>;
  let componentRef: ComponentRef<TechnologyFormComponent>;

  const setupComponent = async (technology: Technology | null = null, submitButtonText: string = 'Create Technology') => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TechnologyFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('technology', technology);
    componentRef.setInput('submitButtonText', submitButtonText);

    fixture.detectChanges();
    TestBed.tick();

    return {fixture, component, componentRef};
  };

  beforeEach(async () => {
    await setupComponent();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
      expect(component.technologyForm.value).toEqual({
        name: '',
        category: '',
        ring: '',
        description: '',
        reason: '',
        isPublished: false
      });
    });

    it('should initialize form as invalid', () => {
      expect(component.technologyForm.valid).toBe(false);
    });

    it('should have required validators for always-required fields', () => {
      const form = component.technologyForm;

      expect(form.get('name')?.hasError('required')).toBe(true);
      expect(form.get('category')?.hasError('required')).toBe(true);
      expect(form.get('description')?.hasError('required')).toBe(true);
    });

    it('should not have required validators for ring and reason when isPublished is false', () => {
      const form = component.technologyForm;

      expect(form.get('ring')?.hasError('required')).toBe(false);
      expect(form.get('reason')?.hasError('required')).toBe(false);
    });
  });

  describe('Form with technology input', () => {
    it('should patch form values when technology is provided', async () => {
      const mockTechnology: Technology = {
        _id: '1',
        name: 'React',
        category: 'Languages & Frameworks',
        ring: 'Adopt',
        description: 'A JavaScript library',
        reason: 'Widely adopted',
        isPublished: true,
        createdAt: new Date('2024-01-01')
      };

      await setupComponent(mockTechnology);

      expect(component.technologyForm.value).toEqual({
        name: 'React',
        category: 'Languages & Frameworks',
        ring: 'Adopt',
        description: 'A JavaScript library',
        reason: 'Widely adopted',
        isPublished: true
      });
    });

    it('should update form when technology input changes', async () => {
      const tech1: Technology = {
        _id: '1',
        name: 'React',
        category: 'Languages & Frameworks',
        ring: 'Adopt',
        description: 'Description 1',
        reason: 'Reason 1',
        isPublished: true,
        createdAt: new Date()
      };

      await setupComponent(tech1);
      expect(component.technologyForm.value.name).toBe('React');

      const tech2: Technology = {
        ...tech1,
        name: 'Angular',
        category: 'Tools'
      };

      componentRef.setInput('technology', tech2);
      fixture.detectChanges();
      TestBed.tick();

      expect(component.technologyForm.value.name).toBe('Angular');
      expect(component.technologyForm.value.category).toBe('Tools');
    });
  });

  describe('Form validation', () => {
    it('should be invalid when name is empty', () => {
      component.technologyForm.patchValue({
        category: 'Tools',
        ring: 'Adopt',
        description: 'Test',
        reason: 'Test'
      });

      expect(component.technologyForm.valid).toBe(false);
      expect(component.technologyForm.get('name')?.hasError('required')).toBe(true);
    });

    it('should be invalid when category is empty', () => {
      component.technologyForm.patchValue({
        name: 'Test',
        ring: 'Adopt',
        description: 'Test',
        reason: 'Test'
      });

      expect(component.technologyForm.valid).toBe(false);
      expect(component.technologyForm.get('category')?.hasError('required')).toBe(true);
    });

    it('should be invalid when ring is empty and isPublished is true', () => {
      component.technologyForm.patchValue({
        name: 'Test',
        category: 'Tools',
        ring: '',
        description: 'Test',
        reason: 'Test',
        isPublished: true
      });

      expect(component.technologyForm.valid).toBe(false);
      expect(component.technologyForm.get('ring')?.hasError('required')).toBe(true);
    });

    it('should be valid when ring is empty and isPublished is false', () => {
      component.technologyForm.patchValue({
        name: 'Test',
        category: 'Tools',
        ring: '',
        description: 'Test',
        reason: '',
        isPublished: false
      });

      expect(component.technologyForm.valid).toBe(true);
    });

    it('should be invalid when description is empty', () => {
      component.technologyForm.patchValue({
        name: 'Test',
        category: 'Tools',
        ring: 'Adopt',
        reason: 'Test'
      });

      expect(component.technologyForm.valid).toBe(false);
      expect(component.technologyForm.get('description')?.hasError('required')).toBe(true);
    });

    it('should be invalid when reason is empty and isPublished is true', () => {
      component.technologyForm.patchValue({
        name: 'Test',
        category: 'Tools',
        ring: 'Adopt',
        description: 'Test',
        reason: '',
        isPublished: true
      });

      expect(component.technologyForm.valid).toBe(false);
      expect(component.technologyForm.get('reason')?.hasError('required')).toBe(true);
    });

    it('should be valid when reason is empty and isPublished is false', () => {
      component.technologyForm.patchValue({
        name: 'Test',
        category: 'Tools',
        ring: '',
        description: 'Test',
        reason: '',
        isPublished: false
      });

      expect(component.technologyForm.valid).toBe(true);
    });

    it('should be valid when all required fields are filled', () => {
      component.technologyForm.patchValue({
        name: 'Test',
        category: 'Tools',
        ring: 'Adopt',
        description: 'Test description',
        reason: 'Test reason',
        isPublished: false
      });

      expect(component.technologyForm.valid).toBe(true);
    });
  });

  describe('onSubmit method', () => {
    it('should mark all fields as touched when form is invalid', () => {
      const markAllAsTouchedSpy = vi.spyOn(component.technologyForm, 'markAllAsTouched');

      component.onSubmit();

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('should not emit when form is invalid', () => {
      const emitSpy = vi.fn();
      component.formSubmit.subscribe(emitSpy);

      component.onSubmit();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should emit formSubmit with technology data when form is valid', () => {
      const emitSpy = vi.fn();
      component.formSubmit.subscribe(emitSpy);

      component.technologyForm.patchValue({
        name: 'React',
        category: 'Languages & Frameworks',
        ring: 'Adopt',
        description: 'A JavaScript library',
        reason: 'Widely adopted',
        isPublished: true
      });

      component.onSubmit();

      expect(emitSpy).toHaveBeenCalled();
      const emittedTechnology = emitSpy.mock.calls[0][0];
      expect(emittedTechnology.name).toBe('React');
      expect(emittedTechnology.category).toBe('Languages & Frameworks');
      expect(emittedTechnology.ring).toBe('Adopt');
      expect(emittedTechnology.description).toBe('A JavaScript library');
      expect(emittedTechnology.reason).toBe('Widely adopted');
      expect(emittedTechnology.isPublished).toBe(true);
    });

    it('should set createdAt to current date for new technology', () => {
      const emitSpy = vi.fn();
      component.formSubmit.subscribe(emitSpy);

      component.technologyForm.patchValue({
        name: 'Test',
        category: 'Tools',
        ring: 'Adopt',
        description: 'Test',
        reason: 'Test',
        isPublished: false
      });

      const beforeSubmit = new Date();
      component.onSubmit();
      const afterSubmit = new Date();

      const emittedTechnology = emitSpy.mock.calls[0][0];
      expect(emittedTechnology.createdAt).toBeDefined();
      expect(emittedTechnology.createdAt.getTime()).toBeGreaterThanOrEqual(beforeSubmit.getTime());
      expect(emittedTechnology.createdAt.getTime()).toBeLessThanOrEqual(afterSubmit.getTime());
    });

    it('should not set changedAt for new technology', () => {
      const emitSpy = vi.fn();
      component.formSubmit.subscribe(emitSpy);

      component.technologyForm.patchValue({
        name: 'Test',
        category: 'Tools',
        ring: 'Adopt',
        description: 'Test',
        reason: 'Test',
        isPublished: false
      });

      component.onSubmit();

      const emittedTechnology = emitSpy.mock.calls[0][0];
      expect(emittedTechnology.changedAt).toBeUndefined();
    });

    it('should set changedAt for existing technology', async () => {
      const mockTechnology: Technology = {
        _id: '1',
        name: 'React',
        category: 'Languages & Frameworks',
        ring: 'Adopt',
        description: 'Test',
        reason: 'Test',
        isPublished: true,
        createdAt: new Date('2024-01-01')
      };

      await setupComponent(mockTechnology);

      const emitSpy = vi.fn();
      component.formSubmit.subscribe(emitSpy);

      component.onSubmit();

      const emittedTechnology = emitSpy.mock.calls[0][0];
      expect(emittedTechnology.changedAt).toBeDefined();
      expect(emittedTechnology.createdAt).toEqual(mockTechnology.createdAt);
    });

    it('should preserve existing technology _id', async () => {
      const mockTechnology: Technology = {
        _id: '123',
        name: 'React',
        category: 'Languages & Frameworks',
        ring: 'Adopt',
        description: 'Test',
        reason: 'Test',
        isPublished: true,
        createdAt: new Date('2024-01-01')
      };

      await setupComponent(mockTechnology);

      const emitSpy = vi.fn();
      component.formSubmit.subscribe(emitSpy);

      component.onSubmit();

      const emittedTechnology = emitSpy.mock.calls[0][0];
      expect(emittedTechnology._id).toBe('123');
    });
  });

  describe('reset method', () => {
    it('should reset form to initial state', () => {
      component.technologyForm.patchValue({
        name: 'Test',
        category: 'Tools',
        ring: 'Adopt',
        description: 'Test',
        reason: 'Test',
        isPublished: true
      });

      component.reset();

      expect(component.technologyForm.value).toEqual({
        name: null,
        category: null,
        ring: null,
        description: null,
        reason: null,
        isPublished: null
      });
    });

    it('should reset form validation state', () => {
      component.technologyForm.markAllAsTouched();

      expect(component.technologyForm.touched).toBe(true);

      component.reset();

      expect(component.technologyForm.touched).toBe(false);
    });
  });

  describe('Template rendering', () => {
    it('should render form element', () => {
      const form = fixture.nativeElement.querySelector('form');
      expect(form).toBeTruthy();
    });

    it('should render all form fields', () => {
      const nameInput = fixture.nativeElement.querySelector('#name');
      const categorySelect = fixture.nativeElement.querySelector('#category');
      const ringSelect = fixture.nativeElement.querySelector('#ring');
      const descriptionTextarea = fixture.nativeElement.querySelector('#description');
      const reasonTextarea = fixture.nativeElement.querySelector('#reason');
      const isPublishedCheckbox = fixture.nativeElement.querySelector('#isPublished');

      expect(nameInput).toBeTruthy();
      expect(categorySelect).toBeTruthy();
      expect(ringSelect).toBeTruthy();
      expect(descriptionTextarea).toBeTruthy();
      expect(reasonTextarea).toBeTruthy();
      expect(isPublishedCheckbox).toBeTruthy();
    });

    it('should render submit button with default text', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button).toBeTruthy();
      expect(button.textContent).toBe('Create Technology');
    });

    it('should render submit button with custom text', async () => {
      await setupComponent(null, 'Update Technology');

      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.textContent).toBe('Update Technology');
    });

    it('should disable submit button when form is invalid', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.technologyForm.patchValue({
        name: 'Test',
        category: 'Tools',
        ring: 'Adopt',
        description: 'Test',
        reason: 'Test',
        isPublished: false
      });

      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBe(false);
    });

    it('should show error message when name is touched and invalid', () => {
      component.technologyForm.get('name')?.markAsTouched();
      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector('.field-error');
      expect(error).toBeTruthy();
      expect(error.textContent).toContain('Name is required');
    });

    it('should not show error message when field is untouched', () => {
      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector('.field-error');
      expect(error).toBeFalsy();
    });

    it('should render all category options', () => {
      const categorySelect = fixture.nativeElement.querySelector('#category');
      const options = categorySelect.querySelectorAll('option');

      expect(options.length).toBe(5); // 1 disabled + 4 categories
      expect(Array.from(options).map((o: any) => o.value)).toContain('Techniques');
      expect(Array.from(options).map((o: any) => o.value)).toContain('Platforms');
      expect(Array.from(options).map((o: any) => o.value)).toContain('Tools');
      expect(Array.from(options).map((o: any) => o.value)).toContain('Languages & Frameworks');
    });

    it('should render all ring options', () => {
      const ringSelect = fixture.nativeElement.querySelector('#ring');
      const options = ringSelect.querySelectorAll('option');

      expect(options.length).toBe(5); // 1 disabled + 4 rings
      expect(Array.from(options).map((o: any) => o.value)).toContain('Adopt');
      expect(Array.from(options).map((o: any) => o.value)).toContain('Trial');
      expect(Array.from(options).map((o: any) => o.value)).toContain('Assess');
      expect(Array.from(options).map((o: any) => o.value)).toContain('Hold');
    });

    it('should display "No" when isPublished is false', () => {
      component.technologyForm.patchValue({isPublished: false});
      fixture.detectChanges();

      const toggleLabel = fixture.nativeElement.querySelector('.toggle-label');
      expect(toggleLabel.textContent.trim()).toBe('No');
    });
  });

  describe('Form submission', () => {

    it('should emit event when valid form is submitted', () => {
      const emitSpy = vi.fn();
      component.formSubmit.subscribe(emitSpy);

      component.technologyForm.patchValue({
        name: 'Test',
        category: 'Tools',
        ring: 'Adopt',
        description: 'Test',
        reason: 'Test',
        isPublished: false
      });

      const form = fixture.nativeElement.querySelector('form');
      form.dispatchEvent(new Event('submit'));

      expect(emitSpy).toHaveBeenCalled();
    });
  });
});
