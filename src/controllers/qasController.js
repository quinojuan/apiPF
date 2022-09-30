const { Qas, Users, Phones } = require('../db');

const getAllQas = async (req, res) => {
	
	try {
		const allQas = await Qas.findAll(( {
			include: [
			  {
				model: Phones,
				attributes: ['model']
			  },{
				model: Users,
				attributes: ['email']
			  }
			],
		  }))
		let presentacion = allQas.map(({id, questions, answers, Phones, Users})=>{
			console.log(Users)
			return {
				id,
				questions,
                answers,
				email: Users[0].email,
				product: Phones[0].model
			}
		})
		presentacion
		?res.status(201).json(presentacion)
		:res.status(404).json({message: 'Error /get qas'})
	} catch (e) {
		console.log(e);
		res.status(505).json({message: 'Server error'})
	}
};

 const updateQas = async (req, res) => {
	 try {
		 const { id } = req.params;
		 console.log(id, "IDDD")
		//console.log(req.body, "BODY")
		let [qa] = await Qas.update(req.body, {where: {id}})
		console.log(qa, "FEED")
		if(qa){
			res.status(201).json(qa)
		} else{
			res.status(404).json({message: 'Error /put qas'})
		}
	} catch (e) {
		console.log(e);
		res.status(500).json({message: 'Error missing info'})
	}
};  

  const postQa = async (req, res) => {
	try {
		const {
			questions,
			email,
			model
		} = req.body;
		if(questions){
          const newQa = await Qas.create({
			questions
		  })
          
		  let myUser = await Users.findOne({ where: { email: email } })
		  
		  await newQa.addUsers(myUser.dataValues.id)
		  const qaWithUser = await Qas.findByPk(newQa.id,{
			  include:[{
				  model: Users
			  }]
		  })
          
		  let myPhone = await Phones.findOne({where:{ model: model}})
		  await newQa.addPhones(myPhone.dataValues.id)
		  const qaWithPhone = await Qas.findByPk(newQa.id,{
			include:[{
			  model: Phones
			 }]
		   }) 
		   console.log(qaWithUser,"feedbackWithUser")
		   console.log(qaWithPhone,"feedbackWithPhone")


		   let presentacion = {
			   questions,
			   email: qaWithUser.Users[0].email,
			   model: qaWithPhone.Phones[0].model
		   }
		   res.status(201).json(presentacion)
		}else{
          
		  res.status(404).json({message: 'Error /post qa'})
		}
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'error, missing info' })
	}
};  


module.exports = {
	getAllQas,
	updateQas,
	postQa,
}; 