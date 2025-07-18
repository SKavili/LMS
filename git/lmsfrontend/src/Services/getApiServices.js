
import { ApiNames } from '../Utils/ApiNames';

// const getAuthHeaders = () => {
//     const token = localStorage.getItem("auth");
//            return {
//         'Content-Type': 'application/json',
//         Authorization: token ? `Bearer ${token}` : ""
//     };
// };

const otherOptions = async () => {
    return {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem("auth")
        }
    }
}
export const GetAllCourses = async () => {
    const response = await fetch(ApiNames.Course,await otherOptions())
    const responseData = await response.json();
    return { response, responseData };
}

export const GetAllRoles = async () => {
    const response = await fetch(ApiNames.Roles,await otherOptions())
    const responseData = await response.json();
    return { response, responseData };
}

export const GetAllUsers = async () => {
    const response = await fetch(ApiNames.Registration, await otherOptions())
    const responseData = await response.json();
    return { response, responseData };
}

export const GetAllCompanies = async () => {
    const response = await fetch(ApiNames.Companies,await otherOptions())
    const responseData = await response.json();
    return { response, responseData };
}
export const GetAllTrainingDetails = async () => {
    const response = await fetch(ApiNames.T_Details,await otherOptions())
    const responseData = await response.json();
    return { response, responseData };
}


export const GetAllTests = async () => {
    const response = await fetch(ApiNames.Tests, await otherOptions())
    const responseData = await response.json();
    return { response, responseData };
}


export const TestScoresBySId = async (testId) => {
    const response = await fetch(`${ApiNames.TscoresById}/${testId}`, await otherOptions());
    const responseData = await response.json()
    return { response, responseData };
}

export const GetMaterialsDataByTid = async (trainingId) => {
    const response = await fetch(`${ApiNames.Materials}/${trainingId}`, await otherOptions())
    const responseData = await response.json();
    return { response, responseData };
}

export const GetTestDetailsById = async (testId) => {
    const response = await fetch(`${ApiNames.Tests}/${testId}`, await otherOptions());
    const responseData = await response.json()
    return { response, responseData };
}

export const GetTrainingsByCourseId = async (courseId) => {
    const response = await fetch(`${ApiNames.StudentCourses}/courses_trainings/${courseId}`,await otherOptions())
    const responseData = await response.json();
    return { response, responseData };
}


export const GetStudentsByCourseAndTrainingId = async (courseId, trainingId) => {
    const response = await fetch(`${ApiNames.StudentsCourse}/courses_training_student/${courseId}/${trainingId}`, await otherOptions())
    const responseData = await response.json();
    return { response, responseData };
}


export const GetCoursesByUserId = async (userId) => {
    const response = await fetch(`${ApiNames.StudentCourses}/courses_student/${userId}`,await otherOptions());
    const responseData = await response.json()
    return { response, responseData };
}

export const GetStudentDocuments = async () => {
    const response = await fetch(ApiNames.StudentDocuments, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}
export const GetCoursesByCompany = async (companyId) => {

    const response = await fetch(`${ApiNames.StudentCourses}/company_courses/${companyId}`, await otherOptions());
    const responseData = await response.json();
    return { response, responseData: Array.isArray(responseData) ? responseData : [responseData] }; // Ensure array format
};


export const GetStudentsByTraining = async (companyId) => {
    const response = await fetch(`${ApiNames.Registration}/${companyId}`,await otherOptions());
    const responseData = await response.json();
    return { response, responseData };
};


export const GetAttendanceByTrainingCidComid = async (trainingId, courseId, companyId) => {
    const response = await fetch(`${ApiNames.StudentsCourse}/attendance/${trainingId}/${courseId}/${companyId}`);
    const responseData = await response.json();
    return { response, responseData };
};

// 140624
export const GetTrainingsByStudentId = async (StudentId) => {
    const response = await fetch(`${ApiNames.StudentsCourse}/student_trainings/${StudentId}`, await otherOptions());
    const responseData = await response.json();
    return { response, responseData };
};

export const GetTestnameByTrainingId = async (trainingIdId, userId) => {
    const response = await fetch(`${ApiNames.StudentsCourse}/student_trainings_tests/${userId}/${trainingIdId}`, await otherOptions());
    const responseData = await response.json();
    return { response, responseData };
};

export const TestScoresByTestidstudentId = async (testId, userId) => {
    const response = await fetch(`${ApiNames.TscoresById}/${testId}/${userId}`, await otherOptions());
    const responseData = await response.json()
    return { response, responseData };
}

export const GetMaterialsDataForStudent = async (stu_id) => {
    const response = await fetch(`${ApiNames.Materials}/student_materials/${stu_id}`, await otherOptions())
    const responseData = await response.json();
    return { response, responseData };
}
export const GetAllTestsByTid = async (trainingId) => {
    const response = await fetch(`${ApiNames.T_Details}/training_tests/${trainingId}`,  await otherOptions())
    const responseData = await response.json();
    return { response, responseData };
}
export const GetMaterialsData = async () => {
    const response = await fetch(ApiNames.Materials, otherOptions())
    const responseData = await response.json();
    return { response, responseData };
}

export const GetStudentsByTrainingId = async (trainingId) => {
    const response = await fetch(`${ApiNames.StudentsMapping}/${trainingId}`, await otherOptions());
    const responseData = await response.json();
    return { response, responseData };
};

export const GetStudentsByCompanyId = async (CompanyId) => {
    const response = await fetch(`${ApiNames.StudentsCourse}/company_students/${CompanyId}`,await  otherOptions())
    const responseData = await response.json();
    return { response, responseData };
}


export const QuestionsByTestId = async (testId) => {
    const response = await fetch(`${ApiNames.Tests}/${testId}`,await otherOptions());
    const responseData = await response.json()
    return { response, responseData };
}

export const GetAllMappedAndUnMappedStudents = async (cid, tid) => {

    const response = await fetch(`${ApiNames.StudentsMapping}/${cid}/${tid}`,await otherOptions());
    const responseData = await response.json()
    return { response, responseData };
}
// to fetch attendance by course ID, training ID, and attendance date
export const GetAttendanceByDate = async (courseId, trainingId, attDate) => {
    try {
        const response = await fetch(`${ApiNames.StudentsCourse}/courses_training_student/${courseId}/${trainingId}/${attDate}`);
        const responseData = await response.json();
        return { response, responseData };
    } catch (error) {
        return { response: { ok: false, statusText: error.message }, responseData: null };
    }
};

export const GetAllStandupNotes = async () => {
    // const token = localStorage.getItem('token'); // assuming you're storing JWT
    try {
    const response = await fetch(ApiNames.StandupNotes, await otherOptions() );
    const responseData = await response.json();

    return { response, responseData };
}
catch (error) {
        return { response: { ok: false, statusText: error.message }, responseData: null };
    }
};

export const GetWeeklyStandupNotes = async (start, end) => {
    try {
        console.log("📤 Sending weekly standup request", start, end);
        const response = await fetch(`${ApiNames.StandupNotesWeekly}?start=${start}&end=${end}`, await otherOptions());
        const responseData = await response.json();
        return { response, responseData };
    } catch (error) {
        return { response: { ok: false, statusText: error.message }, responseData: null };
    }
};




