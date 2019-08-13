import { API } from "aws-amplify";
import { globalState } from "../configuration/appState";

//sets the currentUser in the appState variable.
export default async function getUser(username: string){
    try{
        console.log(":: retrieving user " + username + " from user_table.");
        let jsonUser = await API.get("users", `/user/${username}`, null);
        globalState.appState.currentUser = jsonUser;
        console.log(":: retrieved user " + username + " successfully.");
    }
    catch(e){
        console.log(":: User " + username + " did not exist in db");
        return null;
    }
}