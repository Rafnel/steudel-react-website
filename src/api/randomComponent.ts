import { API } from "aws-amplify";
import AppStateStore from "../stateStores/appState";

export default async function getRandomComponent(appState: AppStateStore){
    try{
        let jsonComponent = await API.get("swimComponents", "/components/random", null);
        appState.currentComponent = jsonComponent;
        appState.isLoading = false;
    }
    catch(e){
        alert(e);
        return null;
    }
}