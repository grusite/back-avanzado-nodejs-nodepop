'use strict';

const mongoose = require('mongoose');

var anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]
}, {collection:'anuncios'});

anuncioSchema.statics.list = function({filter, start, limit, sort}){
    const query = V1.find(filter);
    query.skip(start);
    query.limit(limit);
    query.sort(sort);
    return query.exec();
};

anuncioSchema.statics.contar = function({filter}){
    const query = V1.find(filter).countDocuments();
    return query.exec();
};

anuncioSchema.statics.categories = function({sort}){
    const query = V1.find();
    query.select('tags');
    query.sort(sort);
    return query.exec();
};

const V1 = mongoose.model('anuncios', anuncioSchema);

module.exports = V1;