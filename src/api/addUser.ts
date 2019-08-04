import { API } from "aws-amplify";

//adds a (most likely) new user to the user_table
export default async function addUser(username: String){
    try{
        await API.post("users", "/users", {
            body: {
                username: username
            }
        });
    }
    catch(e){
        console.log(e.message);
        alert(e);
        return null;
    }
}