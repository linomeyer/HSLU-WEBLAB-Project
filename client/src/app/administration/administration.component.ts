import {Component, computed, inject, Signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TechnologyService} from '../technology-radar/technology/technology.service';
import {Technology} from '../technology-radar/technology/technology';
import {CommonModule} from '@angular/common';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-administration',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css',
})
export class AdministrationComponent {
  private fb = inject(FormBuilder);
  private techService = inject(TechnologyService);

  private technologies: Signal<Technology[]> = toSignal(this.techService.getAll(), {initialValue: []});

  unpublishedTechnologies = computed(() => {
    return this.technologies().filter((t) => !t.isPublished);
  });

  successMessage = '';
  errorMessage = '';

  technologyForm = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    ring: ['', Validators.required],
    description: ['', Validators.required],
    reason: ['', Validators.required],
    isPublished: [false, Validators.required],
  });

  onSubmit(): void {
    if (this.technologyForm.invalid) {
      this.technologyForm.markAllAsTouched();
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    const formData = this.technologyForm.value;
    const technology: Technology = {
      name: formData.name!,
      category: formData.category!,
      ring: formData.ring!,
      description: formData.description!,
      reason: formData.reason!,
      isPublished: formData.isPublished!,
      createdAt: new Date(),
    }

    this.techService.post(technology).subscribe({
      next: () => {
        this.successMessage = 'Technology created successfully!';
        this.technologyForm.reset();
      },
      error: (err) => {
        this.errorMessage = 'Failed to create technology. Please try again.';
        console.error('Error creating technology:', err);
      },
    });
  }
}
