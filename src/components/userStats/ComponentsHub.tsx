import { Typography, Grid, Divider, Button } from "@material-ui/core";
import React, { Fragment } from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import getAllComponentsFromUser from "../../api/getAllComponentsFromUser";
import { globalState } from "../../configuration/appState";
import { PRIMARY } from "../..";
import BeatLoader from 'react-spinners/BeatLoader';
import { RouteComponentProps, withRouter } from "react-router";

@observer
class ComponentsHub extends React.Component<RouteComponentProps<any>>{
    @observable loadingComponents: boolean = true;
    @observable components: any[] = [];

    async getComponents(){
        this.components = await getAllComponentsFromUser(globalState.appState.currentUser.username);
        if(this.components === null){
            this.components = [];
        }
        this.loadingComponents = false;
    }

    render(){
        return(
            <Fragment>
                <Grid container justify = "center" alignItems = "center" spacing = {2} direction = "column">
                    <Grid item>
                        <Typography variant = "h4">
                            Components
                        </Typography>
                    </Grid>

                    {this.loadingComponents && <BeatLoader color = {PRIMARY}/>}

                    {!this.loadingComponents
                     &&
                     <Grid item>
                         <Typography>
                            Swim components you have created: {this.components.length}
                        </Typography>
                     </Grid>
                    }
                    
                </Grid>  

                <Divider/>
            </Fragment>
        )
    }

    componentDidMount(){
        this.getComponents();
    }
}

export default withRouter<RouteComponentProps<any>, any>(ComponentsHub);