import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', registerNumber: '', department: '', year: '', email: '', phone: '', password: '' });

  const loadStudents = async () => {
    const res = await api.get('/students');
    setStudents(res.data);
  };

  useEffect(() => { loadStudents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/students', form);
    setForm({ name: '', registerNumber: '', department: '', year: '', email: '', phone: '', password: '' });
    loadStudents();
  };

  const toggleStatus = async (id) => {
    await api.patch(`/students/${id}/toggle-status`);
    loadStudents();
  };

  return (
    <div className="stack">
      <form className="panel-card" onSubmit={handleSubmit}>
        <h3>Create Student</h3>
        <div className="grid-2">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Register Number" value={form.registerNumber} onChange={(e) => setForm({ ...form, registerNumber: e.target.value })} />
          <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <input placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button type="submit">Save Student</button>
      </form>
      <div className="panel-card">
        <h3>Students</h3>
        <table>
          <thead><tr><th>Name</th><th>Register</th><th>Department</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td><td>{student.registerNumber}</td><td>{student.department}</td><td>{student.status}</td>
                <td><button onClick={() => toggleStatus(student._id)}>{student.status === 'active' ? 'Disable' : 'Enable'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
