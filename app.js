require('colors');

const { guardarDB, leerDB } = require('./helpers/guardar');
const { inquirerMenu, 
        pausa, 
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoCheck
} = require('./helpers/inquirer');

const Tareas = require('./models/tareas');


const main = async () => {
    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if ( tareasDB ) {
        // establecer las tareas 
        tareas.cargarTareasFromArray( tareasDB );
    }
    
    do {
        opt = await inquirerMenu();
        
        switch (opt) {
            case '1':
                // crear opcion
                const desc = await leerInput('Descripcion: ');
                tareas.crearTarea( desc );
            break;

            case '2':
                tareas.listadoCompleto();
            break;
            
            case '3':
                tareas.listarPendientesCompletadas();
            break;

            case '4':
                tareas.listarPendientesCompletadas( false );
            break;

            case '5':
                const ids = await mostrarListadoCheck( tareas.listadoArr );
                tareas.toggleCompletados( ids );
            break;

            case '6':
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if ( id !== '0') {
                    const ok = await confirmar('Estas seguro?');
                    ok ? tareas.borrarTarea( id ) : console.log('No se ha borrado nada');
                }
                
            break;
        }

        guardarDB( tareas.listadoArr );
        
        await pausa(); 

    } while (opt !== '0');


}


main();