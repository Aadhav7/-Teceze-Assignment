const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.use('/api/employees', employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));