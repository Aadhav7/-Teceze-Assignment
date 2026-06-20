const Employee = require('../models/Employee');

exports.createEmployee = async (req, res) => {
  try {
    const { employeeName, designation, salary } = req.body;
    
    const salaryValue = Number(salary);

    if (!employeeName || !designation || salary === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (Number.isNaN(salaryValue) || salaryValue <= 0) {
      return res.status(400).json({ message: 'Salary must be a positive number.' });
    }

    const newEmployee = new Employee({ employeeName, designation, salary: salaryValue });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error creating employee record.', error: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving employee records.', error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { employeeName, designation, salary } = req.body;
    const salaryValue = Number(salary);

    if (!employeeName || !designation || salary === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (Number.isNaN(salaryValue) || salaryValue <= 0) {
      return res.status(400).json({ message: 'Salary must be a positive number.' });
    }
    
    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeNo: req.params.employeeNo },
      { employeeName, designation, salary: salaryValue },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee record.', error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findOneAndDelete({ employeeNo: req.params.employeeNo });
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    res.status(200).json({ message: 'Employee record deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee record.', error: error.message });
  }
};
