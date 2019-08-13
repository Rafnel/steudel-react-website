import { API } from "aws-amplify";
import { SwimWorkout, globalState } from "../configuration/appState";

//adds a swim workout
export default async function createSwimWorkout(swimWorkout: SwimWorkout): Promise<boolean>{
    try{
        console.log(":: adding workout from user" + swimWorkout.username + " to db...");
        await API.post("swimWorkouts", "/workouts", {
            body: {
                username: swimWorkout.username,
                warmup: swimWorkout.warmup,
                preset: swimWorkout.preset,
                mainset: swimWorkout.mainset,
                cooldown: swimWorkout.cooldown,
                difficulty: swimWorkout.difficulty,
                yardage: swimWorkout.yardage
            }
        });
        console.log(":: workout from user " + swimWorkout.username + " added successfully to db.");
        return true;
    }
    catch(e){
        console.log(e.message);
        globalState.appState.errorMessage = e.message;
        return false;
    }
}