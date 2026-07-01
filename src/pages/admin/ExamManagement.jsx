import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function ExamManagement() {
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState({ examName: '', subject: '', department: '', year: '', duration: 60, instructions: '', startTime: '', endTime: '', passingMarks: 40, negativeMarks: 0, status: 'draft' });

  const loadExams = async () => {
    const res = await api.get('/exams');
    setExams(res.data);
  };

  useEffect(() => { loadExams(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/exams', form);
    setForm({ examName: '', subject: '', department: '', year: '', duration: 60, instructions: '', startTime: '', endTime: '', passingMarks: 40, negativeMarks: 0, status: 'draft' });
    loadExams();
  };

  return (
    <div className="stack">
      <form className="panel-card" onSubmit={handleSubmit}>
        <h3>Create Exam</h3>
        <div className="grid-2">
          <input placeholder="Exam Name" value={form.examName} onChange={(e) => setForm({ ...form, examName: e.target.value })} />
          <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <input placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          <input type="number" placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
          <input type="number" placeholder="Passing Marks" value={form.passingMarks} onChange={(e) => setForm({ ...form, passingMarks: Number(e.target.value) })} />
          <input type="number" placeholder="Negative Marks" value={form.negativeMarks} onChange={(e) => setForm({ ...form, negativeMarks: Number(e.target.value) })} />
          <input type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
          <input type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
          <textarea placeholder="Instructions" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
        </div>
        <button type="submit">Create Exam</button>
      </form>
      <div className="panel-card">
        <h3>Exams</h3>
        <table>
          <thead><tr><th>Name</th><th>Subject</th><th>Status</th><th>Duration</th></tr></thead>
          <tbody>
            {exams.map((exam) => <tr key={exam._id}><td>{exam.examName}</td><td>{exam.subject}</td><td>{exam.status}</td><td>{exam.duration} min</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
