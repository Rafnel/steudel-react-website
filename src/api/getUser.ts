import { API } from "aws-amplify";
import { User } from "../configuration/appState";

//updated
//returns the user with <username> in the form of a User object.
export default async function getUser(username: string): Promise<User>{
    try{
        console.log(":: retrieving user " + username + " from user_table.");
        let jsonUser = await API.get("users", `/user/${username}`, null);
        console.log(":: retrieved user " + username + " successfully.");
        return jsonUser;
    }
    catch(e){
        console.log(":: User " + username + " did not exist in db");
        return new User();
    }
}