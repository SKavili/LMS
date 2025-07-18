import React, { useState, useEffect } from 'react';
import Navbar from '../Navigation/Navbar';
import { GetAllTests, QuestionsByTestId } from '../Services/getApiServices';
import { ApiNames } from '../Utils/ApiNames';
import { SubmitTest } from '../Services/postApiServices';

const StudentTest = () => {
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const fetchTests = async () => {
        try {
            const studentId = JSON.parse(localStorage.getItem('userData')).id;
            const { response, responseData } = await GetAllTests();
            if (response.ok) {
                setTests(responseData);
            } else {
                console.error('Error fetching tests:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
    };

    useEffect(() => {
        fetchTests();
    }, []); // Fetch tests on component mount

    const fetchQuestionsByTest = async (testId) => {
        try {
            const { response, responseData } = await QuestionsByTestId(testId);
            setQuestions(responseData);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleTestChange = (testId) => {
        setSelectedTest(testId);
        setQuestions([]);
        setAnswers({});
        fetchQuestionsByTest(testId);
    };

    const handleOptionChange = (questionId, selectedOption) => {
        setAnswers({
            ...answers,
            [questionId]: selectedOption,
        });
    };

    const handleSubmit = async () => {
        const studentId = JSON.parse(localStorage.getItem('userData')).id;
        try {
            // Display confirmation dialog
            const confirmSubmission = window.confirm('Are you sure you want to submit the test?');

            if (!confirmSubmission) {
                return; // Exit function if user cancels submission
            }

            const { response, responseData } = await SubmitTest({
                student_id: studentId,
                test_id: selectedTest,
                answers: Object.keys(answers).map(questionId => ({
                    question_id: questionId,
                    selected_option: answers[questionId],
                })),
            });

            if (response.ok) {
                alert('Test submitted successfully!');
                setSelectedTest('');
                setQuestions([]);
                setAnswers({});
            } else {
                alert('Error submitting test');
            }
        } catch (error) {
            console.error('Error submitting test:', error);
        }
    };


    return (
        <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}>
            <Navbar toggleSidebar={toggleSidebar} />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Student MCQ Test</h1>
                </div>
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <br />
                                    <div>
                                        <h2>Select Test</h2>
                                        <div>
                                            <label>Test:</label>
                                            <select value={selectedTest} onChange={(e) => handleTestChange(e.target.value)}>
                                                <option value="">Select Test</option>
                                                {tests.map(test => (
                                                    <option key={test.test_id} value={test.test_id}>{test.test_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <br />
                                    {questions.length > 0 && (
                                        <div>
                                            <h2>Answer Questions</h2>
                                            {questions.map((question, index) => (
                                                <div key={question.id}>
                                                    <p>{index + 1}. {question.question_text}</p>
                                                    <div>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name={`question-${question.id}`}
                                                                value="1"
                                                                onChange={() => handleOptionChange(question.id, '1')}
                                                                checked={answers[question.id] === '1'}
                                                            />
                                                            {question.option_1}
                                                        </label>
                                                    </div>
                                                    <div>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name={`question-${question.id}`}
                                                                value="2"
                                                                onChange={() => handleOptionChange(question.id, '2')}
                                                                checked={answers[question.id] === '2'}
                                                            />
                                                            {question.option_2}
                                                        </label>
                                                    </div>
                                                    <div>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name={`question-${question.id}`}
                                                                value="3"
                                                                onChange={() => handleOptionChange(question.id, '3')}
                                                                checked={answers[question.id] === '3'}
                                                            />
                                                            {question.option_3}
                                                        </label>
                                                    </div>
                                                    <div>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name={`question-${question.id}`}
                                                                value="4"
                                                                onChange={() => handleOptionChange(question.id, '4')}
                                                                checked={answers[question.id] === '4'}
                                                            />
                                                            {question.option_4}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={handleSubmit}>Submit Test</button>
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

export default StudentTest;
