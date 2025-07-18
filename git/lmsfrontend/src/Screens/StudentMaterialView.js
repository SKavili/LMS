import React, { useState, useEffect } from 'react';
import Navbar from '../Navigation/Navbar';
import { BaseUrl } from '../Utils/ApiUrl';
import { GetMaterialsDataForStudent } from '../Services/getApiServices';

const StudentMaterialView = () => {
    const [materials, setMaterials] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    useEffect(() => {
        const fetchData = async () => {
            const data = JSON.parse(localStorage.getItem('userData'));
            const studentId = data.id;
            try {
                const { response, responseData } = await GetMaterialsDataForStudent(studentId);
                if (!response.ok) {
                    throw new Error('Failed to fetch materials');
                }
                setMaterials(responseData);
            } catch (error) {
                console.error('Error fetching materials:', error);
            }
        };

        fetchData();
    }, []);

    const handleDownload = (filePath) => {
        const link = document.createElement('a');
        link.href = `${BaseUrl}${filePath}`;
        link.download = filePath;
        link.click();
    };

    return (
        <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}>
            <Navbar toggleSidebar={toggleSidebar} />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>View Materials</h1>
                </div>
                <section className="section">
                    <div className="row">
                        <div className='col-lg-12'>
                            <div className='card'>
                                <div className='card-body'>
                                    <br />
                                    <div class="table-responsive">
                                        <table className="table table-striped table-bordered LMS_table">
                                            <thead>
                                                <tr>
                                                    <th>Course Name</th>
                                                    <th>Faculty Name</th>
                                                    <th>Material Name</th>
                                                    <th>Training Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {materials.map(material => (
                                                    <tr key={material.id}>
                                                        <td>{material.course_name}</td>
                                                        <td>{material.faculty_name}</td>
                                                        <td>{material.material_name}</td>
                                                        <td>{new Date(material.training_date).toLocaleDateString()}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-secondary"
                                                                onClick={() => handleDownload(material.file_path)}
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
                </section>
            </main>
        </div>
    );
};

export default StudentMaterialView;
