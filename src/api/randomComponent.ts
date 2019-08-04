import { API } from "aws-amplify";
import { globalState } from "../stateStores/appState";

export default async function getRandomComponent(){
    try{
        let jsonComponent = await API.get("swimComponents", "/components/random", null);
        globalState.appState.currentComponent = jsonComponent;
        globalState.appState.isLoading = false;
    }
    catch(e){
        alert(e);
        return null;
    }
}