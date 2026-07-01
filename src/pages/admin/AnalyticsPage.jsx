import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AnalyticsPage() {
  const [stats, setStats] = useState({ students: 0, exams: 0, completed: 0, average: 0, highest: 0, lowest: 0, passRate: 0 });

  useEffect(() => {
    api.get('/results/analytics').then((res) => setStats(res.data));
  }, []);

  return (
    <div className="card-grid">
      <div className="stat-card"><h3>Highest Score</h3><p>{stats.highest}</p></div>
      <div className="stat-card"><h3>Lowest Score</h3><p>{stats.lowest}</p></div>
      <div className="stat-card"><h3>Average Score</h3><p>{stats.average}</p></div>
      <div className="stat-card"><h3>Pass Percentage</h3><p>{stats.passRate}%</p></div>
    </div>
  );
}
