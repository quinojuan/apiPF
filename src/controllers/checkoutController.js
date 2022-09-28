const Stripe = require('stripe');
const cors = require('cors');
const  {Checkout} = require('../db.js')

const stripe = new Stripe("sk_test_51Lm1TVK1EwVhNCq6eEgsHN6onfdau7VdEZy2EwgkW5q2G0lpgA9TiFJJ4m2AgNOemkqDLeGQkJxixl79Qdr4oz1T00838Pgcji");
// private key from Stripe
let idCheck = ""

const checkoOut = async (req, res) =>{
    try {
        const {id, amount} = req.body;
    const payment = await stripe.paymentIntents.create({
        amount,
        currency: 'USD',
        
        payment_method: id,
        confirm: true
    });
     
    
    let data = {
        transaction : payment.id,
        amount: payment.amount,
        status: payment.status
    }
    
    let checkoutDB = await Checkout.create(data)
    
    //console.log(checkoutDB.dataValues.id, "a verr")
    idCheck = checkoutDB.dataValues.id
   // console.log(data);
    
    res.status(201).json(data)
   // return data
    
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'})
    }
};

 const getCheckout = async (req, res) => {
    try{
        //console.log(idCheck, "ID EN EL GET")
        //transaction
        //amount
        //status
        const check = await Checkout.findByPk(idCheck);
        res.status(201).json(check);  
    }catch(e){
        console.log(e);
		res.status(500).json({ message: 'Server error' });  
    }
}; 


module.exports = {checkoOut, getCheckout}