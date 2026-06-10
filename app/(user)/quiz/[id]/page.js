'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, HelpCircle, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { mockQuizQuestions, mockContents } from '@/lib/mockData';
import styles from './quiz.module.css';

export default function QuizPage({ params }) {
  const { id } = use(params);
  const content = mockContents.find(c => c.id === parseInt(id)) || mockContents[0];
  
  const [quizState, setQuizState] = useState('start'); // start, active, result
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  const handleStart = () => {
    setQuizState('active');
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < mockQuizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    let finalScore = 0;
    mockQuizQuestions.forEach(q => {
      if (answers[q.id] === q.correct) finalScore++;
    });
    setScore(finalScore);
    setQuizState('result');
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setScore(0);
    setQuizState('start');
  };

  if (quizState === 'start') {
    return (
      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
        <Link href={`/content/${id}`} className="btn btn-ghost" style={{ padding: 0, marginBottom: '2rem' }}>
          <ChevronLeft size={20} /> কন্টেন্টে ফিরে যান
        </Link>
        
        <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'var(--color-primary-50)', borderRadius: '50%', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
            <HelpCircle size={48} />
          </div>
          
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>কুইজ: {content.title}</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            আপনার জ্ঞান যাচাই করুন। কুইজে {mockQuizQuestions.length}টি প্রশ্ন রয়েছে।
          </p>

          <div style={{ backgroundColor: 'var(--color-surface-alt)', padding: '1rem', borderRadius: '12px', textAlign: 'left', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <AlertCircle size={16} /> নিয়মাবলী:
            </h3>
            <ul style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', paddingLeft: '1.5rem', listStyleType: 'disc', lineHeight: 1.6 }}>
              <li>সর্বমোট {mockQuizQuestions.length}টি বহুনির্বাচনী প্রশ্ন থাকবে।</li>
              <li>প্রতিটি প্রশ্নের জন্য ১ নম্বর।</li>
              <li>আপনি সর্বোচ্চ ৩ বার কুইজে অংশগ্রহণ করতে পারবেন।</li>
            </ul>
          </div>

          <button onClick={handleStart} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            কুইজ শুরু করুন
          </button>
        </div>
      </div>
    );
  }

  if (quizState === 'active') {
    const q = mockQuizQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / mockQuizQuestions.length) * 100;

    return (
      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
        <div className="card" style={{ padding: '2rem' }}>
          {/* Header & Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              প্রশ্ন {currentQuestion + 1} / {mockQuizQuestions.length}
            </span>
          </div>
          <div className="progress-bar-track" style={{ marginBottom: '2rem' }}>
            <div className="progress-bar-fill" style={{ width: `${progress}%`, transition: 'width 0.3s ease' }} />
          </div>

          {/* Question */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem', lineHeight: 1.5 }}>
            {q.question}
          </h2>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                className={`${styles.optionBtn} ${answers[q.id] === idx ? styles.selected : ''}`}
                onClick={() => handleSelectOption(q.id, idx)}
              >
                <div className={styles.radioCircle}>
                  {answers[q.id] === idx && <div className={styles.radioInner} />}
                </div>
                <span>{opt}</span>
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button 
            onClick={handleNextQuestion} 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={answers[q.id] === undefined}
          >
            {currentQuestion === mockQuizQuestions.length - 1 ? 'ফলাফল দেখুন' : 'পরবর্তী প্রশ্ন'}
          </button>
        </div>
      </div>
    );
  }

  if (quizState === 'result') {
    const percentage = (score / mockQuizQuestions.length) * 100;
    const passed = percentage >= 60;

    return (
      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
        <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          
          <div style={{ 
            width: '80px', height: '80px', margin: '0 auto 1.5rem', 
            backgroundColor: passed ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
            color: passed ? 'var(--color-success)' : 'var(--color-error)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {passed ? <CheckCircle size={40} /> : <XCircle size={40} />}
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {passed ? 'মাশাআল্লাহ! আপনি সফলভাবে পাস করেছেন।' : 'ইনশাআল্লাহ! পরবর্তীতে আরো ভালো হবে।'}
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            আপনার প্রাপ্ত নম্বর: <strong style={{ color: 'var(--color-text)', fontSize: '1.5rem' }}>{score}</strong> / {mockQuizQuestions.length}
          </p>

          {/* Review Section */}
          <div style={{ textAlign: 'left', marginBottom: '2rem', borderTop: '1px solid var(--color-earth-1)', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>উত্তর পর্যালোচনা:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {mockQuizQuestions.map((q, i) => {
                const isCorrect = answers[q.id] === q.correct;
                return (
                  <div key={i} style={{ padding: '1rem', backgroundColor: 'var(--color-surface-alt)', borderRadius: '8px' }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>{i+1}. {q.question}</p>
                    <p style={{ fontSize: '0.85rem', color: isCorrect ? 'var(--color-success)' : 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {isCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />} 
                      আপনার উত্তর: {q.options[answers[q.id]]}
                    </p>
                    {!isCorrect && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-success)', marginTop: '4px' }}>
                        সঠিক উত্তর: {q.options[q.correct]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            {!passed && (
              <button onClick={handleRetry} className="btn btn-primary">
                আবার চেষ্টা করুন
              </button>
            )}
            <Link href="/content" className={passed ? "btn btn-primary" : "btn btn-outline"}>
              কন্টেন্ট লিস্টে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
