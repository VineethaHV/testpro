import React, { useEffect, useState } from 'react';
import api from '../services/api';

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    patientId: '', doctor: '', date: '', timeSlot: '', reason: ''
  });
  const [statusUpdate, setStatusUpdate] = useState({ id: '', status: 'scheduled' });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/appointments').then(res => setAppointments(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/appointments', form);
      api.get('/appointments').then(res => setAppointments(res.data));
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating appointment');
    }
  };

  const handleStatusChange = async e => {
    e.preventDefault();
    try {
      await api.put(`/appointments/${statusUpdate.id}/status`, { status: statusUpdate.status });
      api.get('/appointments').then(res => setAppointments(res.data));
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating status');
    }
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
      {error && <div style={{color: 'red'}}>{error}</div>}
      <ul>
        {appointments.map(a => (
          <li key={a.id}>
            Patient #{a.patientId} with Dr. {a.doctor} on {a.date} [{a.timeSlot}] ({a.reason}) - Status: {a.status}
          </li>
        ))}
      </ul>
      <h3>Update Appointment Status</h3>
      <form onSubmit={handleStatusChange}>
        <input name="id" placeholder="Appointment ID" value={statusUpdate.id} onChange={e => setStatusUpdate({ ...statusUpdate, id: e.target.value })} />
        <select name="status" value={statusUpdate.status} onChange={e => setStatusUpdate({ ...statusUpdate, status: e.target.value })}>
          <option value="scheduled">Scheduled</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit">Update Status</button>
      </form>
    </div>
  );
}

export default AppointmentsPage;