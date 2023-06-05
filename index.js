const express = require('express')
const mongoose = require('mongoose')
const app = express()
// middleweare


 app.use(express.json())
 app.use(express.urlencoded({ extended: true })); 
// create product schema 
const productsSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  createAdt:{
    type:Date,
    default: Date.now
  }
})
const product = mongoose.model('product',productsSchema)

 const connectDB = async()=>{
  try{
      await mongoose.connect('mongodb://127.0.0.1:27017/test2ProductDB')
        console.log('db is connected')
  }
  catch(erro){
    console.log(`db is not connect ${erro}`)
    
  }
 }
app.listen(3000, async()=>{
  console.log(`the server is runnig  on port of ${3000}`);
  await connectDB()
})

app.get('/',(req,res)=>{
  // console.log('hellwo')
  res.send('Welcome')
  res.end()
})

app.post('/products', async(req,res)=>{
  try{

   

    const newProduct = new product({
       title:req.body.title,
       price:req.body.price,
       description : req.body.description
       
    })
   
   const data = await newProduct.save();
   res.send(data)
    
    res.end()
    
  }
  catch(err){
    console.log(err)
  }
})

app.get('/products',async(req,res)=>{
  try {
    //  const products = await product.find({price: {$gt:50}});
    //  if(products){
    //   res.status(200).send(products.join())
    //  }
    //  else{
    //   res.status(404).send({message:'not fount'})
    //  }

    const price = req.query.price;
    const rating = Number(req.query.rating);
   let  productsAll;
    if(price){
    productsAll = await product.find({$or:[{price:{$gt:price}},{rating:{$gt:rating}}]}).countDocuments()
    }
    else{
      productsAll = await product.find().sort({price:-1})
    }
    if(productsAll){
      res.status(200).send({
        succes:true,
        message:'reutn all',
        data:{
          productsAll
        }
      })
    }
    
  } catch (error) {

    res.status(500).json({message:'server error'})
    
  }
})

app.get("/products/:id" ,async(req,res)=>{
  try {
    const id = req.params.id;
    const products = await product.find({_id:id});
    if(products){
      res.status(200).send(products)
    }
    else{
      res.status(404).send({
        message:'products not found'
      })
    }
    
  } catch (error) {
    res.status(500).json({message:'server error'})
    
  }
})

//delete

app.delete('/products/:id',async(req,res)=>{
  try {
    const id = req.params.id;
    
    const products =  await product.deleteOne({_id:id});
    if(products){
      res.status(200).send({
        success:true,
        message:'return single product',
        data:products
      });
       
    }
    else{
      res.send({
        success:false,
        message:'product not fount'
      })
    }
       
    
    
  } catch (error) {

    res.status(500).json({message:'server error', err: error.message})
  }
})
app.put('/products/:id',async(req,res)=>{
  try {
    const id = req.params.id;
  const updateprct =  await  product.updateOne({_id:id},{$set:{
    price:20
    

    }})
    if(updateprct){
      res.status(200).send({
        seccess:true,
        message:'upadat single produc',
        data:updateprct
      })
      
    }
    else{
      res.status(404).send({
        succes:false,
        message:'produdct was not deleledt with this id'
      })
    }
  } catch (error) {
    
  }
  res.end()
}

)