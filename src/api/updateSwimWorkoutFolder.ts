import { SwimFolder } from './../configuration/appState';
import { API } from "aws-amplify";
import { SwimWorkout } from "../configuration/appState";

//edits a swim workout folder
export default async function updateSwimWorkoutFolder(folder: SwimFolder){
    try{
        console.log(":: updating folder...");
        await API.post("swimFolders", "/folders/update", {
            body: {
                owner_username: folder.owner_username,
                folder_name: folder.folder_name,
                workouts: folder.workouts
            }
        });
        console.log(":: folder updated.");
        return true;
    }
    catch(e){
        console.log(e.message);
        return false;
    }
}