import React, { useState, useEffect } from 'react';
import Navbar from '../Navigation/Navbar';
import { GetAllCompanies, GetCoursesByCompany, GetTrainingsByCourseId, GetAttendanceByTrainingCidComid } from '../Services/getApiServices'; // Adjust path as per your project structure

const ViewTrainingAttendance = () => {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [trainings, setTrainings] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState('');
    const [attendance, setAttendance] = useState([]);
    const [dates, setDates] = useState([]);
    const [students, setStudents] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const { responseData } = await GetAllCompanies();
                setCompanies(responseData);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompanies();
    }, []);

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

    const fetchAttendance = async (trainingId, courseId, companyId) => {
        try {
            const { responseData } = await GetAttendanceByTrainingCidComid(trainingId, courseId, companyId);
            setAttendance(responseData);

            const uniqueDates = [...new Set(responseData.map(entry => formatDate(entry.attendance_date)))];
            setDates(uniqueDates);

            const uniqueStudents = [...new Map(responseData.map(entry => [entry.student_id, { id: entry.student_id, name: entry.student_name }])).values()];
            setStudents(uniqueStudents);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // This will format the date as 'YYYY-MM-DD'
    };

    const handleCompanyChange = (companyId) => {
        setSelectedCompany(companyId);
        setSelectedCourse('');
        setSelectedTraining('');
        setCourses([]);
        setTrainings([]);
        setAttendance([]);
        setDates([]);
        setStudents([]);

        fetchCoursesByCompany(companyId);
    };

    const handleCourseChange = (courseId) => {
        setSelectedCourse(courseId);
        setSelectedTraining('');
        setTrainings([]);
        setAttendance([]);
        setDates([]);
        setStudents([]);

        fetchTrainingsByCourse(courseId);
    };

    const handleTrainingChange = (e) => {
        setSelectedTraining(e.target.value);
        setAttendance([]);
        setDates([]);
        setStudents([]);

        fetchAttendance(e.target.value, selectedCourse, selectedCompany);
    };

    const getAttendanceStatus = (studentId, date) => {
        const entry = attendance.find(
            (att) => att.student_id === studentId && formatDate(att.attendance_date) === date
        );
        return entry ? entry.status : 'absent';
    };

    return (
        <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}>
            <Navbar toggleSidebar={toggleSidebar} />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Training Attendance</h1>
                </div>
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <br />
                                    <div className="filters">
                                        <div className="form-group col-md-4">
                                            <label htmlFor="company_id" className="form-label">Company:</label>
                                            <select
                                                id="company_id"
                                                value={selectedCompany}
                                                onChange={(e) => handleCompanyChange(e.target.value)}
                                                required
                                                className="form-control"
                                            >
                                                <option value="">Select Company</option>
                                                {companies.map((company) => (
                                                    <option key={company.id} value={company.id}>{company.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="course_id" className="form-label">Course:</label>
                                            <select
                                                id="course_id"
                                                value={selectedCourse}
                                                onChange={(e) => handleCourseChange(e.target.value)}
                                                required
                                                className="form-control"
                                            >
                                                <option value="">Select Course</option>
                                                {courses.map((course) => (
                                                    <option key={course.id} value={course.id}>{course.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="training_id" className="form-label">Training:</label>
                                            <select
                                                id="training_id"
                                                value={selectedTraining}
                                                onChange={handleTrainingChange}
                                                required
                                                className="form-control"
                                            >
                                                <option value="">Select Training</option>
                                                {trainings.map((training) => (
                                                    <option key={training.id} value={training.id}>{training.id}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <br />
                                    {students.length > 0 && dates.length > 0 && (
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Student ID</th>
                                                    <th>Student Name</th>
                                                    {dates.map((date) => (
                                                        <th key={date}>{date}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {students.map((student) => (
                                                    <tr key={student.id}>
                                                        <td>{student.id}</td>
                                                        <td>{student.name}</td>
                                                        {dates.map((date) => (
                                                            <td key={date}>{getAttendanceStatus(student.id, date)}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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

export default ViewTrainingAttendance;
