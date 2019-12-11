import { observable, action } from "mobx";


export class AppStateStore{
    @observable signedUp: boolean = false;
    @observable isLoading: boolean = false;
    @observable emailVerified: boolean = false;
    @observable navBarVisible: boolean = false; 
    @observable isLoggedIn: boolean = false;
    @observable isAuthenticating: boolean = true;
    @observable redirectAfterLogin: string = "";

    @action resetState(){
        this.signedUp = false;
        this.emailVerified = false;
        this.navBarVisible = false;
        this.isLoggedIn = false;
        this.isAuthenticating = false;
    }
}