import React from "react";
import { Drawer, Typography, Button } from "@material-ui/core";
import { MainStore } from "../App";
import { Link } from 'react-router-dom';
import { observer } from "mobx-react";
import Routes from "../Routes";

export interface NavBarProps{
    mainStore: MainStore;
}

@observer
export class NavBar extends React.Component<NavBarProps>{
    render(){
        return(
        <Drawer
            className = "navBar"
            open = {this.props.mainStore.navBarVisible}
            onClose = {() => this.props.mainStore.navBarVisible = false}
        >
            <Typography variant = "h6" gutterBottom>
                &nbsp;&nbsp;Rafnel Navigation&nbsp;&nbsp;
            </Typography>
            
            
            <Button 
                className = "weatherButton"
                size = "medium" 
            >
                <Typography variant = "button" display = "block">
                    Weather
                </Typography>
                <Link to = "/weather"></Link>
            </Button>
            
        </Drawer>
        )
    }
}