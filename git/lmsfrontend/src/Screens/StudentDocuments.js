import React, { useState, useEffect } from 'react';
import Navbar from '../Navigation/Navbar';
import { GetCoursesByUserId, GetStudentDocuments } from '../Services/getApiServices';
import { UploadStudentDocument } from '../Services/postApiServices';
import { BaseUrl } from '../Utils/ApiUrl';

const StudentDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState('');
    const [courseMap, setCourseMap] = useState({});

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        fetchCourses();
        fetchDocuments();
    }, []);

    useEffect(() => {
        if (courseId) {
            fetchDocuments();
        }
    }, [courseId]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const fetchCourses = async () => {
        const data = JSON.parse(localStorage.getItem('userData'));
        let id = data.id;
        try {
            const { response, responseData } = await GetCoursesByUserId(id);
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            setCourses(responseData);

            const courseMap = {};
            responseData.forEach(course => {
                courseMap[course.id] = course.name;
            });
            setCourseMap(courseMap);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchDocuments = async () => {
        try {
            const { response, responseData } = await GetStudentDocuments();
            if (!response.ok) {
                throw new Error('Failed to fetch documents');
            }
            setDocuments(responseData);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const handleDownload = async (filePath) => {
        const fileName = filePath.split('/').pop();
        try {
            const response = await fetch(`${BaseUrl}${filePath}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to download file');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('student_id', JSON.parse(localStorage.getItem('userData')).id);
        formData.append('course_id', courseId);
        formData.append('documents', file);


        try {
            const { response } = await UploadStudentDocument(formData);

            if (response.ok) {
                alert('Document uploaded successfully');
                setFile(null);
                fetchDocuments();
            } else {
                alert('Error uploading document');
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Error uploading document');
        }
    };



    const handleCourseChange = (event) => {
        setCourseId(event.target.value);
    };

    return (
        <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}>
            <Navbar toggleSidebar={toggleSidebar} />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Student Documents</h1>
                </div>
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <br />
                                    <div>
                                        <h1>Student Documents</h1>
                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={{ marginRight: '10px' }}>Select Course:</label>
                                            <select
                                                value={courseId}
                                                onChange={handleCourseChange}
                                                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                                            >
                                                <option value="" disabled>Select</option>
                                                {courses.map(course => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.name}
                                                    </option>
                                                ))}
                                            </select>

                                        </div>
                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={{ marginRight: '10px' }}>Upload Document:</label>
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                style={{ marginRight: '10px' }}
                                            />
                                            <button
                                                onClick={handleUpload}
                                                style={{
                                                    padding: '5px 10px',
                                                    backgroundColor: '#007bff',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Upload
                                            </button>
                                        </div>

                                        <div style={{ marginTop: '20px' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Student ID</th>
                                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Course Name</th>
                                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Document Name</th>
                                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {documents.map(doc => (
                                                        <tr key={doc.id}>
                                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{doc.student_id}</td>
                                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{courseMap[doc.course_id]}</td>
                                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{doc.document_name}</td>
                                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                                <button
                                                                    className="btn btn-secondary"
                                                                    onClick={() => handleDownload(doc.file_path)}
                                                                >
                                                                    Download
                                                                </button>
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
                    </div>
                </section>
            </main>
        </div>
    );
};

export default StudentDocuments;
