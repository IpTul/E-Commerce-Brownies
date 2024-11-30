const port = 4000
const express = require('express')
const router = express.Router();
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const { type } = require('os')

app.use(express.json())
app.use(cors())

// Database Connection
const sequelize = require('./database'); // Adjust the path as necessary
const Product = require('./models/Product'); // Include your models
const Users = require('./models/Users'); // Include your models

// Sync all models
sequelize.sync().then(() => {
  console.log('Database & tables created!');
}).catch(err => {
  console.error('Error syncing database:', err);
});

// API creation
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on port " + port)
  }
  else {
    console.log("Error : " + error)
  }
})

app.get("/", (req, res) => {
  res.send("Express App is running")
})

// Image storage
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({ storage: storage })

// Createing upload image for product
app.use('/images', express.static('upload/images'))
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  })
})

// Creating add new product
app.post('/addproduct', async (req, res) => {
  let products = await Product.find({})
  let id
  if (products.length > 0) {
    let last_product_array = products.slice(-1)
    let last_product = last_product_array[0]
    id = last_product.id + 1
  } else {
    id = 1
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  })
  console.log(product)
  await product.save()
  console.log("Saved")
  res.json({
    success: true,
    name: req.body.name,
  })
})

// creating api remove product
app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id })
  console.log("Removed")
  res.json({
    success: true,
    name: req.body.name,
  })
})

// Get all product
app.get('/allproducts', async (req, res) => {
  try {
    const products = await Product.findAll();
    const totalCount = await Product.count()
    console.log(`Fetched ${products.length} products`)
    res.json({ products, totalCount })
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching products' });
  }
});

// creating update product
app.post('/updateproduct', upload.single('product'), async (req, res) => {
  const { id, name, category, new_price } = req.body;
  const image = req.file ? req.file.filename : null; // Check if a new image is uploaded

  const updatedProduct = await Product.findOneAndUpdate(
    { id: id },
    {
      name,
      image: image ? `http://localhost:${port}/images/${image}` : undefined, // Update image if new one is provided
      category,
      new_price
    },
    { new: true }
  );

  if (updatedProduct) {
    console.log("Updated");
    res.json({ success: true, name: updatedProduct.name });
  } else {
    res.json({ success: false, message: "Product not found" });
  }
});

// Create signed user
app.post('/signup', async (req, res) => {
  try {
    let check = await Users.findOne({ email: req.body.email })
    if (check) {
      return res.status(400).json({ success: false, errors: "Existing user found with the same email address" })
    }

    let cart = {}
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    let id_user = await Users.count() + 1

    const user = new Users({
      id_user: id_user,
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    })

    await user.save();

    const data = {
      user: {
        id_user: user.id_user
      }
    }

    const token = jwt.sign(data, 'secret_ecom')
    res.json({ success: true, token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, errors: "Internal server error" })
  }
})

// Create login
app.post('/login', async (req, res) => {
  let user = await Users.findOne({ email: req.body.email })
  if (user) {
    const passCompare = req.body.password == user.password
    if (passCompare) {
      const data = {
        user: {
          id_user: user.id_user
        }
      }
      const token = jwt.sign(data, 'secret_ecom')
      res.json({ success: true, token })
    }
    else {
      res.json({ success: false, errors: "Wrong Password" })
    }
  } else {
    res.json({ success: false, errors: "Wrong Email or Password" })
  }
})

