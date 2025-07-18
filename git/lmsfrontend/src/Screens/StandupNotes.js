import React, { useState, useEffect } from 'react';
import { GetAllStandupNotes } from '../Services/getApiServices';
import { CreateStandupNote } from '../Services/postApiServices';
import { DeleteStandupNote } from '../Services/deleteApiServices';
import { UpdateStandupNote } from '../Services/putApiServices';
import Navbar from '../Navigation/Navbar';
 
const StandupNotes = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({
        standup_date: '',
        yesterday_work: '',
        today_plan: '',
        blockers: ''
    });
    const [editNote, setEditNote] = useState(null);

    // Get current user info from localStorage
    const userDataString = localStorage.getItem('userData');
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const currentUserId = userData ? userData.id : null;
    const currentUserRole = userData ? userData.role_id : null;
 
    useEffect(() => {
        fetchNotes();
    }, []);
 
    const fetchNotes = async () => {
        try {
            const { response, responseData } = await GetAllStandupNotes();
            if (response.ok) {
                setNotes(responseData);
            } else {
                console.error('Error fetching notes:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };
 
    const handleCreateNote = async () => {
        try {
            const { response, responseData } = await CreateStandupNote(newNote);
            if (response.status === 201) {
                setNewNote({
                    standup_date: '',
                    yesterday_work: '',
                    today_plan: '',
                    blockers: ''
                });
                alert("Note created successfully")
                fetchNotes();
            } else {
                console.error('Failed to create note:', response.status);
            }
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };
 
    const handleUpdateNote = async (id) => {
        try {
            const { response } = await UpdateStandupNote(id, editNote);
            if (response.status === 200) {
                fetchNotes();
                setEditNote(null);
            } else {
                console.error('Failed to update note. Status:', response.status);
            }
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };
 
    const handleDeleteNote = async (id) => {
        try {
            const { response } = await DeleteStandupNote(id);
            if (response.status === 200) {
                alert('Deleted Successfully');
                fetchNotes();
            } else {
                alert('Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };
 
    return (
<>
<Navbar />
<main id="main" className="main">
<div className="pagetitle">
<h1>Daily Standup Notes</h1>
</div>
<section className="section">
<div className="row">
<div className='col-lg-12'>
<div className='card' style={{ marginBottom: '20px' }}>
<div className='card-body'>
<h2>Create Note</h2>
<label className="form-label">Date</label>
<input className="form-control mb-2" type="date" placeholder="Date" value={newNote.standup_date} onChange={e => setNewNote({ ...newNote, standup_date: e.target.value })} />
<label className="form-label">Completed Work</label>
<textarea className="form-control mb-2" placeholder="From last reporting to current" value={newNote.yesterday_work} onChange={e => setNewNote({ ...newNote, yesterday_work: e.target.value })} />
  <label className="form-label">Planned Work</label>  
<textarea className="form-control mb-2" placeholder="Planned work for today" value={newNote.today_plan} onChange={e => setNewNote({ ...newNote, today_plan: e.target.value })} />
     <label className="form-label">Blockers</label>
<textarea className="form-control mb-2" placeholder="Impedements" value={newNote.blockers} onChange={e => setNewNote({ ...newNote, blockers: e.target.value })} />
<button className="btn btn-primary" onClick={handleCreateNote}>Submit</button>
</div>
</div>
</div>
</div>
 
                    <div className="row">
<div className='col-lg-12'>
<div className='card' style={{ marginTop: 0 }}>
<div className='card-body'>
<h2>Submitted Notes</h2>
<table className="table table-bordered table-striped">
<thead>
<tr>
<th>ID</th>
<th>User</th>
<th>Date</th>
<th>Yesterday</th>
<th>Today</th>
<th>Blockers</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
    {(currentUserRole === 1 ? notes : notes.filter(note => note.user_id === currentUserId)).map(note => (
<tr key={note.id}>
<td>{note.id}</td>
<td>{note.username}</td>
<td>{new Date(note.standup_date).toLocaleDateString()}</td>
<td>{editNote && editNote.id === note.id ? (
<textarea className="form-control" value={editNote.yesterday_work} onChange={e => setEditNote({ ...editNote, yesterday_work: e.target.value })} />
    ) : note.yesterday_work}</td>
<td>{editNote && editNote.id === note.id ? (
<textarea className="form-control" value={editNote.today_plan} onChange={e => setEditNote({ ...editNote, today_plan: e.target.value })} />
    ) : note.today_plan}</td>
<td>{editNote && editNote.id === note.id ? (
<textarea className="form-control" value={editNote.blockers} onChange={e => setEditNote({ ...editNote, blockers: e.target.value })} />
    ) : note.blockers}</td>
<td>
    {editNote && editNote.id === note.id ? (
<>
<button className="btn btn-success" onClick={() => handleUpdateNote(note.id)}>Save</button>
<button className="btn btn-secondary ms-2" onClick={() => setEditNote(null)}>Cancel</button>
</>
    ) : (
<>
<button className="btn btn-primary" onClick={() => setEditNote(note)}>Edit</button>
<button className="btn btn-danger ms-2" onClick={() => handleDeleteNote(note.id)}>Delete</button>
</>
    )}
</td>
</tr>
    ))}
</tbody>
</table>
</div>
</div>
</div>
</div>
</section>
</main>
</>
    );
};
 
export default StandupNotes;