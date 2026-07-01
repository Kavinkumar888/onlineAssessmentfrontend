import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function AvailableExamsPage() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    api.get('/exams').then((res) => setExams(res.data));
  }, []);

  return (
    <div className="panel-card">
      <h3>Available Exams</h3>
      {exams.filter((exam) => exam.status === 'published').map((exam) => (
        <div key={exam._id} className="exam-item">
          <strong>{exam.examName}</strong>
          <p>{exam.subject} • {exam.duration} mins</p>
          <Link to={`/student/take/${exam._id}`}>Start</Link>
        </div>
      ))}
    </div>
  );
}
