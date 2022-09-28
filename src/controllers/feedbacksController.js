const { Feedbacks, Users, Phones } = require('../db');

const getAllFeedbacks = async (req, res) => {
	
	try {
		const allFeedbacks = await Feedbacks.findAll(( {
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
		let presentacion = allFeedbacks.map(({id, comment, title, points, Phones, Users})=>{
			console.log(Users)
			return {
				id,
				comment,
				title,
				points,
				email: Users[0].email,
				product: Phones[0].model
			}
		})
		presentacion
		?res.status(201).json(presentacion)
		:res.status(404).json({message: 'Error /get feedbacks'})
	} catch (e) {
		console.log(e);
		res.status(505).json({message: 'Server error'})
	}
};

 const updateFeedback = async (req, res) => {
	 try {
		 const { id } = req.params;
		 console.log(id, "IDDD")
		//console.log(req.body, "BODY")
		let [feedback] = await Feedbacks.update(req.body, {where: {id}})
		console.log(feedback, "FEED")
		if(feedback){
			res.status(201).json(feedback)
		} else{
			res.status(404).json({message: 'Error /put feedbacks'})
		}
	} catch (e) {
		console.log(e);
		res.status(500).json({message: 'Error missing info'})
	}
};  

const postFeedback = async (req, res) => {
	try {
		const {
			comment,
			title,
			points,
			email,
			model
		} = req.body;
		if(comment && title && points){
          const newFeedback = await Feedbacks.create({
			comment,
			title,
			points,

		  })
          
		  let myUser = await Users.findOne({ where: { email: email } })
		  
		  await newFeedback.addUsers(myUser.dataValues.id)
		  const feedbackWithUser = await Feedbacks.findByPk(newFeedback.id,{
			  include:[{
				  model: Users
			  }]
		  })
          
		  let myPhone = await Phones.findOne({where:{ model: model}})
		  await newFeedback.addPhones(myPhone.dataValues.id)
		  const feedbackWithPhone = await Feedbacks.findByPk(newFeedback.id,{
			include:[{
			  model: Phones
			 }]
		   }) 
		   console.log(feedbackWithUser,"feedbackWithUser")
		   console.log(feedbackWithPhone,"feedbackWithPhone")


		   let presentacion = {
			   comment,
			   title,
			   points,
			   email: feedbackWithUser.Users[0].email,
			   model: feedbackWithPhone.Phones[0].model
		   }
		   res.status(201).json(presentacion)
		}else{
          
		  res.status(404).json({message: 'Error /post feedback'})
		}
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'error, missing info' })
	}
};

/* const deleteFeedback = (req, res) => {
	const { id } = req.params;
	try {
		//
	} catch (e) {
		//
	}
}  */

module.exports = {
	getAllFeedbacks,
	updateFeedback,
	postFeedback,
	//deleteFeedback,
};
