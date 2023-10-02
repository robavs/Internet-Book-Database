import { createReducer, on } from "@ngrx/store";
import { Role, UserSignup } from "src/app/models";
import * as RegistrationActions from "../actions/signup.actions"

export const userSignupCredentials: UserSignup = {
    firstName: "",
    lastName: "",
    role: Role.Reader,
    email: "",
    password: ""
}

export const signupReducer = createReducer(
    userSignupCredentials,
    on(RegistrationActions.setUserSignupCredentials, (credentails, { property, value }) => ({ ...credentails, [property]: value }))
)