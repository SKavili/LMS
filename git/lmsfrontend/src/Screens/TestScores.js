import React, { useState, useEffect } from 'react';
import Navbar from '../Navigation/Navbar';
import { GetAllTestsByTid, TestScoresBySId, GetTrainingsByCourseId } from '../Services/getApiServices';
import { GetAllCompanies, GetCoursesByCompany } from '../Services/getApiServices';

const TestScores = () => {
    const [testNames, setTestNames] = useState([]);
    const [selectedTest, setSelectedTest] = useState('');
    const [testScores, setTestScores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [trainings, setTrainings] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState('');

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
        if (selectedCourse) {
            fetchTrainingsByCourse(selectedCourse);
        }
    }, [selectedCourse]);

    const fetchTestNamesByTraining = async (trainingId) => {
        try {
            const { responseData } = await GetAllTestsByTid(trainingId);
            setTestNames(responseData);
        } catch (error) {
            console.error('Error fetching test names:', error);
        }
    };

    const handleTestSelect = async (e) => {
        const selectedTestId = e.target.value;
        setSelectedTest(selectedTestId);
        setLoading(true);
        setError(null);
        try {
            const { response, responseData } = await TestScoresBySId(selectedTestId);
            if (response.ok) {
                setTestScores(responseData);
            } else {
                setError('Failed to fetch test scores');
                setTestScores([]);
            }
        } catch (error) {
            setError('Error fetching test scores');
            setTestScores([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCompanyChange = (companyId) => {
        setSelectedCompany(companyId);
        setSelectedCourse('');
        setSelectedTraining('');
        setCourses([]);
        setTrainings([]);
        setTestNames([]);
        if (companyId) {
            fetchCoursesByCompany(companyId);
        }
    };

    const handleCourseChange = (courseId) => {
        setSelectedCourse(courseId);
        setSelectedTraining('');
        setTrainings([]);
        setTestNames([]);
        if (courseId) {
            fetchTrainingsByCourse(courseId);
        }
    };

    const handleTrainingChange = (trainingId) => {
        setSelectedTraining(trainingId);
        setTestNames([]);
        if (trainingId) {
            fetchTestNamesByTraining(trainingId);
        }
    };

    return (
        <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}>
            <Navbar toggleSidebar={toggleSidebar} />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Test Scores</h1>
                </div>
                <section className="section">
                    <div className="row">
                        <div className='col-lg-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <br />
                                    <div className="filters">
                                        <div className="form-group">
                                            <label htmlFor="companySelect">Company:</label>
                                            <select id="companySelect" className="form-control" value={selectedCompany} onChange={(e) => handleCompanyChange(e.target.value)}>
                                                <option value="">Select Company</option>
                                                {companies.map(company => (
                                                    <option key={company.id} value={company.id}>{company.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="courseSelect">Course:</label>
                                            <select id="courseSelect" className="form-control" value={selectedCourse} onChange={(e) => handleCourseChange(e.target.value)}>
                                                <option value="">Select Course</option>
                                                {courses.map(course => (
                                                    <option key={course.id} value={course.id}>{course.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="trainingSelect">Training:</label>
                                            <select id="trainingSelect" className="form-control" value={selectedTraining} onChange={(e) => handleTrainingChange(e.target.value)}>
                                                <option value="">Select Training</option>
                                                {trainings.map(training => (
                                                    <option key={training.id} value={training.id}>{training.id}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="testSelect">Test Name:</label>
                                            <select id="testSelect" className="form-control" value={selectedTest} onChange={handleTestSelect}>
                                                <option disabled value="">Select Test</option>
                                                {testNames.map(testName => (
                                                    <option key={testName.test_id} value={testName.test_id}>{testName.test_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <br />
                                    {loading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-striped table-bordered table-hover">
                                                <thead className="table-dark">
                                                    <tr>
                                                        <th>Student ID</th>
                                                        <th>Student Name</th>
                                                        <th>Score</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {testScores.length > 0 ? (
                                                        testScores.map(score => (
                                                            <tr key={score.student_id}>
                                                                <td>{score.student_id}</td>
                                                                <td>{score.student_name}</td>
                                                                <td>{score.score}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="3" className="text-center">There is no data to show.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {error && (
                                        <div className="alert alert-danger mt-3">{error}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default TestScores;
