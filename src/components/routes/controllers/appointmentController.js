// controllers/appointmentController.js

const Appointment = require('../models/appointmentModel'); // Assuming a model file exists

exports.rescheduleAppointment = async (req, res) => {
    const { id } = req.params;
    const { rescheduleDate, remarks } = req.body;

    try {
        // Find the appointment and update
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { rescheduleDate, remarks },
            { new: true } // Returns the updated document
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json({
            message: 'Appointment rescheduled successfully',
            appointment: updatedAppointment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
