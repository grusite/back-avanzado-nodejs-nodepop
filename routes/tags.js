'use strict';

var express = require('express');
var router = express.Router();

// Carga del modelo
const apiv1 = require('../models/APIv1');

router.get('/', async (req, res, next) => {
    try{
        const sort = req.query.sort;
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

        res.render('tags', {
            title: 'Categorías',
            tags: uniqueTags
        });
    }catch(error){
        next(error);
    }
});

module.exports = router;
