const API_URL = '/api/employees';
let editEmployeeId = null;

const employeeTableBody = document.getElementById('employee-table-body');
const noDataMsg = document.getElementById('no-data-msg');
const formModal = document.getElementById('form-modal');
const employeeForm = document.getElementById('employee-form');
const modalTitle = document.getElementById('modal-title');
const formError = document.getElementById('form-error');

const empNameInput = document.getElementById('emp-name');
const empDesignationInput = document.getElementById('emp-designation');
const empSalaryInput = document.getElementById('emp-salary');

async function fetchEmployees() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        renderTable(data);
    } catch (err) {
        console.error('Error fetching employee records:', err);
    }
}

function renderTable(employees) {
    employeeTableBody.innerHTML = '';
    
    if (!employees || employees.length === 0) {
        noDataMsg.classList.remove('hidden');
        return;
    }
    noDataMsg.classList.add('hidden');

    employees.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="font-mono">#${String(emp.employeeNo).padStart(3, '0')}</td>
            <td style="font-weight: 600;">${emp.employeeName}</td>
            <td>${emp.designation}</td>
            <td style="font-weight: 500;">$${Number(emp.salary).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            <td class="text-right">
                <button class="action-btn edit-btn" onclick="openEditModal(${JSON.stringify(emp).replace(/"/g, '&quot;')})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteEmployee(${emp.employeeNo})">Delete</button>
            </td>
        `;
        employeeTableBody.appendChild(row);
    });
}

document.getElementById('add-emp-btn').addEventListener('click', () => {
    editEmployeeId = null;
    modalTitle.innerText = 'Add New Employee';
    employeeForm.reset();
    formError.classList.add('hidden');
    formModal.classList.remove('hidden');
});

function openEditModal(emp) {
    editEmployeeId = emp.employeeNo;
    modalTitle.innerText = 'Edit Employee Details';
    formError.classList.add('hidden');
    
    empNameInput.value = emp.employeeName;
    empDesignationInput.value = emp.designation;
    empSalaryInput.value = emp.salary;
    
    formModal.classList.remove('hidden');
}

function closeModal() {
    formModal.classList.add('hidden');
    employeeForm.reset();
}

document.getElementById('close-modal-btn').addEventListener('click', closeModal);
document.getElementById('cancel-btn').addEventListener('click', closeModal);

employeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.classList.add('hidden');

    const payload = {
        employeeName: empNameInput.value.trim(),
        designation: empDesignationInput.value.trim(),
        salary: Number(empSalaryInput.value)
    };

    if (payload.salary < 0) {
        formError.innerText = 'Salary must be a positive number.';
        formError.classList.remove('hidden');
        return;
    }

    try {
        let response;
        if (editEmployeeId) {
            response = await fetch(`${API_URL}/${editEmployeeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Failed to save record.');
        }

        fetchEmployees();
        closeModal();
    } catch (err) {
        formError.innerText = err.message;
        formError.classList.remove('hidden');
    }
});

async function deleteEmployee(employeeNo) {
    if (confirm('Are you sure you want to delete this employee record?')) {
        try {
            const response = await fetch(`${API_URL}/${employeeNo}`, { method: 'DELETE' });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to delete record.');
            }
            fetchEmployees();
        } catch (err) {
            console.error('Error deleting employee:', err);
        }
    }
}

fetchEmployees();