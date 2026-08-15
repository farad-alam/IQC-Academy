'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ClipboardList, CheckCircle, XCircle, Trophy, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function SubjectFinalExamPage() {
  const { courseId, subjectId } = useParams();
  const [status, setStatus] = useState('loading'); // loading | ready | taking | result | done
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch(`/api/subjects/${subjectId}/final-exam`)
      .then(async r => {
        const d = await r.json();
        if (r.status === 409) { setResult(d.session); setStatus('done'); }
        else if (r.ok) { setExam(d); setStatus('ready'); }
        else setStatus('error_' + (d.error || 'unknown'));
      });
  }, [subjectId]);

  const handleAnswer = (quizId, idx) => setAnswers(p => ({ ...p, [quizId]: idx }));

  const handleSubmit = async () => {
    if (Object.keys(answers).length < exam.quizzes.length) {
      if (!confirm(`আপনি ${exam.quizzes.length - Object.keys(answers).length} টি প্রশ্নের উত্তর দেননি। তবুও জমা দিতে চান?`)) return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/subjects/${subjectId}/final-exam/attempt`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers })
      });
      const data = await res.json();
      if (res.ok) { setResult(data); setStatus('result'); }
      else alert(data.error || 'ত্রুটি হয়েছে');
    } finally { setSubmitting(false); }
  };

  if (status === 'loading') return <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></main>;

  if (status.startsWith('error_')) return (
    <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem' }}>
      <div style={{ fontSize: '3rem' }}>🔒</div>
      <h2 style={{ fontWeight: 700, textAlign: 'center' }}>পরীক্ষা এখনো পাওয়া যাচ্ছে না</h2>
      <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>সব মডিউল সম্পন্ন করুন তারপর ফাইনাল পরীক্ষা দিন।</p>
      <Link href={`/learn/${courseId}`} className="btn btn-primary">কোর্সে ফিরে যান</Link>
    </main>
  );

  // Already taken — show previous result
  if (status === 'done') return (
    <main style={{ padding: '2rem 1.5rem', maxWidth: '700px', margin: '0 auto' }}>
      <Link href={`/learn/${courseId}`} className="btn btn-ghost btn-sm" style={{ padding: 0, marginBottom: '1.5rem' }}>
        <ChevronLeft size={16} /> কোর্সে ফিরে যান
      </Link>
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{result?.passed ? '🏆' : '😔'}</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>আপনি ইতিমধ্যে এই পরীক্ষা দিয়েছেন</h2>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: result?.passed ? 'var(--color-success)' : 'var(--color-error)', margin: '1rem 0', fontFamily: 'var(--font-latin)' }}>{result?.score}/{result?.total}</div>
        <span style={{ padding: '0.5rem 1.5rem', borderRadius: '20px', fontWeight: 700, background: result?.passed ? '#dcfce7' : '#fee2e2', color: result?.passed ? '#16a34a' : '#dc2626' }}>{result?.passed ? '✅ পাস' : '❌ ফেইল'}</span>
        <div style={{ marginTop: '2rem' }}>
          <Link href={`/learn/${courseId}`} className="btn btn-primary">কোর্সে ফিরে যান</Link>
        </div>
      </div>
    </main>
  );

  // Result after taking
  if (status === 'result') return (
    <main style={{ padding: '2rem 1.5rem', maxWidth: '750px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem', background: result.passed ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : 'linear-gradient(135deg, #fff1f2, #fee2e2)' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{result.passed ? '🎉' : '😔'}</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{result.passed ? 'অভিনন্দন! পাস হয়েছেন!' : 'দুঃখিত! পাস হয়নি'}</h2>
        <div style={{ fontSize: '3rem', fontWeight: 900, color: result.passed ? '#16a34a' : '#dc2626', margin: '1rem 0', fontFamily: 'var(--font-latin)' }}>{result.score}/{result.total}</div>
        <p style={{ color: 'var(--color-text-muted)' }}>পাস মার্ক ছিল {result.passMarkRequired} নম্বর</p>
        <div style={{ marginTop: '1.5rem' }}>
          <Link href={`/learn/${courseId}`} className="btn btn-primary">কোর্সে ফিরে যান</Link>
        </div>
      </div>

      {/* Show answers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {result.results?.map((q, i) => (
          <div key={q.id} className="card" style={{ padding: '1.25rem', border: `1px solid ${q.isCorrect ? '#bbf7d0' : '#fecaca'}`, background: q.isCorrect ? '#f0fdf4' : '#fff1f2' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontWeight: 800, color: q.isCorrect ? '#16a34a' : '#dc2626', minWidth: '24px', fontFamily: 'var(--font-latin)' }}>{i + 1}.</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>{q.question}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {q.options.map((opt, idx) => {
                    const isCorrect = idx === q.correct;
                    const isUser = idx === q.userAnswer;
                    return (
                      <div key={idx} style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: isCorrect || isUser ? 600 : 400, background: isCorrect ? '#dcfce7' : isUser && !isCorrect ? '#fee2e2' : 'transparent', color: isCorrect ? '#16a34a' : isUser && !isCorrect ? '#dc2626' : 'var(--color-text)' }}>
                        {isCorrect ? '✅' : isUser && !isCorrect ? '❌' : '○'} {opt}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.75rem', fontStyle: 'italic', borderTop: '1px dashed var(--color-earth-1)', paddingTop: '0.5rem' }}>💡 {q.explanation}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );

  // Exam taking UI
  if (status === 'ready' && (!exam.quizzes || exam.quizzes.length === 0)) {
    return (
      <main style={{ padding: '2rem 1.5rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <h2 style={{ color: 'var(--color-error)', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 700 }}>পরীক্ষা পাওয়া যায়নি</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>এই সাবজেক্টের ফাইনাল পরীক্ষার জন্য এখনও কোনো প্রশ্ন যোগ করা হয়নি।</p>
          <Link href={`/learn/${courseId}`} className="btn btn-primary">কোর্সে ফিরে যান</Link>
        </div>
      </main>
    );
  }

  const q = exam.quizzes ? exam.quizzes[current] : null;
  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / exam.quizzes.length) * 100);

  if (status === 'ready') return (
    <main style={{ padding: '2rem 1.5rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem 1.25rem', background: 'var(--color-primary-50)', borderRadius: '20px', color: 'var(--color-primary)', fontWeight: 700 }}>
          <ClipboardList size={18} /> ফাইনাল পরীক্ষা
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{exam.subject.title}</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>মোট প্রশ্ন: {exam.quizzes.length} | পাস মার্ক: {exam.subject.finalExamPassMark}</p>
        <p style={{ color: '#dc2626', fontWeight: 600, marginTop: '0.5rem', fontSize: '0.9rem' }}>⚠️ এই পরীক্ষা একবারই দেওয়া যাবে</p>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          <span>প্রশ্ন {current + 1} / {exam.quizzes.length}</span>
          <span>{answered} টি উত্তর দেওয়া হয়েছে</span>
        </div>
        <div style={{ height: '6px', background: 'var(--color-surface-alt)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Question */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
        <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-latin)', marginRight: '8px' }}>{current + 1}.</span>
          {q.question}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {q.options.map((opt, idx) => (
            <button key={idx} onClick={() => handleAnswer(q.id, idx)}
              style={{ padding: '1rem 1.25rem', borderRadius: '10px', border: `2px solid ${answers[q.id] === idx ? 'var(--color-primary)' : 'var(--color-earth-1)'}`, background: answers[q.id] === idx ? 'var(--color-primary-50)' : 'var(--color-surface)', textAlign: 'left', cursor: 'pointer', fontWeight: answers[q.id] === idx ? 700 : 400, color: 'var(--color-text)', transition: 'all 0.15s', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700, marginRight: '0.5rem', fontFamily: 'var(--font-latin)' }}>
                {String.fromCharCode(65 + idx)}.
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-outline" onClick={() => setCurrent(p => Math.max(0, p - 1))} disabled={current === 0}>← পূর্ববর্তী</button>
        {current < exam.quizzes.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setCurrent(p => Math.min(exam.quizzes.length - 1, p + 1))}>পরবর্তী →</button>
        ) : (
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting} style={{ background: 'linear-gradient(135deg, var(--color-accent-dark), var(--color-accent))' }}>
            {submitting ? <><Loader2 size={16} className="spin" /> জমা হচ্ছে...</> : '✅ পরীক্ষা জমা দিন'}
          </button>
        )}
      </div>

      {/* Quick nav dots */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1.5rem', justifyContent: 'center' }}>
        {exam.quizzes.map((qz, i) => (
          <button key={qz.id} onClick={() => setCurrent(i)}
            style={{ width: '32px', height: '32px', borderRadius: '50%', border: `2px solid ${i === current ? 'var(--color-primary)' : 'var(--color-earth-1)'}`, background: answers[qz.id] !== undefined ? 'var(--color-primary)' : i === current ? 'var(--color-primary-50)' : 'transparent', color: answers[qz.id] !== undefined ? 'white' : 'var(--color-text)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-latin)' }}>
            {i + 1}
          </button>
        ))}
      </div>
    </main>
  );
}
