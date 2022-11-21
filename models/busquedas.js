const fs = require('fs');

const axios = require('axios');


class Busquedas {
    historial = [];
    dbPath= './db/database.json'

    constructor () {
        this.leerDB();
    }

    get historialCapitalizado(){
    
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map (p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ');
        })
    }

    async ciudad ( lugar = '') {
        try {
            // peticion http
            const instance = axios.create({
                baseURL: `https://us1.locationiq.com/v1/search`,
                params: {
                    'key': process.env.LOCATION_KEY,
                    'q': lugar,
                    'format':'json'
                }
            });

            const rta = await instance.get();
            return rta.data.map ( lugar => ({
                id: lugar.place_id,
                nombre: lugar.display_name,
                lng: lugar.lon,
                lat: lugar.lat
            }));
            
        } catch (error) {
            return [];
        }
    }

    get paramsClima () {
        return {
            'appid': process.env.OPENWEATHER,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async climaLugar( lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsClima, lat, lon}

            });
            const rta = await instance.get();
            const {main, weather} = rta.data;
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
           
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial (lugar = ''){
        if(this.historial.includes(lugar.toLowerCase())){
            return;
        }
        this.historial = this.historial.splice (0, 4);
        this.historial.unshift(lugar.toLowerCase());
        this.guardarDB();
    }

    guardarDB(){

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB(){
        if(!fs.existsSync(this.dbPath)){
            return;
        }
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);
        this.historial = data.historial;
    }
}

module.exports = Busquedas;