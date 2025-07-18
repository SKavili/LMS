const BASE_URL = "http://localhost:4002/course-content"; // Adjust if needed

export const getAllCourseContent = async () => {
    const response = await fetch(BASE_URL);
    return response.json();
};

export const addCourseContent = async (data) => {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const updateCourseContent = async (id, data) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const deleteCourseContent = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    return response.json();
}; 