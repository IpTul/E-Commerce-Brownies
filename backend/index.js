const port = 4000
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const { type } = require('os')
let Midtrans = require('midtrans-nodejs-client')

app.use(express.json())
app.use(cors())

// Database Connection
mongoose.connect("mongodb+srv://browniesbrowcious:browniesbrowcious01@browniesbrowcious.3nbw4.mongodb.net/brownies")
// mongoose.connect("mongodb+srv://browniesbrowcious:browniesbrowcious01@browniesbrowcious.3nbw4.mongodb.net/brownies")

// API Createion
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

// image storage
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({ storage: storage })

// createing upload image for product
app.use('/images', express.static('upload/images'))
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  })
})

// creating product
const Product = mongoose.model("Products", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  avilable: {
    type: Boolean,
    default: true,
  },
})

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

// creating api get allproduct
// app.get('/allproducts', async (req, res) => {
//   let products = await Product.find({})
//   console.log("All Product Fetched")
//   res.send(products)
// })

app.get('/allproducts', async (req, res) => {
  try {
    const limit = 100
    const products = await Product.find({})
    const totalCount = await Product.countDocuments()
    console.log(`Fetched ${products.length} products`)
    res.json({ products, totalCount })
    // res.json({ products, totalCount })
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: 'Error fetching products' })
  }
})

// creating user login
const Users = mongoose.model('Users', {
  id_user: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

app.post('/signup', async (req, res) => {
  try {
    // Check if a user with the given email already exists
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ success: false, errors: "Existing user found with the same email address" });
    }

    // Initialize cart
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    // Generate a new user ID
    let id_user = await Users.countDocuments() + 1; // Count existing users to assign a new ID

    // Create a new user instance
    const user = new Users({
      id_user: id_user,
      name: req.body.username,
      email: req.body.email,
      password: req.body.password, // Note: Consider hashing passwords before saving
      cartData: cart,
    });

    // Save the user to the database
    await user.save();

    // Create a token for the user
    const data = {
      user: {
        id: user._id // Use id_user instead of user.id
      }
    };

    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errors: "Internal server error" });
  }
});

app.post('/login', async (req, res) => {
  let user = await Users.findOne({ email: req.body.email })
  if (user) {
    const passCompare = req.body.password == user.password
    if (passCompare) {
      const data = {
        user: {
          id: user.id
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

//creating middleware fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token')
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using a valid token" })
  } else {
    try {
      const data = jwt.verify(token, 'secret_ecom')
      req.user = data.user
      next()
    } catch (error) {
      res.status(401).send({ errors: "Please authenticate using a valid token" })
    }
  }
}

// creating adding product in cart data
app.post('/addtocart', fetchUser, async (req, res) => {
  console.log("Added", req.body.itemId, "Quantity:", req.body.quantity);
  let userData = await Users.findOne({ _id: req.user.id })
  userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + req.body.quantity;
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData })
  res.send("Added")
})

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

// creating promo code model
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

// creating api for create promo code

// app.post('/createpromocode', async (req, res) => {
//   const { code, discount, expirationDate } = req.body

//   try {
//     const promoCode = new PromoCode({ code, discount, expirationDate })
//     await promoCode.save()
//     res.json({ success: true, message: 'Promo code create successfully' })
//   } catch (error) {
//     res.status(400).son({ success: false, message: 'Error creating promo code' })
//   }
// })
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

// creating api for validation promo code
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

// creating api get promo code
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

// creating api remove promo code
app.post('/removecode', async (req, res) => {
  const promocodes = await PromoCode.findOneAndDelete({ id: req.body.id })
  console.log("Remove promo code", promocodes.code)
  res.json({
    success: true,
    name: req.body.code,
  })
})

// creating api for MIDTRANS
// const axios = require('axios')

// const midtransConfig = {
//   serverKey: process.env.SECRET,
//   clientKey: process.env.NEXT_PUBLIC_CLIENT,
//   isProduction: false,
// }

// import { useContext } from 'react'
// import { ShopContext } from '../../Context/ShopContext'
// app.post('/create-payment', async (req, res) => {
//   const { getCartDetails } = useContext(ShopContext)
//   const { totalQuantity, productIds } = getCartDetails();
//   try {
//     const product = productIds
//     if (!product) {
//       return res.status(400).json({success: false, message: 'Product not found'})
//     }

//     const paymentData = {
//       transaction_details: {

//       }
//     }
//   }
// })

const axios = require('axios')
require('dotenv').config()

// const snap = new Midtrans.Snap({
//   isProduction: false,
//   serverKey: process.env.SECRET,
//   clientKey: process.env.NEX_PUBLIC_CLIENT,
// })

app.get('/check-midtrans', async (req, res) => {
  console.log(Midtrans)
  res.send(Midtrans)
  res.json(Midtrans)
})

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

app.post('/createcheckout', fetchUser, async (req, res) => {
  const userId = req.user.id; // This comes from the fetchUser  middleware
  const user = await Users.findById(userId); // Find the user in the database
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
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
  })
  console.log(checkout)
  await checkout.save()
  console.log("Saved")
  res.json({
    success: true,
    name: user.name,
  })
})

app.get('/allorders', fetchUser, async (req, res) => {
  const userId = req.user.id; // Ambil ID pengguna dari objek pengguna yang sudah di-fetch oleh middleware
  try {
    const checkouts = await Checkout.find({ user_id: userId }).populate('products'); // Filter pesanan berdasarkan userId
    const totalCount = await Checkout.countDocuments({ user_id: userId });
    console.log(`Fetched ${checkouts.length} orders for user ${userId}`);
    res.json({ checkouts, totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching orders' });
  }
});