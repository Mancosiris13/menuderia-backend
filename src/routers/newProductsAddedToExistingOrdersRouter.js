const express = require('express');

const NewProductsAddedToExistingOrders = require('../models/newProductsAddedToExistingOrders');
const router = new express.Router();

//////////////////POSTING NEW ORDERS WITH NEW PRODUCTS TO EXISTING ORDER SO IT CAN HELP RENDER TACOS AND MENUDOS NEW TICKETS////////////////

router.post('/postNewProductsToExistingOrder', async (req, res) => {
  console.log(req.body);
  try {
    const productAddedToExistingOrder =
      await new NewProductsAddedToExistingOrders(req.body);
    await productAddedToExistingOrder.save();
    res.status(200).send(productAddedToExistingOrder);
  } catch (e) {
    res.status(400).send(e);
  }
});

//************* READ NEW ORDERS WITH NEW PRODUCTS TO EXISTING ORDER ENDPOINT****************//
router.get('/newProductsToExistingOrder', async (req, res) => {
  try {
    const orders = await NewProductsAddedToExistingOrders.find();
    if (!orders) {
      return res.status(404).send();
    }
    res.status(200).send(orders);
  } catch (e) {
    res.status(400).send(e);
  }
});

//************* UPDATE TACO AND MENUDO TICKET OF NEW PRODUCT ADDED TO EXISTING ORDERS STATUS PRINTED ENDPOINT****************//

router.patch('/updateTicketsOfNewProductsAdded/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['tacosTicketPrinted', 'menudosTicketPrinted'];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    res.status(400).send({ error: 'Invalid Updates!' });
  }

  let orderId = req.params.id;
  console.log('order id to update', orderId);

  try {
    const newProductsAddedToExistingOrders =
      await NewProductsAddedToExistingOrders.findById({
        _id: orderId,
      });

    if (!newProductsAddedToExistingOrders) {
      res.status(400).send();
    }

    updates.forEach((update) => {
      newProductsAddedToExistingOrders[update] = req.body[update];
    });

    await newProductsAddedToExistingOrders.save();
    res.status(200).send(newProductsAddedToExistingOrders);
  } catch (e) {
    res.status(500).send();
  }
});

//************* CHANGE TABLE NUMBER TO NEW PRODUCTS ADDED TO EXISTING ORDERS SO CAN BE ARCHIVED****************//
router.patch(
  '/updateTableNumberOfNewProductsAdded/:tableNumber',
  async (req, res) => {
    let tableNumber = req.params.tableNumber;
    // console.log(tableNumber);

    try {
      const newRandomTableNumber = Math.floor(Math.random() * 1000) + 100;
      const ordersToUpdate = await NewProductsAddedToExistingOrders.find({
        mesa: tableNumber,
      });
      if (ordersToUpdate.length === 0) {
        return res.status(404).json({ error: 'Orders not found' });
      }

      // Step 3: Update the table number for each order
      for (const order of ordersToUpdate) {
        order.mesa = newRandomTableNumber;
        await order.save();
      }
      res.status(200).send(ordersToUpdate);
    } catch (e) {
      res.status(500).send();
    }
  }
);

module.exports = router;
