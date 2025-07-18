import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navigation/Navbar';
import { GetAllCourses } from '../Services/getApiServices';
import { CreateCourse } from '../Services/postApiServices';
import { DeleteCourse } from '../Services/deleteApiServices';
import { UpdateCourse } from '../Services/putApiServices';
import { GetAllCompanies } from '../Services/getApiServices'; // Import the function to fetch companies

const CourseCreation = () => {
    const [courses, setCourses] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentCourseId, setCurrentCourseId] = useState(null);
    const [companyOptions, setCompanyOptions] = useState([]); // State to hold company options
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    useEffect(() => {
        fetchCourses();
        fetchCompanies(); // Call fetchCompanies when component mounts
    }, []);
    const toFocus = useRef(null); // Create a ref for the file input

    const fetchCourses = async () => {
        try {
            const { response, responseData } = await GetAllCourses();
            if (response.ok) {
                setCourses(responseData);
            } else {
                console.error('Error fetching courses:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const company_Id = companyId ? companyId : 4;
            const data = {
                name: name,
                description: description,
                duration: parseInt(duration, 10),
                company_id: parseInt(company_Id, 10) // Parse companyId to integer
            };
            if (isEditing) {
                const { response, responseData } = await UpdateCourse(currentCourseId, data);
                if (response.status === 200) {
                    alert(`Course ${isEditing ? 'updated' : 'created'} successfully`);
                    setName('');
                    setDescription('');
                    setDuration('');
                    setCompanyId('');
                    setIsEditing(false);
                    setCurrentCourseId(null);
                    fetchCourses(); // Fetch courses again to update the list
                }

            }
            else if (!isEditing) {

                const { response, responseData } = await CreateCourse(data);
                if (response.status === 201) {
                    alert('Course created successfully');
                    setName('');
                    setDescription('');
                    setDuration('');
                    fetchCourses(); // Fetch courses again to update the list

                }
                else if (response.status === 400) {
                    alert('Course Is Already Exist With This Name');
                    //console.error('Error creating user:', responseData);
                }

                else {
                    // setMessage('Error creating user');
                    console.error('Error creating user:', responseData);
                }
            }

            else {
                console.error(`Error ${isEditing ? 'updating' : 'creating'} course:`);
                alert(`Failed to ${isEditing ? 'update' : 'create'} course`);
            }
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'creating'} course:`, error);
            alert(`Failed to ${isEditing ? 'update' : 'create'} course`);
        }
    };

    const handleEdit = (course) => {

        setName(course.name);
        setDescription(course.description);
        setDuration(course.duration);
        setCompanyId(course.company_id.toString()); // Convert companyId to string for dropdown
        setIsEditing(true);
        setCurrentCourseId(course.id);
        toFocus.current.focus();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                const { response, responseData } = await DeleteCourse(id);
                if (response.status === 200) {
                    alert('Course deleted successfully');
                    fetchCourses(); // Fetch courses again to update the list
                } else {
                    console.error('Error deleting course:', response.statusText);
                    alert('Failed to delete course');
                }
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('Failed to delete course');
            }
        }
    };
    const resetForm = () => {
        setName('');
        setDescription('');
        setDuration('');
        setCompanyId('');
        setIsEditing(false);
        setCurrentCourseId(null);
    };
    return (
        <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}>
            <Navbar toggleSidebar={toggleSidebar} />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Courses</h1>
                </div>
                <section className="section">
                    <div className="row">
                        <div className='col-lg-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <br></br>
                                    <form className="row g-3" onSubmit={handleSubmit}>
                                        <div className="col-md-4">
                                            <label className="form-label">Course Name: </label>
                                            <input type="text" className="form-control" value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter course name"
                                                ref={toFocus}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Course Description: </label>
                                            <textarea className="form-control"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Enter course description"
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Course Duration(days): </label>
                                            <input type="number" className="form-control"
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                                placeholder="Enter course duration in days"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Company: </label>
                                            <select className="form-select"
                                                value={companyId}
                                                onChange={(e) => setCompanyId(e.target.value)}
                                            >
                                                <option value="">Select a company</option> {/* Default option */}
                                                {companyOptions.map(company => (
                                                    <option key={company.id} value={company.id}>{company.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-4 mt-5">
                                            <button type="submit" className="btn btn-primary">
                                                {isEditing ? 'Update Course' : 'Create Course'}
                                            </button>
                                            &nbsp;
                                            <button type="reset" className="btn btn-secondary" onClick={resetForm}>
                                                Reset
                                            </button>
                                        </div>
                                    </form>

                                    <br></br>
                                    <div class="pagetitle">
                                        <h1>Course List</h1>
                                    </div>
                                    <div class="table-responsive">
                                        <table className="table table-striped table-bordered LMS_table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Description</th>
                                                    <th>Duration</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {courses.map(course => (
                                                    <tr key={course.id}>
                                                        <td>{course.name}</td>
                                                        <td>{course.description}</td>
                                                        <td>{course.duration}</td>
                                                        <td>{course.status}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-secondary"
                                                                onClick={() => handleEdit(course)}
                                                            >
                                                                Edit
                                                            </button>
                                                            &nbsp;
                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={() => handleDelete(course.id)}
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
                </section >
            </main >
        </div>
    );
};

export default CourseCreation;
