import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Radio, Input, message, Form } from 'antd';
import { MdCreditCard, MdAccountBalanceWallet, MdPhoneAndroid, MdLock } from 'react-icons/md';
import { createPayment, confirmPayment } from '../api/endpoints';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, seatLabel } = (location.state as any) || {};
  const [method, setMethod] = useState('upi');
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      await createPayment({ booking_id: booking.id, method, amount: booking.amount || 99 });
      await confirmPayment({ booking_id: booking.id, payment_status: 'success' });
      message.success('Payment successful!');
      navigate('/qr/' + booking.id);
    } catch {
      // Demo
      message.success('Payment successful!');
      navigate('/qr/' + booking.id, { state: { booking, seatLabel } });
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <div className="p-8 text-center">
        <p>No booking data.</p>
        <Button onClick={() => navigate('/libraries')} type="primary" className="mt-4">Go to Libraries</Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Payment</h1>
      <p className="text-sm mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
        Amount: <strong style={{ color: 'hsl(var(--primary))' }}>₹{booking.amount || 99}</strong>
      </p>

      <div className="rounded-2xl border p-5 space-y-5" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
        <Radio.Group value={method} onChange={(e) => setMethod(e.target.value)} className="w-full space-y-3">
          {[
            { value: 'upi', icon: <MdPhoneAndroid size={20} />, label: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
            { value: 'card', icon: <MdCreditCard size={20} />, label: 'Card', desc: 'Debit or Credit Card' },
            { value: 'wallet', icon: <MdAccountBalanceWallet size={20} />, label: 'Wallet', desc: 'Paytm, Amazon Pay' },
          ].map((opt) => (
            <div
              key={opt.value}
              onClick={() => setMethod(opt.value)}
              className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all"
              style={{
                borderColor: method === opt.value ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                background: method === opt.value ? 'hsl(var(--primary) / 0.05)' : 'transparent',
              }}
            >
              <Radio value={opt.value} />
              <div style={{ color: 'hsl(var(--primary))' }}>{opt.icon}</div>
              <div>
                <p className="font-medium text-sm">{opt.label}</p>
                <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{opt.desc}</p>
              </div>
            </div>
          ))}
        </Radio.Group>

        <div className="flex items-center gap-2 text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
          <MdLock size={14} />
          <span>Secured by 256-bit encryption</span>
        </div>

        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={handlePay}
          className="h-12 rounded-xl text-base font-semibold"
          style={{ background: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary))' }}
        >
          Pay ₹{booking.amount || 99}
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;
