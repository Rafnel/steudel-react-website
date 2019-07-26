import React from "react";
import { WeatherStore } from "../containers/WeatherPage";
import { observer } from "mobx-react";
import "./WeatherHeader.css";
import { TextField, Typography, Button, Grid } from "@material-ui/core";
let unirest = require("unirest");

export interface WeatherHeaderProps{
    weatherStore: WeatherStore;
}

@observer
export class WeatherHeader extends React.Component<WeatherHeaderProps>{
    render(){
        return(
            <div className = "weatherHeader">
                <Typography variant = "h6">
                    <p className = "helperText">Enter a city to see the weather:</p>
                </Typography>

                &nbsp;&nbsp;

                <Grid className = "inputStuff" container direction = "row" justify = "center" alignItems = "center">
                    <Grid item >
                        <TextField className = "input"
                            value = {this.props.weatherStore.city} 
                            onChange = {event => this.props.weatherStore.city = (event.target as HTMLInputElement).value}
                            name = "city"
                            type = "city"
                            margin = "dense"
                            variant = "outlined"
                            label = "City"
                        >
                        </TextField>          
                    </Grid>
                    
                    &nbsp;&nbsp;&nbsp;
                    <Grid item >
                        <Button 
                            className = "submitButton"
                            color = "primary"
                            variant = "contained" 
                            onClick = {event => {
                                if(this.props.weatherStore.city.length !== 0){
                                    this.props.weatherStore.errorMessage = "";
                                    this.props.weatherStore.submitted = true;
                                    this.props.weatherStore.loading = true;
                                    this.getWeather(this.props.weatherStore.city, this.setWeatherData.bind(this))
                                }
                            }}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </div>
            
        )
    }

    getWeather(city: string, callback: Function){
        unirest.get("https://community-open-weather-map.p.rapidapi.com/weather?&units=%22metric%22+or+%22imperial%22&mode=xml%2C+html&q=" + city)
        .header("X-RapidAPI-Host", "community-open-weather-map.p.rapidapi.com")
        .header("X-RapidAPI-Key", "94079240b5msh6143d0960824ebbp18b9fdjsn4344bcdb5cd0")
        .end((response: any) =>{
            console.log(response.body);
            if(response.status === 404){
              console.log(":: Error: city name of " + city + ", result: " + response.status);
              this.props.weatherStore.errorMessage = "Please enter a valid location.";
              this.props.weatherStore.loading = false;
            }
            else{
              let data: string = JSON.stringify(response.body);
              callback(data);
            }
        });
      }
    
      setWeatherData(weatherData: string){
        console.log(":: Weather data is " + weatherData);
        let weather: any = JSON.parse(weatherData);
    
        this.props.weatherStore.city = weather.name;
        this.props.weatherStore.submittedCity = this.props.weatherStore.city;
        this.props.weatherStore.latitude = weather.coord.lat;
        this.props.weatherStore.longitude = weather.coord.lon;
        this.props.weatherStore.weather = weather.weather[0].main;
        this.props.weatherStore.weatherDescription = weather.weather[0].description;
        this.props.weatherStore.weatherIcon = weather.weather[0].icon;
    
        let temp: number = (weather.main.temp - 273.15) * 9/5 + 32;
        this.props.weatherStore.temperature = temp.toFixed(0);
    
        this.props.weatherStore.humidity = weather.main.humidity + "%";
        this.props.weatherStore.loading = false;
      }
}