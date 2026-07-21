'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '@/components/ui/Loader';

export default function QuizzesClient({ module, courseId }) {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState(module.quizzes);
  const [isAdding, setIsAdding] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    question: '', option1: '', option2: '', option3: '', option4: '', correct: 0, explanation: ''
  });

  const openAddForm = () => {
    setIsAdding(true);
    setEditingQuizId(null);
    setFormData({ question: '', option1: '', option2: '', option3: '', option4: '', correct: 0, explanation: '' });
  };

  const openEditForm = (quiz) => {
    setIsAdding(true);
    setEditingQuizId(quiz.id);
    setFormData({
      question: quiz.question || '',
      option1: quiz.options[0] || '',
      option2: quiz.options[1] || '',
      option3: quiz.options[2] || '',
      option4: quiz.options[3] || '',
      correct: quiz.correct ?? 0,
      explanation: quiz.explanation || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingQuizId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const options = [formData.option1, formData.option2, formData.option3, formData.option4].filter(o => o.trim() !== '');
      if (options.length < 2) {
        alert('অন্তত দুটি অপশন দিতে হবে।');
        setLoading(false);
        return;
      }

      const isEditing = !!editingQuizId;
      const url = isEditing
        ? `/api/admin/modules/${module.id}/quizzes/${editingQuizId}`
        : `/api/admin/modules/${module.id}/quizzes`;
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
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
        if (isEditing) {
          setQuizzes(quizzes.map(q => q.id === editingQuizId ? data.quiz : q));
        } else {
          setQuizzes([...quizzes, data.quiz]);
        }
        closeForm();
        router.refresh();
      } else {
        alert(data.error || 'Failed to save quiz');
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
        {!isAdding && (
          <button onClick={openAddForm} className="btn btn-primary">
            <Plus size={18} /> নতুন প্রশ্ন
          </button>
        )}
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: '2rem' }}
          >
            <div className="card" style={{ padding: '2rem', border: '1px solid var(--color-primary-light)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                {editingQuizId ? 'প্রশ্ন আপডেট করুন' : 'নতুন প্রশ্ন যোগ করুন'}
              </h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">প্রশ্ন</label>
                  <input type="text" className="form-input" required value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} placeholder="প্রশ্ন লিখুন" />
                </div>
                
                <div className="grid-2 gap-4">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">অপশন ১</label>
                    <input type="text" className="form-input" required value={formData.option1} onChange={e => setFormData({ ...formData, option1: e.target.value })} placeholder="১ম অপশন" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">অপশন ২</label>
                    <input type="text" className="form-input" required value={formData.option2} onChange={e => setFormData({ ...formData, option2: e.target.value })} placeholder="২য় অপশন" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">অপশন ৩ (ঐচ্ছিক)</label>
                    <input type="text" className="form-input" value={formData.option3} onChange={e => setFormData({ ...formData, option3: e.target.value })} placeholder="৩য় অপশন" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">অপশন ৪ (ঐচ্ছিক)</label>
                    <input type="text" className="form-input" value={formData.option4} onChange={e => setFormData({ ...formData, option4: e.target.value })} placeholder="৪র্থ অপশন" />
                  </div>
                </div>

                <div className="grid-2 gap-4">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">সঠিক উত্তর</label>
                    <select className="form-input form-select" value={formData.correct} onChange={e => setFormData({ ...formData, correct: e.target.value })}>
                      <option value="0">অপশন ১</option>
                      <option value="1">অপশন ২</option>
                      {formData.option3 && <option value="2">অপশন ৩</option>}
                      {formData.option4 && <option value="3">অপশন ৪</option>}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">ব্যাখ্যা (ঐচ্ছিক)</label>
                  <textarea className="form-input" rows="2" value={formData.explanation} onChange={e => setFormData({ ...formData, explanation: e.target.value })} placeholder="সঠিক উত্তরের ব্যাখ্যা..." />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <Loader variant="button" text="সংরক্ষণ হচ্ছে..." /> : 'সংরক্ষণ করুন'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={closeForm} disabled={loading}>বাতিল</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => openEditForm(q)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)', height: 'fit-content', minWidth: '44px', minHeight: '44px' }} title="এডিট করুন">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(q.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)', height: 'fit-content', minWidth: '44px', minHeight: '44px' }} title="মুছে ফেলুন">
                  <Trash2 size={16} />
                </button>
              </div>
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
