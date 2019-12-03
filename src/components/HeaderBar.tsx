import { AppBar, Toolbar } from "@material-ui/core";
import { Auth } from "aws-amplify";
import { observer } from "mobx-react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { globalState, resetState } from "../configuration/appState";
import CreateButton from "./buttons/CreateButton";
import HomeButton from "./buttons/HomeButton";
import WeatherButton from "./buttons/WeatherButton";
import ExploreButton from "./buttons/ExploreButton";
import AccountButton from "./buttons/AccountButton";
import QuestionButton from "./buttons/QuestionButton";


@observer
class HeaderBar extends React.Component<RouteComponentProps<any>>{
    handleLogout = async (event: any) => {
        await Auth.signOut();

        resetState();
    
        //reset the app's state since the user logged out.
        globalState.appState.successMessage = "Logged out successfully.";
        this.props.history.push("/login");
        
    }
    
    render(){
        return(
            <AppBar position = "sticky">
                <Toolbar>
                    <HomeButton/>

                    {globalState.appState.isLoggedIn && <ExploreButton/>}

                    {globalState.appState.isLoggedIn && <CreateButton/>}

                    <span style = {{marginLeft: "auto", marginRight: -12}}>
                        <AccountButton/>
                        <WeatherButton/>
                        <QuestionButton/>
                    </span>
                </Toolbar>
            </AppBar>
        )
    }
}

export default withRouter<RouteComponentProps<any>, any>(HeaderBar);
