import { formatDate } from './utils';
import { weatherProviderHost } from './urls';

export default class API {
    cache = {};
    useLocalStorageCache = false;

    storeToCache(query, res){
        this.useLocalStorageCache ? localStorage.setItem('query:' + query, JSON.stringify(res)) : this.cache[query] = res;
    }

    restoreFromCache(query){
        return this.useLocalStorageCache ? JSON.parse(localStorage.getItem('query:' + query)) : this.cache[query];
    }

    getLocation(city){
        const query = 'search/?query=' + city;
        return this.sendRequest(query);
    }

    getWeather(locationID, period){
        const date = formatDate(new Date());
        const query = locationID + (period === 'today' ? '/' + date : ''); 
        return this.sendRequest(query);
    }

    sendRequest(query){
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const api = weatherProviderHost + '/api/location/';
        return new Promise((resolve, reject) => {
            const cachedRes = this.restoreFromCache(query);
            if (cachedRes){
                resolve(cachedRes);
                return;
            }
            const url = proxy + api + query;
            fetch(url)
                .then(res => 
                    res.status === 200 ? res.json() : {status: res.status}
                )
                .then(res => {
                    this.storeToCache(query, res);
                    resolve(res);
                })
                .catch(err => { 
                    console.error(err);
                    reject(err);
                });
        });
    }
}