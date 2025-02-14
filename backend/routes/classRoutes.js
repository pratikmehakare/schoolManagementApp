const express = require('express');
const { getAllClasses,createClass,getClassById,updateClass,deleteClass } = require('../controllers/classController');
const router = express.Router();

router.get('/', getAllClasses);
router.post('/', createClass);
router.get('/:id',getClassById);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);


module.exports = router;