// creating user for admin panel
const Adminusers = mongoose.model('Adminusers', {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

// Create admin signup user
app.post('/adminsignup', async (req, res) => {
  let check = await Adminusers.findOne({ email: req.body.email })
  if (check) {
    return res.status(400).json({ success: false, errors: "exiting user found with same email address" })
  }

  let cart = {}
  for (let i = 0; i < 300; i++) {
    cart[i] = 0
  }
  const user = new Adminusers({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })

  await user.save()

  const data = {
    user: {
      id: user.id
    }
  }

  const token = jwt.sign(data, 'secret_ecom')
  res.json({ success: true, token })
})

// Create admin users account
app.post('/adminlogin', async (req, res) => {
  let adminuser = await Adminusers.findOne({ email: req.body.email })
  if (adminuser) {
    const passCompare = req.body.password == adminuser.password
    if (passCompare) {
      const data = {
        adminuser: {
          id: adminuser.id
        }
      }
      const token = jwt.sign(data, 'secret_ecom')
      res.json({ success: true, token })
    }
    else {
      res.json({ success: false, errors: "Wrong Password" })
    }
  } else {
    res.json({ success: false, errors: "Wrong Email or Password" })
  }
})

// Creating for validation token
app.post('/validateToken', async (req, res) => {
  const token = req.headers['auth-token']
  console.log(token)
  if (!token) {
    return res.json({ success: false, errors: "No token provided" })
  }

  jwt.verify(token, 'secret_ecom', (err, decoded) => {
    if (err) {
      return res.json({ success: false, errors: "Invalid token" })
    }
    res.json({ success: true, adminuser: decoded.adminuser })
  })
})

// creating new collection data
app.get('/newcollections', async (req, res) => {
  let products = await Product.find({})
  let newcollection = products.slice(1).slice(-8)
  console.log("NewCollection Fetched")
  res.send(newcollection)
})

// creating popular data
app.get('/popularbrownies', async (req, res) => {
  let products = await Product.find({ category: "brownies" })
  let popular = products.slice(0, 4)
  console.log("Popular Products")
  res.send(popular)
})

// creating middleware fetch user
const fetchUser = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send("Access denied");
  }

  try {
    const verified = jwt.verify(token, 'secret_ecom');
    console.log("Decoded token:", verified);
    req.user = verified.user; // Ensure that the user object contains the necessary data
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};

// creating adding product in cart data
app.post('/addtocart', fetchUser, async (req, res) => {
  console.log("User  ID:", req.user.id_user); // Log the user ID
  console.log("Added", req.body.itemId, "Quantity:", req.body.quantity);

  try {
    // Check if req.user.id_user is defined
    if (!req.user || !req.user.id_user) {
      return res.status(400).json({ success: false, message: "User  ID is missing" });
    }

    let userData = await Users.findOne({ where: { id_user: req.user.id_user } });

    if (!userData) {
      return res.status(404).json({ success: false, message: "User  not found" });
    }

    // Parse the cartData if it's a string
    userData.cartData = typeof userData.cartData === 'string' ? JSON.parse(userData.cartData) : userData.cartData;

    // Update the cart data
    userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + req.body.quantity;

    // Save the updated cart data
    await Users.update(
      { cartData: userData.cartData }, // Store it back as a string
      { where: { id_user: req.user.id_user } }
    );

    // Send back the updated cart data
    res.json({ success: true, message: "Added", cartData: userData.cartData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
});

// creating remove product in cart data
app.post('/removefromcart', fetchUser, async (req, res) => {
  console.log("Removed", req.body.itemId)
  let userData = await Users.findOne({ _id: req.user.id })
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData })
  res.send("Removed")
})

// creating get product in cart data
app.post('/getcart', fetchUser, async (req, res) => {
  console.log("GetCart")
  let userData = await Users.findOne({ _id: req.user.id })
  res.json(userData.cartData)
})

// Creating promo code model
const PromoCode = mongoose.model('PromoCodes', {
  id: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
})

// Create promo code
app.post('/createpromocode', async (req, res) => {
  let promocodes = await PromoCode.find({})
  let id
  if (promocodes.length > 0) {
    let last_promocode_array = promocodes.slice(-1)
    let last_promocode = last_promocode_array[0]
    id = last_promocode.id + 1
  } else {
    id = 1
  }

  const promocode = new PromoCode({
    id: id,
    code: req.body.code,
    discount: req.body.discount,
    expirationDate: req.body.expirationDate,
  })
  console.log(promocode)
  await promocode.save()
  console.log("Saved Code")
  res.json({
    success: true,
    code: req.body.code,
  })
})

// Validation promo code
app.post('/validatepromocode', async (req, res) => {
  const { code } = req.body

  try {
    const promoCode = await PromoCode.findOne({ code })

    if (!promoCode) {
      return res.status(404).json({ success: false, message: 'Promo code not found' })
    }

    if (new Date() > promoCode.expirationDate) {
      return res.status(400).json({ success: false, message: 'Promo code has expired' })
    }

    res.json({ success: true, discount: promoCode.discount })
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error validating promo code' })
  }
})

// Get promo code
app.get('/allpromocodes', async (req, res) => {
  try {
    const limit = 100
    const promocodes = await PromoCode.find({}).limit(limit)
    console.log(`Fetched ${promocodes.length} promocodes`)
    res.send(promocodes)
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: 'Error fetching promo code' })
  }
})

