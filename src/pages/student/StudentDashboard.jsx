import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function StudentDashboard() {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/exams'), api.get('/results/me')]).then(([examsRes, resultsRes]) => {
      setExams(examsRes.data);
      setResults(resultsRes.data);
    });
  }, []);

  return (
    <div>
      <div className="card-grid">
        <div className="panel-card">
          <h3>Upcoming Exams</h3>
          <ul>{exams.filter((exam) => exam.status === 'published').slice(0, 5).map((exam) => <li key={exam._id}>{exam.examName}</li>)}</ul>
        </div>
        <div className="panel-card">
          <h3>Your Results</h3>
          <ul>{results.slice(0, 5).map((result) => <li key={result._id}>{result.exam?.examName}: {result.marks}</li>)}</ul>
        </div>
      </div>
      <div className="panel-card">
        <h3>Available Exams</h3>
        {exams.filter((exam) => exam.status === 'published').map((exam) => (
          <div key={exam._id} className="exam-item">
            <strong>{exam.examName}</strong>
            <p>{exam.subject}</p>
            <Link to={`/student/take/${exam._id}`}>Start Exam</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
