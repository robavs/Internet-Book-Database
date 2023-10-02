import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { User } from "src/app/models";
import { AuthService } from "src/app/services/auth.service";

export const AuthGuard: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> => {
        const userData: string | null = localStorage.getItem("userData")

        if (!userData) {
            return inject(Router).createUrlTree(["/"])
        }

        const user: User = JSON.parse(userData)
        inject(AuthService).user$.next(user)
        return true
    }