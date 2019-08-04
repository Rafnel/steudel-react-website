import { API } from "aws-amplify";
import { SwimComponent, globalState } from "../stateStores/appState";

export default async function updateComponentLikes(swimComponent: SwimComponent, value: number){
    try{
        await API.post("swimComponents", "/components/update/likes", {
            body: {
                component_id: swimComponent.component_id,
                username: swimComponent.username,
                value: value
            }
        });
        globalState.appState.isLoading = false;
    }
    catch(e){
        alert(e);
        return null;
    }
}