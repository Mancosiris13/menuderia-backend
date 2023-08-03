const express = require('express');

const Order = require('../models/order');

const router = new express.Router();

//************* CREATE ORDER ENDPOINT****************//

router.post('/createOrder', async (req, res) => {
  // console.log(req.body);
  try {
    // const checkTable = await Order.findOne({ mesa: req.body.mesa });

    // if (checkTable) {
    //   return res.status(400).send('Solo Puede Haber Una Orden Por mesa');
    // }
    const order = await new Order(req.body);
    await order.save();
    res.status(200).send(order);
  } catch (e) {
    res.status(400).send(e);
  }
});

//************* ADD PRODCUTS TO AN EXISTING ORDER BY TRABLE NUMBER ENDPOINT****************//

router.patch('/addProductsToOrder/:orderID', async (req, res) => {
  const orderId = req.params.orderID;
  const newOrder = req.body;
  // console.log('NUEVA orden para mezclar con la antigua orden', newOrder);
  // console.log('mesa para agregar productos', tableNumber);

  try {
    const previousOrder = await Order.findOne({ _id: orderId });
    // console.log('ANTIGUA orden para mezclar con la nueva : ', previousOrder);
    if (!previousOrder) {
      return res.status(404).send();
    }

    // Verificar si el campo 'alimentos' existe y es un array en la orden existente
    if (!Array.isArray(previousOrder.alimentos)) {
      previousOrder.alimentos = [];
    }

    // Agregar los alimentos de la nueva orden al arreglo 'alimentos' de la orden existente
    previousOrder.alimentos.push(...newOrder.alimentos);

    // Sumar los totales de ambas órdenes
    previousOrder.total += newOrder.total;

    // Guardar la orden mezclada en la base de datos
    const updatedOrder = await previousOrder.save();

    // Responder con la orden mezclada
    res.status(200).json(updatedOrder);
  } catch (e) {
    res.status(400).send(e);
  }
});

//************* READ ORDERS ENDPOINT****************//
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders) {
      return res.status(404).send();
    }
    res.status(200).send(orders);
  } catch (e) {
    res.status(400).send(e);
  }
});

//************* READ ORDERS BY TABLE NUMBER ENDPOINT****************//
router.get('/orders/:tableNumber', async (req, res) => {
  let tableNumber = req.params.tableNumber;
  // console.log(tableNumber);
  try {
    const order = await Order.findOne({ mesa: tableNumber });
    if (!order) {
      res.status(404).send();
    }
    res.status(200).send(order);
  } catch (e) {
    res.status(500).send();
  }
});

//************* READ ORDERS BY TABLE NUMBER ENDPOINT****************//

router.delete('/deleteOrder/:tableNumber', async (req, res) => {
  let tableNumber = req.params.tableNumber;
  console.log(tableNumber);
  try {
    const order = await Order.findOneAndDelete({ mesa: tableNumber });
    if (!order) {
      return res.status(404).send();
    }
    res.status(200).send(Order);
  } catch (e) {
    res.status(500).send();
  }
});

//************* UPDATE TACO AND MENUDO TICKET STATUS PRINTED ENDPOINT****************//

router.patch('/updateTickets/:orderId', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['tacosTicketPrinted', 'menudosTicketPrinted'];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    res.status(400).send({ error: 'Invalid Updates!' });
  }

  let orderID = req.params.orderId;
  // console.log(orderID);

  try {
    const order = await Order.findById(orderID);
    console.log(order);

    if (!order) {
      res.status(400).send();
    }

    updates.forEach((update) => {
      order[update] = req.body[update];
    });

    await order.save();
    res.status(200).send(order);
  } catch (e) {
    res.status(500).send();
  }
});

//************* CHANGE TABLE NUMBER TO ORDER SO CAN BE ARCHIVED****************//
router.patch('/updateTableNumber/:tableNumber', async (req, res) => {
  let tableNumber = req.params.tableNumber;
  // console.log(tableNumber);

  try {
    const newRandomTableNumber = Math.floor(Math.random() * 1000) + 100;
    const order = await Order.findOne({ mesa: tableNumber });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.mesa = newRandomTableNumber;
    await order.save();
    res.status(200).send(order);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
