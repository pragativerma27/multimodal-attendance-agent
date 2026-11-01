const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  enrollFaceDescriptor,
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getStudents)
  .post(upload.single('avatar'), createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(upload.single('avatar'), updateStudent)
  .delete(deleteStudent);

router.post('/:id/face-descriptor', enrollFaceDescriptor);

module.exports = router;
