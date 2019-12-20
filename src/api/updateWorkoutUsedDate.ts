import { API } from "aws-amplify";
import { SwimComponent } from "../configuration/appState";

//updates the "last_used" value on the workout to right now.
export default async function updateLastUsed(workout_id: string, username: string){
    try{
        await API.post("swimWorkouts", "/workout/update/date", {
            body: {
                workout_id: workout_id,
                username: username
            }
        });
        console.log(":: Successfully updated the last used date for the workout.");
    }
    catch(e){
        alert(e);
        console.log(JSON.stringify(e));
        return null;
    }
}