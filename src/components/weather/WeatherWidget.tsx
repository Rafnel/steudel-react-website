import React from 'react';
import { WeatherStore } from '../../containers/WeatherPage';
import {Card} from 'primereact/card';
import { observer } from 'mobx-react';
import {ProgressSpinner} from 'primereact/progressspinner';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Message } from 'primereact/components/message/Message';
import {GMap} from 'primereact/gmap';
import "./WeatherWidget.css";

export interface WeatherWidgetProps{
    weatherStore: WeatherStore;
}

@observer
export class WeatherWidget extends React.Component<WeatherWidgetProps>{
    render(){
        if(this.props.weatherStore.loading){
            return (
                <div>
                    <Card>
                        <ProgressSpinner style = {{width: "50px", height: "50px"}} strokeWidth = "6"/>
                    </Card>
                </div>
            )
        }
        else if(this.props.weatherStore.errorMessage.length > 0){
            return (
                <div>
                    <Card>
                        <Message
                            severity = "error"
                            text = {this.props.weatherStore.errorMessage}
                        >
                        </Message>
                    </Card>
                </div>
            )                
        }
        else{
            const options: any = {
                center: {lat: this.props.weatherStore.latitude, lng: this.props.weatherStore.longitude},
                zoom: 12
            };
            return (
                <div className = "weatherCard">
                    <Card title = {this.props.weatherStore.submittedCity + " Weather"} >
                        <p>Temperature: {this.props.weatherStore.temperature} &deg; Fahrenheit</p>
                        <p>Humidity: {this.props.weatherStore.humidity}</p>
                        <p>Conditions: {this.props.weatherStore.weather}</p>

                        <GMap 
                            options = {options}
                            style={{width: '100%', minHeight: '320px'}}
                        >

                        </GMap>
                    </Card>
                </div>
            )
        }
    }
}