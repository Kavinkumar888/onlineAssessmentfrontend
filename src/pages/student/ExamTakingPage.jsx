import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

export default function ExamTakingPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [instructionsAccepted, setInstructionsAccepted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    Promise.all([api.get(`/exams/${examId}`), api.get(`/questions?examId=${examId}`)]).then(([examRes, questionRes]) => {
      setExam(examRes.data);
      setQuestions(questionRes.data);
      setTimeLeft((examRes.data?.duration || 60) * 60);
    });
  }, [examId]);

  useEffect(() => {
    if (!instructionsAccepted || !exam) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [instructionsAccepted, exam]);

  const submitExam = async () => {
    const payload = {
      exam: examId,
      answers: Object.values(answers),
      correctAnswers: 0,
      wrongAnswers: 0,
      skippedQuestions: questions.length - Object.keys(answers).length,
      marks: 0,
      percentage: 0,
      timeTaken: exam?.duration * 60 - timeLeft,
      status: 'passed'
    };
    await api.post('/exams/submit', payload);
    navigate('/student/results');
  };

  const question = questions[currentIndex];
  const progress = useMemo(() => questions.length ? Math.round((Object.keys(answers).length / questions.length) * 100) : 0, [answers, questions]);

  if (!exam) return <div className="panel-card">Loading exam...</div>;

  if (!instructionsAccepted) {
    return (
      <div className="panel-card">
        <h3>Instructions</h3>
        <p>{exam.instructions || 'Read carefully.'}</p>
        <label><input type="checkbox" checked={instructionsAccepted} onChange={() => setInstructionsAccepted(!instructionsAccepted)} /> I have read all instructions.</label>
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="panel-card exam-toolbar">
        <strong>{exam.examName}</strong>
        <span>Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
        <span>Progress: {progress}%</span>
        <button onClick={submitExam}>Submit</button>
      </div>
      <div className="panel-card">
        <h4>{currentIndex + 1}. {question?.question}</h4>
        {question?.options?.map((option, index) => (
          <label key={index} className="option-row"><input type="radio" name={question?._id} checked={answers[question?._id] === option} onChange={() => setAnswers({ ...answers, [question._id]: option })} /> {option}</label>
        ))}
        <div className="nav-row">
          <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}>Previous</button>
          <button onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}>Next</button>
        </div>
      </div>
    </div>
  );
}
