import { User } from "./appState";

//Object that can be used to return from functions that have a success / failure state and message.
export interface StatusObject{
    message: string,
    status: boolean
}

//used to return status + user object from sign in function
export interface LoginStatusObject extends StatusObject{
    user: User
}