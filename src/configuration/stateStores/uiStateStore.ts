import { observable, action } from "mobx";



export default class UIStateStore{
    @observable successMessage: string = "";
    @observable errorMessage: string = "";

    @action setSuccessMessage(message: string){
        this.successMessage = message;
    }

    @action setErrorMessage(message: string){
        this.errorMessage = message;
    }
}