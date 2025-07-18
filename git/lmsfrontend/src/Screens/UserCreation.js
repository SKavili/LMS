import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navigation/Navbar';
import { GetAllCompanies, GetAllRoles, GetAllUsers } from '../Services/getApiServices';
import { CreateUser } from '../Services/postApiServices';
import { updateUser } from '../Services/putApiServices';
import { DeleteUser } from '../Services/deleteApiServices';
import { CreateRole } from '../Services/postApiServices'; // Import the service to create a new role

const UserCreation = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [company, setCompany] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [roleOptions, setRoleOptions] = useState([]);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const [passwordDisabled, setPasswordDisabled] = useState(false);
    const [newRoleVisible, setNewRoleVisible] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    useEffect(() => {
        fetchUsers();
        fetchRoleOptions();
        fetchCompanies();
    }, []);
    const emailInputRef = useRef(null); // Step 1: Create a reference for the email input
    const fetchRoleOptions = async () => {
        try {
            const { response, responseData } = await GetAllRoles();
            if (response.ok) {
                const filteredRoles = responseData.filter(role => role.name.toLowerCase() !== 'admin');
                setRoleOptions(filteredRoles);
            } else {
                console.error('Error fetching roles:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const { response, responseData } = await GetAllUsers();
            if (response.ok) {
                setUsers(responseData);
            } else {
                console.error('Error fetching users:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchCompanies = async () => {
        try {
            const { response, responseData } = await GetAllCompanies();
            if (response.ok) {
                setCompanyOptions(responseData);
            } else {
                console.error('Error fetching companies:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const companyId = company ? company : 4;
            const R_data = {
                email: email,
                password: password,
                username: username,
                role_id: role,
                company_id: companyId
            };

            const { response, responseData } = await CreateUser(R_data);

            if (response.ok) {
                alert('User created successfully');
                fetchUsers();
                resetForm();
            } else if (response.status === 409) {
                alert('User Is Already Exist With This Email');
                //console.error('Error creating user:', responseData);
            }

            else {
                setMessage('Error creating user');
                console.error('Error creating user:', responseData);
            }
        } catch (error) {
            setMessage('Error creating user');
            console.error('Error creating user:', error);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const companyId = company ? company : 4;
            const R_data = {
                email: email,
                username: username,
                role_id: role,
                company_id: companyId
            };

            const { response, responseData } = await updateUser(editUserId, R_data);

            if (response.ok) {
                alert('User updated successfully');
                fetchUsers();
                resetForm();
            } else {
                setMessage('Error updating user');
                console.error('Error updating user:', responseData);
            }
        } catch (error) {
            setMessage('Error updating user');
            console.error('Error updating user:', error);
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setUsername('');
        setRole('');
        setCompany('');
        setIsEditing(false);
        setEditUserId(null);
        setPasswordDisabled(false);
    };

    const handleEditUser = (user) => {
        setEmail(user.email);
        setPasswordDisabled(true);
        setUsername(user.username);
        setRole(user.role_id);
        setCompany(user.company_id);
        setIsEditing(true);
        setEditUserId(user.id);
        emailInputRef.current.focus(); // Step 3: Focus on the email input
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const { response, responseData } = await DeleteUser(id);

                if (responseData.message === "Deleted") {
                    setMessage('User deleted successfully');
                    alert('User deleted successfully');
                    fetchUsers();
                } else {
                    alert('Error deleting user');
                    //console.error('Error deleting user:', await response.json());
                }
            } catch (error) {
                setMessage('Error deleting user');
                console.error('Error deleting user:', error);
            }
        } else {
            alert('Deletion cancelled');
        }
    };

    const handleAddNewRole = async () => {
        try {
            const newRole = { name: newRoleName };
            const { response, responseData } = await CreateRole(newRole);

            if (response.ok) {
                setMessage('Role added successfully');
                setRoleOptions([...roleOptions, responseData]); // Append the new role to the role options 
                setNewRoleName('');
                setNewRoleVisible(false);
            } else {
                setMessage('Error adding role');
                console.error('Error adding role:', responseData);
            }
        } catch (error) {
            setMessage('Error adding role');
            console.error('Error adding role:', error);
        }
    };

    return (
        <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}>
            <Navbar toggleSidebar={toggleSidebar} />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>{isEditing ? 'Edit User' : 'Create User'}</h1>
                </div>
                <section className="section">
                    <div className="row">
                        <div className='col-lg-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <br></br>
                                    <form class="row g-3" onSubmit={isEditing ? handleUpdateUser : handleCreateUser}>
                                        <div className="col-md-4">
                                            <label className="form-label"> Username: </label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="username"
                                                placeholder='Username'
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </div>


                                        <div className="col-md-4">
                                            <label className="form-label"> Password: </label>
                                            <input
                                                className="form-control"
                                                type="password"
                                                id="password"
                                                placeholder='Password'
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required={!isEditing}
                                                disabled={passwordDisabled}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label"> Email: </label>
                                            <input
                                                className="form-control"
                                                type="email"
                                                id="email"
                                                placeholder='Email'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                ref={emailInputRef} // Step 2: Attach the reference to the email input
                                                required
                                            />
                                        </div>




                                        <div className="col-md-4">
                                            <label className="form-label"> Role: </label>
                                            <div className="d-flex align-items-center">
                                                <select
                                                    className="form-control"
                                                    id="role"
                                                    value={role}
                                                    onChange={(e) => setRole(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Role</option>
                                                    {roleOptions.map((r) => (
                                                        <option key={r.id} value={r.id}>
                                                            {r.name}
                                                        </option>
                                                    ))}
                                                </select> &nbsp;
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary ml-2"
                                                    onClick={() => setNewRoleVisible(true)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        {newRoleVisible && (
                                            <>
                                                <div className="col-md-4">
                                                    <label className="form-label"> Enter new role: </label>
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder="Enter new role"
                                                        value={newRoleName}
                                                        onChange={(e) => setNewRoleName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary mt-4"
                                                        onClick={handleAddNewRole}
                                                    >
                                                        Save Role
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                        <div className="col-md-4">
                                            <label className="form-label">Company </label>
                                            <select
                                                className="form-control"
                                                id="company"
                                                value={company}
                                                onChange={(e) => setCompany(e.target.value)}
                                            >
                                                <option value="0">Select Company Name</option>
                                                {companyOptions.map((companyName, index) => (
                                                    <option key={index} value={companyName.id}>
                                                        {companyName.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-4">

                                            <button type="submit" className='btn btn-primary mt-2erm'>
                                                {isEditing ? 'Update User' : 'Create User'}
                                            </button>
                                        </div>
                                    </form>

                                    <div className="users-list mt-4">
                                        <div class="pagetitle">
                                            <h1>Users List</h1>
                                        </div>
                                        <div class="table-responsive">
                                            <table className="table table-striped table-bordered LMS_table">
                                                <thead>
                                                    <tr>

                                                        <th>Username</th>
                                                        <th>Email</th>
                                                        <th>Role</th>
                                                        <th>Company</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.map((user) => (
                                                        <tr key={user.id}>
                                                            <td>{user.username}</td>
                                                            <td>{user.email}</td>
                                                            <td>{user.role_name}</td>
                                                            <td>{user.company_name}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-secondary"
                                                                    onClick={() => handleEditUser(user)}
                                                                >
                                                                    Edit
                                                                </button>&nbsp;
                                                                <button
                                                                    className="btn btn-danger"
                                                                    onClick={() => handleDeleteUser(user.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UserCreation;
