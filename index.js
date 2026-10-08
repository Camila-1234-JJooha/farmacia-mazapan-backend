require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;

// ==========================================
// CONFIGURACIÓN
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// CONEXIÓN A MYSQL
// ==========================================

const conexion = mysql.createConnection({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    port: process.env.DB_PORT || 3306,

    ssl: {
        rejectUnauthorized: false
    }

});


conexion.connect(err => {

    if (err) {

        console.error('Error de conexión a MySQL:', err);

        return;

    }

    console.log('Conectado a MySQL');

});


// ==========================================
// CLIENTES
// ==========================================

// MOSTRAR CLIENTES

app.get('/clientes', (req, res) => {

    conexion.query(
        'SELECT * FROM clientes',
        (err, resultados) => {

            if (err) {

                console.error(err);

                return res
                    .status(500)
                    .send('Error al obtener clientes');

            }

            res.json(resultados);

        }
    );

});


// AGREGAR CLIENTE

app.post('/clientes', (req, res) => {

    const {
        nombre,
        telefono
    } = req.body;


    conexion.query(

        `INSERT INTO clientes
        (nombre, telefono)
        VALUES (?, ?)`,

        [
            nombre,
            telefono
        ],

        err => {

            if (err) {

                console.error(err);

                return res
                    .status(500)
                    .send('Error al agregar cliente');

            }

            res.send('Cliente agregado');

        }

    );

});


// ACTUALIZAR CLIENTE

app.put('/clientes/:id', (req, res) => {

    const id = req.params.id;

    const {
        nombre,
        telefono
    } = req.body;


    conexion.query(

        `UPDATE clientes

        SET nombre=?,
            telefono=?

        WHERE id=?`,

        [
            nombre,
            telefono,
            id
        ],

        err => {

            if (err) {

                console.error(err);

                return res
                    .status(500)
                    .send('Error al actualizar cliente');

            }

            res.send('Cliente actualizado');

        }

    );

});


// ELIMINAR CLIENTE

app.delete('/clientes/:id', (req, res) => {

    const id = req.params.id;


    conexion.query(

        'DELETE FROM clientes WHERE id=?',

        [id],

        err => {

            if (err) {

                console.error(err);

                return res
                    .status(500)
                    .send('Error al eliminar cliente');

            }

            res.send('Cliente eliminado');

        }

    );

});


// ==========================================
// MEDICAMENTOS
// ==========================================

// MOSTRAR MEDICAMENTOS

app.get('/medicamentos', (req, res) => {

    conexion.query(

        'SELECT * FROM medicamentos',

        (err, resultados) => {

            if (err) {

                console.error(err);

                return res
                    .status(500)
                    .send('Error al obtener medicamentos');

            }

            res.json(resultados);

        }

    );

});


// AGREGAR MEDICAMENTO

app.post('/medicamentos', (req, res) => {

    const {
        nombre,
        precio,
        imagen
    } = req.body;


    conexion.query(

        `INSERT INTO medicamentos
        (nombre, precio, imagen)
        VALUES (?, ?, ?)`,

        [
            nombre,
            precio,
            imagen
        ],

        err => {

            if (err) {

                console.error(err);

                return res
                    .status(500)
                    .send('Error al agregar medicamento');

            }

            res.send('Medicamento agregado');

        }

    );

});


// ACTUALIZAR MEDICAMENTO

app.put('/medicamentos/:id', (req, res) => {

    const id = req.params.id;

    const {
        nombre,
        precio,
        imagen
    } = req.body;


    conexion.query(

        `UPDATE medicamentos

        SET nombre=?,
            precio=?,
            imagen=?

        WHERE id=?`,

        [
            nombre,
            precio,
            imagen,
            id
        ],

        err => {

            if (err) {

                console.error(err);

                return res
                    .status(500)
                    .send('Error al actualizar medicamento');

            }

            res.send('Medicamento actualizado');

        }

    );

});


// ELIMINAR MEDICAMENTO

app.delete('/medicamentos/:id', (req, res) => {

    const id = req.params.id;


    conexion.query(

        'DELETE FROM medicamentos WHERE id=?',

        [id],

        err => {

            if (err) {

                console.error(err);

                return res
                    .status(500)
                    .send('Error al eliminar medicamento');

            }

            res.send('Medicamento eliminado');

        }

    );

});


// ==========================================
// BANNER
// ==========================================

app.get('/banner', (req, res) => {

    conexion.query(

        'SELECT * FROM banner LIMIT 1',

        (err, resultados) => {

            if (err) {

                console.error(err);

                return res
                    .status(500)
                    .send('Error al obtener banner');

            }

            res.json(resultados);

        }

    );

});


// ==========================================
// VENTAS
// ==========================================

// MOSTRAR VENTAS CON JOIN

app.get('/ventas', (req, res) => {

    const sql = `

        SELECT

            v.id,

            c.nombre AS cliente,

            m.nombre AS medicamento,

            m.imagen,

            v.cantidad,

            m.precio,

            (v.cantidad * m.precio) AS total,

            v.fecha

        FROM ventas v

        INNER JOIN clientes c

            ON v.cliente_id = c.id

        INNER JOIN medicamentos m

            ON v.medicamento_id = m.id

    `;


    conexion.query(

        sql,

        (err, resultados) => {

            if (err) {

                console.error(err);

                return res
                    .status(500)
                    .send('Error al obtener ventas');

            }

            res.json(resultados);

        }

    );

});


// AGREGAR VENTA

app.post('/ventas', (req, res) => {

    const {
        cliente_id,
        medicamento_id,
        cantidad,
        fecha
    } = req.body;


    conexion.query(

        `INSERT INTO ventas
        (cliente_id, medicamento_id, cantidad, fecha)

        VALUES (?, ?, ?, ?)`,

        [
            cliente_id,
            medicamento_id,
            cantidad,
            fecha
        ],

        err => {

            if (err) {

                console.error(err);

                return res
                    .status(500)
                    .send('Error al registrar venta');

            }

            res.send('Venta registrada');

        }

    );

});


// ACTUALIZAR VENTA

app.put('/ventas/:id', (req, res) => {

    const id = req.params.id;

    const {
        cliente_id,
        medicamento_id,
        cantidad,
        fecha
    } = req.body;


    conexion.query(

        `UPDATE ventas

        SET cliente_id=?,
            medicamento_id=?,
            cantidad=?,
            fecha=?

        WHERE id=?`,

        [
            cliente_id,
            medicamento_id,
            cantidad,
            fecha,
            id
        ],

        err => {

            if (err) {

                console.error(err);

                return res
                    .status(500)
                    .send('Error al actualizar venta');

            }

            res.send('Venta actualizada');

        }

    );

});


// ELIMINAR VENTA

app.delete('/ventas/:id', (req, res) => {

    const id = req.params.id;


    conexion.query(

        'DELETE FROM ventas WHERE id=?',

        [id],

        err => {

            if (err) {

                console.error(err);

                return res
                    .status(500)
                    .send('Error al eliminar venta');

            }

            res.send('Venta eliminada');

        }

    );

});

app.listen(PORT, () => {

    console.log(
        `Servidor corriendo en http://localhost:${PORT}`
    );

});