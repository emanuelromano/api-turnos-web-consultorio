// ----- API-REST Consultorio -------------------------------------------------------------------------------------- //

const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Conexión alternativa con credenciales:
//
// const cors = require('cors');
// const corsOptions = {
//     origin: 'http://localhost:3005', 
//     credentials: true,
//     optionSuccessStatus: 200
// }
// app.use(cors(corsOptions));

// ----- Conexión a BD --------------------------------------------------------------------------------------------- //

// const connection = mysql.createConnection({ // Conexión anterior
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'consultorio'
// });

const connection = mysql.createConnection({ // Conexión actual
    host: 'EmanuelRomano',
    user: 'server',
    password: '1234',
    database: 'consultorio'
});

// Conexión a DB
connection.connect(error => {
    if (error) throw error
    console.log('API-REST Consultorio - Conexión con la DB establecida.')
});

app.listen(3005, () => console.log('Servicio escuchando en el puerto 3005.')); // Escucha en el puerto 3005

// Ruta inicial
app.get('/', (res) => {
    res.send(`¡Bienvenido! API-REST Consultorio
    <br><br>
    Endpoints disponibles: 
    <br>GET /pacientes/
    <br>GET /pacientes/:id
    <br>GET /pacientes/dni/:dni
    <br>GET /pacientes/usuario/:usuario - 1 / 0
    <br>POST /pacientes/
    <br>PUT /pacientes/:id
    <br>DELETE /pacientes/:id`)
});

// ----- Pacientes ------------------------------------------------------------------------------------------------- //

// Mostrar pacientes
app.get('/pacientes', (req, res) => {
    connection.query('SELECT * FROM pacientes', (error, results) => {
        if (error) throw error
        res.json(results)
    })
});

// Mostrar paciente por ID
app.get('/pacientes/:id', (req, res) => {
    const id = req.params.id
    connection.query(`SELECT * FROM pacientes WHERE idPaciente = ${id}`,
        (error, results) => {
            if (error) throw error
            res.json(results)
        })
});

// Mostrar paciente por DNI
app.get('/pacientes/dni/:dni', (req, res) => {
    const dni = req.params.dni
    connection.query(`SELECT * FROM pacientes WHERE dni = ${dni}`,
        (error, results) => {
            if (error) throw error
            res.json(results)
        })
});

// Corroborar si existe un usuario en la BD - 1: Existe / 0: No existe
app.get('/pacientes/usuario/:usuario', (req, res) => {
    const usuario = req.params.usuario
    connection.query(`SELECT EXISTS (SELECT * FROM pacientes WHERE usuario = ${usuario}) AS existe`,
        (error, results) => {
            if (error) throw error
            res.json(results)
        })
});

// Obtener contraseña para corroborar
app.get('/pacientes/contra/:usuario', (req, res) => {
    const usuario = req.params.usuario
    connection.query(`SELECT contraseña FROM pacientes WHERE usuario = ${usuario}`,
        (error, results) => {
            if (error) throw error
            res.json(results)
        })
});

// Método POST para añadir paciente
app.post('/pacientes', (req, res) => {
    connection.query('INSERT INTO pacientes SET ?', {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        usuario: req.body.usuario,
        sexo: req.body.sexo,
        fechanacimiento: req.body.fechanacimiento,
        edad: req.body.edad,
        telefono: req.body.telefono,
        email: req.body.email,
        direccion: req.body.direccion,
        ciudad: req.body.ciudad,
        contraseña: req.body.contraseña
    },
        (error, results) => {
            if (error) throw error
            res.send(results)
        })
});

// Método UPDATE para actualizar paciente
app.put('/pacientes/:id', (req, res) => {
    const id = req.params.id
    const { nombre, apellido, dni, usuario, sexo, fechanacimiento, edad, telefono, email, direccion, ciudad, contraseña } = req.body
    connection.query(
        `UPDATE pacientes SET 
        nombre = '${nombre}', 
        apellido = '${apellido}', 
        dni = '${dni}',  
        usuario = '${usuario}', 
        sexo = '${sexo}', 
        fechanacimiento = '${fechanacimiento}', 
        edad = '${edad}', 
        telefono = '${telefono}',
        email = '${email}', 
        direccion = '${direccion}', 
        ciudad = '${ciudad}', 
        contraseña = '${contraseña}' 
        WHERE idPaciente = ${id}`,
        (error, results) => {
            if (error) throw error
            res.json(results)
        })
});

// Método DELETE para borrar paciente
app.delete('/pacientes/:id', (req, res) => {
    const id = req.params.id
    connection.query(`DELETE FROM pacientes WHERE idPaciente = ${id}`,
        (error, results) => {
            if (error) throw error
            res.json(results)
        })
});

// ----- Turnos ---------------------------------------------------------------------------------------------------- //

// Mostrar turnos por DNI de paciente
app.get('/turnos/:dni', (req, res) => {
    const dni = req.params.dni
    connection.query(
        `SELECT turnos.idTurno, doctores.nombre AS nombredoc, doctores.apellido AS apellidodoc, doctores.especialidad, turnos.fecha, turnos.horario FROM turnos 
        INNER JOIN
        doctores ON turnos.idDoctor = doctores.idDoctor
        WHERE turnos.dni = ${dni};`,
        (error, results) => {
            if (error) throw error
            res.json(results)
        })
});

// Método POST para añadir turno
app.post('/turnos', (req, res) => {
    connection.query('INSERT INTO turnos SET ?', {
        idDoctor: req.body.idDoctor,
        idPaciente: req.body.idPaciente,
        dni: req.body.dni,
        fecha: req.body.fecha,
        horario: req.body.horario,
        observaciones: req.body.observaciones
    },
        (error, results) => {
            if (error) throw error
            res.send(results)
        })
});

// Método DELETE para borrar turno
app.delete('/turnos/:id', (req, res) => {
    const id = req.params.id
    connection.query(`DELETE FROM turnos WHERE idTurno = ${id}`,
        (error, results) => {
            if (error) throw error
            res.json(results)
        })
});

// ----- Doctores -------------------------------------------------------------------------------------------------- //

// Mostrar lista doctores
app.get('/doctores', (req, res) => {
    connection.query('SELECT * FROM doctores', (error, results) => {
        if (error) throw error
        res.json(results)
    })
});

// Mostrar lista doctores (datos reservados)
app.get('/doctoreslista', (req, res) => {
    connection.query('SELECT idDoctor, nombre, apellido, especialidad FROM doctores', (error, results) => {
        if (error) throw error
        res.json(results)
    })
});

// Mostrar doctores por DNI
app.get('/doctores/:dni', (req, res) => {
    const dni = req.params.dni
    connection.query(`SELECT * FROM doctores WHERE dni = ${dni}`,
        (error, results) => {
            if (error) throw error
            res.json(results)
        })
});

// Mostrar doctor por ID
app.get('/doctores/id/:id', (req, res) => {
    const id = req.params.id
    connection.query(`SELECT nombre AS nombredoc, apellido AS apellidodoc, especialidad FROM doctores WHERE idDoctor = ${id}`,
        (error, results) => {
            if (error) throw error
            res.json(results)
        })
});