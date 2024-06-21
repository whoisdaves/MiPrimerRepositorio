const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

// Conexión a la base de datos
const connection = mysql.createConnection({
    host: '10.0.6.39',
    user: 'estudiante',
    password: 'Info-2023',
    database: 'ClaseDavid'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Conexión exitosa a la base de datos.');
});

// Ruta para servir el formulario HTML
app.use(express.static(path.join(__dirname, 'pagina')));

// Middleware para manejar los datos de formulario
app.use(express.urlencoded({ extended: true }));

// Ruta para manejar el registro de usuario
app.post('/registrar_usuario', (req, res) => {
    const { correo, contraseña, rol } = req.body;

    const query = 'INSERT INTO usuarios (correo, contraseña, rol) VALUES (?, ?, ?)';
    connection.query(query, [correo, contraseña, rol], (err, result) => {
        if (err) {
            res.send('Error al registrar el usuario');
        } else {
            console.log('Usuario registrado exitosamente');
            res.redirect('/');
        }
    });
});

// Nueva ruta para mostrar todos los usuarios
app.get('/usuarios', (req, res) => {
    const query = 'SELECT * FROM usuarios';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los usuarios:', err);
            res.send('Error al obtener los usuarios');
        } else {
            res.json(results);
        }
    });
});

// Nueva ruta para obtener los detalles de un usuario
app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM usuarios WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al obtener los detalles del usuario:', err);
            res.status(500).send('Error al obtener los detalles del usuario');
        } else {
            res.json(result[0]);
        }
    });
});

// Nueva ruta para eliminar un usuario
app.delete('/eliminar_usuario/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM usuarios WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el usuario:', err);
            res.status(500).send('Error al eliminar el usuario');
        } else {
            res.status(200).send('Usuario eliminado exitosamente');
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
