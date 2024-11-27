import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    AttendenceDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    IsAttend: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
