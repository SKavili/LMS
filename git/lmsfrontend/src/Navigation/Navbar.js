import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.svg';
import logo_icon from '../assets/logo_icon.svg';
const Navbar = ({ toggleSidebar }) => {
    const userDataString = localStorage.getItem('userData');
    const userData = userDataString ? JSON.parse(userDataString) : null; // Parse the JSON string
    // Now you can access the properties of userData, including Roleid
    const role = userData ? userData.role_id : null;

    const logOutHandler = () => {
        localStorage.clear();
        // Additional logout logic, e.g., redirect to login page
    };


    return (
        <>
            <header id="header" className="header fixed-top d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-between">
                    <NavLink className="logo d-flex align-items-center" to="/">
                        <img src={logo} alt="LMS" />
                        <span className="d-none d-lg-block">LMS</span>
                    </NavLink>
                    <i class="bi bi-list toggle-sidebar-btn" onClick={toggleSidebar}></i>
                </div>
                <nav className="header-nav ms-auto">
                    <ul className="d-flex align-items-center">
                        <li className="nav-item dropdown pe-3">
                            <NavLink className="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown" to="#">
                                <img src={logo_icon} alt="Profile" className="rounded-circle" />
                                <span className="d-none d-md-block dropdown-toggle ps-2">{userData.username}</span>
                            </NavLink>
                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                                <li className="dropdown-header">
                                    <h6>{userData.username}</h6>
                                    <span>{userData.role_id}</span>
                                </li>
                                <hr className="dropdown-divider" />
                                {/* <Link className="dropdown-item d-flex align-items-center" to="/Profile">
                                    <i className="bi bi-person-square" /> My Profile
                                </Link> */}
                                {/* <hr className="dropdown-divider" /> */}
                                {/* <button className="dropdown-item d-flex align-items-center" onClick={changePasswordHandler}>
                                    <i className="bi bi-shield-lock-fill" /> Change Password
                                </button> */}
                                {/* <hr className="dropdown-divider" /> */}
                                <Link className="dropdown-item d-flex align-items-center" to="/" onClick={logOutHandler}>
                                    <i className="bi bi-power" /> Sign Out
                                </Link>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </header>
            <aside id="sidebar" className="sidebar">
                <ul className="sidebar-nav" id="sidebar-nav">

                    {role === 1 && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/UserCreation">
                                    <i className="bi bi-people" /> User Creation
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Company">
                                    <i className="bi bi-people" /> Company Creation
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/CourseCreation">
                                    <i className="bi bi-book" /> Course Creation
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/CreateTrainingDetails">
                                    <i className="bi bi-book" /> Training Details
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/TestCreation">
                                    <i className="bi bi-book" /> Test Creation
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/CreateTestShedule">
                                    <i className="bi bi-book" /> Test Schedule
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/StudentMapping">
                                    <i className="bi bi-book" /> Student Mapping
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/Reports">
                                    <i className="bi bi-book" /> Reports
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Attendance">
                                    <i className="bi bi-book" /> Mark Attendance
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/ViewAttendance">
                                    <i className="bi bi-book" /> View Attendance
                                </Link>
                            </li>
                            {/* <li>
                                <a href="/course-content">Course Content</a>
                            </li> */}
                              <li className="nav-item">
                                <Link className="nav-link" to="/AdminStandupNotes">
                                    <i className="bi bi-book" /> View StandupNotes
                                </Link>
                            </li>

                        </>
                    )}
                    {role === 2 && (
                        <>
                            {/* <li className="nav-item">
                                <Link className="nav-link" to="/Faculty">
                                    <i className="bi bi-book" /> Course Management
                                </Link>
                            </li> */}
                            <li className="nav-item">
                                <Link className="nav-link" to="/Material">
                                    <i className="bi bi-pencil" /> Material
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/ViewMaterials">
                                    <i className="bi bi-book" /> View Materials
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/TestScores">
                                    <i className="bi bi-pencil" /> Test Scores
                                </Link>
                            </li>
                        </>
                    )}
                    {role === 3 && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/StudentMaterial">
                                    <i className="bi bi-book" /> View Materials
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/StudentDocuments">
                                    <i className="bi bi-card-list" /> Student Documents
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/StudentTest">
                                    <i className="bi bi-card-list" /> Student Test
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/StudentTestScores">
                                    <i className="bi bi-card-list" /> Test Scores
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/StandupNotes">
                                    <i className="bi bi-card-list" /> Standup Notes
                                </Link>
                            </li>

                        </>
                    )}
                </ul>
            </aside>
        </>
    );
};

export default Navbar;
