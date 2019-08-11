import React, { Component } from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import "./WeatherPage.css";
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { WeatherWidget } from "../components/weather/WeatherWidget";
import { WeatherHeader } from "../components/weather/WeatherHeader";




export class WeatherStore{
  @observable city: string = "";
  @observable loading: boolean = false;
  @observable submitted: boolean = false;
  @observable longitude: string = "";
  @observable latitude: string = "";
  @observable weather: string = "";
  @observable weatherDescription: string = "";
  @observable weatherIcon: string = "";
  @observable temperature: string = "";
  @observable humidity: string = "";
  @observable submittedCity: string = "";
  @observable errorMessage: string = "";
}

interface WeatherPageProps{

}
interface WeatherPageState{
  weatherStore: WeatherStore;
}

@observer
export default class Home extends Component<WeatherPageProps, WeatherPageState> {
  constructor(props: WeatherPageProps){
    super(props);

    this.state = {
      weatherStore: new WeatherStore()
    }
  }
  
  render() {
    return (
      <div className="Home">
        <div>
          <WeatherHeader weatherStore = {this.state.weatherStore}> </WeatherHeader>

          &nbsp;&nbsp;&nbsp;

          {this.state.weatherStore.submitted ? <WeatherWidget weatherStore = {this.state.weatherStore}/> : null}
        </div>
      </div>
    );
  }
}
