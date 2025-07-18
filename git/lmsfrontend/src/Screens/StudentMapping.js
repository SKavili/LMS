
import React, { useState, useEffect } from 'react';
import Navbar from '../Navigation/Navbar';
import {
    GetAllCompanies,
    GetCoursesByCompany,
    GetTrainingsByCourseId,
    GetAllMappedAndUnMappedStudents
} from '../Services/getApiServices';
import { CreateStudentMapping } from '../Services/postApiServices';

const StudentMapping = () => {
    const [companies, setCompanies] = useState([]);
    const [courses, setCourses] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentRecords, setStudentRecords] = useState({});

    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedTraining, setSelectedTraining] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        const { response, responseData } = await GetAllCompanies();
        if (response.ok) setCompanies(responseData);
    };

    const fetchCourses = async (companyId) => {
        const { response, responseData } = await GetCoursesByCompany(companyId);
        if (response.ok) setCourses(responseData);
    };

    const fetchTrainings = async (courseId) => {
        const { response, responseData } = await GetTrainingsByCourseId(courseId);
        if (response.ok) setTrainings(responseData);
    };

    const fetchStudents = async (companyId, trainingId) => {
        const { response, responseData } = await GetAllMappedAndUnMappedStudents(companyId, trainingId);
        if (response.ok) {
            setStudents(responseData);
            const records = {};
            responseData.forEach(student => {
                records[student.user_id] = student.has_training_record === 'Check';
            });
            setStudentRecords(records);
        }
    };

    const handleCompanyChange = (companyId) => {
        setSelectedCompany(companyId);
        setSelectedCourse('');
        setSelectedTraining('');
        setStudents([]);
        setSelectedStudents([]);
        setStudentRecords({});
        fetchCourses(companyId);
    };

    const handleCourseChange = (courseId) => {
        setSelectedCourse(courseId);
        setSelectedTraining('');
        setStudents([]);
        setSelectedStudents([]);
        setStudentRecords({});
        fetchTrainings(courseId);
    };

    const handleTrainingChange = (trainingId) => {
        setSelectedTraining(trainingId);
        setSelectedStudents([]);
        setStudentRecords({});
        if (selectedCompany && trainingId) {
            fetchStudents(selectedCompany, trainingId);
        }
    };

    const handleStudentChange = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleCheckAll = (event) => {
        if (event.target.checked) {
            const unmapped = students
                .filter(s => !studentRecords[s.user_id])
                .map(s => s.user_id);
            setSelectedStudents(unmapped);
        } else {
            setSelectedStudents([]);
        }
    };

    const handleSubmit = async () => {
        const student_ids = selectedStudents.filter(id => !studentRecords[id]);
        const unmap_student_ids = Object.entries(studentRecords)
            .filter(([id, mapped]) => mapped && !selectedStudents.includes(id))
            .map(([id]) => id);

        const data = {
    training_id: Number(selectedTraining),
    student_ids: student_ids.map(Number),
    unmap_student_ids: unmap_student_ids.map(Number)
};

        try {
            const { response } = await CreateStudentMapping(data);
            if (response.ok) {
                alert('Student mappings updated successfully!');
                fetchStudents(selectedCompany, selectedTraining);
                setSelectedStudents([]);
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('Something went wrong!');
        }
    };

    const handleSingleUnmap = async (studentId) => {
        const confirm = window.confirm("Are you sure you want to remove this student from the training?");
        if (!confirm) return;

        const data = {
    training_id: Number(selectedTraining),
    student_ids: [],
    unmap_student_ids: [Number(studentId)]
};

        try {
            const { response } = await CreateStudentMapping(data);
            if (response.ok) {
                alert('Student removed successfully!');
                fetchStudents(selectedCompany, selectedTraining);
            } else {
                throw new Error('Remove failed');
            }
        } catch (error) {
            console.error('Unmap error:', error);
            alert('Failed to remove student.');
        }
    };

    return (
        <>
            <Navbar />
            <main id="main" className="main">
                <div className="pagetitle"><h1>Student Mapping</h1></div>
                <section className="section">
                    <div className="row">
                        <div className='col-lg-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <br />

                                    <div className="row">
                                        <div className="col-lg-4">
                                            <label>Company:</label>
                                            <select className="form-select" value={selectedCompany}
                                                onChange={(e) => handleCompanyChange(e.target.value)}>
                                                <option value="">Select Company</option>
                                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-lg-4">
                                            <label>Course:</label>
                                            <select className="form-select" value={selectedCourse}
                                                onChange={(e) => handleCourseChange(e.target.value)} disabled={!selectedCompany}>
                                                <option value="">Select Course</option>
                                                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-lg-4">
                                            <label>Training:</label>
                                            <select className="form-select" value={selectedTraining}
                                                onChange={(e) => handleTrainingChange(e.target.value)} disabled={!selectedCourse}>
                                                <option value="">Select Training</option>
                                                {trainings.map(t => <option key={t.id} value={t.id}>{t.training_name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-lg-12">
                                            <label>Students:</label>
                                            {students.length > 0 ? (
                                                <>
                                                    <div className="form-check">
                                                        <input type="checkbox" className="form-check-input" id="checkAll"
                                                            checked={selectedStudents.length === students.filter(s => !studentRecords[s.user_id]).length}
                                                            onChange={handleCheckAll} />
                                                        <label className="form-check-label" htmlFor="checkAll">Check All Unmapped</label>
                                                    </div>

                                                    {students.map(student => {
                                                        const isMapped = studentRecords[student.user_id];
                                                        return (
                                                            <div className="form-check d-flex justify-content-between align-items-center" key={student.user_id}>
                                                                <div>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={`student_${student.user_id}`}
                                                                        value={student.user_id}
                                                                        checked={selectedStudents.includes(student.user_id)}
                                                                        onChange={() => handleStudentChange(student.user_id)}
                                                                    />
                                                                    <label className="form-check-label ms-2"
                                                                        htmlFor={`student_${student.user_id}`}
                                                                        style={{ color: isMapped ? 'gray' : 'black' }}>
                                                                        {student.username} {isMapped ? '(Already Mapped)' : ''}
                                                                    </label>
                                                                </div>
                                                                {isMapped && (
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => handleSingleUnmap(student.user_id)}>
                                                                        Remove
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </>
                                            ) : (
                                                <p>No students available</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-lg-12">
                                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                                Submit
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default StudentMapping;

