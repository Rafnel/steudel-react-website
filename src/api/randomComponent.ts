import { API } from "aws-amplify";
import { globalState } from "../stateStores/appState";

export default async function getRandomComponent(){
    try{
        console.log(":: Retrieving random swim component...");
        let jsonComponent = await API.get("swimComponents", "/components/random", null);
        globalState.appState.isLoading = false;
        console.log(":: component retrieved.");

        return jsonComponent;
    }
    catch(e){
        alert(e);
        console.log(e.message);
        return null;
    }
}