import { API } from "aws-amplify";

export default async function getSwimFolder(owner_username: string, folder_name: string){
    try{
        console.log(":: Retrieving swim folder from " + owner_username + " with name " + folder_name);
        let jsonfolders = await API.post("swimFolders", `/folders/get-workouts`, {
            body: {
                owner_username: owner_username,
                folder_name: folder_name
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