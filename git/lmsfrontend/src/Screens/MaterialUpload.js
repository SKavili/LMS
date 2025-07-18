import React, { useState, useEffect } from 'react';
import Navbar from '../Navigation/Navbar';
import { GetAllCompanies, GetCoursesByCompany, GetTrainingsByCourseId, GetAllUsers } from '../Services/getApiServices';
import { UploadMaterial } from '../Services/postApiServices';

const UploadFacultyMaterial = () => {
    const [companyId, setCompanyId] = useState('');
    const [courseId, setCourseId] = useState('');
    const [trainingId, setTrainingId] = useState('');
    const [facultyId, setFacultyId] = useState('');
    const [materialName, setMaterialName] = useState('');
    const [files, setFiles] = useState([]);
    const [trainingDate, setTrainingDate] = useState('');
    const [companies, setCompanies] = useState([]);
    const [courses, setCourses] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        fetchCompanies();
        fetchFaculties();
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

    const fetchFaculties = async () => {
        try {
            const { responseData } = await GetAllUsers();
            const filteredUsers = responseData.filter(user => user.role_id === 2);
            setFaculties(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!files.length) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('training_id', trainingId);
        formData.append('faculty_id', facultyId);
        formData.append('material_name', materialName);
        formData.append('training_date', trainingDate);

        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            const { response } = await UploadMaterial(formData);

            if (response.ok) {
                alert('Material uploaded successfully');
                setCompanyId('');
                setCourseId('');
                setTrainingId('');
                setMaterialName('');
                setFiles([]);
                setTrainingDate('');
            } else {
                alert('Error uploading material');
            }
        } catch (error) {
            console.error('Error uploading material:', error);
            alert('Error uploading material');
        }
    };

    const handleCompanyChange = (e) => {
        const companyId = e.target.value;
        setCompanyId(companyId);
        setCourseId('');
        setTrainingId('');
        setCourses([]);
        setTrainings([]);
        fetchCoursesByCompany(companyId);
    };

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setCourseId(courseId);
        setTrainingId('');
        setTrainings([]);
        fetchTrainingsByCourse(courseId);
    };

    const handleTrainingChange = (e) => {
        setTrainingId(e.target.value);
    };

    return (
        <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}>
            <Navbar toggleSidebar={toggleSidebar} />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Upload Material</h1>
                </div>
                <section className="section">
                    <div className="row">
                        <div className='col-lg-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <br />
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="company_id" className="form-label">Company:</label>
                                                <select
                                                    id="company_id"
                                                    value={companyId}
                                                    onChange={handleCompanyChange}
                                                    required
                                                    className="form-control"
                                                >
                                                    <option value="">Select Company</option>
                                                    {companies.map(company => (
                                                        <option key={company.id} value={company.id}>{company.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="course_id" className="form-label">Course:</label>
                                                <select
                                                    id="course_id"
                                                    value={courseId}
                                                    onChange={handleCourseChange}
                                                    required
                                                    className="form-control"
                                                >
                                                    <option value="">Select Course</option>
                                                    {courses.map(course => (
                                                        <option key={course.id} value={course.id}>{course.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="training_id" className="form-label">Training:</label>
                                                <select
                                                    id="training_id"
                                                    value={trainingId}
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
                                            <div className="form-group col-md-4">
                                                <label htmlFor="faculty_id" className="form-label">Faculty:</label>
                                                <select
                                                    id="faculty_id"
                                                    value={facultyId}
                                                    onChange={(e) => setFacultyId(e.target.value)}
                                                    required
                                                    className="form-control"
                                                >
                                                    <option value="">Select Faculty</option>
                                                    {faculties.map(faculty => (
                                                        <option key={faculty.id} value={faculty.id}>{faculty.username}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="material_name" className="form-label">Material Name:</label>
                                                <input
                                                    type="text"
                                                    id="material_name"
                                                    value={materialName}
                                                    onChange={(e) => setMaterialName(e.target.value)}
                                                    required
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="files" className="form-label">Files:</label>
                                                <input
                                                    type="file"
                                                    id="files"
                                                    name="files"
                                                    onChange={handleFileChange}
                                                    multiple
                                                    required
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="training_date" className="form-label">Training Date:</label>
                                                <input
                                                    type="date"
                                                    id="training_date"
                                                    value={trainingDate}
                                                    onChange={(e) => setTrainingDate(e.target.value)}
                                                    required
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Upload</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UploadFacultyMaterial;
