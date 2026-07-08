'use client';
import Link from 'next/link';
import { ChevronLeft, Printer, Download } from 'lucide-react';
import { useRef } from 'react';

export default function CertificateClient({ user, course, enrollment, certId }) {
  const printRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const completedDate = enrollment.completedAt 
    ? new Date(enrollment.completedAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Link href={`/courses/${course.id}`} className="btn btn-ghost" style={{ padding: 0 }}>
          <ChevronLeft size={20} /> কোর্সে ফিরে যান
        </Link>
        <button onClick={handlePrint} className="btn btn-primary">
          <Printer size={18} /> প্রিন্ট/ডাউনলোড করুন
        </button>
      </div>

      <div 
        ref={printRef}
        className="certificate-wrapper"
        style={{
          backgroundColor: '#fff',
          padding: '3rem',
          border: '10px solid var(--color-primary-100)',
          outline: '2px solid var(--color-primary)',
          outlineOffset: '-12px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          opacity: 0.03,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83-54.627 54.627-.83-.83L54.627 0zM0 54.627l.83-.83 54.627-54.627.83.83L1.66 55.457 0 54.627z\' fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '2px', fontFamily: 'var(--font-latin)' }}>
              IQC ACADEMY
            </h1>
            <p style={{ color: 'var(--color-accent-dark)', fontWeight: 600, letterSpacing: '1px' }}>
              Institute of Quranic Courses
            </p>
          </div>

          <h2 style={{ fontSize: '3rem', fontWeight: 700, margin: '2rem 0', color: 'var(--color-text)' }}>
            সনদপত্র
          </h2>

          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            এই সনদপত্রটি প্রদান করা হলো
          </p>

          <h3 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary-100)', display: 'inline-block', paddingBottom: '0.5rem', marginBottom: '1.5rem', minWidth: '400px' }}>
            {user.name}
          </h3>

          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            যিনি সফলতার সাথে নিম্নের কোর্সটি সম্পন্ন করেছেন:
          </p>

          <h4 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent-dark)', marginBottom: '3rem' }}>
            {course.title}
          </h4>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4rem', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid var(--color-text)', paddingBottom: '0.5rem', marginBottom: '0.5rem', minWidth: '200px' }}>
                {completedDate}
              </div>
              <div style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>ইস্যু তারিখ</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', color: 'var(--color-primary-200)' }}>
                <Award size={64} />
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid var(--color-text)', paddingBottom: '0.5rem', marginBottom: '0.5rem', minWidth: '200px' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" alt="Signature" style={{ height: '40px', margin: '0 auto', opacity: 0.7 }} />
              </div>
              <div style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>কর্তৃপক্ষের স্বাক্ষর</div>
            </div>
          </div>
          
          <div style={{ marginTop: '3rem', fontSize: '0.875rem', color: 'var(--color-text-light)', fontFamily: 'var(--font-latin)' }}>
            Certificate ID: {certId} | Verify at iqcacademy.com/verify
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .certificate-wrapper, .certificate-wrapper * {
            visibility: visible;
          }
          .certificate-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
