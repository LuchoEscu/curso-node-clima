const inquirer = require('inquirer');
require('colors');

const opciones = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.magenta} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.magenta} Historial`
            },
            {
                value: 0,
                name: `${'0.'.magenta} Salir`
            }
        ]
    }
];

const menuPrincipal = async () => {
    
    console.clear();
    console.log('==================================='.magenta);
    console.log('       Seleccione una opción.');
    console.log('===================================\n'.magenta);

    const {opcion} = await inquirer.prompt(opciones);

    return opcion;

}

const leerInput = async (message) => {
    const preg = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if (value.length === 0){
                    return 'Por favor ingrese un valor.';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(preg)
    return desc

}

const pause = async () => {
    const preg = [
        {
            type: 'input',
            name: 'pausa',
            message: `Presione ${'ENTER'.green} para continuar.`
        }
    ];
    console.log();
    const pause = await inquirer.prompt(preg);
    return pause

}

const listLugares = async ( lugares = [] ) => {

    const choices = lugares.map ( (lugar, i) => {
        const idx = `${i + 1}.`.magenta;
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    } );
    choices.unshift ({
        value: 0,
        name: '0.'.red + ' Cancelar'
    })
    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ];

    const {id} = await inquirer.prompt(preguntas);
    return id;

}

const confirmar = async mensaje => {
    const pregunta = [
        {
            type: 'confirm',
            name: 'ok',
            message: mensaje
        }
    ];

    const { ok } = await inquirer.prompt(pregunta);
    return ok;

}


const mostrarListado = async ( tareas = [] ) => {

    const choices = tareas.map ( (tareas, i) => {
        const idx = `${i + 1}.`.blue;
        return {
            value: tareas.id,
            name: `${idx} ${tareas.desc}`,
            checked: tareas.completadoEn ? true : false
        }
    } );

    const preguntas = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices
        }
    ];

    const {ids} = await inquirer.prompt(preguntas);
    return ids;

}




module.exports = {
    menuPrincipal,
    leerInput,
    pause,
    listLugares,
    confirmar,
    mostrarListado
}