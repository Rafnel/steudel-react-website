import { observable, action } from "mobx";

/*
 * Central storage location for the whole application's state. Using MobX,
 * any changes to any of these will propogate to any components that use these.
*/
export default class AppStateStore{
    @observable username: string = "";
    @observable email: string = "";
    @observable name: string = "";
    @observable signedUp: boolean = false;
    @observable isLoading: boolean = false;
    @observable emailVerified: boolean = false;
    @observable navBarVisible: boolean = false; 
    @observable isLoggedIn: boolean = false;
    @observable isAuthenticating: boolean = true;
    @observable successMessage: string = "";

    @observable verificationCode: string = "";
    @observable resentCode: boolean = false;
    @observable emailVerificationErrorMessage: string = "";
    
    @observable loginPageErrorMessage: string = "";

    @observable signUpPageErrorMessage: string = "";
}