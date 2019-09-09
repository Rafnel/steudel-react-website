import { API } from "aws-amplify";

//gets all swim components created by the user specified
export default async function getAllComponentsFromUser(username: string){
    try{
        let swimComponents = await API.post("swimComponents", "/components/user", {
            body: {
                username: username
            }
        });
        console.log("Successfully received user " + username + "'s components, of size " + swimComponents.length);
        return swimComponents;
    }
    catch(e){
        console.log(":: User " + username + " did not exist in db");
        return null;
    }
}