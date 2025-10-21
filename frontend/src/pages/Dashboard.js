import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h2>Patient Management Dashboard</h2>
      <nav>
        <Link to="/patients">Patients</Link> |{' '}
        <Link to="/appointments">Appointments</Link> |{' '}
        <Link to="/records">Medical Records</Link>
      </nav>
    </div>
  );
}

export default Dashboard;