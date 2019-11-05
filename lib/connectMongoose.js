'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;

mongoose.set('useFindAndModify', false);

conn.on('error', err => {
    console.log('Error de conexión:', err);
    process.exit(1);
});

conn.once('open', () => {
    console.log('Conectado a MongoDB en', mongoose.connection.name);
});

mongoose.connect('mongodb://localhost/nodepop', {useNewUrlParser:true});

module.exports = conn;