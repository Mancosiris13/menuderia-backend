const mongoose = require('mongoose');

const dishSChema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
});

const Dish = mongoose.model('Dish', dishSChema);

module.exports = Dish;
