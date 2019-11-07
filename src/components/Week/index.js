import React from 'react';
import { weatherProviderHost } from '../../urls';
import { parseDate, getDayOfWeekName } from '../../utils';
import './main.css';

class Week extends React.Component {
    constructor(){
        super();
        this.state = {
            loading: false,
            data: {}
        };
    }

    getWeather(){
        this.setState({loading: true});
        this.props.api.getWeather(this.props.locationID, 'week').then(data => {
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

    mapWeatherAbbrToRowClass(abbr){
        switch (abbr) {
            case 'sn': 
            case 'sl': 
            case 'h': 
                return 'snowy';
            case 't':  
            case 'hr': 
            case 'lr': 
            case 's': 
                return 'rainy';
            case 'hc': 
            case 'lc': 
                return 'cloudy';
            case 'c': 
                return 'sunny';
            default:
                return '';
        }
    }

    render(){
        var days = this.state.data.consolidated_weather || [];
        var rows = days.map(day => {
            var imgSrc = weatherProviderHost + '/static/img/weather/' + day.weather_state_abbr + '.svg';
            var rowClass = this.mapWeatherAbbrToRowClass(day.weather_state_abbr);
            var date = parseDate(day.applicable_date);
            var dayOfWeek = getDayOfWeekName(date);
            return <tr key={day.applicable_date} className={rowClass}>
                <td className="date">{day.applicable_date}, {dayOfWeek}</td>
                <td>{parseInt(day.the_temp) + '°'}</td>
                <td className="weatherIcon"><img src={imgSrc} alt={day.weather_state_name} /></td>
            </tr>
        });
        return this.state.loading ? 
            <div className="state">Loading...</div> : 
            (days.length ? 
                <table className="week"><tbody>{rows}</tbody></table> : 
                <div className="state">No data</div>);
    }
}

export default Week;
