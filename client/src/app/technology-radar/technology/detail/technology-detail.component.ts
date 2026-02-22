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
import {AuthService} from '@auth0/auth0-angular';
import {toSignal} from '@angular/core/rxjs-interop';
import {map, switchMap, take} from 'rxjs/operators';
import {from, of} from 'rxjs';
import {TechnologyEditModalComponent} from '../edit/technology-edit-modal.component';

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
  private auth = inject(AuthService);

  data: { technology: Technology; color: string } = inject(MAT_DIALOG_DATA);

  isAdmin = toSignal(
    this.auth.isAuthenticated$.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return of(false);
        }
        return from(this.auth.getAccessTokenSilently()).pipe(
          map(token => {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const roles: string[] = payload['https://technology-radar.com/roles'] || [];
            return roles.includes('admin');
          })
        );
      })
    ),
    {initialValue: false}
  );

  onEdit(): void {
    this.dialogRef.close();
    this.dialog.open(TechnologyEditModalComponent, {
      data: this.data.technology,
      width: '600px',
      disableClose: false
    });
  }
}
