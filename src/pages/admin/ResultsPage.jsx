import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function ResultsPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    api.get('/results').then((res) => setResults(res.data));
  }, []);

  return (
    <div className="panel-card">
      <h3>Exam Results</h3>
      <table>
        <thead><tr><th>Student</th><th>Exam</th><th>Marks</th><th>Status</th><th>Time</th></tr></thead>
        <tbody>
          {results.map((result) => (
            <tr key={result._id}>
              <td>{result.student?.name}</td>
              <td>{result.exam?.examName}</td>
              <td>{result.marks}</td>
              <td>{result.status}</td>
              <td>{result.timeTaken}s</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
