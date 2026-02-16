import {Component, effect, inject, input, output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Technology} from '../technology';

@Component({
  selector: 'app-technology-form',
  imports: [ReactiveFormsModule],
  templateUrl: './technology-form.component.html',
  styleUrl: './technology-form.component.css',
})
export class TechnologyFormComponent {
  private fb = inject(FormBuilder);

  technology = input<Technology | null>(null);
  submitButtonText = input<string>('Create Technology');

  formSubmit = output<Technology>();

  technologyForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    ring: ['', Validators.required],
    description: ['', Validators.required],
    reason: ['', Validators.required],
    isPublished: [false, Validators.required],
  });

  constructor() {
    effect(() => {
      const tech = this.technology();
      if (tech) {
        this.technologyForm.patchValue({
          name: tech.name,
          category: tech.category,
          ring: tech.ring,
          description: tech.description,
          reason: tech.reason,
          isPublished: tech.isPublished,
        }, {emitEvent: false});
      }
    });
  }

  onSubmit(): void {
    if (this.technologyForm.invalid) {
      this.technologyForm.markAllAsTouched();
      return;
    }

    const formData = this.technologyForm.value;
    const technology: Technology = {
      ...this.technology(),
      name: formData.name!,
      category: formData.category!,
      ring: formData.ring!,
      description: formData.description!,
      reason: formData.reason!,
      isPublished: formData.isPublished!,
      createdAt: this.technology()?.createdAt || new Date(),
      changedAt: this.technology() ? new Date() : undefined,
    };

    this.formSubmit.emit(technology);
  }

  reset(): void {
    this.technologyForm.reset();
  }
}
