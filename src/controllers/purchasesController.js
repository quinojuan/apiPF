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
            
         

		  let presentacion = allPurchases.map(({dni,adress,birthday,creditCard,email, Users, Phones})=>{
			return {
				dni,
				adress,
				birthday,
				creditCard,
				email: Users[0].username,
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
		const {dni, adress, birthday, creditCard, email, products } = req.body
		let newPurchase = await Purchases.create({
			dni,
			adress,
			birthday,
			creditCard,
			email
		})

		//console.log(newPurchase, "LA COMPRITA")

		let myUser = await Users.findOne({ where: { email: email } })
		await newPurchase.addUsers(myUser.dataValues.id)
		const purchaseWithUser = await Purchases.findByPk(newPurchase.id,{
			include:[{
				model: Users
			}]
		})

	   // console.log(myUser.dataValues, "UUUSER")

	    let myPhone = await Phones.findOne({where:{ model: products}})
		
	    await newPurchase.addPhones(myPhone.dataValues.id)
	    const purchaseWithPhone = await Purchases.findByPk(newPurchase.id,{
		  include:[{
			model: Phones
		   }]
	     })

	  let presentacion ={
		dni,
		adress,
		birthday,
		creditCard,
		email,
		user: purchaseWithUser.Users[0].username,
		products: purchaseWithPhone.Phones[0].model
	  } 
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