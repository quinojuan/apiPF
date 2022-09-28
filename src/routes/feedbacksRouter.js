const { Router } = require('express');
const router = Router();
const {
	getAllFeedbacks,
	updateFeedback,
	postFeedback,
	//deleteFeedback,
} = require('../controllers/feedbacksController');

router.get('/', getAllFeedbacks);
router.put('/:id', updateFeedback);
router.post('/', postFeedback);
//router.delete('/:id', deleteFeedback);

module.exports = router;
