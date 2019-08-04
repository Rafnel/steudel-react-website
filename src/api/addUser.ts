import { API } from "aws-amplify";

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