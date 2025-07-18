import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navigation/Navbar';
import { GetAllCompanies, GetAllTests, GetTrainingsByCourseId, GetCoursesByCompany, GetTestDetailsById } from '../Services/getApiServices';
import { CreateTestManualMcq, CreateTestMcq } from '../Services/postApiServices';

const TestCreation = () => {
    const [questions, setQuestions] = useState([{ question_text: '', options: ['', '', '', ''], correct_answer: '' }]);
    const [file, setFile] = useState(null);
    const [uploadMethod, setUploadMethod] = useState('upload');
    const [courseId, setCourseId] = useState('');
    const [testName, setTestName] = useState('');
    const [duration, setDuration] = useState('');
    const [listOfCourses, setListOfCourses] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [testNames, setTestNames] = useState([]);
    const [selectedTest, setSelectedTest] = useState('');
    const [selectedTestDetails, setSelectedTestDetails] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [companyId, setCompanyId] = useState('');
    const [trainingId, setTrainingId] = useState('');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        if (companyId) {
            fetchCourses();
            setCourseId(''); // Reset course and training selections
            setTrainingId('');
            setListOfCourses([]);
            setTrainings([]);
        }
    }, [companyId]);

    useEffect(() => {
        if (courseId) {
            fetchTrainings();
            setTrainingId(''); // Reset training selection
            setTrainings([]);
        }
    }, [courseId]);

    const fileInputRef = useRef(null);

    const fetchCourses = async () => {
        if (!companyId) return;
        try {
            const { response, responseData } = await GetCoursesByCompany(companyId);
            if (response.ok) {
                setListOfCourses(responseData);
            } else if (response.status === 404) {
                alert('No courses found for the selected company.');
                setListOfCourses([]);
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
                setCompanies(responseData);
            } else {
                console.error('Error fetching companies:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const fetchTrainings = async () => {
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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleRadioChange = (e) => {
        setUploadMethod(e.target.value);
    };

    const handleUpload = async () => {
        try {
            // Validate required fields before upload
            if (!file) {
                alert('Please select a file to upload');
                return;
            }
            if (!testName || !duration || (!trainingId && !courseId)) {
                alert('Please fill in all required fields (Test Name, Duration, and Training)');
                return;
            }

            // Debug logging
            console.log('Upload values:', {
                file: file,
                courseId: courseId,
                trainingId: trainingId,
                testName: testName,
                duration: duration
            });

            // Create a stable reference to the file
            const fileToUpload = file;
            const trainingIdToUse = trainingId || courseId;

            // Verify file is still valid
            if (!fileToUpload || !fileToUpload.name) {
                alert('File is no longer valid. Please select the file again.');
                return;
            }

            const formData = new FormData();
            formData.append('file', fileToUpload);
            formData.append('training_id', trainingIdToUse);
            formData.append('test_name', testName);
            formData.append('duration', duration);

            // Debug FormData contents
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const { response, responseData } = await CreateTestMcq(formData);
            if (response.ok) {
                alert('Questions uploaded successfully!');
                // Clear file input only after successful upload
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                resetForm();
                setQuestions([]);
                setFile(null);
                setUploadMethod('upload');
                setTestName('');
                setDuration('');
                fetchTestNames();
            } else {
                console.error('Error uploading file:', response.statusText);
                console.error('Response data:', responseData);
                
                // Show more detailed error message
                const errorMessage = responseData?.error || responseData?.message || 'Failed to upload questions';
                alert(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            
            // Handle specific file upload errors
            if (error.message.includes('ERR_UPLOAD_FILE_CHANGED') || error.message.includes('Failed to fetch')) {
                alert('File upload failed. Please try selecting the file again and uploading.');
            } else {
                alert('Failed to upload questions: ' + error.message);
            }
        }
    };

    const handleQuestionChange = (e, index) => {
        const newQuestions = [...questions];
        newQuestions[index].question_text = e.target.value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (e, index, optionIndex) => {
        const newQuestions = [...questions];
        newQuestions[index].options[optionIndex] = e.target.value;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (e, index) => {
        const newQuestions = [...questions];
        newQuestions[index].correct_answer = e.target.value;
        setQuestions(newQuestions);
    };

    const resetForm = () => {
        setQuestions([{ question_text: '', options: ['', '', '', ''], correct_answer: '' }]);
        setFile(null);
        setUploadMethod('upload');
        setTestName('');
        setDuration('');
        setCourseId('');
        setCompanyId('');
        setTrainingId('');
        setCurrentQuestionIndex(0);
        setListOfCourses([]);
        setTrainings([]);
        // Don't clear file input here to avoid ERR_UPLOAD_FILE_CHANGED
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const bodywithdata = {
                training_id: courseId,
                test_name: testName,
                duration: duration,
                questions: questions.map(q => ({
                    question_text: q.question_text,
                    option_1: q.options[0],
                    option_2: q.options[1],
                    option_3: q.options[2],
                    option_4: q.options[3],
                    correct_answer: q.correct_answer
                }))
            };
            const { response, responseData } = await CreateTestManualMcq(bodywithdata);

            if (response.ok) {
                alert('Test and questions submitted successfully!');
                resetForm();
                setQuestions([]);
                setFile(null);
                setUploadMethod('upload');
                setCurrentQuestionIndex(0);
                setTestName('');
                setDuration('');
                fetchTestNames();
            } else {
                console.error('Error submitting questions:', response.statusText);
                alert('Failed to submit questions');
            }
        } catch (error) {
            console.error('Error submitting questions:', error);
            alert('Failed to submit questions');
        }
    };

    const handleCourseChange = (event) => {
        const { value } = event.target;
        setCourseId(value);
        setTrainingId(''); // Reset training dropdown
        setTrainings([]);
    };

    const handleTestChange = async (event) => {
        const { value } = event.target;
        setSelectedTest(value);
        if (value) {
            try {
                const { response, responseData } = await GetTestDetailsById(value);
                if (response.ok) {
                    setSelectedTestDetails(responseData);
                } else {
                    console.error('Error fetching test details:', response.statusText);
                    setSelectedTestDetails(null);
                }
            } catch (error) {
                console.error('Error fetching test details:', error);
                setSelectedTestDetails(null);
            }
        } else {
            setSelectedTestDetails(null);
        }
    };

    const addQuestion = () => {
        setQuestions([...questions, { question_text: '', options: ['', '', '', ''], correct_answer: '' }]);
    };

    const fetchTestNames = async () => {
        try {
            const { response, responseData } = await GetAllTests();
            if (response.ok) {
                setTestNames(responseData);
            } else {
                console.error('Error fetching test names:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching test names:', error);
        }
    };
 useEffect(() => {
    fetchTestNames();
   }
 )
    return (
        <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}>
            <Navbar toggleSidebar={toggleSidebar} />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Create Online MCQ Test</h1>
                </div>
                <section className="section">
                    <div className="row">
                        <div className='col-lg-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <br />
                                    <div className="pagetitle">
                                        <h1>Test Details</h1>
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Company Name:</label>
                                            <select
                                                className="form-select"
                                                value={companyId}
                                                onChange={(e) => setCompanyId(e.target.value)}
                                                required
                                            >
                                                <option selected disabled value="">Select Company</option>
                                                {companies.map((company) => (
                                                    <option key={company.id} value={company.id}>
                                                        {company.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Course Name: </label>
                                            <select
                                                className="form-select"
                                                value={courseId}
                                                onChange={handleCourseChange}
                                                required
                                                disabled={!companyId} // Disable if no company selected
                                            >
                                                <option selected disabled value="">Select Course</option>
                                                {listOfCourses.map((course) => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Training Name:</label>
                                            <select
                                                className="form-select"
                                                value={trainingId}
                                                onChange={(e) => setTrainingId(e.target.value)}
                                                required
                                                disabled={!courseId} // Disable if no course selected
                                            >
                                                <option selected disabled value="">Select Training</option>
                                                {trainings.map((training) => (
                                                    <option key={training.id} value={training.id}>
                                                        {training.training_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Test Name: </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={testName}
                                                onChange={(e) => setTestName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Duration: </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <h5 className="card-title2">Choose Upload Method</h5>
                                            <label className="form-label">
                                                <input type="radio" value="upload" checked={uploadMethod === 'upload'} onChange={handleRadioChange} />
                                                Upload from Excel
                                            </label>
                                            <br />
                                            <label className="form-label">
                                                <input type="radio" value="manual" checked={uploadMethod === 'manual'} onChange={handleRadioChange} />
                                                Enter Manually
                                            </label>
                                        </div>
                                    </div>
                                    {uploadMethod === 'upload' && (
                                        <>
                                            <div className="col-md-6">
                                                <h5 className="card-title2">Upload Questions from  Excel</h5>
                                                <input type="file" accept=".pdf,.xlsx,.csv"
                                                    onChange={handleFileChange}
                                                    ref={fileInputRef}
                                                />
                                            </div>
                                            <br></br>
                                            <div className="col-md-4">
                                                <button onClick={handleUpload} className="btn btn-primary">Upload</button>
                                            </div>
                                        </>
                                    )}
                                    {uploadMethod === 'manual' && (
                                        <form onSubmit={handleSubmit}>
                                            {questions.map((q, index) => (
                                                <div key={index}>
                                                    <div className="row g-3">
                                                        <div className="col-md-12">
                                                            <br></br>
                                                            <h5 className='card-title2'> Question {index + 1}</h5>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="form-label">Question:</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={q.question_text}
                                                                onChange={(e) => handleQuestionChange(e, index)}
                                                                required
                                                            />
                                                        </div>
                                                        {q.options.map((option, optionIndex) => (
                                                            <div className="col-md-4" key={optionIndex}>
                                                                <label className="form-label">Option {optionIndex + 1}:</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={option}
                                                                    onChange={(e) => handleOptionChange(e, index, optionIndex)}
                                                                    required
                                                                />
                                                            </div>
                                                        ))}
                                                        <div className="col-md-4">
                                                            <label className="form-label">Correct Answer:</label>
                                                            <select
                                                                className="form-select"
                                                                value={q.correct_answer}
                                                                onChange={(e) => handleCorrectAnswerChange(e, index)}
                                                                required
                                                            >
                                                                <option value="">Select Correct Answer</option>
                                                                {q.options.map((_, optionIndex) => (
                                                                    <option key={optionIndex} value={String.fromCharCode(65 + optionIndex)}>
                                                                        {String.fromCharCode(65 + optionIndex)}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <br></br>
                                            <div className="col-md-4">
                                                <button type="button" className="btn btn-primary" onClick={addQuestion}>Add Question</button>&nbsp;
                                                <button type="submit" className="btn btn-primary">Submit</button>
                                            </div>
                                        </form>
                                    )}
                                    <br />
                                    <label className="form-label">
                                        Test Name:
                                    </label>
                                    <select
                                        onChange={handleTestChange}
                                        className="form-select"
                                    >
                                        <option value="">Select Test</option>
                                        {testNames.map(x => (
                                            <option key={x.test_id} value={x.test_id}>{x.test_name}</option>
                                        ))}
                                    </select>
                                    {selectedTestDetails && (
                                        <div>
                                            <h2>Test Details</h2>
                                            <div className="table-responsive">
                                                <table className="table table-striped table-bordered LMS_table">
                                                    <thead>
                                                        <tr>
                                                            <th>Question</th>
                                                            <th>Option 1</th>
                                                            <th>Option 2</th>
                                                            <th>Option 3</th>
                                                            <th>Option 4</th>
                                                            <th>Correct Answer</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedTestDetails.map((q, index) => (
                                                            <tr key={index}>
                                                                <td>{q.question_text}</td>
                                                                <td>{q.option_1}</td>
                                                                <td>{q.option_2}</td>
                                                                <td>{q.option_3}</td>
                                                                <td>{q.option_4}</td>
                                                                <td>{q.correct_answer}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
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

export default TestCreation;
