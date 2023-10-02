import { Injectable, OnInit } from '@angular/core';
import { Role, Tokens, UpdatePasssword, User, UserSignin, UserSignup } from '../models';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, EMPTY, Observable, catchError, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) { }

  async login(userCredentials: UserSignin | UserSignup, errors$: BehaviorSubject<string[]>): Promise<Tokens | undefined> {
    try {
      const { role, ...credentials } = userCredentials
      const userType: string = role === Role.Reader ? "reader" : "moderator"
      const signinOrSignupMethod: string = "firstName" in userCredentials ? "/signup" : "/signin"
      const route: string = environment.api + `/${userType}` + signinOrSignupMethod
      // zato sto se za signup salje i role
      const body = "firstName" in userCredentials ? userCredentials : credentials

      const tokens$: Observable<Tokens> = this.http.post<Tokens>(route, body)
        .pipe(
          catchError((error) => {
            // verovatno ima neka fora da se ovo bolje ishendla
            if (typeof error.error.message !== "object") {
              errors$.next([error.error.message])
            }
            else {
              errors$.next(error.error.message)
            }

            throw new Error(error)
          })
        )

      const tokens = await lastValueFrom(tokens$)
      const user: User = {
        email: credentials.email,
        role,
        accessToken: tokens.access_token
      }
      localStorage.setItem("userData", JSON.stringify(user))
      this.user$.next(user)

      // mozda ce ovo trebati se promeni
      const nextPageRoute: string = role === Role.Reader ? "r/books" : "m/books"
      this.router.navigate([nextPageRoute])

      return tokens
    }
    catch (err) {
      console.log(err)
    }
    return undefined
  }

  logout(): void {
    this.user$.next(null)
    localStorage.removeItem("userData")
    this.router.navigate(["/"])
  }

  updatePassword(updatePasswordData: UpdatePasssword, errors$: BehaviorSubject<string[]>) {
    try {
      const userType: string = this.user$.value!.role === Role.Reader ? "reader" : "moderator"
      const route: string = environment.api + `/${userType}` + "/updatePassword"

      this.http.put(route, updatePasswordData)
        .pipe(
          catchError((error) => {
            // verovatno ima neka fora da se ovo bolje ishendla
            errors$.next(["Wrong password provided"])

            throw new Error(error)
            return EMPTY
          })
        ).subscribe({
          next: () => {
            errors$.next(["Password changed successfully"])
          }
        })
    }
    catch (err) {
      console.log(err)
    }
  }

  getIdFromAccessToken(): Observable<number> {
    const accessToken = this.user$.value?.accessToken
    const userType: string = this.user$.value!.role === Role.Reader ? "reader" : "moderator"
    const route: string = environment.api + `/${userType}` + "/getUserId/" + accessToken
    return this.http.get<number>(route)
  }

  removeReader() {
    this.getIdFromAccessToken().subscribe({
      next: (readerId: number) => {
        const route = environment.api + "/reader/delete" + `/${readerId}`
        this.http.delete(route).pipe(
          catchError((error) => {
            throw new Error(error)
          })
        ).subscribe({
          next: (value) => {
            this.router.navigate(["/"])
            localStorage.removeItem("userData")
          }
        })
      }
    })
  }
}
