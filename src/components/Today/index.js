import React from 'react';
import { weatherProviderHost } from '../../urls';
import './main.css';

class Today extends React.Component {
    constructor(){
        super();
        this.state = {
            loading: false,
            data: []
        };
    }

    getWeather(){
        this.setState({loading: true});
        this.props.api.getWeather(this.props.locationID, 'today').then(data => {
            this.setState({loading: false, data: data});
        });
    }

    componentDidMount(){
        this.getWeather();
    }

    componentDidUpdate(prevProps){
        if (this.props.locationID !== prevProps.locationID) {
            this.getWeather();
        }
    }

    render(){
        var days = this.state.data || [];
        var day = days[0] || {};
        var imgSrc = weatherProviderHost + '/static/img/weather/' + day.weather_state_abbr + '.svg';
        var img = <img src={imgSrc} alt={day.weather_state_name} className="weatherImage" key="wi" />;
        var todayTemp = <h1 className="todayTemp" key="tt">{parseInt(day.the_temp) + '°'}</h1>;
        return this.state.loading ? 
            <div className="state">Loading...</div> : 
            (days.length ? 
                [img, todayTemp] : 
                <div className="state">No data</div>);
    }
}

export default Today;
