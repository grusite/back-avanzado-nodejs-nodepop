'use strict';

var express = require('express');
var router = express.Router();

// Carga del modelo
const apiv1 = require('../models/APIv1');

router.get('/', async (req, res, next) => {
    try{
        const tag = req.query.tag;
        const venta = req.query.venta;
        const nombre = req.query.nombre;
        const precio = req.query.precio;
        let start = parseInt(req.query.start);
        let limit = parseInt(req.query.limit);
        const sort = req.query.sort;

        const filter= {};
        if(nombre) filter.nombre = new RegExp('^'+nombre);
        if(venta) filter.venta = venta;
        if(precio) filter.precio = priceFilterToMongo(precio);
        if(tag) filter.tags = { $in: tagFilter(tag) };
        console.log('limit', limit);
        if(isNaN(limit)) limit = 100000000;
        if(limit == 'todo') limit = 100000000;
        if(!start) start = 0;
        const anuncios = await apiv1.list({filter, start, limit, sort});
        const numAnuncios = await apiv1.contar({filter});
        console.log('num', numAnuncios);

        const items = await apiv1.categories({sort});
        let arrayTags = [];
        items.forEach(item => {
            item.tags.forEach(tag => {
                arrayTags.push(tag);
            });
        });
        let uniqueTags = arrayTags.filter( (value, index, self) => { 
            return self.indexOf(value) === index;
        } );

        res.render('anuncios', {
            title: 'Anuncios',
            anuncios: anuncios,
            tags: uniqueTags,
            limit: limit,
            tag: tag,
            venta: venta,
            nombre: nombre,
            precio: precio,
            start: start,
            limit: limit,
            numAnuncios: numAnuncios
        });
    }catch(error){
        next(error);
    }
});

function priceFilterToMongo(pPrice){
    let minus = pPrice.indexOf('-');
    let precio = '';
    if(minus === -1){
        precio = parseInt(pPrice);
    }else if( (minus + 1) ==  pPrice.length ){ // Está al final
        precio = { $gte: pPrice.substr(0, (pPrice.length - 1) )};
    }else if(minus == 0){
        precio = { $lte: pPrice.substr(1, (pPrice.length - 1) )};
    }else{
        let precio1 = parseInt(pPrice.substr(0, minus));
        let precio2 = parseInt(pPrice.substr(minus + 1, pPrice.length - 1));
        if(precio2 < precio1){
            precio = { $gte: precio2, $lte: precio1 };
        }else{
            precio = { $gte: precio1, $lte: precio2 };
        }
    }
    return precio;
}

function tagFilter(pTag){
    if(pTag.indexOf(',') === -1){
        return pTag;
    }else{
        let tags = pTag.split(',');
        return tags;
    }
}

module.exports = router;
