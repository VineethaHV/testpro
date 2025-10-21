import React, { useEffect, useState } from 'react';
import api from '../services/api';

function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    patientId: '', description: '', date: ''
  });

  useEffect(() => {
    api.get('/records').then(res => setRecords(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await api.post('/records', form);
    api.get('/records').then(res => setRecords(res.data));
  };

  return (
    <div>
      <h2>Medical Records</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(form).map(key => (
          <input key={key} name={key} placeholder={key} value={form[key]} onChange={handleChange} />
        ))}
        <button type="submit">Add Record</button>
      </form>
      <ul>
        {records.map(r => (
          <li key={r.id}>Patient #{r.patientId} - {r.description} ({r.date})</li>
        ))}
      </ul>
    </div>
  );
}

export default RecordsPage;