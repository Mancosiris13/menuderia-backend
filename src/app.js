const express = require('express');
const cors = require('cors');
require('./db/mongoose');

const dishRouter = require('./routers/dishesRouter');
const orderRouter = require('./routers/orderRouter');

const newProductsAddedToExistingOrdersRouter = require('./routers/newProductsAddedToExistingOrdersRouter');

const app = express();

// app.use(cors({ origin: 'http://localhost:3000' })); ///Uncomment for local development

app.use(cors()); /// Uncomment for production

app.use(express.json());

app.use(dishRouter);
app.use(orderRouter);
app.use(newProductsAddedToExistingOrdersRouter);

module.exports = app;
