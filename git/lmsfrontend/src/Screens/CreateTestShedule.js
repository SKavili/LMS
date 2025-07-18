import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navigation/Navbar';
import {
    GetAllTests,
    GetAllCourses,
    GetAllTrainings,
    GetAllCompanies,
    GetCoursesByCompany,
    GetTrainingsByCourseId,
    GetAllTestsByTid
} from '../Services/getApiServices';
import { UpdateTestShedule } from '../Services/putApiServices';

const CreateTestShedule = () => {
    const [testNames, setTestNames] = useState([]);
    const [selectedTest, setSelectedTest] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [testScheduleData, setTestScheduleData] = useState([]);
    const [editTestId, setEditTestId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [courses, setCourses] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedTraining, setSelectedTraining] = useState('');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toFocus = useRef(null);

    useEffect(() => {
        fetchCompanies();
        fetchTestScheduleData();
    }, []);

    useEffect(() => {
        if (selectedCompany) {
            fetchCourses(selectedCompany);
        }
    }, [selectedCompany]);

    useEffect(() => {
        if (selectedCourse) {
            fetchTrainings(selectedCourse);
        }
    }, [selectedCourse]);

    useEffect(() => {
        if (selectedTraining) {
            fetchTestNames(selectedTraining);
        }
    }, [selectedTraining]);

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

    const fetchCourses = async (companyId) => {
        try {
            debugger
            const { response, responseData } = await GetCoursesByCompany(companyId);
            if (response.ok) {
                setCourses(responseData);
            } else if (response.status === 404) {
                alert('No courses found for the selected company.');
                setCourses([]);
            } else {
                console.error('Error fetching courses:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchTrainings = async (courseId) => {
        try {
            const { response, responseData } = await GetTrainingsByCourseId(courseId);
            if (response.ok) {
                setTrainings(responseData);
            } else if (response.status === 404) {
                alert('No Training found for the selected Course.');
                setTrainings([]);
            } else {
                console.error('Error fetching trainings:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching trainings:', error);
        }
    };

    const fetchTestNames = async (trainingId) => {
        try {
            debugger
            const { response, responseData } = await GetAllTestsByTid(trainingId);
            if (response.ok) {
                setTestNames(responseData);
            } else if (response.status === 404) {
                alert('No courses found for the selected company.');
                setTestNames([]);
            } else {
                console.error('Error fetching test names:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching test names:', error);
        }
    };

    const fetchTestScheduleData = async () => {
        try {
            const { response, responseData } = await GetAllTests();
            if (response.ok) {
                const formattedData = responseData.map(data => ({
                    ...data,
                    from_date: data.from_date ? new Date(data.from_date).toLocaleDateString() : '', // Check for null value
                    to_date: data.to_date ? new Date(data.to_date).toLocaleDateString() : '' // Check for null value
                })).filter(data => data.from_date !== '' || data.to_date !== '');
                setTestScheduleData(formattedData);
            } else {
                console.error('Error fetching test names:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching test names:', error);
        }
    };

    const handleEdit = (testId) => {
        setEditTestId(testId);
        const selectedTestData = testScheduleData.find(test => test.test_id === testId);
        setSelectedTest(selectedTestData.test_id);
        setFromDate(selectedTestData.from_date);
        setToDate(selectedTestData.to_date);
        toFocus.current.focus();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            test_id: selectedTest,
            from_date: fromDate,
            to_date: toDate
        };

        try {
            const { response, responseData } = await UpdateTestShedule(selectedTest, formData);
            if (response.ok) {
                alert('Test schedule updated successfully!');
                setSelectedTest('');
                setFromDate('');
                setToDate('');
                setEditTestId(null);
                setSelectedCompany('');
                setSelectedCourse('');
                setSelectedTraining('');
                fetchTestScheduleData(); // Fetch updated test schedule data
            } else {
                console.error('Error updating test schedule:', responseData.error);
                alert('Failed to update test schedule');
            }
        } catch (error) {
            console.error('Error updating test schedule:', error);
            alert('Failed to update test schedule');
        }
    };

    return (
        <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}>
            <Navbar toggleSidebar={toggleSidebar} />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Create Test Schedule</h1>
                </div>
                <section className="section">
                    <div className="row">
                        <div className='col-lg-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <br />
                                    <form className="row g-3" onSubmit={handleSubmit}>
                                        <div className="col-md-3">
                                            <label className="form-label">Company:</label>
                                            <select
                                                value={selectedCompany}
                                                onChange={(e) => setSelectedCompany(e.target.value)}
                                                className="form-select"
                                            >
                                                <option value="">Select Company</option>
                                                {companies.map(company => (
                                                    <option key={company.id} value={company.id}>{company.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Course:</label>
                                            <select
                                                value={selectedCourse}
                                                onChange={(e) => setSelectedCourse(e.target.value)}
                                                className="form-select"
                                                disabled={!selectedCompany}
                                            >
                                                <option value="">Select Course</option>
                                                {courses.map(course => (
                                                    <option key={course.id} value={course.id}>{course.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Training:</label>
                                            <select
                                                value={selectedTraining}
                                                onChange={(e) => setSelectedTraining(e.target.value)}
                                                className="form-select"
                                                disabled={!selectedCourse}
                                            >
                                                <option value="">Select Training</option>
                                                {trainings.map(training => (
                                                    <option key={training.id} value={training.id}>{training.training_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Test Name:</label>
                                            <select
                                                value={selectedTest}
                                                ref={toFocus}
                                                onChange={(e) => setSelectedTest(e.target.value)}
                                                className="form-select"
                                                disabled={!selectedTraining}
                                            >
                                                <option value="">Select Test</option>
                                                {testNames.map(test => (
                                                    <option key={test.test_id} value={test.test_id}>{test.test_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">From Date:</label>
                                            <input
                                                type="date"
                                                value={fromDate}
                                                onChange={(e) => setFromDate(e.target.value)}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">To Date:</label>
                                            <input
                                                type="date"
                                                value={toDate}
                                                onChange={(e) => setToDate(e.target.value)}
                                                className="form-control"
                                            />
                                        </div>
                                        {editTestId ? (
                                            <div className="col-md-3 mt-2">
                                                <button type="submit" className="btn btn-primary" style={{ margin: '1rem' }}>Update</button>
                                            </div>
                                        ) : (
                                            <div className="col-md-3 mt-2">
                                                <button type="submit" className="btn btn-primary" style={{ margin: '1rem' }}>Create</button>
                                            </div>
                                        )}
                                    </form>
                                    <br />
                                    <div className="pagetitle">
                                        <h1>Test Schedule Data</h1>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-striped table-bordered L                                        MS_table">
                                            <thead>
                                                <tr>
                                                    <th>Test Name</th>
                                                    <th>From Date</th>
                                                    <th>To Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {testScheduleData.map(test => (
                                                    <tr key={test.test_id}>
                                                        <td>{test.test_name}</td>
                                                        <td>{test.from_date}</td>
                                                        <td>{test.to_date}</td>
                                                        <td>
                                                            <button onClick={() => handleEdit(test.test_id)} className="btn btn-secondary">Edit</button>
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

export default CreateTestShedule;

