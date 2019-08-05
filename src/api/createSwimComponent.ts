import { API } from "aws-amplify";
import { SwimComponent } from "../stateStores/appState";

//adds a swim component
export default async function createSwimComponent(swimComponent: SwimComponent){
    try{
        console.log(":: adding component " + swimComponent.component_body + " to db...");
        await API.post("swimComponents", "/components", {
            body: {
                username: swimComponent.username,
                component_body: swimComponent.component_body,
                yardage: swimComponent.yardage,
                tags: swimComponent.tags,
                intervals: swimComponent.intervals,
                difficulty: swimComponent.difficulty,
                set: swimComponent.set
            }
        });
        console.log(":: component " + swimComponent.component_body + " added successfully to db.")
    }
    catch(e){
        console.log(e.message);
        alert(e);
        return null;
    }
}