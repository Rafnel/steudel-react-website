import { observable, action } from "mobx";



export default class AddFolderModalStateStore{
    @observable open: boolean = false;
}