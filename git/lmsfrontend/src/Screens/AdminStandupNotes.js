import React, { useState, useEffect } from 'react';
import Navbar from '../Navigation/Navbar';
import { GetWeeklyStandupNotes } from '../Services/getApiServices';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // <-- important for tooltips


function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}
function getFriday(monday) {
  const d = new Date(monday);
  d.setDate(d.getDate() + 4);
  return d;
}
function formatDate(date) {
  return date.toISOString().split('T')[0];
}
function getWeekDates(monday) {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return formatDate(d);
  });
}

// Helper to truncate text
function truncateText(text, maxLength = 40) {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

const AdminStandupNotes = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const isAdmin = userData && userData.role_id === 1;
  const [weekStart, setWeekStart] = useState(() => formatDate(getMonday(new Date())));
  const [weekEnd, setWeekEnd] = useState(() => formatDate(getFriday(getMonday(new Date()))));
  const [notesData, setNotesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const weekDates = getWeekDates(new Date(weekStart));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    setError('');
    GetWeeklyStandupNotes(weekStart, weekEnd)
      .then(({ response, responseData }) => {
        if (response.ok) {
          setNotesData(responseData);
        } else {
          setError('Failed to fetch notes');
        }
      })
      .catch(() => setError('Failed to fetch notes'))
      .finally(() => setLoading(false));
  }, [weekStart, weekEnd, isAdmin]);

  // Initialize Bootstrap tooltips after render
  useEffect(() => {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      if (!tooltipTriggerEl._tooltip) {
        // eslint-disable-next-line no-undef
        tooltipTriggerEl._tooltip = new window.bootstrap.Tooltip(tooltipTriggerEl);
      }
    });
    return () => {
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        if (tooltipTriggerEl._tooltip) {
          tooltipTriggerEl._tooltip.dispose();
          tooltipTriggerEl._tooltip = null;
        }
      });
    };
  }, [notesData, weekDates]);

  const handlePrevWeek = () => {
    const prevMonday = new Date(weekStart);
    prevMonday.setDate(prevMonday.getDate() - 7);
    setWeekStart(formatDate(getMonday(prevMonday)));
    setWeekEnd(formatDate(getFriday(getMonday(prevMonday))));
  };
  const handleNextWeek = () => {
    const nextMonday = new Date(weekStart);
    nextMonday.setDate(nextMonday.getDate() + 7);
    setWeekStart(formatDate(getMonday(nextMonday)));
    setWeekEnd(formatDate(getFriday(getMonday(nextMonday))));
  };

  if (!isAdmin) {
    return <div><Navbar /><main className="main"><h2>Access Denied</h2></main></div>;
  }

  return (
    <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}> 
      <Navbar toggleSidebar={toggleSidebar} />
      <main id="main" className="main">
        <div className="pagetitle text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ textAlign: 'center', width: '100%' }}>All Students Standup Notes</h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <button className="btn btn-outline-primary me-2" onClick={handlePrevWeek}>&lt;&lt;</button>
            <span className="fw-bold" style={{ fontSize: '1.2rem' }}>{weekStart} to {weekEnd}</span>
            <button className="btn btn-outline-primary ms-2" onClick={handleNextWeek}>&gt;&gt;</button>
          </div>
        </div>
        <section className="section mt-4">
          {loading ? <div>Loading...</div> : error ? <div className="text-danger">{error}</div> : (
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="text-center">Standup Notes ({weekStart} to {weekEnd})</h5>
                    <div className="table-responsive">
                      <table className="table table-bordered w-100" style={{ tableLayout: 'auto' }}>
                        <thead>
                          <tr>
                            <th>Student</th>
                            {weekDates.map(date => (
                             <th key={date}>
    {new Date(date + 'T00:00:00').toLocaleDateString('en-CA')}
   {/* {new Date(note.standup_date).toLocaleDateString()} */}

  </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {notesData.map(student => (
                            <tr key={student.user_id}>
                              <td>{student.username}</td>
                              {weekDates.map(date => (
                                <td key={date} style={{ minWidth: 180 }}>
                                  {student.notes[date] ? (
                                    <div>
                                      <div>
                                        <b>Completed:</b> <span data-bs-toggle="tooltip" data-bs-placement="top" title={student.notes[date].yesterday_work}>{truncateText(student.notes[date].yesterday_work)}</span>
                                      </div>
                                      <div>
                                        <b>Planned:</b> <span data-bs-toggle="tooltip" data-bs-placement="top" title={student.notes[date].today_plan}>{truncateText(student.notes[date].today_plan)}</span>
                                      </div>
                                      <div>
                                        <b>Blockers:</b> <span data-bs-toggle="tooltip" data-bs-placement="top" title={student.notes[date].blockers}>{truncateText(student.notes[date].blockers)}</span>
                                      </div>
                                    </div>
                                  ) : <span className="text-muted">-</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminStandupNotes; 