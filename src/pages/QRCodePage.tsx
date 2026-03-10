import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Button, Spin } from 'antd';
import { MdQrCode2, MdDownload, MdCheckCircle } from 'react-icons/md';
import { getQRCode } from '../api/endpoints';

const QRCodePage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();
  const { booking, seatLabel } = (location.state as any) || {};
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQR();
  }, [bookingId]);

  const loadQR = async () => {
    try {
      const res = await getQRCode(bookingId!);
      setQrUrl(res.data.qr_url || res.data);
    } catch {
      // Generate a demo QR using a public API
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=booking-${bookingId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-lg mx-auto text-center">
      <div className="mb-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'hsl(var(--seat-available) / 0.1)' }}
        >
          <MdCheckCircle size={36} style={{ color: 'hsl(var(--seat-available))' }} />
        </div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          Payment Successful!
        </h1>
        <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Show this QR code at the library entrance
        </p>
      </div>

      <div
        className="rounded-2xl border p-6 inline-block"
        style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
      >
        {loading ? (
          <Spin size="large" />
        ) : (
          <div>
            <img
              src={qrUrl}
              alt="Booking QR Code"
              className="mx-auto rounded-xl"
              style={{ width: 220, height: 220 }}
            />
            <p className="mt-4 font-bold text-lg">Seat {seatLabel || bookingId}</p>
            {booking && (
              <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {booking.start_time?.split('T')[1]?.slice(0, 5)} - {booking.end_time?.split('T')[1]?.slice(0, 5)}
              </p>
            )}
            <p className="text-xs mt-2 font-mono" style={{ color: 'hsl(var(--muted-foreground))' }}>
              ID: {bookingId}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Button
          size="large"
          icon={<MdDownload size={18} />}
          className="rounded-xl"
          onClick={() => {
            const link = document.createElement('a');
            link.href = qrUrl;
            link.download = `booking-${bookingId}.png`;
            link.click();
          }}
        >
          Download QR Code
        </Button>
      </div>
    </div>
  );
};

export default QRCodePage;
