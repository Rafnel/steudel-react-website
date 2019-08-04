import { API } from "aws-amplify";
import { User } from "../stateStores/appState";

export default async function updateUser(user: User){
    try{
        console.log(":: Attempting to update user: " + user.username + " with liked components: " + user.liked_components);
        await API.post("users", "/users/update", {
            body: {
                liked_components: user.liked_components,
                username: user.username,
                liked_workouts: user.liked_workouts
            }
        });
    }
    catch(e){
        alert(e);
        return null;
    }
}