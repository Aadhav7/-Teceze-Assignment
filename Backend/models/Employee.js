const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', counterSchema);

const employeeSchema = new mongoose.Schema({
  employeeNo: { type: Number, unique: true },
  employeeName: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true },
  salary: { type: Number, required: true, min: 0.01 }
}, { timestamps: true });

employeeSchema.pre('save', async function () {
  if (!this.isNew) return;

  const counter = await Counter.findByIdAndUpdate(
    { _id: 'employeeNo' },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true }
  );
  this.employeeNo = counter.seq;
});

module.exports = mongoose.model('Employee', employeeSchema);
