import { ApiNames } from '../Utils/ApiNames';

const getAuthHeaders = () => {
    const token = localStorage.getItem("auth");
    return {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ""
    };
};

const otherOptions = {
    method: "GET",
    headers: getAuthHeaders()
}
export const GetAllCourses = async () => {
    const response = await fetch(ApiNames.Course, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}

export const GetAllRoles = async () => {
    const response = await fetch(ApiNames.Roles, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}

export const GetAllUsers = async () => {
    const response = await fetch(ApiNames.Registration, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}

export const GetAllCompanies = async () => {
    const response = await fetch(ApiNames.Companies, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}
export const GetAllTrainingDetails = async () => {
    const response = await fetch(ApiNames.T_Details, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}


export const GetAllTests = async () => {
    const response = await fetch(ApiNames.Tests, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}


export const TestScoresBySId = async (testId) => {
    const response = await fetch(`${ApiNames.TscoresById}/${testId}`, otherOptions);
    const responseData = await response.json()
    return { response, responseData };
}

export const GetMaterialsDataByTid = async (trainingId) => {
    const response = await fetch(`${ApiNames.Materials}/${trainingId}`, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}

export const GetTestDetailsById = async (testId) => {
    const response = await fetch(`${ApiNames.Tests}/${testId}`, otherOptions);
    const responseData = await response.json()
    return { response, responseData };
}

export const GetTrainingsByCourseId = async (courseId) => {
    const response = await fetch(`${ApiNames.StudentCourses}/courses_trainings/${courseId}`, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}


export const GetStudentsByCourseAndTrainingId = async (courseId, trainingId) => {
    const response = await fetch(`${ApiNames.StudentsCourse}/courses_training_student/${courseId}/${trainingId}`, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}


export const GetCoursesByUserId = async (userId) => {
    const response = await fetch(`${ApiNames.StudentCourses}/courses_student/${userId}`, otherOptions);
    const responseData = await response.json()
    return { response, responseData };
}

export const GetStudentDocuments = async () => {
    const response = await fetch(ApiNames.StudentDocuments, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}
export const GetCoursesByCompany = async (companyId) => {

    const response = await fetch(`${ApiNames.StudentCourses}/company_courses/${companyId}`, otherOptions);
    const responseData = await response.json();
    return { response, responseData: Array.isArray(responseData) ? responseData : [responseData] }; // Ensure array format
};


export const GetStudentsByTraining = async (companyId) => {
    const response = await fetch(`${ApiNames.Registration}/${companyId}`, otherOptions);
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
    const response = await fetch(`${ApiNames.StudentsCourse}/student_trainings/${StudentId}`, otherOptions);
    const responseData = await response.json();
    return { response, responseData };
};

export const GetTestnameByTrainingId = async (trainingIdId, userId) => {
    const response = await fetch(`${ApiNames.StudentsCourse}/student_trainings_tests/${userId}/${trainingIdId}`, otherOptions);
    const responseData = await response.json();
    return { response, responseData };
};

export const TestScoresByTestidstudentId = async (testId, userId) => {
    const response = await fetch(`${ApiNames.TscoresById}/${testId}/${userId}`, otherOptions);
    const responseData = await response.json()
    return { response, responseData };
}

export const GetMaterialsDataForStudent = async (stu_id) => {
    const response = await fetch(`${ApiNames.Materials}/student_materials/${stu_id}`, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}
export const GetAllTestsByTid = async (trainingId) => {
    const response = await fetch(`${ApiNames.T_Details}/training_tests/${trainingId}`, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}
export const GetMaterialsData = async () => {
    const response = await fetch(ApiNames.Materials, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}

export const GetStudentsByTrainingId = async (trainingId) => {
    const response = await fetch(`${ApiNames.StudentsMapping}/${trainingId}`, otherOptions);
    const responseData = await response.json();
    return { response, responseData };
};

export const GetStudentsByCompanyId = async (CompanyId) => {
    const response = await fetch(`${ApiNames.StudentsCourse}/company_students/${CompanyId}`, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}


export const QuestionsByTestId = async (testId) => {
    const response = await fetch(`${ApiNames.Tests}/${testId}`, otherOptions);
    const responseData = await response.json()
    return { response, responseData };
}

export const GetAllMappedAndUnMappedStudents = async (cid, tid) => {

    const response = await fetch(`${ApiNames.StudentsMapping}/${cid}/${tid}`, otherOptions);
    const responseData = await response.json()
    return { response, responseData };
}


// Function to fetch attendance by course ID, training ID, and attendance date
export const GetAttendanceByDate = async (courseId, trainingId, attDate) => {
    try {
        const response = await fetch(`${ApiNames.StudentsCourse}/courses_training_student/${courseId}/${trainingId}/${attDate}`);
        const responseData = await response.json();
        return { response, responseData };
    } catch (error) {
        return { response: { ok: false, statusText: error.message }, responseData: null };
    }
};

export const GetCombinedScores = async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query string
    Object.keys(filters).forEach(key => {
        if (filters[key]) {
            queryParams.append(key, filters[key]);
        }
    });
    
    const url = filters && Object.keys(filters).length > 0 
        ? `${ApiNames.Reports}/combined-scores?${queryParams.toString()}`
        : `${ApiNames.Reports}/combined-scores`;
    
    const response = await fetch(url, otherOptions);
    const responseData = await response.json();
    return { response, responseData };
};

export const GetCombinedScoresSummary = async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query string
    Object.keys(filters).forEach(key => {
        if (filters[key]) {
            queryParams.append(key, filters[key]);
        }
    });
    
    const url = filters && Object.keys(filters).length > 0 
        ? `${ApiNames.Reports}/combined-scores/summary?${queryParams.toString()}`
        : `${ApiNames.Reports}/combined-scores/summary`;
    
    const response = await fetch(url, otherOptions);
    const responseData = await response.json();
    return { response, responseData };
};


