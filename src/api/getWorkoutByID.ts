import { API } from "aws-amplify";

export default async function getWorkoutByID(username: string, id: string){
    try{
        console.log(":: Retrieving swim workout from " + username + " with id " + id);
        let jsonWorkout = await API.get("swimWorkouts", `/workouts/${username}/${id}`, null);
        console.log(":: Workout retrieved.");

        return jsonWorkout;
    }
    catch(e){
        console.log(e.message);
        return null;
    }
}