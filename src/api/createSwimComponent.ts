import { SwimComponent } from './../configuration/appState';
import { API } from "aws-amplify";
import { emptySwimComponent, swimComponentToString } from "../configuration/appState";

//adds a swim component
export default async function createSwimComponent(swimComponent: SwimComponent){
    try{
        console.log(":: adding component " + swimComponent.component_body + " to db...");
        console.log(":: Component: " + swimComponentToString(swimComponent));
        let component = await API.post("swimComponents", "/components", {
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

        //return the newly created component from the db
        let sComp: SwimComponent = component;
        return sComp;
    }
    catch(e){
        console.log(e.message);
        alert(e);
        return emptySwimComponent();
    }
}