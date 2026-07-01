import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function ResultsPageStudent() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    api.get('/results/me').then((res) => setResults(res.data));
  }, []);

  return (
    <div className="panel-card">
      <h3>My Results</h3>
      <table>
        <thead><tr><th>Exam</th><th>Marks</th><th>Status</th><th>Submitted</th></tr></thead>
        <tbody>
          {results.map((result) => (
            <tr key={result._id}><td>{result.exam?.examName}</td><td>{result.marks}</td><td>{result.status}</td><td>{new Date(result.submittedAt).toLocaleString()}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
