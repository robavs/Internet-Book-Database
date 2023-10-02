import { createAction, props } from "@ngrx/store";
import { UpdatePasssword } from "src/app/models";

export const setUpdatePasswordInput = createAction(
    "[Change Password] Set New Password",
    props<{ property: keyof UpdatePasssword, value: string }>()
)

export const setNewPassword = createAction(
    "[Change Password] Set New Password"
)

export const setNewPassordSuccess = createAction(
    "[Change Password] Set New Password Success"
)

export const setNewPasswordFail = createAction(
    "[Change Password] Set New Password Fail"
)