import { API } from "aws-amplify";
import { SwimComponent, globalState } from "../configuration/appState";

//increments / decrements the amount of likes for a component 
export default async function updateComponentLikes(swimComponent: SwimComponent, value: number){
    try{
        console.log(":: value " + value + " to be added to the like count for component " + swimComponent.component_id);
        await API.post("swimComponents", "/components/update/likes", {
            body: {
                component_id: swimComponent.component_id,
                username: swimComponent.username,
                value: value
            }
        });
        globalState.appState.isLoading = false;
        console.log(":: value add successful for component " + swimComponent.component_id + " with body " + swimComponent.component_body);
    }
    catch(e){
        alert(e);
        console.log(e.message);
        return null;
    }
}