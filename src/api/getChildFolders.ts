import { API } from "aws-amplify";

export default async function getChildFolders(owner_username: string, parent: string){
    try{
        console.log(":: Retrieving swim folder from " + owner_username + " with parent " + parent);
        let jsonfolders = await API.post("swimFolders", `/folders/get-parent`, {
            body: {
                owner_username: owner_username,
                parent: parent
            }
        });
        console.log(JSON.stringify(jsonfolders));

        return jsonfolders;
    }
    catch(e){
        console.log(e.message);
        return null;
    }
}