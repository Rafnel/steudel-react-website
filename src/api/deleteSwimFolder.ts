import { API } from "aws-amplify";

//deletes existing folder from db.
export default async function deleteSwimFolder(owner_username: string, folder_name: string){
    try{
        console.log(":: deleting folder " + folder_name + " from db...");
        const result = await API.post("swimFolders", "/folders/delete", {
            body: {
                owner_username: owner_username,
                folder_name: folder_name,
            }
        });
        console.log(":: folder " + folder_name + " deleted successfully from db.");
        return true;
    }
    catch(e){
        console.log(e.message);
        return false;
    }
}