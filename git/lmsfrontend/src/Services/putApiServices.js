// const getAuthHeaders = () => {
//     const token = localStorage.getItem("auth");
//     return {
//         'Content-Type': 'application/json',
//         Authorization: token ? `Bearer ${token}` : ""
//     };
// };

import { ApiNames } from '../Utils/ApiNames';
const otherOptions = async () => {
    return {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            authorization: localStorage.getItem("auth")
        },
    }
}
export const updateUser = async (id, v_formData) => {
    const response = await fetch(`${ApiNames.Registration}/${id}`, {
        ...await otherOptions(),
        body: JSON.stringify(v_formData),
    });
    const responseData = await response.json();
    return { response, responseData };
};

export const UpdateCourse = async (id, v_formData) => {
    const response = await fetch(`${ApiNames.Course}/${id}`, {
        ...await otherOptions(),
        body: JSON.stringify(v_formData),
    });
    const responseData = await response.json();
    return { response, responseData };
};

export const UpdateTrainingDetails = async (id, v_formData) => {
    const response = await fetch(`${ApiNames.T_Details}/${id}`, {
        ...await otherOptions(),
        body: JSON.stringify(v_formData),
    });
    const responseData = await response.json();
    return { response, responseData };
};

export const UpdateTestShedule = async (id, v_formData) => {
    const response = await fetch(`${ApiNames.CreateTestWithMcq}/${id}`, {
        ...await otherOptions(),
        body: JSON.stringify(v_formData),
    });
    const responseData = await response.json();
    return { response, responseData };
};

export const UpdateCompany = async (id, v_formData) => {
    const response = await fetch(`${ApiNames.Companies}/${id}`, {
        ...await otherOptions(),
        body: JSON.stringify(v_formData),
    });
    const responseData = await response.json();
    return { response, responseData };
};

export const UpdateStandupNote = async (id, updatedData) => {
    
    const response = await fetch(`${ApiNames.StandupNotes}/${id}`,{...await otherOptions(),
        body: JSON.stringify(updatedData),
    });
    const responseData = await response.json();
    return { response, responseData };
};


