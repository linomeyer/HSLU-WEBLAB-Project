import {Component, computed, inject, viewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TechnologyService} from '../technology-radar/technology/technology.service';
import {Technology, TechnologyCreateOrUpdate} from '../technology-radar/technology/technology';
import {CommonModule} from '@angular/common';
import {TechnologyFormComponent} from '../technology-radar/technology/form/technology-form.component';
import {MatDialog} from '@angular/material/dialog';
import {TechnologyEditModalComponent} from '../technology-radar/technology/edit/technology-edit-modal.component';
import {CATEGORY_COLORS} from '../technology-radar/technology-radar.component';

@Component({
  selector: 'app-administration',
  imports: [ReactiveFormsModule, CommonModule, TechnologyFormComponent],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css',
})
export class AdministrationComponent {
  private techService = inject(TechnologyService);
  private dialog = inject(MatDialog);

  unpublishedTechnologies = computed(() => {
    return this.techService.technologies().filter((t) => !t.isPublished);
  });

  formComponent = viewChild<TechnologyFormComponent>(TechnologyFormComponent);

  successMessage = '';
  errorMessage = '';

  onFormSubmit(formData: Partial<Technology>): void {
    this.successMessage = '';
    this.errorMessage = '';

    const technology: TechnologyCreateOrUpdate = {
      name: formData.name!,
      category: formData.category!,
      ring: formData.ring!,
      description: formData.description!,
      reason: formData.reason!,
      isPublished: formData.isPublished!
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
        setTimeout(() => this.successMessage = '', 300);
      }
    });
  }

  getCategoryColor(category: string): string {
    return CATEGORY_COLORS[category] || '#cccccc';
  }
}
