import { Auth } from 'aws-amplify';
import { StatusObject, LoginStatusObject } from './interfaces';
import { ensureUserInDB } from './loginSignup';
import { User } from './appState';


//sends email for user who forgot their password
export async function sendPasswordForgotEmail(emailOrUsername: string): Promise<StatusObject>{
    let returnObject = {
        message: "",
        status: true
    }
    try{
        await Auth.forgotPassword(emailOrUsername);
        //if we make it to this next time, Auth worked (correct email/username provided)
        returnObject.message = "Password reset email was sent successfully.";
        return returnObject;
    }
    catch(e){
        //email / username must have been incorrect. return this to client.
        let message: string = e.message;
        message = message.replace("client id", "email");

        returnObject.message = message;
        returnObject.status = false;
        return returnObject;
    }
}

//resets email of user who forgot their password
export async function forgotPasswordChange(emailOrUsername: string, verificationCode: string, newPassword: string): Promise<StatusObject>{
    let returnObject = {
        message: "",
        status: true
    }

    try{
        await Auth.forgotPasswordSubmit(emailOrUsername, verificationCode, newPassword);
        //if we make it here, password change succeeded.
        return returnObject;

    }
    catch(e){
        //password change failed.
        returnObject.message = e.message;
        returnObject.status = false;

        return returnObject;
    }
}

//function signs user in, ensures that they are also in the user database.
export async function signUserIn(emailOrUsername: string, password: string): Promise<LoginStatusObject>{
    let returnObject = {
        message: "",
        status: true,
        user: new User()
    }
    try{
        await Auth.signIn(emailOrUsername, password);
        //if we make it here, signin was successful.
        returnObject.user = await ensureUserInDB();

        return returnObject;

    }
    catch(e){
        //user could not be signed in.
        returnObject.message = e.message;
        returnObject.status = false;

        return returnObject;
    }
}

//function will resend the user's email verification code for account signup
export async function resendConfirmationCode(username: string): Promise<StatusObject>{
    let returnObject = {
        message: "",
        status: true
    }

    try{
        await Auth.resendSignUp(username);
        //if we don't throw exception, email resend was successful.
        return returnObject;
    }
    catch(e){
        //email resend failed.
        returnObject.message = e.message;
        returnObject.status = false;

        return returnObject;
    }
}

//function will confirm the user's email for their signup.
export async function confirmUserEmail(username: string, verificationCode: string): Promise<StatusObject>{
    let returnObject = {
        message: "",
        status: true
    }

    try{
        await Auth.confirmSignUp(username, verificationCode);
        //email confirmation was successful
        return returnObject;
    }
    catch(e){
        //email confirmation was unsuccessful

        returnObject.message = e.message;
        if(e.message.includes("cannot be confirm.")){
            returnObject.message = "User is already confirmed.";
        }
        returnObject.status = false;
        
        return returnObject;
    }
}

//function authenticates the current session based on browser tokens, returns whether user is logged in.
export async function checkUserLoggedIn(): Promise<LoginStatusObject>{
    let statusObject = {
        status: true,
        message: "",
        user: new User()
    }

    try{
        await Auth.currentSession();
        //if no exception thrown, there is user logged in currently.
        statusObject.user = await ensureUserInDB();
        return statusObject;
      }
      catch(e){
        //there is no user logged in currently.
        if(e !== "No current user"){
          alert(e);
        }

        statusObject.status = false;
        return statusObject;
      }
}

export async function logOut(){
    await Auth.signOut();
}

export async function confirmSignup(username: string, verificationCode: string): Promise<StatusObject>{
    let statusObject = {
        message: "",
        status: true
    }
    try{
        console.log(":: Authenticating user with username " + username + " and code " + verificationCode);

        await Auth.confirmSignUp(username, verificationCode);
        
        //no exception, confirmation successful
        return statusObject;
    }
    catch(e){
        //signup failed
        statusObject.message = e.message;
        statusObject.status = false;

        return statusObject;
    }
}