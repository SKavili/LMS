import React, { useState, useEffect } from 'react';
import { GetAllCourses, GetTrainingsByCourseId, GetStudentsByCourseAndTrainingId, GetAttendanceData } from '../Services/getApiServices';
import { InsertAttendance } from '../Services/postApiServices';

const MarkAttendance = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [trainings, setTrainings] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState('');
    const [attendanceDate, setAttendanceDate] = useState('');
    const [attendance, setAttendance] = useState([]);
    const [students, setStudents] = useState([]);
    const DEFAULT_STATUS = 'present';

    useEffect(() => {
        fetchCourses();
    }, []);

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

    const fetchStudents = async (courseId, trainingId) => {
        try {
            const { response, responseData } = await GetStudentsByCourseAndTrainingId(courseId, trainingId);
            if (response.ok) {
                setStudents(responseData);
                setAttendance(responseData.map(student => ({
                    studentId: student.id,
                    status: DEFAULT_STATUS
                })));
            } else {
                console.error('Error fetching students:', response.statusText);
                setStudents([]);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents([]);
        }
    };

    useEffect(() => {
        if (selectedCourse) {
            fetchTrainings(selectedCourse);
        } else {
            setTrainings([]);
        }
    }, [selectedCourse]);

    useEffect(() => {
        if (selectedTraining) {
            fetchStudents(selectedCourse, selectedTraining);
        } else {
            setStudents([]);
        }
    }, [selectedTraining]);

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => prev.map(att =>
            att.studentId === studentId ? { ...att, status } : att
        ));
    };

    const handleSubmit = async () => {
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
                console.log("Attendance submitted successfully", responseData);
                // Reset form state or perform any other actions
            } else {
                console.error('Error submitting attendance:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting attendance:', error);
        }
    };


    return (
        <div>
            <h1>Mark Attendance</h1>
            <div className="form-group col-md-4">
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
                >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                </select>
            </div>
            {selectedCourse && (
                <div className="form-group col-md-4">
                    <label htmlFor="training_id" className="form-label">Training:</label>
                    <select
                        id="training_id"
                        value={selectedTraining}
                        onChange={(e) => setSelectedTraining(e.target.value)}
                        required
                        className="form-control"
                    >
                        <option value="">Select Training</option>
                        {trainings.map(training => (
                            <option key={training.id} value={training.id}>{training.training_type}</option>
                        ))}
                    </select>
                </div>
            )}
            <div>
                <label>Select Date:</label>
                <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                />
            </div>
            {selectedTraining && attendanceDate && (
                <div>
                    <h2>Attendance for {
                        courses.find(c => c.id === parseInt(selectedCourse))?.name}, Training: {trainings.find(t => t.id === parseInt(selectedTraining))?.training_type} on {attendanceDate}</h2>
                    <table>
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
                    <button onClick={handleSubmit}>Submit Attendance</button>
                </div>
            )}
        </div>
    );
};

export default MarkAttendance;
