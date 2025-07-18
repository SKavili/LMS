import { ApiNames } from "../Utils/ApiNames";

const getAuthHeaders = () => {
    const token = localStorage.getItem("auth");
    return {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ""
    };
};

const otherOptions = {
    method: "DELETE",
    headers: getAuthHeaders()
}
export const DeleteUser = async (id) => {
    const response = await fetch(`${ApiNames.Registration}/${id}`, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}

export const DeleteCourse = async (id) => {
    const response = await fetch(`${ApiNames.Course}/${id}`, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}
export const DeleteTrainingDetails = async (id) => {
    const response = await fetch(`${ApiNames.T_Details}/${id}`, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}
export const DeleteCompany = async (id) => {
    const response = await fetch(`${ApiNames.Companies}/${id}`, otherOptions)
    const responseData = await response.json();
    return { response, responseData };
}
export const DeleteStandupNote = async (id) => {
    const response = await fetch(`${ApiNames.StandupNotes}/${id}`,otherOptions);  
    const responseData = await response.json();
    return { response, responseData };
};