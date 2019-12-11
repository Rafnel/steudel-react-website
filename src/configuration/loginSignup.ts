import Amplify, { Auth } from "aws-amplify";
import config from "./config";
import { User } from "./appState";
import getUser from "../api/getUser";
import addUser from "../api/addUser";
import { StatusObject } from "./interfaces";

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
export function validatePassword(password: string, confirmPassword: string): StatusObject{
  let statusObject = {
    message: "",
    status: true
  }

  if(password.length === 0 || confirmPassword.length === 0){
      statusObject.message = "Password fields must not be empty.";
      statusObject.status = false;
  }
  else if(password !== confirmPassword){
      statusObject.message = "Passwords must match.";
      statusObject.status = false;
  }
  else if(password.length < 8){
      statusObject.message = "Password must be 8 characters or greater.";
      statusObject.status = false;
  }

  return statusObject;
}

//validates the user's email verification code.
export function validateVerificationCode(verificationCode: string): StatusObject{
  let statusObject = {
    message: "",
    status: true
  }

  if(verificationCode.length === 0){
      statusObject.message = "Verification code field must not be empty.";
      statusObject.status = false;
  }

  return statusObject;
}

//function will ensure that the logged in user is in the database, and will then get the user info.
export async function ensureUserInDB(): Promise<User>{
    const currentUserInfo = await Auth.currentUserInfo();
    let username = currentUserInfo.username;
    //check if user is in db, if not, they slipped through cracks and we must add them.
    let user = await getUser(username);
    
    if(user.username === ""){
        //user doesn't exist in the db. Add them, then populate our currentUser value.
        await addUser(username);
        user = await getUser(username);
    }

    console.log(":: User " + user.username + " logged in with liked components " + user.liked_components);
    return user;
}