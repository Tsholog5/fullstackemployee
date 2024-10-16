import React, { useEffect, useState } from 'react';
import './form.css';
import axios from "axios";

function Form() {
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    last: '',
    gender: '',
    email: '',
    phone: '',
    image: '',
    position: '',
    age: '',
    id: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);

  const validateInputs = () => {
    if (!newEmployee.name) return 'Name is required.';
    if (!newEmployee.email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(newEmployee.email)) return 'Invalid email address.';
    if (!newEmployee.phone || !/^\d+$/.test(newEmployee.phone)) return 'Phone number should contain only digits.';
    if (!newEmployee.gender) return 'Gender is required.';
    if (!newEmployee.position) return 'Position is required.';
    if (!newEmployee.id || !/^\d{13}$/.test(newEmployee.id)) return 'ID should be exactly 13 digits.';
    return '';
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/deleteEmployee/${id}`);
      setEmployees(employees.filter(employee => employee.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee. Please try again.');
    }
  };

  const editEmployee = (employee) => {
    setNewEmployee(employee);
    setIsEditing(true);
    setCurrentEmployeeId(employee.id);
    setShowForm(true);
    setShowList(false);
  };

  const handleSubmit = async () => {
    const errorMsg = validateInputs();
    if (errorMsg) {
        setError(errorMsg);
        return;
    }

    const employeeData = {
        firstName: newEmployee.name,
        lastName: newEmployee.lastName || '', // Ensure this field is optional
        idNumber: newEmployee.id,
        gender: newEmployee.gender,
        email: newEmployee.email,
        phone: newEmployee.phone,
        position: newEmployee.position,
        image: newEmployee.image,
        age: newEmployee.age,
    };

    console.log("Submitting employee data:", employeeData); // Log the employee data

    try {
        let response;

        if (isEditing) {
            response = await axios.put(`http://localhost:5000/api/updateEmployee/${currentEmployeeId}`, employeeData);
        } else {
            response = await axios.post('http://localhost:5000/api/addEmployee', employeeData);
        }

        if (response.status === 201 || response.status === 200) {
            alert(isEditing ? 'Employee successfully updated' : 'Employee successfully added');
            setEmployees(isEditing
                ? employees.map(emp => (emp.id === currentEmployeeId ? { ...emp, ...employeeData } : emp))
                : [...employees, response.data]
            );
        } else {
            alert(`Error during submission: ${response.data.message}`);
        }

        resetForm();
    } catch (error) {
        console.error('Error during form submission:', error);
        if (error.response && error.response.data) {
            alert(`An error occurred: ${error.response.data.message}`);
        } else {
            alert('An error occurred during form submission. Please try again.');
        }
    }
};

  const resetForm = () => {
    setNewEmployee({
      name: '',
      gender: '',
      email: '',
      phone: '',
      position: '',
      id: '',
      image: ''
    });
    setIsEditing(false);
    setError('');
  };

  useEffect(() => {
    FetchEmployees();
  }, []);

  const FetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/getEmployees');
      setEmployees(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees", error.message);
      setError("Error fetching employees");
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilteredEmployees(employees.filter(employee =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || employee.id.includes(searchQuery)
    ));
  };

  const handleShowForm = () => {
    setShowForm(true);
    setShowList(false);
  };

  const handleShowList = () => {
    setShowForm(false);
    setShowList(true);
  };

  const getGenderIcon = (gender) => {
    if (gender === 'male') {
      return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpC650bxBEk2zBAQj64HdZ770dTVGbO_lm9A&s';
    } else if (gender === 'female') {
      return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzVvc_1EbinQldCVFBX3uJ5vKe8LQP6CvhXA&s';
    }
    return null;
  };

  return (
    <div className="app-container">
      <h1>Employee Management</h1>
      <div className="nav-buttons">
        <button className={`nav-button ${showForm ? 'active' : ''}`} onClick={handleShowForm}>Show Employee Form</button>
        <button className={`nav-button ${showList ? 'active' : ''}`} onClick={handleShowList}>Show Employee List</button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{isEditing ? 'Edit Employee' : 'Add Employee'}</h2>
          <input type="text" placeholder="Name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} />
          <input type="text" placeholder="Last" value={newEmployee.last} onChange={(e) => setNewEmployee({ ...newEmployee, last: e.target.value })} />
          <input type="email" placeholder="Email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} />
          <input type="text" placeholder="Phone number" value={newEmployee.phone} onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} />
          <select value={newEmployee.gender} onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value })}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {newEmployee.gender && (
            <img src={getGenderIcon(newEmployee.gender)} alt={`${newEmployee.gender} Icon`} className="gender-icon" />
          )}
          <input type="text" placeholder="Position" value={newEmployee.position} onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })} />
          <input type="text" placeholder="ID" value={newEmployee.id} onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })} />
          <input type="file" onChange={(e) => setNewEmployee({ ...newEmployee, image: URL.createObjectURL(e.target.files[0]) })} />
          <input type="text" placeholder="Age" value={newEmployee.age} onChange={(e) => setNewEmployee({ ...newEmployee, age: e.target.value })} />
          {error && <p className="error">{error}</p>}
          <button className="form-button" onClick={handleSubmit}>
            {isEditing ? 'Update Employee' : 'Add Employee'}
          </button>
          {isEditing && <button className="form-button" onClick={resetForm}>Cancel</button>}
        </div>
      )}

      {showList && (
        <div className="list-container">
          <h2>Employee List</h2>
          <input type="text" placeholder="Search by ID or Name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <button onClick={handleSearch}>Search</button>
          <div className="employee-list">
            {(searchQuery ? filteredEmployees : employees).map((employee) => (
              <div key={employee.id} className="employee-card">
                <img src={employee.image} alt="Employee" className="employee-image" />
                <h3>{employee.name}</h3>
                <p>Gender: {employee.gender}</p>
                <p>Email: {employee.email}</p>
                <p>Phone: {employee.phone}</p>
                <p>Position: {employee.position}</p>
                <p>ID: {employee.id}</p>
                <button onClick={() => editEmployee(employee)}>Edit</button>
                <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Form;
