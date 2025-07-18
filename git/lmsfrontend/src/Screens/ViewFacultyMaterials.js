import React, { useState, useEffect } from 'react';
import Navbar from '../Navigation/Navbar';
import { GetAllCompanies, GetCoursesByCompany, GetTrainingsByCourseId, GetMaterialsDataByTid } from '../Services/getApiServices'; // Adjust path as per your project structure
import { BaseUrl } from '../Utils/ApiUrl';

const ViewFacultyMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [trainings, setTrainings] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const { responseData } = await GetAllCompanies();
            setCompanies(responseData);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const fetchCoursesByCompany = async (companyId) => {
        try {
            const { responseData } = await GetCoursesByCompany(companyId);
            setCourses(responseData);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchTrainingsByCourse = async (courseId) => {
        try {
            const { responseData } = await GetTrainingsByCourseId(courseId);
            setTrainings(responseData);
        } catch (error) {
            console.error('Error fetching trainings:', error);
        }
    };

    useEffect(() => {
        if (selectedCompany) {
            fetchCoursesByCompany(selectedCompany);
        }
    }, [selectedCompany]);

    useEffect(() => {
        if (selectedCourse) {
            fetchTrainingsByCourse(selectedCourse);
        }
    }, [selectedCourse]);

    useEffect(() => {
        if (selectedTraining) {
            fetchMaterials(selectedTraining);
        }
    }, [selectedTraining]);

    const fetchMaterials = async (trainingId) => {
        try {
            const { response, responseData } = await GetMaterialsDataByTid(trainingId);
            if (!response.ok) {
                throw new Error('Failed to fetch materials');
            }
            const materialsArray = Array.isArray(responseData) ? responseData : [responseData];
            setMaterials(materialsArray);
        } catch (error) {
            console.error('Error fetching materials:', error);
            // Set materials to empty array on error
            setMaterials([]);
        }
    };

    const handleDownload = async (filePath) => {
        const fullUrl = `${BaseUrl}${filePath}`;
        try {
            const response = await fetch(fullUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filePath.split('/').pop());
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
            // Handle error as needed
        }
    };

    const handleCompanyChange = (companyId) => {
        setSelectedCompany(companyId);
        setSelectedCourse('');
        setSelectedTraining('');
        setCourses([]);
        setTrainings([]);
        setMaterials([]);
        if (companyId) {
            fetchCoursesByCompany(companyId);
        }
    };

    const handleCourseChange = (courseId) => {
        setSelectedCourse(courseId);
        setSelectedTraining('');
        setTrainings([]);
        setMaterials([]);
        if (courseId) {
            fetchTrainingsByCourse(courseId);
        }
    };

    const handleTrainingChange = (e) => {
        setSelectedTraining(e.target.value);
        setMaterials([]);
        if (e.target.value) {
            fetchMaterials(e.target.value);
        }
    };

    return (
        <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}>
            <Navbar toggleSidebar={toggleSidebar} />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>View Materials</h1>
                </div>
                <section className="section">
                    <div className="row">
                        <div className='col-lg-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <br />
                                    <div className="filters">
                                        {/* Company Dropdown */}
                                        <div className="form-group col-md-4">
                                            <label htmlFor="company_id" className="form-label">Company:</label>
                                            <select
                                                id="company_id"
                                                value={selectedCompany}
                                                onChange={(e) => handleCompanyChange(e.target.value)}
                                                required
                                                className="form-control"
                                            >
                                                <option value="">Select Company</option>
                                                {companies.map(company => (
                                                    <option key={company.id} value={company.id}>{company.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* Course Dropdown */}
                                        <div className="form-group col-md-4">
                                            <label htmlFor="course_id" className="form-label">Course:</label>
                                            <select
                                                id="course_id"
                                                value={selectedCourse}
                                                onChange={(e) => handleCourseChange(e.target.value)}
                                                required
                                                className="form-control"
                                            >
                                                <option value="">Select Course</option>
                                                {courses.map(course => (
                                                    <option key={course.id} value={course.id}>{course.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* Training Dropdown */}
                                        <div className="form-group col-md-4">
                                            <label htmlFor="training_id" className="form-label">Training:</label>
                                            <select
                                                id="training_id"
                                                value={selectedTraining}
                                                onChange={handleTrainingChange}
                                                required
                                                className="form-control"
                                            >
                                                <option value="">Select Training</option>
                                                {Array.isArray(trainings) && trainings.map(training => (
                                                    <option key={training.id} value={training.id}>{training.id}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="table-responsive">
                                        {materials.length === 0 && selectedTraining ? (
                                            <p>No data to display</p>
                                        ) : (
                                            <table className="table table-striped table-bordered LMS_table">
                                                <thead>
                                                    <tr>
                                                        <th>Course Name</th>
                                                        <th>Faculty Name</th>
                                                        <th>Material Name</th>
                                                        <th>Training Date</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {materials.map(material => (
                                                        <tr key={material.id}>
                                                            <td>{material.course_name}</td>
                                                            <td>{material.faculty_name}</td>
                                                            <td>{material.material_name}</td>
                                                            <td>{new Date(material.training_date).toLocaleDateString()}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-secondary"
                                                                    onClick={() => handleDownload(material.file_path)}
                                                                >
                                                                    Download
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
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

export default ViewFacultyMaterials;
