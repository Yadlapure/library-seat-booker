import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { MdEventSeat, MdAccessTime, MdPayment, MdCheckCircle } from 'react-icons/md';

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, seatLabel } = (location.state as any) || {};
  const [countdown, setCountdown] = useState(600); // 10 min

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  if (!booking) {
    return (
      <div className="p-8 text-center">
        <p>No booking data found.</p>
        <Button onClick={() => navigate('/libraries')} type="primary" className="mt-4">
          Go to Libraries
        </Button>
      </div>
    );
  }

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'hsl(var(--primary) / 0.1)' }}
        >
          <MdCheckCircle size={36} style={{ color: 'hsl(var(--primary))' }} />
        </div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          Booking Confirmed!
        </h1>
        <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Complete payment to secure your seat
        </p>
      </div>

      <div
        className="rounded-2xl border p-5 space-y-4"
        style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MdEventSeat size={18} style={{ color: 'hsl(var(--primary))' }} />
            <span className="text-sm font-medium">Seat</span>
          </div>
          <span className="font-bold">{seatLabel || booking.seat_id}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MdAccessTime size={18} style={{ color: 'hsl(var(--primary))' }} />
            <span className="text-sm font-medium">Time</span>
          </div>
          <span className="text-sm">
            {booking.start_time?.split('T')[1]?.slice(0, 5)} - {booking.end_time?.split('T')[1]?.slice(0, 5)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Amount</span>
          <span className="text-lg font-bold" style={{ color: 'hsl(var(--primary))' }}>
            ₹{booking.amount || 99}
          </span>
        </div>

        {/* Countdown */}
        <div
          className="text-center py-3 rounded-xl"
          style={{
            background: countdown < 120 ? 'hsl(var(--destructive) / 0.1)' : 'hsl(var(--accent) / 0.1)',
          }}
        >
          <p className="text-xs mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Payment deadline
          </p>
          <p
            className="text-2xl font-bold font-mono"
            style={{ color: countdown < 120 ? 'hsl(var(--destructive))' : 'hsl(var(--accent))' }}
          >
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button
          type="primary"
          size="large"
          block
          onClick={() => navigate('/payment', { state: { booking, seatLabel } })}
          className="h-12 rounded-xl text-base font-semibold"
          style={{ background: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary))' }}
          icon={<MdPayment size={20} />}
        >
          Proceed to Payment
        </Button>
        <Button
          size="large"
          block
          onClick={() => navigate('/libraries')}
          className="h-12 rounded-xl"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
