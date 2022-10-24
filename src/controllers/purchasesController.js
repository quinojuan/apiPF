const { Purchases, Users, Phones, Quantities } = require("../db.js");
const nodemailer = require("nodemailer");



const getAllPurchases = async (req, res) => {
  //falta devolver la quantiy
  try {
    const allPurchases = await Purchases.findAll({
      include: [
        {
          model: Phones,
          attributes: ["model"],
        },
        {
          model: Users,
          attributes: ["email"],
        },
        {
          model: Quantities,
        }
      ],
    });
    let presentacion = allPurchases.map(
      ({ dni, adress, birthday, amount, Users, Phones, id, id_transaction, Quantities }) => {
        let productPresent = []
        for(let j = 0; j<Quantities.length;j++){
        for(let i = 0; i<Phones.length; i++){
          if(Phones[i].PhonePurchases.PurchasesId === Quantities[j].PurchasesQuantities.PurchasesId){
           let productWithQuantity = {
             phone: Phones[i].model,
             quantity: Quantities[i].quantity
            }
            if(!productPresent.includes(productWithQuantity)){
              productPresent.push(productWithQuantity)
            }
          } 
        }
      }
     //este es el momento que me multiplica los productos por cada relacion en la pegada.
     //entonces lo que sigue es basicamente una limpieza de los elementos repetidos
      let productsMap = productPresent.map(item=>{
          return [item.phone,item]
      });
      var productsMapArr = new Map(productsMap); // Pares de clave y valor
      
      let productsClean = [...productsMapArr.values()]; // Conversión a un array
      //hasta aca xd
      console.log(productsClean);

        return {
          id,
          id_transaction,
          dni,
          adress,
          birthday,
          amount,
          email: Users[0].email,
          products: productsClean,
        };
      }
    );
    //console.log(presentacion, "COMPRITAS")

    //allPurchases = allPurchases.map((purchase) => purchase.name);
    res.status(200).json(presentacion);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
};

const postPurchase = async (req, res) => {
  try {
    const { dni, adress, birthday, amount, email, products, transaction } =
      req.body;

      let newPurchase = await Purchases.create({
        dni,
        adress,
        birthday,
        amount,
        id_transaction: transaction,
      }); 
     
    
    let presentacion = {
      dni,
      adress,
      birthday,
      amount,
      id_transaction: transaction,
      email: email,
      products: [],
    };

    //Relacion con user:
    let myUser = await Users.findOne({ where: { email: email } });
    await newPurchase.addUsers(myUser.dataValues.id);
    const purchaseWithUser = await Purchases.findByPk(newPurchase.id, {
      include: [
        {
          model: Users,
        },
      ],
    });
   
    
    //Relacion con phones:
    const promisesPhones = products.map((p) => {
      return new Promise(async (resolve, reject) => {
        let myPhone = await Phones.findOne({ where: { model: p.phone.model } });
        await newPurchase.addPhones(myPhone.dataValues.id);
        myPhone = {
          ...myPhone.dataValues,
          stock: myPhone.dataValues.stock - p.quantity,
        };
        await Phones.update(myPhone, { where: { id: myPhone.id } });
      
        const purchaseWithPhone = await Purchases.findByPk(newPurchase.id,   {
          include: [
            {
              model: Phones,
            },
          ],
        } );
        resolve(presentacion.products.push(purchaseWithPhone));
        reject((err) => console.log(err));
      });
    });
    await Promise.all(promisesPhones);



    //relacion con quantities
    
    const promisesQuantities = products.map((q) => {
      return new Promise(async (resolve, reject) => {
        let myPhone2 = await Phones.findOne({ where: { model: q.phone.model } })
        let quan = await Quantities.findOne({where:{quantity: q.quantity}})
          await myPhone2.addQuantities(quan.dataValues.id)
          await newPurchase.addQuantities(quan.dataValues.id)
        resolve(presentacion.products.push(quan));
        reject((err) => console.log(err));
      });
    });
    await Promise.all(promisesQuantities); 
  


    res.status(200).json(presentacion);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "server error" });
  }
};


/////////////////////////// ENVIO DEL EMAIL LUEGO DE LA COMPRA /////////////////////////////////

const purchaseMail = async (req, res) => {
  try {
    const { adress, amount, email } = req.body; // estoy utilizando solo 3 propiedades pero por body estan llegando muchas mas.
    
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: 'movilgatesapp',
			pass: 'ndqazcbtpvhawpvf' // esta contraseña se genera especificamente en el apartado "contraseñas de aplicaciones" del panel de la cuenta Google que emite el mail
		}                            // limite diario de mails 500
	});
	
	var mailOptions = {
	  from: "ventas@movilgates.com",
	  to: email, // capturo el mail que me llega por body
	  subject: "Gracias por tu compra!",
	  html: `<h1>Gracias por tu compra</h1>
			  <img src="cid:sameValue"/>
			  <h4>Esperamos que disfrutes del producto por un costo de $ ${amount} que adquiriste</h4>
			  <p>El mismo te va a llegar en los proximos días a la dirección: ${adress}</p>
			  <h5>Gracias por confiar en nosotros</h5>`,
	  attachments: [{
		filename: "logo.Movil-Gates.png",
		path: "../client/src/images/logo.Movil-Gates.png",
		cid: "sameValue" // cid (unique identifier of the file) which is a reference to the attachment file
	  }]
	}
	
	transporter.sendMail(mailOptions, (error, info)=> {
	  if(error) {
		res.status(500).send(error.message)
	  } else {
		console.log("Email enviado")
		res.status(200).send("Email enviado correctamente")
	  }
	} )

  } catch (error) {
    console.log(error);
	res.status(500).send(error.message)
  }
};

/////////////////////////// ENVIO DEL EMAIL AL DESPACHAR LA COMPRA /////////////////////////////////

const shippingMail = async (req, res) => {
	try {
	  const { adress, amount, email } = req.body; // ver qué datos realmente se necesitan para elaborar la nota de envio
	  
	  const transporter = nodemailer.createTransport({
		  service: "gmail",
		  auth: {
			  user: 'movilgatesapp',
			  pass: 'ndqazcbtpvhawpvf' // esta contraseña se genera especificamente en el apartado "contraseñas de aplicaciones" del panel de la cuenta Google que emite el mail
		  }                            // limite diario de mails 500
	  });
	  
	  var mailOptions = {
		from: "envios@movilgates.com",
		to: email, // capturo el mail que me llega por body
		subject: "Tu producto está en camino!",
		html: `<h1>Pronto recibirás tu producto</h1>
				<img src="cid:sameValue"/>
				<h4>El producto que compraste ya salió de nuestro centro de distribución</h4>
				<p>El mismo te va a llegar en los proximos días a la dirección: ${adress}</p>
				<h5>Gracias por confiar en nosotros</h5>`,
		attachments: [{
		  filename: "envios.png",
		  path: "../client/src/images/envios.png",
		  cid: "sameValue" // cid (unique identifier of the file) which is a reference to the attachment file
		}]
	  }
	  
	  transporter.sendMail(mailOptions, (error, info)=> {
		if(error) {
		  res.status(500).send(error.message)
		} else {
		  console.log("Email de despacho del producto enviado")
		  res.status(200).send("Email enviado correctamente")
		}
	  } )
  
	} catch (error) {
	  console.log(error);
	  res.status(500).send(error.message)
	}
  };

module.exports = {
  getAllPurchases,
  postPurchase,
  purchaseMail,
  shippingMail
};