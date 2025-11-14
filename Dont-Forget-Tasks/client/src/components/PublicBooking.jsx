import React, { useMemo, useState, useEffect } from 'react';
import { FiCalendar, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import './Booking.css';

const defaultSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00',
  '11:30', '12:00', '14:00', '14:30', '15:00',
  '15:30', '16:00'
];

const PublicBooking = () => {
  const [searchParams] = useSearchParams();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedSlot, setSelectedSlot] = useState('');
  const [guest, setGuest] = useState({ name: '', email: '', phone: '', comment: '' });
  const [step, setStep] = useState('select'); // select -> payment -> confirm
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [requirePayment, setRequirePayment] = useState(false); // Owner link allows optional payment by default
  const [payNow, setPayNow] = useState(false); // Client chooses to pay now or not
  const [isSharedLink, setIsSharedLink] = useState(false);
  const [ownerName, setOwnerName] = useState('us');
  const [packages, setPackages] = useState([
    { id: 'consult-30', name: 'Consultation (30 min)', price: 29, duration: 30, description: 'Quick consult call' },
    { id: 'strategy-60', name: 'Strategy Session (60 min)', price: 59, duration: 60, description: 'In-depth strategy meeting' },
    { id: 'vip-90', name: 'VIP Intensive (90 min)', price: 99, duration: 90, description: 'Deep dive and action plan' }
  ]);
  const [selectedPackageId, setSelectedPackageId] = useState('');

  // In a real app, you might fetch owner-configured pricing here; for now, payment is optional without service selection

  // Handle URL parameters for shared links
  useEffect(() => {
    const owner = searchParams.get('owner');
    const payment = searchParams.get('payment');
    const task = searchParams.get('task');
    const pkgs = searchParams.get('pkgs');
    
    if (owner === 'true') {
      setIsSharedLink(true);
      setOwnerName('the account owner');
    }
    
    if (payment === 'optional') {
      setRequirePayment(false);
    } else if (payment === 'required') {
      setRequirePayment(true);
    }
    
    // Decode packages from link if present (overrides defaults)
    if (pkgs) {
      try {
        const json = decodeURIComponent(escape(atob(pkgs)));
        const list = JSON.parse(json);
        const normalized = list.map(p => ({ id: p.id, name: p.n, price: Number(p.pr)||0, duration: Number(p.du)||0, description: p.d||'' }));
        if (Array.isArray(normalized) && normalized.length > 0) setPackages(normalized);
      } catch (e) {
        console.error('Invalid packages payload');
      }
    }
  }, [searchParams]);

  const meetingLink = useMemo(() => {
    if (!selectedSlot) return '';
    const token = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `https://dontforget.app/meet/${date}-${selectedSlot}-${token}`;
  }, [date, selectedSlot]);

  const isGuestValid = guest.name.trim() && guest.email.trim() && guest.phone.trim();
  const selectedPackage = packages.find(p => p.id === selectedPackageId);
  const needsPayment = (requirePayment || payNow) && !!selectedPackage;

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!isGuestValid || !selectedSlot) return;
    if (step === 'select') {
      if (needsPayment) {
        setStep('payment');
      } else {
        setStep('confirm');
      }
      return;
    }
    if (step === 'payment') {
      // Simulate payment success
      setTimeout(() => setStep('confirm'), 400);
    }
  };

  const resetBooking = () => {
    setSelectedSlot('');
    setGuest({ name: '', email: '', phone: '', comment: '' });
    setPaymentMethod('stripe');
    setStep('select');
    setPayNow(false);
  };

  if (!isSharedLink) {
    return (
      <div className="public-booking-page">
        <div className="public-header">
          <div className="public-header-content">
            <Link to="/" className="back-link"><FiArrowLeft /> Back to Home</Link>
            <div className="public-logo"><FiCalendar /><span>Don't Forget</span></div>
          </div>
        </div>
        <div className="booking-page">
          <div className="content-header">
            <div className="section-title">
              <span className="title-icon"><FiCalendar /></span>
              <h2>Link Required</h2>
            </div>
            <p className="section-desc">This booking page is only accessible via a shared link from the account owner.</p>
          </div>
          <div className="actions-row">
            <Link to="/" className="primary-btn">Go to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-booking-page">
      {/* Public Header */}
      <div className="public-header">
        <div className="public-header-content">
          <Link to="/" className="back-link">
            <FiArrowLeft />
            Back to Home
          </Link>
          <div className="public-logo">
            <FiCalendar />
            <span>Don't Forget</span>
          </div>
        </div>
      </div>

      <div className="booking-page">
        <div className="content-header">
          <div className="section-title">
            <span className="title-icon"><FiCalendar /></span>
            <h2>Book Your Appointment</h2>
          </div>
          <p className="section-desc">
            {isSharedLink 
              ? `Schedule a meeting with ${ownerName}. No account required - just pick a time, enter your details, and we'll confirm your appointment instantly.`
              : 'Schedule a meeting with us. No account required - just pick a time, enter your details, and we\'ll confirm your appointment instantly.'
            }
          </p>
        </div>

        {step !== 'confirm' && (
          <div className="booking-container">
            <div className="booking-main">
              <div className="booking-grid">
                <div className="calendar-card">
                  <div className="card-title">Select Date</div>
                  <input
                    type="date"
                    className="date-input"
                    value={date}
                    onChange={(e) => { setDate(e.target.value); setSelectedSlot(''); }}
                  />
                  <div className="card-title" style={{ marginTop: 12 }}>Available Slots</div>
                  <div className="slots-grid">
                    {defaultSlots.map(t => (
                      <button
                        key={t}
                        className={`slot-btn ${selectedSlot === t ? 'selected' : ''}`}
                        onClick={() => setSelectedSlot(t)}
                      >{t}</button>
                    ))}
                  </div>
                </div>

                <form className="details-card" onSubmit={handleConfirm}>
                  <div className="card-title">Your Details</div>
                  {packages.length > 0 && (
                    <div className="form-row">
                      <div className="form-field full">
                        <label>Select a Package</label>
                        <select value={selectedPackageId} onChange={(e)=>setSelectedPackageId(e.target.value)} className="filter-select">
                          <option value="">Choose...</option>
                          {packages.map(p => (
                            <option key={p.id} value={p.id}>{p.name} — ${p.price.toFixed(2)} • {p.duration}m</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  <div className="form-row">
                    <div className="form-field">
                      <label>Full Name *</label>
                      <input 
                        value={guest.name} 
                        onChange={(e)=>setGuest({ ...guest, name: e.target.value })} 
                        placeholder="Your full name" 
                        required 
                      />
                    </div>
                    <div className="form-field">
                      <label>Email *</label>
                      <input 
                        type="email"
                        value={guest.email} 
                        onChange={(e)=>setGuest({ ...guest, email: e.target.value })} 
                        placeholder="your.email@example.com" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label>Phone *</label>
                      <input 
                        value={guest.phone} 
                        onChange={(e)=>setGuest({ ...guest, phone: e.target.value })} 
                        placeholder="Your phone number" 
                        required 
                      />
                    </div>
                    <div className="form-field">
                      <label>Comments</label>
                      <input 
                        value={guest.comment} 
                        onChange={(e)=>setGuest({ ...guest, comment: e.target.value })} 
                        placeholder="Any special requests?" 
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={payNow}
                        onChange={(e) => setPayNow(e.target.checked)}
                      />
                      Pay now (optional)
                    </label>
                  </div>

                  {step === 'select' && (
                    <div className="actions-row">
                      <button type="submit" className="primary-btn" disabled={!isGuestValid || !selectedSlot}>
                        {needsPayment ? 'Continue to Payment' : 'Confirm Booking'}
                      </button>
                    </div>
                  )}

                  {step === 'payment' && (
                    <div className="payment-panel">
                      <div className="card-title">Payment</div>
                      <div className="payment-info">
                        <p className="payment-note">{selectedPackage ? `Pay $${selectedPackage.price.toFixed(2)} for ${selectedPackage.name}.` : 'You chose to pay now. Complete payment to confirm your booking.'}</p>
                      </div>
                      <div className="pay-methods">
                        <label className="radio"><input type="radio" name="pay" checked={paymentMethod==='stripe'} onChange={()=>setPaymentMethod('stripe')} /> Stripe</label>
                        <label className="radio"><input type="radio" name="pay" checked={paymentMethod==='paypal'} onChange={()=>setPaymentMethod('paypal')} /> PayPal</label>
                      </div>
                      <div className="actions-row">
                        <button type="button" className="secondary-btn" onClick={() => setStep('select')}>Back</button>
                        <button type="submit" className="primary-btn">Pay and Confirm</button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="confirmation-card">
            <div className="card-title">Booking Confirmed! 🎉</div>
            <ul className="confirm-list">
              <li><strong>Date/Time:</strong> {date} at {selectedSlot}</li>
              <li><strong>Meeting link:</strong> <span className="mono">{meetingLink}</span> <button className="secondary-btn" onClick={()=>navigator.clipboard.writeText(meetingLink)} style={{ marginLeft: 8 }}>Copy</button></li>
              <li><strong>Payment:</strong> {payNow || requirePayment ? 'Collected' : 'Not collected'}</li>
              {guest.comment && (<li><strong>Notes:</strong> {guest.comment}</li>)}
            </ul>
            <div className="confirmation-note">
              <p>We've sent a confirmation email to <strong>{guest.email}</strong> with all the details.</p>
            </div>
            <div className="actions-row">
              <button className="secondary-btn" onClick={resetBooking}>Book Another</button>
              <Link to="/" className="primary-btn">Back to Home</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicBooking;
