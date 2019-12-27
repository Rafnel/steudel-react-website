import { API } from "aws-amplify";
import { SwimWorkout } from "../configuration/appState";

//adds a swim workout
export default async function createSwimWorkout(swimWorkout: SwimWorkout){
    try{
        console.log(":: adding workout from user" + swimWorkout.username + " to db...");
        const result = await API.post("swimWorkouts", "/workouts", {
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
        console.log(JSON.stringify(result));
        return result;
    }
    catch(e){
        console.log(e.message);
        return false;
    }
}