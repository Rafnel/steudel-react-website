import { globalState } from "./appState";
import getAllWorkoutsFromUser from "../api/getAllWorkoutsFromUser";
import getAllComponentsFromUser from "../api/getAllComponentsFromUser";

export async function getLoggedInUserWorkouts(){
    if(globalState.needToUpdateSwimWorkouts){
        globalState.mySwimWorkouts = await getAllWorkoutsFromUser(globalState.appState.currentUser.username);
        globalState.needToUpdateSwimWorkouts = false;
    }
}

export async function getLoggedInUserComponents(){
    if(globalState.needToUpdateSwimComponents){
        globalState.mySwimComponents = await getAllComponentsFromUser(globalState.appState.currentUser.username);
        globalState.needToUpdateSwimComponents = false;
    }
}