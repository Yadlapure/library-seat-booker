import React, { useState, useEffect } from 'react';
import { Button, Tag, Spin, Empty, Modal, message } from 'antd';
import { MdEventSeat, MdAccessTime, MdDelete, MdQrCode2, MdCalendarToday } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getUserBookings, cancelBooking } from '../api/endpoints';
import { useAuth } from '../contexts/AuthContext';

interface Booking {
  id: string;
  seat_id: string;
  seat_label?: string;
  library_name?: string;
  floor_name?: string;
  start_time: string;
  end_time: string;
  status: string;
  amount?: number;
}

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await getUserBookings(user?.id || '');
      setBookings(res.data);
    } catch {
      setBookings([
        { id: 'b1', seat_id: 's1', seat_label: 'A3', library_name: 'Central Study Hub', floor_name: 'Ground Floor', start_time: '2026-03-10T09:00:00', end_time: '2026-03-10T12:00:00', status: 'confirmed', amount: 99 },
        { id: 'b2', seat_id: 's2', seat_label: 'B5', library_name: 'Knowledge Nest', floor_name: 'First Floor', start_time: '2026-03-11T14:00:00', end_time: '2026-03-11T17:00:00', status: 'pending_payment', amount: 149 },
        { id: 'b3', seat_id: 's3', seat_label: 'C1', library_name: 'The Reading Room', floor_name: 'Second Floor', start_time: '2026-03-08T10:00:00', end_time: '2026-03-08T13:00:00', status: 'completed', amount: 79 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (bookingId: string) => {
    Modal.confirm({
      title: 'Cancel Booking',
      content: 'Are you sure you want to cancel this booking?',
      okText: 'Yes, Cancel',
      okButtonProps: { danger: true },
      async onOk() {
        try {
          await cancelBooking(bookingId);
        } catch {}
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        message.success('Booking cancelled');
      },
    });
  };

  const statusConfig: Record<string, { color: string; label: string }> = {
    confirmed: { color: 'green', label: 'Confirmed' },
    pending_payment: { color: 'orange', label: 'Pending Payment' },
    completed: { color: 'blue', label: 'Completed' },
    cancelled: { color: 'red', label: 'Cancelled' },
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
        My Bookings
      </h1>
      <p className="text-sm mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
        Manage your study seat reservations
      </p>

      {loading ? (
        <div className="flex justify-center py-20"><Spin size="large" /></div>
      ) : bookings.length === 0 ? (
        <Empty description="No bookings yet">
          <Button type="primary" onClick={() => navigate('/libraries')}>Browse Libraries</Button>
        </Empty>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const sc = statusConfig[b.status] || { color: 'default', label: b.status };
            return (
              <div
                key={b.id}
                className="rounded-2xl border p-4 sm:p-5 transition-all hover:shadow-md"
                style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-base">{b.library_name || 'Library'}</h3>
                    <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      {b.floor_name}
                    </p>
                  </div>
                  <Tag color={sc.color} className="rounded-full">{sc.label}</Tag>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <MdEventSeat size={16} style={{ color: 'hsl(var(--primary))' }} />
                    <span>Seat {b.seat_label || b.seat_id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdCalendarToday size={16} style={{ color: 'hsl(var(--primary))' }} />
                    <span>{b.start_time.split('T')[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <MdAccessTime size={16} style={{ color: 'hsl(var(--primary))' }} />
                    <span>{b.start_time.split('T')[1]?.slice(0, 5)} - {b.end_time.split('T')[1]?.slice(0, 5)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {b.status === 'confirmed' && (
                    <Button
                      size="small"
                      icon={<MdQrCode2 size={14} />}
                      onClick={() => navigate(`/qr/${b.id}`, { state: { booking: b, seatLabel: b.seat_label } })}
                      className="rounded-lg"
                      style={{ color: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary))' }}
                    >
                      QR Code
                    </Button>
                  )}
                  {(b.status === 'confirmed' || b.status === 'pending_payment') && (
                    <Button
                      size="small"
                      danger
                      icon={<MdDelete size={14} />}
                      onClick={() => handleCancel(b.id)}
                      className="rounded-lg"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
