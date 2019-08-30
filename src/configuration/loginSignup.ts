import Amplify, { Auth } from "aws-amplify";
import config from "./config";
import { globalState } from "./appState";
import getUser from "../api/getUser";
import addUser from "../api/addUser";

Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    API: {
      endpoints:[
        {
          name: "swimComponents",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
        {
          name: "users",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
        {
          name: "swimWorkouts",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        }
      ]
    }
});

//validates the user's password when signing up / changing password. Must be same as the confirm password field.
export function validatePassword(password: string, confirmPassword: string): boolean{
    if(password.length === 0 || confirmPassword.length === 0){
        globalState.appState.errorMessage = "Password fields must not be empty.";
        return false;
    }
    
    if(password !== confirmPassword){
        globalState.appState.errorMessage = "Passwords must match.";
        return false;
    }

    if(password.length < 8){
        globalState.appState.errorMessage = "Password must be 8 characters or greater.";
        return false;
    }

    return true;
}

//validates the user's email verification code.
export function validateVerificationCode(): boolean{
    if(globalState.appState.verificationCode.length === 0){
        globalState.appState.errorMessage = "Verification code field must not be empty.";
        return false;
    }

    return true;
}

//function will ensure that the logged in user is in the database, and will then get the user info.
export async function ensureUserInDB(){
    const currentUserInfo = await Auth.currentUserInfo();
    globalState.appState.username = currentUserInfo.username;
    //check if user is in db, if not, they slipped through cracks and we must add them.
    await getUser(globalState.appState.username);
    
    if(globalState.appState.currentUser.username === ""){
        //user doesn't exist in the db. Add them, then populate our currentUser value.
        await addUser(globalState.appState.username);
        await getUser(globalState.appState.username);
    }

    console.log(":: User " + globalState.appState.currentUser.username + " logged in with liked components " + globalState.appState.currentUser.liked_components);
}