import React, { useState, useEffect } from 'react';
import Navbar from '../Navigation/Navbar';
import { GetTrainingsByStudentId, GetTestnameByTrainingId, TestScoresByTestidstudentId } from '../Services/getApiServices';

const StudentTestScores = () => {
    const [testNames, setTestNames] = useState([]);
    const [selectedTest, setSelectedTest] = useState('');
    const [testScores, setTestScores] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const data = JSON.parse(localStorage.getItem('userData'));
                const studentId = data.id;
                const { response, responseData } = await GetTrainingsByStudentId(studentId);
                if (response.ok) {
                    setTrainings(responseData);
                } else {
                    console.error('Error fetching trainings:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching trainings:', error);
            }
        };

        fetchTrainings();
    }, []);

    const handleTrainingSelect = async (e) => {
        const selectedTrainingId = e.target.value;
        setSelectedTraining(selectedTrainingId);
        setLoading(true);
        setError(null);
        try {
            const data = JSON.parse(localStorage.getItem('userData'));
            const studentId = data.id;
            const { response, responseData } = await GetTestnameByTrainingId(selectedTrainingId, studentId);
            if (response.ok) {
                setTestNames(responseData);
            } else {
                setError('Failed to fetch test names');
                setTestNames([]);
            }
        } catch (error) {
            setError('Error fetching test names');
            setTestNames([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTestSelect = async (e) => {
        debugger
        const selectedTestId = e.target.value;
        setSelectedTest(selectedTestId);
        setLoading(true);
        setError(null);
        const data = JSON.parse(localStorage.getItem('userData'));
        const studentId = data.id;
        try {
            const { response, responseData } = await TestScoresByTestidstudentId(selectedTestId, studentId);
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
                                    <div>
                                        <label htmlFor="training-select">Training Name:</label>
                                        <select id="training-select" className="form-select" value={selectedTraining} onChange={handleTrainingSelect}>
                                            <option disabled value="">Select Training</option>
                                            {trainings.map(training => (
                                                <option key={training.id} value={training.id}>{training.training_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <br />
                                    <div>
                                        <label htmlFor="test-select">Test Name:</label>
                                        <select id="test-select" className="form-select" value={selectedTest} onChange={handleTestSelect}>
                                            <option disabled value="">Select Test</option>
                                            {testNames.map(testName => (
                                                <option key={testName.test_id} value={testName.test_id}>{testName.test_name}</option>
                                            ))}
                                        </select>
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

export default StudentTestScores;
