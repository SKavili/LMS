import React, { useState, useEffect } from 'react';
import { GetAllCompanies } from '../Services/getApiServices';
import { CreateCompany } from '../Services/postApiServices';
import { DeleteCompany } from '../Services/deleteApiServices';
import { UpdateCompany } from '../Services/putApiServices';
import Navbar from '../Navigation/Navbar';

const Company = () => {
    const [companies, setCompanies] = useState([]);
    const [newCompany, setNewCompany] = useState({
        name: '',
        address: '',
        contact_person: '',
        contact_number: ''
    });
    const [editCompany, setEditCompany] = useState(null);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const { response, responseData } = await GetAllCompanies();
            if (response.ok) {
                setCompanies(responseData);
            } else {
                console.error('Error fetching companies:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const handleCreateCompany = async () => {
        try {
            const { response, responseData } = await CreateCompany(newCompany);
            if (response.status === 201) {
                setNewCompany({
                    name: '',
                    address: '',
                    contact_person: '',
                    contact_number: ''
                });
                fetchCompanies();
            } else {
                console.error('Failed to create company. Status:', response.status);
            }
        } catch (error) {
            console.error('Error creating company:', error);
        }
    };

    const handleUpdateCompany = async (id) => {
        try {
            const { response, responseData } = await UpdateCompany(id, editCompany);
            if (response.status === 200) {
                const updatedCompanies = companies.map(company =>
                    company.id === id ? responseData : company
                );
                setCompanies(updatedCompanies);
                fetchCompanies()
                setEditCompany(null); // Reset editCompany state
            } else {
                console.error('Failed to update company. Status:', response.status);
            }
        } catch (error) {
            console.error('Error updating company:', error);
        }
    };

    const handleDeleteCompany = async (id) => {
        try {
            const { response, responseData } = await DeleteCompany(id);
            if (response.status === 200) {
                alert('Deleted Successfully');
                fetchCompanies();
            } else {
                alert('Failed to delete');
                console.error('Failed to delete company. Status:', response.status);
            }
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    return (
        <>
            <Navbar />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Company Management</h1>
                </div>
                <section className="section">
                    <div className="row">
                        <div className='col-lg-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <h2>Create Company</h2>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newCompany.name}
                                            onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                                            placeholder="Enter company name"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newCompany.address}
                                            onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                                            placeholder="Enter address"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newCompany.contact_person}
                                            onChange={(e) => setNewCompany({ ...newCompany, contact_person: e.target.value })}
                                            placeholder="Enter contact person"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newCompany.contact_number}
                                            onChange={(e) => setNewCompany({ ...newCompany, contact_number: e.target.value })}
                                            placeholder="Enter contact number"
                                        />
                                    </div>
                                    <button className="btn btn-primary" onClick={handleCreateCompany}>Create</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className='col-lg-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <h2>Companies</h2>
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Address</th>
                                                <th>Contact Person</th>
                                                <th>Contact Number</th>
                                                <th>Created At</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {companies.map((company) => (
                                                <tr key={company.id}>
                                                    <td>{company.id}</td>
                                                    <td>
                                                        {editCompany && editCompany.id === company.id ? (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={editCompany.name}
                                                                onChange={(e) => setEditCompany({ ...editCompany, name: e.target.value })}
                                                                placeholder="Enter new name"
                                                            />
                                                        ) : (
                                                            company.name
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editCompany && editCompany.id === company.id ? (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={editCompany.address}
                                                                onChange={(e) => setEditCompany({ ...editCompany, address: e.target.value })}
                                                                placeholder="Enter new address"
                                                            />
                                                        ) : (
                                                            company.address
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editCompany && editCompany.id === company.id ? (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={editCompany.contact_person}
                                                                onChange={(e) => setEditCompany({ ...editCompany, contact_person: e.target.value })}
                                                                placeholder="Enter new contact person"
                                                            />
                                                        ) : (
                                                            company.contact_person
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editCompany && editCompany.id === company.id ? (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={editCompany.contact_number}
                                                                onChange={(e) => setEditCompany({ ...editCompany, contact_number: e.target.value })}
                                                                placeholder="Enter new contact number"
                                                            />
                                                        ) : (
                                                            company.contact_number
                                                        )}
                                                    </td>
                                                    <td>{new Date(company.created_at).toLocaleString()}</td>
                                                    <td>
                                                        {editCompany && editCompany.id === company.id ? (
                                                            <>
                                                                <button className="btn btn-success" onClick={() => handleUpdateCompany(company.id)}>Save</button>
                                                                <button className="btn btn-secondary ms-2" onClick={() => setEditCompany(null)}>Cancel</button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button className="btn btn-primary" onClick={() => setEditCompany(company)}>Edit</button>
                                                                {/* <button className="btn btn-danger ms-2" onClick={() => handleDeleteCompany(company.id)}>Delete</button> */}
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Company;