// Remove promo code
app.post('/removecode', async (req, res) => {
  const promocodes = await PromoCode.findOneAndDelete({ id: req.body.id })
  console.log("Remove promo code", promocodes.code)
  res.json({
    success: true,
    name: req.body.code,
  })
})

require('dotenv').config()
app.get('/check-midtrans', async (req, res) => {
  console.log(Midtrans)
  res.send(Midtrans)
  res.json(Midtrans)
})

// Create checkout model
const Checkout = mongoose.model('Orders', {
  id: {
    type: Number,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nama_customer: {
    type: String,
    required: true,
  },
  no_telp_customer: {
    type: String,
    required: true,
  },
  alamat_customer: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  products: [{
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
})

// Create checkout
app.post('/createcheckout', fetchUser, async (req, res) => {
  const userId = req.user.id
  const user = await Users.findById(userId)
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' })
  }
  let checkouts = await Checkout.find({})
  let id
  if (checkouts.length > 0) {
    let last_Checkout_array = checkouts.slice(-1)
    let last_Checkout = last_Checkout_array[0]
    id = last_Checkout.id + 1
  } else {
    id = 1
  }
  const checkout = new Checkout({
    id: id,
    user_id: userId,
    nama_customer: user.name,
    email_customer: user.email,
    no_telp_customer: req.body.no_telp_customer,
    alamat_customer: req.body.alamat_customer,
    products: req.body.products,
    total: req.body.total,
  })
  console.log(checkout)
  await checkout.save()
  console.log("Saved")
  res.json({
    success: true,
    name: user.name,
  })
})

// Get all orders
app.get('/getorders', async (req, res) => {
  try {
    const limit = 100
    const checkouts = await Checkout.find({})
    console.log(`Fetched ${checkouts.length} orders`)
    res.send(checkouts)
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: 'Error fetching orders' })
  }
})

app.get('/getorders2', async (req, res) => {
  try {
    const limit = 100
    const checkouts = await Checkout.find({})
    const totalCount = await Checkout.countDocuments()
    console.log(`Fetched ${checkouts.length} checkouts`)
    res.json({ checkouts, totalCount })
    // res.json({ products, totalCount })
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: 'Error fetching checkouts' })
  }
})

// Create update order
app.post('/updateorders', async (req, res) => {
  const { id, nama_customer, no_telp_customer, alamat_customer, products } = req.body;

  try {
    // Find the order by ID and update the fields
    const updatedOrder = await Checkout.findOneAndUpdate(
      { id: id }, // Assuming 'id' is the unique identifier for the order
      {
        nama_customer: nama_customer,
        no_telp_customer: no_telp_customer,
        alamat_customer: alamat_customer,
        products: products, // Update products if necessary
      },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    console.log("Updated Order:", updatedOrder);
    res.json({ success: true, message: 'Order updated successfully', updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/removeorders', async (req, res) => {
  await Checkout.findOneAndDelete({ id: req.body.id })
  console.log("Removed")
  res.json({
    success: true,
    name: req.body.name,
  })
})

// Get all orders for user
app.get('/allorders', fetchUser, async (req, res) => {
  const userId = req.user.id
  try {
    const checkouts = await Checkout.find({ user_id: userId }).populate('products')
    const totalCount = await Checkout.countDocuments({ user_id: userId })
    console.log(`Fetched ${checkouts.length} orders for user ${userId}`)
    res.json({ checkouts, totalCount })
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: 'Error fetching orders' })
  }
})

// Get order total by order ID
app.get('/order/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log("Received request for order ID:", orderId); // Debugging line

    const order = await Checkout.findOne({ id: orderId });

    if (!order) {
      console.log("Order not found for ID:", orderId); // Debugging line
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    console.log("Order found:", order); // Debugging line
    res.json({
      success: true,
      total: order.total,
    });
  } catch (error) {
    console.error("Error fetching order total:", error); // Debugging line
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/total-checkouts', async (req, res) => {
  try {
    const totalCount = await Checkout.countDocuments();

    res.json({
      success: true,
      totalCheckouts: totalCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching total checkouts count' });
  }
});

app.get('/total-products', async (req, res) => {
  try {
    const totalCount = await Product.countDocuments();

    res.json({
      success: true,
      totalProducts: totalCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching total product count' });
  }
});

app.get('/total-users', async (req, res) => {
  try {
    const totalCount = await Users.countDocuments();

    res.json({
      success: true,
      totalUsers: totalCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching total product count' });
  }
});