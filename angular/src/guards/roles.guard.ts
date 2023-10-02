import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, take } from "rxjs";
import { Role, User } from "src/app/models";
import { AuthService } from "src/app/services/auth.service";

export const RolesGuard: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> => {

        // jer se svakako authGuard izvrsi pre njega pa use sigurno nije null
        const user: User = inject(AuthService).user$.value as User

        // interface mod kome se pristupa
        const currentPageMode: string = user.role === Role.Reader ? "r" : "m"
        const nextPageMode: string = route.url[0].path

        if (nextPageMode !== "r" && nextPageMode !== "m") {
            return inject(Router).createUrlTree([""])
        }

        if (currentPageMode !== nextPageMode) {
            return inject(Router).createUrlTree([`${currentPageMode}`, "profile"])
        }

        return true
    } 