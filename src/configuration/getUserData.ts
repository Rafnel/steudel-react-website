import { globalState } from "./appState";
import getAllWorkoutsFromUser from "../api/getAllWorkoutsFromUser";

export async function getLoggedInUserWorkouts(){
    globalState.appState.isLoading = true;
    globalState.mySwimWorkouts = await getAllWorkoutsFromUser(globalState.appState.currentUser.username);
    globalState.appState.isLoading = false;
}