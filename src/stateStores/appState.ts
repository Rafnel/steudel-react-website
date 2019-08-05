import { observable } from "mobx";

/*
 * Central storage location for the whole application's state. Using MobX,
 * any changes to any of these will propogate to any components that use these.
*/
export class AppStateStore{
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
    @observable errorMessage: string = "";

    @observable verificationCode: string = "";
    @observable resentCode: boolean = false;
    @observable emailVerificationErrorMessage: string = "";
    
    @observable loginPageErrorMessage: string = "";

    @observable signUpPageErrorMessage: string = "";

    @observable currentComponent: SwimComponent = {
        username: "",
        set: "",
        component_body: "",
        component_id: "",
        date_created: "",
        intervals: [],
        tags: [],
        yardage: 0,
        difficulty: "",
        likes: 0
    };

    @observable forgotPasswordErrorMessage: string = "";
    @observable forgotPasswordUsernameEntered: boolean = false;
    @observable loadingForgotPassword: boolean = false;
    @observable currentUser: User = {
        username: "",
        liked_components: [],
        liked_workouts: []
    }
}

export default class GlobalState{
    appState: AppStateStore = new AppStateStore();
}

export const globalState: GlobalState = new GlobalState();

export interface SwimComponent{
    username: string;
    set: string;
    component_body: string;
    component_id: string;
    date_created: string;
    intervals: string[];
    tags: string[];
    yardage: number;
    difficulty: string;
    likes: number;
}

export interface User{
    username: string;
    liked_components: string[];
    liked_workouts: string[];
}

//function for effectively resetting the program on user log-out.
export function resetState(){
    globalState.appState.isLoggedIn = false;
    globalState.appState.currentComponent = {
        username: "",
        set: "",
        component_body: "",
        component_id: "",
        date_created: "",
        intervals: [],
        tags: [],
        yardage: 0,
        difficulty: "",
        likes: 0
    }
    globalState.appState.currentUser = {
        username: "",
        liked_components: [],
        liked_workouts: []
    }
    globalState.appState.forgotPasswordErrorMessage = "";
    globalState.appState.forgotPasswordUsernameEntered = false;
    globalState.appState.signUpPageErrorMessage = "";
    globalState.appState.loginPageErrorMessage = "";
    globalState.appState.email = "";
    globalState.appState.username = "";
    globalState.appState.name = "";
    globalState.appState.signedUp = false;
    globalState.appState.emailVerified = false;
    globalState.appState.navBarVisible = false;
    globalState.appState.resentCode = false;
}