import { API } from "aws-amplify";
import { globalState } from "../configuration/appState";

//gets all workouts created by the user specified
export default async function getAllWorkoutsFromUser(username: string){
    try{
        let swimWorkouts = await API.post("swimWorkouts", "/workouts/user", {
            body: {
                username: username
            }
        });
        console.log("Successfully received user " + username + "'s workouts, of size " + swimWorkouts.length);
        return swimWorkouts;
    }
    catch(e){
        console.log(":: User " + username + " did not exist in db");
        return null;
    }
}