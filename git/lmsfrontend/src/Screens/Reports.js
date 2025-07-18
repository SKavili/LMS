

import React, { useState, useEffect } from 'react';
import Navbar from '../Navigation/Navbar';
import { GetAllUsers, GetAllCourses, GetAllTests } from '../Services/getApiServices';
import { ReportsData } from '../Services/postApiServices';

function transformCourseReportData(reportData) {
  const tests = [];
  const testIdToName = {};

  reportData.forEach(row => {
    if (!testIdToName[row.test_id]) {
      testIdToName[row.test_id] = row.test_name;
      tests.push({ test_id: row.test_id, test_name: row.test_name });
    }
  });

  const students = {};
  reportData.forEach(row => {
    if (!students[row.student_id]) {
      students[row.student_id] = {
        student_id: row.student_id,
        student_name: row.student_name,
        scores: {},
        total: 0,
      };
    }
    students[row.student_id].scores[row.test_id] = row.score;
    students[row.student_id].total += row.score;
  });

  return {
    tests,
    students: Object.values(students),
  };
}

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState('');
  const [selectedDetail, setSelectedDetail] = useState('');
  const [detailsOptions, setDetailsOptions] = useState([]);
  const [rawReportData, setRawReportData] = useState([]);
  const [type, setType] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (selectedReportType) fetchDetailsOptions();
  }, [selectedReportType]);

  useEffect(() => {
    if (selectedDetail) fetchReportData();
  }, [selectedDetail]);

  const fetchDetailsOptions = async () => {
    try {
      let data = [];
      let newType = '';

      switch (selectedReportType) {
        case 'Student-wise': {
          const { response, responseData } = await GetAllUsers();
          if (response.ok) {
            data = responseData;
            newType = 'student';
          }
          break;
        }
        case 'Course-wise': {
          const { response, responseData } = await GetAllCourses();
          if (response.ok) {
            data = responseData;
            newType = 'course';
          }
          break;
        }
        case 'Test-wise': {
          const { response, responseData } = await GetAllTests();
          if (response.ok) {
            data = responseData;
            newType = 'test';
          }
          break;
        }
        default:
          return;
      }

      setDetailsOptions(data);
      setType(newType);
    } catch (err) {
      console.error('Error fetching details:', err);
    }
  };

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const { response, responseData } = await ReportsData(selectedDetail, type);
      if (response.ok) {
        setRawReportData(responseData);
      } else {
        setRawReportData([]);
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
      setRawReportData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderReportTable = () => {
    if (selectedReportType === 'Course-wise') {
      const { tests, students } = transformCourseReportData(rawReportData);
      if (!students.length) {
        return <div className="alert alert-warning mt-3">No data available.</div>;
      }

      return (
        <table className="table table-striped table-bordered LMS_table">
          <thead>
            <tr>
              <th>Student Name</th>
              {tests.map(test => (
                <th key={test.test_id}>{test.test_name}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.student_id}>
                <td>{student.student_name}</td>
                {tests.map(test => (
                  <td key={test.test_id}>{student.scores[test.test_id] ?? 0}</td>
                ))}
                <td>{student.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (rawReportData.length === 0) {
      return <div className="alert alert-warning mt-3">No data available.</div>;
    }

    return (
      <table className="table table-striped table-bordered LMS_table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {rawReportData.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.total_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className={`${isSidebarOpen ? 'toggle-sidebar' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} />
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Reports</h1>
        </div>

        <section className="section">
          <div className="card">
            <div className="card-body">
              <br />

              {/* Dropdowns */}
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Select Report Type:</label>
                  <select
                    className="form-select"
                    value={selectedReportType}
                    onChange={(e) => {
                      setSelectedReportType(e.target.value);
                      setSelectedDetail('');
                      setDetailsOptions([]);
                      setRawReportData([]);
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="Course-wise">Course-wise</option>
                    <option value="Student-wise">Student-wise</option>
                    <option value="Test-wise">Test-wise</option>
                  </select>
                </div>

                {selectedReportType && (
                  <div className="col-md-4">
                    <label className="form-label">Select {selectedReportType.split('-')[0]}:</label>
                    <select
                      className="form-select"
                      value={selectedDetail}
                      onChange={(e) => setSelectedDetail(e.target.value)}
                    >
                      <option value="" disabled>Select...</option>
                      {detailsOptions.map(option => {
                        const key = option.id || option.test_id;
                        const label =
                          selectedReportType === 'Course-wise' ? option.name :
                          selectedReportType === 'Student-wise' ? option.username :
                          selectedReportType === 'Test-wise' ? option.test_name : '';
                        return <option key={key} value={key}>{label}</option>;
                      })}
                    </select>
                  </div>
                )}
              </div>

              {/* Report Table */}
              {selectedDetail && (
                <div style={{ marginTop: '20px' }}>
                  <div className="pagetitle">
                    <h2>{selectedReportType} Report</h2>
                  </div>
                  {isLoading ? (
                    <div className="text-center">Loading report...</div>
                  ) : (
                    <div className="table-responsive">{renderReportTable()}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Reports;
