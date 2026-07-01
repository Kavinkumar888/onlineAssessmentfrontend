import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, exams: 0, completed: 0, average: 0, highest: 0, lowest: 0, passRate: 0 });
  const [exams, setExams] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/results/analytics'), api.get('/exams')]).then(([analyticsRes, examsRes]) => {
      setStats(analyticsRes.data);
      setExams(examsRes.data);
    });
  }, []);

  return (
    <div>
      <div className="card-grid">
        <div className="stat-card"><h3>Total Students</h3><p>{stats.students}</p></div>
        <div className="stat-card"><h3>Total Exams</h3><p>{stats.exams}</p></div>
        <div className="stat-card"><h3>Completed Exams</h3><p>{stats.completed}</p></div>
        <div className="stat-card"><h3>Average Marks</h3><p>{stats.average}</p></div>
      </div>
      <div className="card-grid">
        <div className="panel-card">
          <h3>Latest Exams</h3>
          <ul>
            {exams.slice(0, 5).map((exam) => <li key={exam._id}>{exam.examName} — {exam.status}</li>)}
          </ul>
        </div>
        <div className="panel-card">
          <h3>Analytics Snapshot</h3>
          <p>Highest Score: {stats.highest}</p>
          <p>Lowest Score: {stats.lowest}</p>
          <p>Pass Rate: {stats.passRate}%</p>
        </div>
      </div>
    </div>
  );
}
