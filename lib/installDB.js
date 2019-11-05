'use strict';

const conn = require('./connectMongoose');
const apiv1 = require('../models/APIv1');
const datasetAnuncios = require('./anuncios.json');

conn.once("open", async () => {
    try {
      await apiv1.deleteMany();
      await apiv1.insertMany(datasetAnuncios.anuncios);
    } catch (error) {
      console.log("error", error);
    }
  });