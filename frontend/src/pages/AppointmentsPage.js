import React, { useEffect, useState } from 'react';
import api from '../services/api';

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    patientId: '', doctor: '', date: '', reason: ''
  });

  useEffect(() => {
    api.get('/appointments').then(res => setAppointments(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await api.post('/appointments', form);
    api.get('/appointments').then(res => setAppointments(res.data));
  };

  return (
    <div>
      <h2>Appointments</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(form).map(key => (
          <input key={key} name={key} placeholder={key} value={form[key]} onChange={handleChange} />
        ))}
        <button type="submit">Add Appointment</button>
      </form>
      <ul>
        {appointments.map(a => (
          <li key={a.id}>Patient #{a.patientId} with Dr. {a.doctor} on {a.date} ({a.reason})</li>
        ))}
      </ul>
    </div>
  );
}

export default AppointmentsPage;