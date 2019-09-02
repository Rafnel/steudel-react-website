import { API } from "aws-amplify";

export default async function getComponentByID(username: string, id: string){
    try{
        console.log(":: Retrieving swim component from " + username + " with id " + id);
        let jsonComponent = await API.get("swimComponents", `/components/${username}/${id}`, null);
        console.log(":: component retrieved.");

        return jsonComponent;
    }
    catch(e){
        alert(e);
        console.log(e.message);
        return null;
    }
}