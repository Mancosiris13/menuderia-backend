const express = require('express');
require('./db/mongoose');
const cors = require('cors');

const dishRouter = require('./routers/dishesRouter');
const orderRouter = require('./routers/orderRouter');

const newProductsAddedToExistingOrdersRouter = require('./routers/newProductsAddedToExistingOrdersRouter');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(dishRouter);
app.use(orderRouter);
app.use(newProductsAddedToExistingOrdersRouter);

app.listen(port, () => {
  console.log('Server is on port ', port);
});
