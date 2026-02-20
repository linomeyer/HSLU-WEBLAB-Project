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

@Component({
  selector: 'app-technology-edit-modal',
  imports: [
    TechnologyFormComponent,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogTitle
  ],
  templateUrl: './technology-edit-modal.component.html',
  styleUrl: './technology-edit-modal.component.css',
})
export class TechnologyEditModalComponent {
  private dialogRef = inject(MatDialogRef<TechnologyEditModalComponent>);
  protected data: Technology = inject(MAT_DIALOG_DATA);
  private techService = inject(TechnologyService);

  errorMessage = '';
  successMessage = '';

  onFormSubmit(formData: Partial<Technology>): void {
    this.errorMessage = '';
    this.successMessage = '';

    const updatedTechnology: TechnologyCreateOrUpdate = {
      name: formData.name!,
      category: formData.category!,
      ring: formData.ring!,
      description: formData.description!,
      reason: formData.reason!,
      isPublished: formData.isPublished!
    };

    this.techService.put(this.data._id!, updatedTechnology).subscribe({
      next: () => {
        this.successMessage = 'Technology updated successfully!';
        setTimeout(() => {
          this.dialogRef.close(true); // Close and signal success
        }, 300);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update technology. Please try again.';
        console.error('Error updating technology:', err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
