import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {TechnologyService} from '../technology.service';
import {Technology, TechnologyCreateOrUpdate} from '../technology';
import {TechnologyFormComponent} from '../form/technology-form.component';
import {MatButton} from '@angular/material/button';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-technology-edit-modal',
  imports: [
    TechnologyFormComponent,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogTitle,
    DatePipe
  ],
  templateUrl: './technology-edit-modal.component.html',
  styleUrl: './technology-edit-modal.component.css',
})
export class TechnologyEditModalComponent {
  private dialogRef = inject(MatDialogRef<TechnologyEditModalComponent>);
  public data: Technology = inject(MAT_DIALOG_DATA);
  private techService = inject(TechnologyService);

  errorMessage = '';
  successMessage = '';

  onFormSubmit(formData: Partial<Technology>): void {
    this.errorMessage = '';
    this.successMessage = '';

    const updatedTechnology: TechnologyCreateOrUpdate = {
      name: formData.name!,
      category: formData.category!,
      ring: formData.ring || null,
      description: formData.description!,
      reason: formData.reason || null,
      isPublished: formData.isPublished!
    };

    this.techService.put(this.data._id!, updatedTechnology).subscribe({
      next: () => {
        this.successMessage = 'Technology updated successfully!';
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update technology. Please try again.';
        console.error('Error updating technology:', err);
      }
    });
  }

  public onDelete(): void {
    if (confirm(`Are you sure you want to delete "${this.data.name}"? This action cannot be undone.`)) {
      this.errorMessage = '';

      this.techService.delete(this.data._id!).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete technology. Please try again.';
          console.error('Error deleting technology:', err);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
