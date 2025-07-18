import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../Navigation/Navbar';
import { GetAllCompanies, GetAllCourses, GetAllTrainingDetails, GetAllUsers } from '../Services/getApiServices';
import { CreateTraining } from '../Services/postApiServices';
import { DeleteTrainingDetails } from '../Services/deleteApiServices';
import { UpdateTrainingDetails } from '../Services/putApiServices';

const CreateTrainingDetails = () => {
    const [courseName, setCourseName] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [trainingType, setTrainingType] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const [trainingName, setTrainingName] = useState('');
    const [listOfCourses, setListOfCourses] = useState([]);
    const [company, setCompany] = useState('');
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [trainingDetails, setTrainingDetails] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTrainingId, setCurrentTrainingId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toFocus = useRef(null);

    useEffect(() => {
        fetchUsers();
        fetchCompanies();
        fetchCourses();
        fetchTrainingDetails();
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleFacultyChange = (e) => {
        setSelectedFaculty(e.target.value);
    };

    const handleCompanyChange = (e) => {
        setCompany(e.target.value);
    };

    const handleTrainingTypeChange = (e) => {
        setTrainingType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const company_Id = company ? company : 4;
            const trainingData = {
                course_id: courseName,
                training_name: trainingName,
                from_date: fromDate,
                to_date: toDate,
                training_type: trainingType,
                faculty_id: selectedFaculty,
                company_id: company_Id
            };
            let response, responseData;
            if (isEditing) {
                ({ response, responseData } = await UpdateTrainingDetails(currentTrainingId, trainingData));
            } else {
                ({ response, responseData } = await CreateTraining(trainingData));
            }
            if (response.status === 201 || response.status === 200) {
                alert(`Training details ${isEditing ? 'updated' : 'created'} successfully`);
                clearFormFields();
                fetchTrainingDetails();
            } else {
                console.error(`Error ${isEditing ? 'updating' : 'creating'} training details:`, response.statusText);
                alert(`Failed to ${isEditing ? 'update' : 'create'} training details`);
            }
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'creating'} training details:`, error);
            alert(`Failed to ${isEditing ? 'update' : 'create'} training details`);
        }
    };

    const clearFormFields = () => {
        setCourseName('');
        setTrainingName('');
        setFromDate('');
        setToDate('');
        setTrainingType('');
        setSelectedFaculty('');
        setCompany('');
        setIsEditing(false);
        setCurrentTrainingId(null);
    };

    const fetchUsers = async () => {
        try {

            const { response, responseData } = await GetAllUsers();
            if (response.ok) {
                const filteredUsers = responseData.filter(user => user.role_id === 2);
                setFaculties(filteredUsers);
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
                setFilteredCompanies(responseData);
            } else {
                console.error('Error fetching companies:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const { response, responseData } = await GetAllCourses();
            if (response.ok) {
                setListOfCourses(responseData);
            } else {
                console.error('Error fetching courses:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchTrainingDetails = async () => {
        try {
            
            const { response, responseData } = await GetAllTrainingDetails();
            if (response.ok) {
                const formattedData = responseData.map(training => ({
                    ...training,
                    from_date: training.from_date ? new Date(training.from_date).toLocaleDateString('en-GB') : '',
                    to_date: training.to_date ? new Date(training.to_date).toLocaleDateString('en-GB') : ''
                }));
                setTrainingDetails(formattedData);
            } else {
                console.error('Error fetching training details:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching training details:', error);
        }
    };

    const handleEdit = (training) => {
        setCourseName(training.course_id);
        setTrainingName(training.training_name);
        setFromDate(training.from_date);
        setToDate(training.to_date);
        setTrainingType(training.training_type);
        setSelectedFaculty(training.faculty_id);
        setCompany(training.company_id);
        setIsEditing(true);
        setCurrentTrainingId(training.id);

        // Focus on the first input field after setting state

        //    toFocus.current.focus();

    };


    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this training detail?')) {
            try {
                const { response } = await DeleteTrainingDetails(id);
                if (response.ok) {
                    alert('Training detail deleted successfully');
                    fetchTrainingDetails();
                } else {
                    console.error('Error deleting training detail:', response.statusText);
                    alert('Failed to delete training detail');
                }
            } catch (error) {
                console.error('Error deleting training detail:', error);
                alert('Failed to delete training detail');
            }
        }
    };

    return (
        <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}>
            <Navbar toggleSidebar={toggleSidebar} />

            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>{isEditing ? 'Edit' : 'Create'} Training Details</h1>
                </div>
                <section className="section">
                    <div className="row">
                        <div className='col-lg-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <form className="row g-3" onSubmit={handleSubmit}>
                                        <div className="col-md-4">
                                            <label className="form-label">Company Name:</label>
                                            <select className="form-control" value={company} onChange={handleCompanyChange}>
                                                <option value="" disabled>Select Company Name</option>
                                                {filteredCompanies.map((companyName) => (
                                                    <option key={companyName.id} value={companyName.id}>
                                                        {companyName.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Course Name:</label>
                                            <select className="form-control" value={courseName} onChange={(e) => setCourseName(e.target.value)} required>
                                                <option value="" disabled>Select Course</option>
                                                {listOfCourses.map(course => (
                                                    <option key={course.id} value={course.id}>{course.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Training Name:</label>
                                            <input type="text" className="form-control" value={trainingName} onChange={(e) => setTrainingName(e.target.value)} required />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Training Type:</label>
                                            <select className="form-control" value={trainingType} onChange={(e) => setTrainingType(e.target.value)} required>
                                                <option disabled value="">Select Training Type</option>
                                                <option value="Online">Online</option>
                                                <option value="Offline">Offline</option>
                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Faculty:</label>
                                            <select className="form-control" value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)} required>
                                                <option value="" disabled>Select Faculty</option>
                                                {faculties.map(faculty => (
                                                    <option key={faculty.id} value={faculty.id}>{faculty.username}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-2">
                                            <label className="form-label">From Date:</label>
                                            <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
                                        </div>

                                        <div className="col-md-2">
                                            <label className="form-label">To Date:</label>
                                            <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} required />
                                        </div>

                                        <div className="col-md-2">
                                            <button type="submit" className='btn btn-primary mt-2'>{isEditing ? 'Update' : 'Submit'}</button>
                                        </div>
                                    </form>
                                    <br />

                                    <div className="pagetitle">
                                        <h1>Training Details</h1>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-striped table-bordered LMS_table">
                                            <thead>
                                                <tr>
                                                    <th>Course Name</th>
                                                    <th>Training Name</th>
                                                    <th>From Date</th>
                                                    <th>To Date</th>
                                                    <th>Training Type</th>
                                                    <th>Faculty</th>
                                                    <th>Company</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {trainingDetails.map(training => (
                                                    <tr key={training.id}>
                                                        <td>{training.course_name}</td>
                                                        <td>{training.training_name}</td>
                                                        <td>{training.from_date}</td>
                                                        <td>{training.to_date}</td>
                                                        <td>{training.training_type}</td>
                                                        <td>{training.faculty_username}</td>
                                                        <td>{training.company_name}</td>
                                                        <td>
                                                            <button className="btn btn-secondary" onClick={() => handleEdit(training)}>Edit</button>&nbsp;
                                                            <button className="btn btn-danger" onClick={() => handleDelete(training.id)}>Delete</button>
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
                </section>
            </main>
        </div>
    );
};

export default CreateTrainingDetails;
