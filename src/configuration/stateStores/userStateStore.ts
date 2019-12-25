import { observable, action } from "mobx";
import { User, SwimWorkout, SwimComponent, SwimFolder } from "../appState";



export default class UserStateStore{
    @observable email: string = "";
    @observable name: string = "";

    @observable currentUser: User = {
        username: "",
        liked_components: [],
        liked_workouts: []
    }

    //swim workouts that the user has created
    @observable mySwimWorkouts: SwimWorkout[] = [];
    @observable mySwimComponents: SwimComponent[] = [];
    @observable mySwimFolders: SwimFolder[] = [];

    //workouts/folders in the current page the user is on.
    @observable currentDirFolders: SwimFolder[] = [];
    @observable currentDirWorkouts: SwimWorkout[] = [];
    @observable currentFolder: SwimFolder = new SwimFolder();
    @observable childFoldersOfCurrent: SwimFolder[] = [];

    @observable needToUpdateFolders: boolean = true;
    @observable needToUpdateSwimWorkouts: boolean = true;
    @observable needToUpdateSwimComponents: boolean = true;

    @action resetState(){
        this.email = "";
        this.currentUser = new User();
        this.name = "";
    }
}