require('dotenv').config();

const { leerInput, pause, menuPrincipal, listLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async () => {
    let opt;
    const busquedas = new Busquedas();
    do {
        console.clear();

        opt = await menuPrincipal();
        
        switch (opt) {
            case 1:
                //Mostrar mensaje
                const busqueda = await leerInput('Ciudad: ');
                
                //Buscar los lugares
                const lugares = await busquedas.ciudad ( busqueda );
                
                //Seleccionar el lugar
                const id = await listLugares(lugares);

                if (id === 0) continue;

                const lugarSelec = lugares.find(l => l.id === id);

                busquedas.agregarHistorial(lugarSelec.nombre)
                //Clima
                const clima = await busquedas.climaLugar(lugarSelec.lat, lugarSelec.lng);

                //Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.magenta);
                console.log('Ciudad', lugarSelec.nombre);
                console.log('Latitud:', lugarSelec.lat);
                console.log('Longitud:', lugarSelec.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Maximo:', clima.max);
                console.log('Como está el clima:', clima.desc);

                break;

                case 2 :
                    busquedas.historialCapitalizado.forEach ((lugar, i) => {
                        const idx = `${i+1}.`.magenta;
                        console.log(`${idx} ${lugar}`);
                    })
                break;
        }
        
        if(opt !== 0) await pause();

    } while (opt !== 0);
}

main ();
