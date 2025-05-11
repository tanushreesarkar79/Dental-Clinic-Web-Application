// routes/appointmentRoutes.js

const express = require('express');
const { rescheduleAppointment } = require('../controllers/appointmentController');
const router = express.Router();

router.put('/reschedule/:id', rescheduleAppointment);

module.exports = router;
