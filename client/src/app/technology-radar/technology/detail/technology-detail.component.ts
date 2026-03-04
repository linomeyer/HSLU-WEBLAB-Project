import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Technology} from '../technology';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {DatePipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {TechnologyEditModalComponent} from '../edit/technology-edit-modal.component';
import {AuthAdminCheckerService} from '../../../auth/auth-admin-checker.service';

@Component({
  selector: 'app-technology-detail',
  imports: [
    MatDialogContent,
    MatChipSet,
    MatChip,
    MatDialogActions,
    DatePipe,
    MatButton,
    MatDialogClose,
    MatDialogTitle
  ],
  templateUrl: './technology-detail.component.html',
  styleUrl: './technology-detail.component.css',
})
export class TechnologyDetailComponent {
  private dialogRef = inject(MatDialogRef<TechnologyDetailComponent>);
  private dialog = inject(MatDialog);
  private authAdminCheckerService = inject(AuthAdminCheckerService);

  data: { technology: Technology; color: string } = inject(MAT_DIALOG_DATA);


  isAdmin = this.authAdminCheckerService.isAdmin;

  onEdit(): void {
    this.dialogRef.close();
    this.dialog.open(TechnologyEditModalComponent, {
      data: this.data.technology,
      width: '600px',
      disableClose: false
    });
  }
}
