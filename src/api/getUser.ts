import { API } from "aws-amplify";
import { globalState } from "../stateStores/appState";

//sets the currentUser in the appState variable.
export default async function getUser(username: string){
    try{
        let jsonUser = await API.get("users", `/user/${username}`, null);
        globalState.appState.currentUser = jsonUser;
    }
    catch(e){
        console.log(":: User " + username + " did not exist in db");
        return null;
    }
}