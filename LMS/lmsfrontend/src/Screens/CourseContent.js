import React, { useEffect, useState } from "react";
import {
  getAllCourseContent,
  addCourseContent,
  updateCourseContent,
  deleteCourseContent,
} from "../Services/courseContentServices";

const statusOptions = ["pending", "in_progress", "completed"];

const emptyForm = {
  date: "",
  day: "",
  day_number: "",
  skill: "",
  topic: "",
  assignment: "",
  assessment: "",
  project: "",
  status: "pending",
  notes: "",
};

export default function CourseContent() {
  const [content, setContent] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const data = await getAllCourseContent();
    setContent(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateCourseContent(editingId, form);
    } else {
      await addCourseContent(form);
    }
    setForm(emptyForm);
    setEditingId(null);
    fetchContent();
  };

  const handleEdit = (row) => {
    setForm(row);
    setEditingId(row.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this entry?")) {
      await deleteCourseContent(id);
      fetchContent();
    }
  };

  return (
    <div className="container">
      <h2>Course Content Progress</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input name="date" type="date" value={form.date} onChange={handleChange} required />
        <input name="day" placeholder="Day" value={form.day} onChange={handleChange} />
        <input name="day_number" type="number" placeholder="Day #" value={form.day_number} onChange={handleChange} />
        <input name="skill" placeholder="Skill" value={form.skill} onChange={handleChange} />
        <input name="topic" placeholder="Topic" value={form.topic} onChange={handleChange} />
        <input name="assignment" placeholder="Assignment" value={form.assignment} onChange={handleChange} />
        <input name="assessment" placeholder="Assessment" value={form.assessment} onChange={handleChange} />
        <input name="project" placeholder="Project" value={form.project} onChange={handleChange} />
        <select name="status" value={form.status} onChange={handleChange}>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && <button type="button" onClick={() => { setForm(emptyForm); setEditingId(null); }}>Cancel</button>}
      </form>
      <table border="1" cellPadding="5" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Date</th><th>Day</th><th>#</th><th>Skill</th><th>Topic</th>
            <th>Assignment</th><th>Assessment</th><th>Project</th>
            <th>Status</th><th>Notes</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {content.map((row) => (
            <tr key={row.id}>
              <td>{row.date}</td>
              <td>{row.day}</td>
              <td>{row.day_number}</td>
              <td>{row.skill}</td>
              <td>{row.topic}</td>
              <td>{row.assignment}</td>
              <td>{row.assessment}</td>
              <td>{row.project}</td>
              <td>
                <select
                  value={row.status}
                  onChange={async (e) => {
                    await updateCourseContent(row.id, { ...row, status: e.target.value });
                    fetchContent();
                  }}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td>{row.notes}</td>
              <td>
                <button onClick={() => handleEdit(row)}>Edit</button>
                <button onClick={() => handleDelete(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 