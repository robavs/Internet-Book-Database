import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpdatePasssword } from 'src/app/models';
import { setUpdatePasswordInput } from 'src/app/store/actions/user.actions';
import { Store } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { selectUpdatePasswordData } from 'src/app/store/selectors/user.selectors';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css'],
  standalone: true,
  imports: [MatListModule, MatDividerModule, CommonModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule]
})
export class ChangePasswordDialogComponent {
  userData$: Observable<UpdatePasssword> = this.store.select(selectUpdatePasswordData)
  requestMessages$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])

  constructor(private store: Store<AppState>, private authService: AuthService) {
    this.store.dispatch(setUpdatePasswordInput({ property: "email", value: authService.user$.value!.email }))
  }

  inputChange(property: keyof UpdatePasssword, value: string) {
    this.requestMessages$.next([])
    this.store.dispatch(setUpdatePasswordInput({ property, value }))
  }

  changePassword() {
    let updatePassData: UpdatePasssword = {} as UpdatePasssword
    this.userData$.subscribe({
      next: (data) => {
        updatePassData = data
      }
    })

    this.requestMessages$.next(["Processing Request"])
    this.authService.updatePassword(updatePassData, this.requestMessages$)
  }
}
