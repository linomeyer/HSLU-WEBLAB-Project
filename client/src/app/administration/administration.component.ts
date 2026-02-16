import {Component, computed, inject, Signal, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TechnologyService} from '../technology-radar/technology/technology.service';
import {Technology} from '../technology-radar/technology/technology';
import {CommonModule} from '@angular/common';
import {toSignal} from '@angular/core/rxjs-interop';
import {TechnologyFormComponent} from '../technology-radar/technology/form/technology-form.component';
import {MatDialog} from '@angular/material/dialog';
import {TechnologyEditModalComponent} from '../technology-radar/technology/edit/technology-edit-modal.component';

@Component({
  selector: 'app-administration',
  imports: [ReactiveFormsModule, CommonModule, TechnologyFormComponent],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css',
})
export class AdministrationComponent {
  private techService = inject(TechnologyService);
  private dialog = inject(MatDialog);

  private technologies: Signal<Technology[]> = toSignal(this.techService.getAll(), {initialValue: []});

  unpublishedTechnologies = computed(() => {
    return this.technologies().filter((t) => !t.isPublished);
  });

  formComponent = viewChild<TechnologyFormComponent>(TechnologyFormComponent);

  successMessage = '';
  errorMessage = '';

  onFormSubmit(formData: Partial<Technology>): void {
    this.successMessage = '';
    this.errorMessage = '';

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
        this.formComponent()?.reset();
      },
      error: (err) => {
        this.errorMessage = 'Failed to create technology. Please try again.';
        console.error('Error creating technology:', err);
      },
    });
  }

  onTechnologyClick(technology: Technology): void {
    const dialogRef = this.dialog.open(TechnologyEditModalComponent, {
      data: technology,
      width: '600px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.successMessage = 'Technology updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      }
    });
  }
}
