import React from 'react';
import {
  BrowserRouter as Router,
  Switch, Route, NavLink
} from "react-router-dom";
import API from './API';
import Today from './components/Today';
import Week from './components/Week';
import './App.css';

class App extends React.Component {
  api = new API();
  timeout;

  constructor(){
    super();
    this.state = {
      loading: false,
      locationQuery: 'Moscow',
      locationFound: true,
      locationID: 2122265
    };
  }

  onLocationChange(e){
    this.setState({locationQuery: e.target.value});
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({loading: true});
      this.api.getLocation(this.state.locationQuery).then(data => {
        const locationFound = !!data[0];
        const locationID = locationFound ? data[0].woeid : 0;
        const locationQuery = locationFound ? data[0].title : this.state.locationQuery;
        this.setState({loading: false, locationQuery, locationFound, locationID});
      });
    }, 500);
  }

  render(){
    const tabs = [
      {id: 'today', label: 'Today', cmp: <Today api={this.api} locationID={this.state.locationID} />},
      {id: 'week', label: 'Week', cmp: <Week api={this.api} locationID={this.state.locationID} />}
    ];
    const queryState = !this.state.locationFound ? 'invalid' : '';
    return (
      <Router>
        <input type="text" className={"locationQuery " + queryState} value={this.state.locationQuery} 
          onChange={e => this.onLocationChange(e)} disabled={this.state.loading} />
        <nav>
          <ul>
            {tabs.map(tab => 
              <li key={tab.id}><NavLink to={'/' + tab.id} activeClassName="selected">{tab.label}</NavLink></li>
            )}
          </ul>
        </nav>
        {this.state.loading ? 
          <div className="state">Loading...</div> : 
          <Switch>
            {tabs.map(tab => 
              <Route key={tab.id} path={'/' + tab.id}>{tab.cmp}</Route>
            )}
          </Switch>
        }
      </Router>
    );
  }
}

export default App;
