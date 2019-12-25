import { API } from "aws-amplify";

//gets all user swim folders
export default async function getSwimFoldersOfUser(owner_username: string){
    try{
        console.log(":: Retrieving swim folders from " + owner_username);
        let jsonfolders = await API.post("swimFolders", `/folders/user`, {
            body: {
                owner_username: owner_username
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