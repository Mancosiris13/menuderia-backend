const express = require('express');

const Dish = require('../models/dish');

const Order = require('../models/order');

const router = new express.Router();

//************* CREATE DISH ENDPOINT****************//

router.post('/createProduct', async (req, res) => {
  console.log(req.body);
  try {
    const dish = await new Dish(req.body);
    await dish.save();
    res.status(200).send(dish);
  } catch (e) {
    res.status(400).send(e);
  }
});

//************* FETCH MENU ENDPOINT****************//

router.get('/menu', async (req, res) => {
  try {
    const menu = await Dish.find();
    if (!menu) {
      return res.status(400).send();
    }
    res.send(menu);
  } catch (e) {
    res.status(500).send();
  }
});

//************* FETCH MENUDOS ENDPOINT****************//
router.get('/menudos', async (req, res) => {
  try {
    const menudos = await Dish.find({ categoria: 'Menudos' });
    if (!menudos) {
      return res.status(400).send();
    }
    res.send(menudos);
  } catch (e) {
    res.status(500).send();
  }
});

//************* FETCH BEBIDAS ENDPOINT****************//
router.get('/bebidas', async (req, res) => {
  try {
    const bebidas = await Dish.find({ categoria: 'Bebidas' });
    if (!bebidas) {
      return res.status(400).send();
    }
    res.send(bebidas);
  } catch (e) {
    res.status(500).send();
  }
});

//************* FETCH TACOS ENDPOINT****************//
router.get('/tacos', async (req, res) => {
  try {
    const tacos = await Dish.find({ categoria: 'Tacos' });
    if (!tacos) {
      return res.status(400).send();
    }
    res.send(tacos);
  } catch (e) {
    res.status(500).send();
  }
});

//************* FETCH EXTRAS ENDPOINT****************//
router.get('/extras', async (req, res) => {
  try {
    const extras = await Dish.find({ categoria: 'Extras' });
    if (!extras) {
      return res.status(400).send();
    }
    res.send(extras);
  } catch (e) {
    res.status(500).send();
  }
});

//************* EDIT PRODUCT BY ID ENDPOINT****************//
router.patch('/products/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  console.log(updates);
  /* ↑↑↑↑↑↑ Returns an array of the keys inserted on the body request ↑↑↑↑↑↑*/
  const allowedUpdates = ['nombre', 'precio'];

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    res.status(400).send({ error: 'Invalid Updates!' });
  }
  const _id = req.params.id;
  console.log(_id);
  try {
    const product = await Dish.findOne({ _id });

    if (!product) {
      res.status(400).send();
    }

    updates.forEach((update) => {
      product[update] = req.body[update];
    });
    await product.save();
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

//************* DELETE PRODUCT BY ID ENDPOINT****************//
router.delete('/deleteProduct/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);

  try {
    const product = await Dish.findOneAndDelete({ _id: id });
    if (!product) {
      res.status(404).send({ error: ' Uneable to find Product' });
    }
    res.status(200).send(product);
  } catch (e) {
    res.status(500).send();
  }
});

// DELETE ALIMENTO FROM ORDER ENDPOINT
router.delete('/orders/:orderId/delete/:productId', async (req, res) => {
  const orderID = req.params.orderId;
  const productID = req.params.productId;

  try {
    const order = await Order.findById(orderID);

    // Find the alimento to be deleted based on its _id
    const alimentoToDelete = order.alimentos.find(
      (alimento) => alimento._id.toString() === productID
    );

    if (!alimentoToDelete) {
      return res.status(404).json({ message: 'Alimento not found in order' });
    }

    // Subtract alimento.precio from order.total
    order.total -= alimentoToDelete.precio * alimentoToDelete.cantidad;

    // Filter out the alimento to be deleted from alimentos array
    order.alimentos = order.alimentos.filter(
      (alimento) => alimento._id.toString() !== productID
    );

    // Save the updated order
    await order.save();

    res
      .status(200)
      .json({ message: 'Alimento deleted from order successfully' });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .send('An error occurred while deleting the alimento from order');
  }
});

module.exports = router;
