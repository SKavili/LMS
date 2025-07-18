import React, { useState, useEffect } from 'react';
import { GetAllCompanies, GetTrainingsByCourseId, GetStudentsByCourseAndTrainingId, GetAttendanceByDate } from '../Services/getApiServices';
import { GetCoursesByCompany } from '../Services/getApiServices'; // Make sure to import the correct service
import { InsertAttendance } from '../Services/postApiServices';
import Navbar from '../Navigation/Navbar';

const MarkAttendance = () => {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [trainings, setTrainings] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState('');
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState([]);
    const [students, setStudents] = useState([]);
    const DEFAULT_STATUS = 'present';
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

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

    const fetchCoursesByCompany = async (companyId) => {
        try {
            const { response, responseData } = await GetCoursesByCompany(companyId);
            if (response.ok) {
                setCourses(responseData);
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
            } else {
                console.error('Error fetching trainings:', response.statusText);
                setTrainings([]);
            }
        } catch (error) {
            console.error('Error fetching trainings:', error);
            setTrainings([]);
        }
    };

    const fetchStudentsAndAttendance = async (courseId, trainingId, attDate) => {
        try {
            const { response: studentsResponse, responseData: studentsData } = await GetStudentsByCourseAndTrainingId(courseId, trainingId);
            if (studentsResponse.ok) {
                setStudents(studentsData);

                if (attDate) {
                    const { response: attendanceResponse, responseData: attendanceData } = await GetAttendanceByDate(courseId, trainingId, attDate);
                    if (attendanceResponse.ok) {
                        const updatedAttendance = studentsData.map(student => {
                            const attendanceRecord = attendanceData.find(att => att.student_id === student.id);
                            return {
                                studentId: student.id,
                                status: attendanceRecord ? attendanceRecord.status : DEFAULT_STATUS
                            };
                        });
                        setAttendance(updatedAttendance);
                    } else {
                        console.error('Error fetching attendance:', attendanceResponse.statusText);
                        setAttendance(studentsData.map(student => ({
                            studentId: student.id,
                            status: DEFAULT_STATUS
                        })));
                    }
                } else {
                    setAttendance(studentsData.map(student => ({
                        studentId: student.id,
                        status: DEFAULT_STATUS
                    })));
                }
            } else {
                console.error('Error fetching students:', studentsResponse.statusText);
                setStudents([]);
                setAttendance([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setStudents([]);
            setAttendance([]);
        }
    };

    useEffect(() => {
        if (selectedCompany) {
            fetchCoursesByCompany(selectedCompany);
        } else {
            setCourses([]);
        }
    }, [selectedCompany]);

    useEffect(() => {
        if (selectedCourse) {
            fetchTrainings(selectedCourse);
        } else {
            setTrainings([]);
        }
    }, [selectedCourse]);

    useEffect(() => {
        if (selectedTraining) {
            fetchStudentsAndAttendance(selectedCourse, selectedTraining, attendanceDate);
        } else {
            setStudents([]);
            setAttendance([]);
        }
    }, [selectedTraining, attendanceDate]);

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => prev.map(att =>
            att.studentId === studentId ? { ...att, status } : att
        ));
    };

    const handleSubmit = async () => {
        // Check if attendance date is in the future
        const now = new Date();
        const selectedDate = new Date(attendanceDate);

        if (selectedDate > now) {
            alert('Attendance date cannot be a future date.');
            return;
        }

        // Check if attendance date is within the past 5 days
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        if (selectedDate < fiveDaysAgo) {
            alert('Attendance date must be within the past 5 days.');
            return;
        }

        const attendanceRecords = attendance.map(att => ({
            student_id: att.studentId,
            course_id: selectedCourse,
            training_id: selectedTraining,
            attendance_date: attendanceDate,
            status: att.status
        }));

        try {
            const { response, responseData } = await InsertAttendance(attendanceRecords);
            if (response.ok) {
                alert("Attendance submitted successfully");
                console.log("Attendance submitted successfully", responseData);
                // Reset form state or perform any other actions
            } else {
                alert('Error submitting attendance: ' + response.statusText);
                console.error('Error submitting attendance:', response.statusText);
            }
        } catch (error) {
            alert('Error submitting attendance: ' + error.message);
            console.error('Error submitting attendance:', error);
        }
    };

    return (
        <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}>
            <Navbar toggleSidebar={toggleSidebar} />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h2>Attendance</h2>
                </div>
                <section className="section">
                    <div className="row">
                        <div className='col-lg-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <br></br>
                                    <div>
                                        <h1>Mark Attendance</h1>
                                        <div className="form-row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="company_id" className="form-label">Company:</label>
                                                <select
                                                    id="company_id"
                                                    value={selectedCompany}
                                                    onChange={(e) => {
                                                        setSelectedCompany(e.target.value);
                                                        setSelectedCourse('');
                                                        setSelectedTraining('');
                                                    }}
                                                    required
                                                    className="form-control"
                                                >
                                                    <option value="">Select Company</option>
                                                    {companies.map(company => (
                                                        <option key={company.id} value={company.id}>{company.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="course_id" className="form-label">Course:</label>
                                                <select
                                                    id="course_id"
                                                    value={selectedCourse}
                                                    onChange={(e) => {
                                                        setSelectedCourse(e.target.value);
                                                        setSelectedTraining('');
                                                    }}
                                                    required
                                                    className="form-control"
                                                    disabled={!selectedCompany}
                                                >
                                                    <option value="">Select Course</option>
                                                    {courses.map(course => (
                                                        <option key={course.id} value={course.id}>{course.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="training_id" className="form-label">Training:</label>
                                                <select
                                                    id="training_id"
                                                    value={selectedTraining}
                                                    onChange={(e) => setSelectedTraining(e.target.value)}
                                                    required
                                                    className="form-control"
                                                    disabled={!selectedCourse}
                                                >
                                                    <option value="">Select Training</option>
                                                    {trainings.map(training => (
                                                        <option key={training.id} value={training.id}>{training.training_type}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label>Select Date:</label>
                                                <input
                                                    type="date"
                                                    value={attendanceDate}
                                                    onChange={(e) => setAttendanceDate(e.target.value)}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        {selectedTraining && attendanceDate && (
                                            <div>
                                                <h2>Attendance for {
                                                    courses.find(c => c.id === parseInt(selectedCourse))?.name}, Training: {trainings.find(t => t.id === parseInt(selectedTraining))?.training_type} on {attendanceDate}</h2>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Student Name</th>
                                                            <th>Present</th>
                                                            <th>Absent</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(students) && students.map(student => (
                                                            <tr key={student.id}>
                                                                <td>{student.username}</td>
                                                                <td>
                                                                    <input
                                                                        type="radio"
                                                                        name={`status-${student.id}`}
                                                                        value="present"
                                                                        checked={attendance.find(att => att.studentId === student.id)?.status === 'present'}
                                                                        onChange={() => handleStatusChange(student.id, 'present')}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="radio"
                                                                        name={`status-${student.id}`}
                                                                        value="absent"
                                                                        checked={attendance.find(att => att.studentId === student.id)?.status === 'absent'}
                                                                        onChange={() => handleStatusChange(student.id, 'absent')}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <button onClick={handleSubmit} className="btn btn-primary">Submit Attendance</button>
                                            </div>
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

export default MarkAttendance;
