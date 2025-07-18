import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../Screens/Login';
import UserCreation from '../Screens/UserCreation';
import CourseCreation from '../Screens/CourseCreation';
import TestCreation from '../Screens/TestCreation';
import CreateTrainingDetails from '../Screens/CreateTrainingDetails';
import CreateTestShedule from '../Screens/CreateTestShedule';
import Reports from '../Screens/Reports';
import Attendance from '../Screens/Attendance';
import UploadFacultyMaterial from '../Screens/MaterialUpload';
import ViewFacultyMaterials from '../Screens/ViewFacultyMaterials';
import TestScores from '../Screens/TestScores';
import StudentDocuments from '../Screens/StudentDocuments';
import ViewTrainingAttendance from '../Screens/ViewAttendance';
import StudentTestScores from '../Screens/StudentTestScores';
import Company from '../Screens/Company';
import StudentMapping from '../Screens/StudentMapping';
import StudentMaterialView from '../Screens/StudentMaterialView';
import StudentTest from '../Screens/StudentTest';
import StandupNotes from '../Screens/StandupNotes';
import AdminStandupNotes from '../Screens/AdminStandupNotes';


const LazyNavbar = lazy(() => import('./Navbar'));
const Navigation = () => {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Navbar" element={<LazyNavbar />} />
                <Route path='/UserCreation' element={< UserCreation />} />
                <Route path='/CourseCreation' element={< CourseCreation />} />
                <Route path='/TestCreation' element={< TestCreation />} />
                <Route path='/CreateTrainingDetails' element={< CreateTrainingDetails />} />
                <Route path='/CreateTestShedule' element={< CreateTestShedule />} />
                <Route path='/Reports' element={< Reports />} />
                <Route path='/Attendance' element={< Attendance />} />
                <Route path='/Material' element={< UploadFacultyMaterial />} />
                <Route path='/ViewMaterials' element={< ViewFacultyMaterials />} />
                <Route path='/TestScores' element={< TestScores />} />
                <Route path='/StudentDocuments' element={< StudentDocuments />} />
                <Route path='/ViewAttendance' element={< ViewTrainingAttendance />} />
                <Route path='/StudentTestScores' element={< StudentTestScores />} />
                <Route path='/Company' element={< Company />} />
                <Route path='/StudentMapping' element={< StudentMapping />} />
                <Route path='/StudentMaterial' element={< StudentMaterialView />} />
                <Route path='/StudentTest' element={< StudentTest />} />
                  <Route path='/StandupNotes' element={< StandupNotes />} />
               <Route path='/AdminStandupNotes' element={< AdminStandupNotes />} />


                {/* Add more routes here */}
            </Routes >



        </Suspense >
    );
};

export default Navigation;
