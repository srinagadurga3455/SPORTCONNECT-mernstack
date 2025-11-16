const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  createTurf,
  getAllTurfs,
  getTurfById,
  updateTurf,
  deleteTurf,
  getMyTurfs
} = require('../controllers/turfController');

router.post('/', protect, authorize('turf'), createTurf);
router.get('/', getAllTurfs);
router.get('/my-turfs', protect, authorize('turf'), getMyTurfs);
router.get('/:id', getTurfById);
router.put('/:id', protect, authorize('turf'), updateTurf);
router.delete('/:id', protect, authorize('turf'), deleteTurf);

module.exports = router;
