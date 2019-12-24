import { API } from "aws-amplify";

//adds a new folder to the database for this user
export default async function addNewSwimFolder(owner_username: string, folder_name: string, parent: string){
    try{
        console.log(":: adding folder " + folder_name + " to db...");
        const result = await API.post("swimFolders", "/folders", {
            body: {
                owner_username: owner_username,
                folder_name: folder_name,
                parent: parent
            }
        });
        console.log(":: folder " + folder_name + " added successfully to db.");
        console.log(JSON.stringify(result));
        return result;
    }
    catch(e){
        console.log(e.message);
        return null;
    }
}