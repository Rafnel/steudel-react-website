import { API } from "aws-amplify";
import { SwimComponent } from "../configuration/appState";

//gets a list of sorted swim components by set, sorted by likes from most to least.
export default async function getSortedSwimComponentsBySet(set: string){
    try{
        console.log(":: set " + set + " to be queried for");
        let jsonList = await API.post("swimComponents", "/components/set", {
            body: {
                set: set
            }
        });
        let components: SwimComponent[] = jsonList;
        console.log(":: set list for " + set + " with length: " + components.length);

        return components;
    }
    catch(e){
        alert(e);
        console.log(e.message);
        return [];
    }
}