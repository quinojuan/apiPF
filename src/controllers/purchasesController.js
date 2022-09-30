const { Purchases, Users, Phones } = require("../db.js");
const nodemailer = require("nodemailer");


const getAllPurchases = async (req, res) => {
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
      ],
    });

    let presentacion = allPurchases.map(
      ({ dni, adress, birthday, amount, Users, Phones }) => {
        return {
          dni,
          adress,
          birthday,
          amount,
          email: Users[0].email,
          products: Phones[0].model,
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
    //console.log(req.body, "a ver que llega por body")
    //console.log(newPurchase, "LA COMPRITA")

    let myUser = await Users.findOne({ where: { email: email } });
    await newPurchase.addUsers(myUser.dataValues.id);
    const purchaseWithUser = await Purchases.findByPk(newPurchase.id, {
      include: [
        {
          model: Users,
        },
      ],
    });
    // console.log(myUser.dataValues, "UUUSER")

    let presentacion = {
      dni,
      adress,
      birthday,
      amount,
      id_transaction: transaction,
      email: purchaseWithUser.Users[0].email,
      products: [],
    };

    const promises = products.map((p) => {
      return new Promise(async (resolve, reject) => {
        let myPhone = await Phones.findOne({ where: { model: p.phone.model } });
        await newPurchase.addPhones(myPhone.dataValues.id);
        //preguntarle a req.body.products cuantas veces enviaron el mismo product
        //en base a la cantidad de ese product, updatear el stock en BD
        myPhone = {
          ...myPhone.dataValues,
          stock: myPhone.dataValues.stock - p.quantity,
        };
        await Phones.update(myPhone, { where: { id: myPhone.id } });

        //aca habria que descontarle del stock a dicho phone por cada quantity del producto en la compra
        const purchaseWithPhone = await Purchases.findByPk(newPurchase.id, {
          include: [
            {
              model: Phones,
            },
          ],
        });
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
