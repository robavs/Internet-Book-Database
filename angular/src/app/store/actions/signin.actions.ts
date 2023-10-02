import { createAction, props } from "@ngrx/store";
import { Role } from "src/app/models";

export const setEmail = createAction(
    "[Signin] Set Email",
    props<{ email: string }>()
)

export const setPassword = createAction(
    "[Signin] Set Password",
    props<{ password: string }>()
)

export const setUserRole = createAction(
    "[Signin] Set Role",
    props<{ role: Role }>()
)