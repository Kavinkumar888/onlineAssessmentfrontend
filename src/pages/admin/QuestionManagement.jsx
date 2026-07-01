import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function QuestionManagement() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ examId: '', question: '', type: 'mcq', options: '', correctAnswer: '', marks: 1, negativeMarks: 0, difficulty: 'easy', explanation: '' });

  useEffect(() => {
    api.get('/exams').then((res) => {
      if (res.data[0]) setForm((prev) => ({ ...prev, examId: res.data[0]._id }));
    });
  }, []);

  const loadQuestions = async () => {
    if (!form.examId) return;
    const res = await api.get(`/questions?examId=${form.examId}`);
    setQuestions(res.data);
  };

  useEffect(() => { loadQuestions(); }, [form.examId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/questions', { ...form, options: form.options.split('|') });
    setForm((prev) => ({ ...prev, question: '', options: '', correctAnswer: '', explanation: '' }));
    loadQuestions();
  };

  return (
    <div className="stack">
      <form className="panel-card" onSubmit={handleSubmit}>
        <h3>Create Question</h3>
        <input placeholder="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="mcq">MCQ</option><option value="multiple-answer">Multiple Answer</option><option value="true-false">True/False</option><option value="short-answer">Short Answer</option></select>
        <input placeholder="Options separated by |" value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} />
        <input placeholder="Correct Answer" value={form.correctAnswer} onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })} />
        <input type="number" placeholder="Marks" value={form.marks} onChange={(e) => setForm({ ...form, marks: Number(e.target.value) })} />
        <input type="number" placeholder="Negative Marks" value={form.negativeMarks} onChange={(e) => setForm({ ...form, negativeMarks: Number(e.target.value) })} />
        <input placeholder="Explanation" value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} />
        <button type="submit">Save Question</button>
      </form>
      <div className="panel-card">
        <h3>Questions</h3>
        <ul>{questions.map((q) => <li key={q._id}>{q.question}</li>)}</ul>
      </div>
    </div>
  );
}
