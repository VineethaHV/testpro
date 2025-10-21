import React, { useEffect, useState } from 'react';
import api from '../services/api';

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    firstName: '', lastName: '', dob: '', gender: '', phone: '', email: '', address: ''
  });

  useEffect(() => {
    api.get('/patients').then(res => setPatients(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await api.post('/patients', form);
    api.get('/patients').then(res => setPatients(res.data));
  };

  return (
    <div>
      <h2>Patients</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(form).map(key => (
          <input key={key} name={key} placeholder={key} value={form[key]} onChange={handleChange} />
        ))}
        <button type="submit">Add Patient</button>
      </form>
      <ul>
        {patients.map(p => (
          <li key={p.id}>{p.firstName} {p.lastName} ({p.dob})</li>
        ))}
      </ul>
    </div>
  );
}

export default PatientsPage;