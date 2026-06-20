import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import '../App.css'
import './Employees.css'

const API_URL = '/api/employees'

const emptyForm = {
  employeeName: '',
  designation: '',
  salary: '',
}

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [pageError, setPageError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchEmployees = async () => {
    setIsLoading(true)
    setPageError('')

    try {
      const response = await fetch(API_URL)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load employee records.')
      }

      setEmployees(Array.isArray(data) ? data : [])
    } catch (error) {
      setPageError(error.message || 'Failed to fetch employee records.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const openAddModal = () => {
    setEditingEmployee(null)
    setFormData(emptyForm)
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (employee) => {
    setEditingEmployee(employee)
    setFormData({
      employeeName: employee.employeeName || '',
      designation: employee.designation || '',
      salary: employee.salary ?? '',
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingEmployee(null)
    setFormData(emptyForm)
    setFormError('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    const payload = {
      employeeName: formData.employeeName.trim(),
      designation: formData.designation.trim(),
      salary: Number(formData.salary),
    }

    if (!payload.employeeName || !payload.designation || Number.isNaN(payload.salary)) {
      setFormError('All fields are required.')
      return
    }

    if (payload.salary <= 0) {
      setFormError('Salary must be a positive number.')
      return
    }

    const url = editingEmployee
      ? `${API_URL}/${editingEmployee.employeeNo}`
      : API_URL

    try {
      const response = await fetch(url, {
        method: editingEmployee ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save record.')
      }

      await fetchEmployees()
      closeModal()
    } catch (error) {
      setFormError(error.message || 'Failed to save record.')
    }
  }

  const deleteEmployee = async (employeeNo) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this employee record?')
    if (!shouldDelete) return

    setPageError('')

    try {
      const response = await fetch(`${API_URL}/${employeeNo}`, { method: 'DELETE' })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete record.')
      }

      await fetchEmployees()
    } catch (error) {
      setPageError(error.message || 'Failed to delete record.')
    }
  }

  return (
    <div className="page-container">
      <header className="page-header employees-header">
        <div>
          <h1>Employees</h1>
          <p>Manage your team members and their roles</p>
        </div>
        <button className="btn btn-primary add-btn" type="button" onClick={openAddModal}>
          <Plus size={18} /> Add Employee
        </button>
      </header>

      <div className="table-card">
        {pageError && <div className="error-banner">{pageError}</div>}
        <table>
          <thead>
            <tr>
              <th>Employee No</th>
              <th>Employee Name</th>
              <th>Designation</th>
              <th>Salary</th>
              <th className="text-right">Edit</th>
              <th className="text-right">Delete</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id || employee.employeeNo}>
                <td className="font-mono" data-label="Employee No">
                  #{String(employee.employeeNo).padStart(3, '0')}
                </td>
                <td className="employee-name" data-label="Employee Name">{employee.employeeName}</td>
                <td data-label="Designation">{employee.designation}</td>
                <td className="salary" data-label="Salary">
                  ${Number(employee.salary).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="text-right action-cell" data-label="Edit">
                  <button className="action-btn edit-btn" type="button" onClick={() => openEditModal(employee)}>
                    Edit
                  </button>
                </td>
                <td className="text-right action-cell" data-label="Delete">
                  <button className="action-btn delete-btn" type="button" onClick={() => deleteEmployee(employee.employeeNo)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && employees.length === 0 && (
          <div className="no-data">No employee records found.</div>
        )}

        {isLoading && <div className="no-data">Loading employee records...</div>}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingEmployee ? 'Edit Employee Details' : 'Add New Employee'}</h3>
              <button className="close-btn" type="button" onClick={closeModal}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {formError && <div className="error-msg">{formError}</div>}

              <div className="form-group">
                <label htmlFor="employeeName">Employee Name</label>
                <input
                  id="employeeName"
                  name="employeeName"
                  type="text"
                  value={formData.employeeName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Jane Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="designation">Designation</label>
                <input
                  id="designation"
                  name="designation"
                  type="text"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div className="form-group">
                <label htmlFor="salary">Salary ($)</label>
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="form-actions">
                <button className="btn btn-secondary" type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
