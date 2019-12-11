import { API } from "aws-amplify";

export default async function getRandomComponent(){
    try{
        console.log(":: Retrieving random swim component...");
        let jsonComponent = await API.get("swimComponents", "/components/random", null);
        console.log(":: component retrieved.");

        return jsonComponent;
    }
    catch(e){
        alert(e);
        console.log(e.message);
        return null;
    }
}