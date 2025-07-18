import React, { useState, useEffect } from 'react';
import Navbar from '../Navigation/Navbar';
import { GetCombinedScores, GetCombinedScoresSummary, GetAllCompanies, GetCoursesByCompany } from '../Services/getApiServices';

const CombinedScoresView = () => {
    const [scores, setScores] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Filter states
    const [filters, setFilters] = useState({
        company_id: '',
        course_id: '',
        training_id: '',
        test_id: '',
        student_id: '',
        from_date: '',
        to_date: ''
    });
    
    // Dropdown data
    const [companies, setCompanies] = useState([]);
    const [courses, setCourses] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [tests, setTests] = useState([]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        fetchCompanies();
        fetchData();
        fetchSummary();
    }, []);

    useEffect(() => {
        if (filters.company_id) {
            fetchCoursesByCompany(filters.company_id);
        }
    }, [filters.company_id]);

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

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const { response, responseData } = await GetCombinedScores(filters);
            if (response.ok) {
                setScores(responseData);
            } else {
                setError('Failed to fetch scores data');
            }
        } catch (error) {
            setError('Error fetching scores data');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const { response, responseData } = await GetCombinedScoresSummary(filters);
            if (response.ok) {
                setSummary(responseData);
            }
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleApplyFilters = () => {
        fetchData();
        fetchSummary();
    };

    const handleClearFilters = () => {
        setFilters({
            company_id: '',
            course_id: '',
            training_id: '',
            test_id: '',
            student_id: '',
            from_date: '',
            to_date: ''
        });
        setCourses([]);
        setTrainings([]);
        setTests([]);
    };

    const getScoreColor = (percentage) => {
        if (percentage >= 90) return 'text-success';
        if (percentage >= 80) return 'text-info';
        if (percentage >= 70) return 'text-warning';
        return 'text-danger';
    };

    return (
        <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}>
            <Navbar toggleSidebar={toggleSidebar} />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Combined Test Scores Analytics</h1>
                </div>
                
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <br />
                                    
                                    {/* Summary Cards */}
                                    <div className="row mb-4">
                                        <div className="col-xl-3 col-md-6">
                                            <div className="card info-card sales-card">
                                                <div className="card-body">
                                                    <h5 className="card-title">Total Students</h5>
                                                    <div className="d-flex align-items-center">
                                                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                            <i className="bi bi-people"></i>
                                                        </div>
                                                        <div className="ps-3">
                                                            <h6>{summary.total_students || 0}</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-xl-3 col-md-6">
                                            <div className="card info-card revenue-card">
                                                <div className="card-body">
                                                    <h5 className="card-title">Total Tests</h5>
                                                    <div className="d-flex align-items-center">
                                                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                            <i className="bi bi-file-text"></i>
                                                        </div>
                                                        <div className="ps-3">
                                                            <h6>{summary.total_tests || 0}</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-xl-3 col-md-6">
                                            <div className="card info-card customers-card">
                                                <div className="card-body">
                                                    <h5 className="card-title">Average Score</h5>
                                                    <div className="d-flex align-items-center">
                                                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                            <i className="bi bi-graph-up"></i>
                                                        </div>
                                                        <div className="ps-3">
                                                            <h6>{summary.overall_average_score || 0}%</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-xl-3 col-md-6">
                                            <div className="card info-card sales-card">
                                                <div className="card-body">
                                                    <h5 className="card-title">Total Courses</h5>
                                                    <div className="d-flex align-items-center">
                                                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                            <i className="bi bi-book"></i>
                                                        </div>
                                                        <div className="ps-3">
                                                            <h6>{summary.total_courses || 0}</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Filters */}
                                    <div className="row mb-4">
                                        <div className="col-md-2">
                                            <label className="form-label">Company:</label>
                                            <select
                                                className="form-select"
                                                value={filters.company_id}
                                                onChange={(e) => handleFilterChange('company_id', e.target.value)}
                                            >
                                                <option value="">All Companies</option>
                                                {companies.map(company => (
                                                    <option key={company.id} value={company.id}>
                                                        {company.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="col-md-2">
                                            <label className="form-label">Course:</label>
                                            <select
                                                className="form-select"
                                                value={filters.course_id}
                                                onChange={(e) => handleFilterChange('course_id', e.target.value)}
                                            >
                                                <option value="">All Courses</option>
                                                {courses.map(course => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="col-md-2">
                                            <label className="form-label">From Date:</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={filters.from_date}
                                                onChange={(e) => handleFilterChange('from_date', e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className="col-md-2">
                                            <label className="form-label">To Date:</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={filters.to_date}
                                                onChange={(e) => handleFilterChange('to_date', e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className="col-md-2">
                                            <label className="form-label">Student ID:</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Student ID"
                                                value={filters.student_id}
                                                onChange={(e) => handleFilterChange('student_id', e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className="col-md-2 d-flex align-items-end">
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={handleApplyFilters}
                                                >
                                                    Apply Filters
                                                </button>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={handleClearFilters}
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Data Table */}
                                    {loading ? (
                                        <div className="text-center">
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : error ? (
                                        <div className="alert alert-danger">{error}</div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-striped table-bordered table-hover">
                                                <thead className="table-dark">
                                                    <tr>
                                                        <th>Student</th>
                                                        <th>Company</th>
                                                        <th>Course</th>
                                                        <th>Training</th>
                                                        <th>Test</th>
                                                        <th>Score</th>
                                                        <th>Percentage</th>
                                                        <th>Test Average</th>
                                                        <th>Test Stats</th>
                                                        <th>Faculty</th>
                                                        <th>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {scores.length > 0 ? (
                                                        scores.map((score, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <strong>{score.student_name}</strong><br/>
                                                                    <small className="text-muted">{score.student_email}</small>
                                                                </td>
                                                                <td>{score.company_name}</td>
                                                                <td>{score.course_name}</td>
                                                                <td>{score.training_name}</td>
                                                                <td>
                                                                    <strong>{score.test_name}</strong><br/>
                                                                    <small className="text-muted">Duration: {score.test_duration_minutes} min</small>
                                                                </td>
                                                                <td>
                                                                    <strong>{score.student_score}/{score.total_questions}</strong>
                                                                </td>
                                                                <td>
                                                                    <span className={`fw-bold ${getScoreColor(score.percentage_score)}`}>
                                                                        {score.percentage_score}%
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <span className="text-info">
                                                                        {score.test_average_score}%
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <small>
                                                                        Highest: {score.test_highest_score}<br/>
                                                                        Lowest: {score.test_lowest_score}<br/>
                                                                        Students: {score.total_students_taken_test}
                                                                    </small>
                                                                </td>
                                                                <td>{score.faculty_name}</td>
                                                                <td>
                                                                    {new Date(score.test_completion_date).toLocaleDateString()}<br/>
                                                                    <small className="text-muted">
                                                                        {new Date(score.test_completion_date).toLocaleTimeString()}
                                                                    </small>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="11" className="text-center">
                                                                No data found. Try adjusting your filters.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
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

export default CombinedScoresView; 