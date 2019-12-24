import { API } from "aws-amplify";

export default async function getComponentByID(username: string, id: string){
    try{
        let jsonComponent = await API.get("swimComponents", `/components/${username}/${id}`, null);

        return jsonComponent;
    }
    catch(e){
        console.log(e.message);
        return null;
    }
}