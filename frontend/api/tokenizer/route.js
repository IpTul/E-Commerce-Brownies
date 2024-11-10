import Midtrans from 'midtrans-client'

export async function POST(request) {
  const { totalAmount, items } = req.body; // totalAmount should be calculated on the frontend
  const orderId = `order-${Date.now()}`; // Unique order ID
  const transactionDetails = {
    order_id: orderId,
    gross_amount: totalAmount, // Total amount to be charged
  };

  const itemDetails = items.map(item => ({
    id: item.id,
    price: item.price,
    quantity: item.quantity,
    name: item.name,
  }));

  const snapRequest = {
    transaction_details: transactionDetails,
    item_details: itemDetails,
    customer_details: {
      first_name: req.user.name,
      email: req.user.email,
    },
  };

  if (Midtrans.Snap) {
    const snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: process.env.SECRET,
      clientKey: process.env.NEX_PUBLIC_CLIENT
    });

    try {
      // const midtransResponse = await midtrans.createTransaction(snapRequest);
      const midtransResponse = await snap.createTransactionToken(snapRequest)
      console.log(midtransResponse)
      res.json(midtransResponse)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Payment processing error' });
    }
  } else {
    console.error("Snap is not available in the Midtrans module.");
  }
}

// app.post('/checkout2', fetchUser, async (req, res) => {
//   const { totalAmount, items } = req.body; // totalAmount should be calculated on the frontend
//   const orderId = `order-${Date.now()}`; // Unique order ID
//   const transactionDetails = {
//     order_id: orderId,
//     gross_amount: totalAmount, // Total amount to be charged
//   };

//   const itemDetails = items.map(item => ({
//     id: item.id,
//     price: item.price,
//     quantity: item.quantity,
//     name: item.name,
//   }));

//   const snapRequest = {
//     transaction_details: transactionDetails,
//     item_details: itemDetails,
//     customer_details: {
//       first_name: req.user.name,
//       email: req.user.email,
//     },
//   };

//   if (Midtrans.Snap) {
//     const snap = new Midtrans.Snap({
//       isProduction: false,
//       serverKey: process.env.SECRET,
//       clientKey: process.env.NEX_PUBLIC_CLIENT
//     });

//     try {
//       // const midtransResponse = await midtrans.createTransaction(snapRequest);
//       const midtransResponse = await snap.createTransactionToken(snapRequest)
//       console.log(midtransResponse)
//       res.json(midtransResponse)
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Payment processing error' });
//     }
//   } else {
//     console.error("Snap is not available in the Midtrans module.");
//   }


// });