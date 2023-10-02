import { createReducer, on } from "@ngrx/store";
import { Role, UserSignin } from "src/app/models";
import * as LoginActions from '../actions/signin.actions'

export const userSigninCredentials: UserSignin = {
    email: "",
    password: "",
    role: Role.Reader
}

export const signinReducer = createReducer(
    userSigninCredentials,
    on(LoginActions.setEmail, (credentails, { email }) => ({ ...credentails, email })),
    on(LoginActions.setPassword, (credentials, { password }) => ({ ...credentials, password })),
    on(LoginActions.setUserRole, (credentials, { role }) => ({ ...credentials, role }))
)