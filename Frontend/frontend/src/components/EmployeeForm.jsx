import { useState } from 'react';
import './EmployeeForm.css.css';

const EmployeeForm = () => {
  // State to manage form toggling (true = Enroll, false = Update)
  const [isEnrollMode, setIsEnrollMode] = useState(true);

  // States for individual input fields
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [salary, setSalary] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  // UI feedback states
  const [message, setMessage] = useState({ text: '', isError: false });

  const API_URL = 'http://localhost:5000/api/employees';

  // Clear inputs and messages
  const resetForm = () => {
    setName('');
    setDesignation('');
    setSalary('');
    setEmployeeId('');
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', isError: false });

    // Determine payload, URL, and HTTP Method based on mode
    const method = isEnrollMode ? 'POST' : 'PUT';
    const url = isEnrollMode ? API_URL : `${API_URL}/${employeeId}`;
    
    const payload = {};
    if (name) payload.name = name;
    if (designation) payload.designation = designation; // Matches your UI field
    if (salary) payload.salary = Number(salary);

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          text: isEnrollMode 
            ? `Employee enrolled successfully! ID: ${data._id || data.data?._id}` 
            : 'Employee updated successfully!',
          isError: false
        });
        resetForm();
      } else {
        setMessage({ text: `Error: ${data.message}`, isError: true });
      }
    } catch {
      setMessage({ text: 'Failed to fetch. Is your backend running on port 5000?', isError: true });
    }
  };

  return (
    <div className="container">
      <button 
        className={`toggle-btn ${isEnrollMode ? 'enroll-theme' : 'update-theme'}`}
        onClick={() => {
          setIsEnrollMode(!isEnrollMode);
          setMessage({ text: '', isError: false });
        }}
      >
        {isEnrollMode ? 'Switch to Update Employee' : 'Switch to Enroll Employee'}
      </button>

      {/* Alert Notification Display */}
      {message.text && (
        <div className={`alert-box ${message.isError ? 'error-bg' : 'success-bg'}`}>
          {message.text}
        </div>
      )}

      <h2>{isEnrollMode ? 'Enroll New Employee' : 'Update Existing Employee'}</h2>

      <form onSubmit={handleSubmit}>
        {/* Only show Database ID input if we are updating an employee */}
        {!isEnrollMode && (
          <div className="form-group">
            <label>Employee Database ID (_id):</label>
            <input 
              type="text" 
              value={employeeId} 
              onChange={(e) => setEmployeeId(e.target.value)} 
              required 
              placeholder="65f... copy from database"
            />
          </div>
        )}

        <div className="form-group">
          <label>Employee Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required={isEnrollMode} // required only on enrollment
            placeholder="Aadhavan"
          />
        </div>

        <div className="form-group">
          <label>Designation:</label>
          <input 
            type="text" 
            value={designation} 
            onChange={(e) => setDesignation(e.target.value)} 
            required={isEnrollMode}
            placeholder="Intern UI/UX Developer"
          />
        </div>

        <div className="form-group">
          <label>Salary ($):</label>
          <input 
            type="number" 
            value={salary} 
            onChange={(e) => setSalary(e.target.value)} 
            required={isEnrollMode}
            placeholder="50"
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          style={{ backgroundColor: isEnrollMode ? '#007bff' : '#ffc107', color: isEnrollMode ? 'white' : 'black' }}
        >
          {isEnrollMode ? 'Submit Registration' : 'Apply Updates'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
