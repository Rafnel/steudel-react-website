import React, { Component } from "react";
import "./HomePage.css";
import { Typography } from "@material-ui/core";


export class HomePage extends React.Component{
    
    render(){
        return(
            <div>
                <div className = "header">
                    <Typography variant = "h2" gutterBottom>
                        <p className = "title">Rafnel</p>
                    </Typography>
                    <Typography variant = "h5" gutterBottom>
                        <p className = "subtitle">Component-Based Workouts</p>
                    </Typography>
                </div>
            </div>
        )
    }
}