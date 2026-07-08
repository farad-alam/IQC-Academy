'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function QuizzesClient({ module, courseId }) {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState(module.quizzes);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    question: '',
    option1: '', option2: '', option3: '', option4: '',
    correct: 0,
    explanation: ''
  });

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const options = [formData.option1, formData.option2, formData.option3, formData.option4].filter(o => o.trim() !== '');
      if (options.length < 2) {
        alert('অন্তত দুটি অপশন দিতে হবে।');
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/admin/modules/${module.id}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: formData.question,
          options,
          correct: parseInt(formData.correct),
          explanation: formData.explanation
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setQuizzes([...quizzes, data.quiz]);
        setIsAdding(false);
        setFormData({ question: '', option1: '', option2: '', option3: '', option4: '', correct: 0, explanation: '' });
        router.refresh();
      } else {
        alert(data.error || 'Failed to add quiz');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quizId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await fetch(`/api/admin/modules/${module.id}/quizzes/${quizId}`, { method: 'DELETE' });
      if (res.ok) {
        setQuizzes(quizzes.filter(q => q.id !== quizId));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href={`/admin/courses/${courseId}/modules`} className="btn btn-ghost btn-sm" style={{ padding: 0, marginBottom: '0.5rem' }}>
            <ChevronLeft size={16} /> মডিউলে ফিরে যান
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>কুইজ পরিচালনা</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>{module.title} (কোর্স: {module.course.title})</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary">
          <Plus size={18} /> নতুন প্রশ্ন
        </button>
      </header>

      {isAdding && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>নতুন প্রশ্ন যোগ করুন</h2>
          <form onSubmit={handleAddQuiz}>
            <div className="form-group">
              <label>প্রশ্ন</label>
              <input type="text" className="input" required value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>অপশন ১</label>
                <input type="text" className="input" required value={formData.option1} onChange={e => setFormData({ ...formData, option1: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>অপশন ২</label>
                <input type="text" className="input" required value={formData.option2} onChange={e => setFormData({ ...formData, option2: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>অপশন ৩</label>
                <input type="text" className="input" value={formData.option3} onChange={e => setFormData({ ...formData, option3: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>অপশন ৪</label>
                <input type="text" className="input" value={formData.option4} onChange={e => setFormData({ ...formData, option4: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label>সঠিক উত্তর (০, ১, ২, বা ৩)</label>
              <select className="input" value={formData.correct} onChange={e => setFormData({ ...formData, correct: e.target.value })}>
                <option value="0">অপশন ১</option>
                <option value="1">অপশন ২</option>
                <option value="2">অপশন ৩</option>
                <option value="3">অপশন ৪</option>
              </select>
            </div>

            <div className="form-group">
              <label>ব্যাখ্যা (ঐচ্ছিক)</label>
              <textarea className="input" rows="2" value={formData.explanation} onChange={e => setFormData({ ...formData, explanation: e.target.value })} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'যোগ হচ্ছে...' : 'সংরক্ষণ করুন'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>বাতিল</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {quizzes.map((q, i) => (
          <div key={q.id} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>{i + 1}. {q.question}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  {q.options.map((opt, idx) => (
                    <div key={idx} style={{ 
                      padding: '0.75rem 1rem', 
                      borderRadius: '8px', 
                      border: idx === q.correct ? '1px solid var(--color-success)' : '1px solid var(--color-earth-1)',
                      backgroundColor: idx === q.correct ? 'var(--color-success-bg)' : 'transparent',
                      display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}>
                      {idx === q.correct && <CheckCircle2 size={18} color="var(--color-success)" />}
                      {opt}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface-alt)', padding: '0.75rem', borderRadius: '8px' }}>
                    <strong>ব্যাখ্যা:</strong> {q.explanation}
                  </div>
                )}
              </div>
              <button onClick={() => handleDelete(q.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }} title="মুছে ফেলুন">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {quizzes.length === 0 && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            এই মডিউলে কোনো কুইজ নেই।
          </div>
        )}
      </div>
    </div>
  );
}
