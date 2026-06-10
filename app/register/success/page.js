import Link from 'next/link';

export default function RegisterSuccessPage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg)',
      padding: '1rem'
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'var(--color-success-bg)',
          color: 'var(--color-success)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          margin: '0 auto 1.5rem'
        }}>
          ✓
        </div>
        
        <h1 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
          আলহামদুলিল্লাহ!
        </h1>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
          আপনার রেজিস্ট্রেশন সফল হয়েছে
        </h2>
        
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
          আপনার রেজিস্ট্রেশন অনুরোধটি এডমিন প্যানেলে পাঠানো হয়েছে। আপনার তথ্য যাচাই করার পর অ্যাকাউন্টটি সচল করা হবে। আপডেট পেতে আপনার ইমেইল ও হোয়াটসঅ্যাপ চেক করুন।
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/" className="btn btn-outline">
            হোম পেজে যান
          </Link>
          <Link href="/login" className="btn btn-primary">
            লগইন পেজে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
