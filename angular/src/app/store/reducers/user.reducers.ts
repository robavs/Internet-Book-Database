import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { UpdatePasssword, UserData } from "src/app/models";
import * as Actions from '../actions/user.actions'

export const updatePasswordData: UpdatePasssword = {
    email: "",
    oldPassword: "",
    newPassword: ""
}

export interface UserState extends EntityState<UserData> {
    selectedUserId: number | null
}

export const adapter: EntityAdapter<UserData> = createEntityAdapter<UserData>()

export const initalState: UserState = adapter.getInitialState({
    selectedUserId: null
})

export const userChangePasswordReducer = createReducer(
    updatePasswordData,
    on(Actions.setUpdatePasswordInput, (credentails, { property, value }) => ({ ...credentails, [property]: value }))
)