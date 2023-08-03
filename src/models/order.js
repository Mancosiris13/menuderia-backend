const mongoose = require('mongoose');

const alimentoSchema = new mongoose.Schema(
  {
    cantidad: {
      type: Number,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    extra: {
      type: String,
    },
    nota: {
      type: String,
    },
    precio: {
      type: Number,
      required: true,
    },
    categoria: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const orderSchema = new mongoose.Schema(
  {
    mesa: {
      type: Number,
    },
    mesero: {
      type: String,
      required: true,
    },
    paraLlevar: {
      type: Boolean,
    },
    menudoTicketPrinted: {
      type: Boolean,
    },
    tacosTicketPrinted: {
      type: Boolean,
    },
    alimentos: [alimentoSchema], // Use the alimentoSchema for the alimentos array

    total: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
