import { API } from "aws-amplify";
import { globalState } from "../stateStores/appState";
import winston from "../logging";

export default async function getUser(username: string){
    try{
        let jsonUser = await API.get("users", `/user/${username}`, null);
        globalState.appState.currentUser = jsonUser;
    }
    catch(e){
        console.log(":: User " + username + " did not exist in db");
        winston.info(":: User " + username + " did not exist in user_table, hopefully they will be added.");
        return null;
    }
}