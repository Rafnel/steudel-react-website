import { API } from "aws-amplify";

//adds a (most likely) new user to the user_table
export default async function addUser(username: String){
    try{
        console.log(":: adding user " + username + " to db...");
        await API.post("users", "/users", {
            body: {
                username: username
            }
        });
        console.log(":: user " + username + " added successfully to db.")
    }
    catch(e){
        console.log(e.message);
        alert(e);
        return null;
    }
}