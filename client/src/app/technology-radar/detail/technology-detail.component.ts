import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {Technology} from '../technology/technology';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {DatePipe} from '@angular/common';
import {MatButton} from '@angular/material/button';

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
  protected data: { technology: Technology; color: string } = inject(MAT_DIALOG_DATA);
}
