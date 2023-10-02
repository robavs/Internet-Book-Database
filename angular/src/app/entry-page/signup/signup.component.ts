import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Store, select } from '@ngrx/store';
import { selectUserSignupCredentials } from 'src/app/store/selectors/signup.selectors';
import { Role, UserSignup } from 'src/app/models';
import { setUserSignupCredentials } from 'src/app/store/actions/signup.actions';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { AuthService } from 'src/app/services/auth.service';
import { MatDividerModule } from '@angular/material/divider';
import { SpinnerComponent } from 'src/app/shared-components/spinner/spinner.component';

@Component({
  selector: 'entry-page-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatDividerModule, MatListModule, MatInputModule, FormsModule, MatButtonModule, SpinnerComponent]
})
export class Signup {
  userCredentials: UserSignup = {
    firstName: '',
    lastName: '',
    role: Role.Reader,
    email: "",
    password: ""
  }
  errors$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  errors: string[] = []
  waitingForSignupResponse: boolean = false

  constructor(
    private store: Store<{ userSignupCredentials: UserSignup }>,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.store.select(selectUserSignupCredentials).subscribe({
      next: (credentials) => {
        this.userCredentials = credentials
      }
    })

    this.errors$.subscribe({
      next: (errors) => {
        this.errors = errors
      }
    })
  }

  inputChange(property: keyof Omit<UserSignup, "role">, value: string) {
    this.store.dispatch(setUserSignupCredentials({ property, value }))
  }

  async signup() {
    this.waitingForSignupResponse = true
    await this.authService.login(this.userCredentials, this.errors$)
    this.waitingForSignupResponse = false
  }
}
