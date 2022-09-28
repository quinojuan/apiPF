const { Purchases, Users, Phones } = require('../db.js');

const getAllPurchases = async (req, res) => {
	try {
		const allPurchases = await Purchases.findAll(( {
			include: [
			  {
				model: Phones,
				attributes: ['model']
			  },{
				model: Users,
				attributes: ['email']
			  }
			],
		  }));
            
		  let presentacion = allPurchases.map(({dni,adress,birthday,amount,Users, Phones})=>{
			return {
				dni,
				adress,
				birthday,
				amount,
				email: Users[0].email,
				products: Phones[0].model
			  } 
			  
		  })
		  //console.log(presentacion, "COMPRITAS")
		
		  //allPurchases = allPurchases.map((purchase) => purchase.name);
		res.status(200).json(presentacion);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error' });
	}
};

const postPurchase = async (req, res) =>{
	try{
		const {dni, adress, birthday, amount, email, products, transaction } = req.body
		let newPurchase = await Purchases.create({
			dni,
			adress,
			birthday,
			amount,
			id_transaction: transaction
		})
        //console.log(req.body, "a ver que llega por body")
		//console.log(newPurchase, "LA COMPRITA")

		let myUser = await Users.findOne({ where: { email: email } })
		await newPurchase.addUsers(myUser.dataValues.id)
		const purchaseWithUser = await Purchases.findByPk(newPurchase.id,{
			include:[{
				model: Users
			}]
		})
	   // console.log(myUser.dataValues, "UUUSER")

	   let presentacion ={
		 dni,
		 adress,
		 birthday,
		 amount,
		 id_transaction: transaction,
		 email: purchaseWithUser.Users[0].email,
		 products: []
	   } 

	   const promises = products.map((p) => {
          return new Promise(async (resolve, reject) => {
			let myPhone = await Phones.findOne({where:{ model: p.model}})
			await newPurchase.addPhones(myPhone.dataValues.id)
			//aca habria que descontarle del stock a dicho phone por cada quantity del producto en la compra
			const purchaseWithPhone = await Purchases.findByPk(newPurchase.id,{
				include:[{
				  model: Phones
				 }]
			   })
             resolve(presentacion.products.push(purchaseWithPhone));
             reject((err) => console.log(err));
           });
         });
         await Promise.all(promises);
       
    
	 /*    let myPhone = await Phones.findOne({where:{ model: products[0].model}})
	    await newPurchase.addPhones(myPhone.dataValues.id)
	    const purchaseWithPhone = await Purchases.findByPk(newPurchase.id,{
		  include:[{
			model: Phones
		   }]
	     }) */

	  res.status(200).json(presentacion)
	}catch(e){
		console.log(e)
		res.status(500).json({message: "server error"})
	}
} 

module.exports = {
	getAllPurchases,
	postPurchase
};