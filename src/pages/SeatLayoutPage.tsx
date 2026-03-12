import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Spin, TimePicker, message, DatePicker } from 'antd';
import { MdArrowBack, MdEventSeat, MdAccessTime } from 'react-icons/md';
import dayjs from 'dayjs';
import { getSeatLayout, createBooking } from '../api/endpoints';
import { useAuth } from '../contexts/AuthContext';

interface Seat {
  id: string;
  label: string;
  status: 'available' | 'held' | 'booked';
  x: number;
  y: number;
}

const SeatLayoutPage = () => {
  const { floorId } = useParams<{ floorId: string }>();
  const location = useLocation();
  const libraryId = (location.state as any)?.libraryId || '';
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(null);
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(null);
  const [bookingDate, setBookingDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadSeats();
  }, [floorId]);

  const loadSeats = async () => {
    try {
      const res = await getSeatLayout(floorId!);
      setSeats(res.data);
    } catch {
      // Demo data
      const demoSeats: Seat[] = [];
      const rows = 6;
      const cols = 8;
      const statuses: Array<'available' | 'held' | 'booked'> = ['available', 'held', 'booked'];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rand = Math.random();
          const status = rand < 0.55 ? 'available' : rand < 0.7 ? 'held' : 'booked';
          demoSeats.push({
            id: `s-${r}-${c}`,
            label: `${String.fromCharCode(65 + r)}${c + 1}`,
            status,
            x: c,
            y: r,
          });
        }
      }
      setSeats(demoSeats);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    setSelectedSeat(selectedSeat === seat.id ? null : seat.id);
  };

  const handleBook = async () => {
    if (!selectedSeat || !startTime || !endTime || !bookingDate) {
      message.warning('Please select a seat, date, and time range');
      return;
    }
    setBookingLoading(true);
    try {
      const start = bookingDate.format('YYYY-MM-DD') + 'T' + startTime.format('HH:mm:ss');
      const end = bookingDate.format('YYYY-MM-DD') + 'T' + endTime.format('HH:mm:ss');
      const res = await createBooking({
        user_id: user?.id || '',
        library_id: libraryId,
        floor_id: floorId!,
        seat_id: selectedSeat,
        start_time: start,
        end_time: end,
      });
      message.success('Seat booked!');
      navigate('/booking-confirmation', {
        state: {
          booking: res.data,
          seatLabel: seats.find((s) => s.id === selectedSeat)?.label,
        },
      });
    } catch {
      // Demo navigation
      const seatLabel = seats.find((s) => s.id === selectedSeat)?.label;
      navigate('/booking-confirmation', {
        state: {
          booking: {
            id: 'demo-booking-123',
            seat_id: selectedSeat,
            start_time: bookingDate.format('YYYY-MM-DD') + 'T' + (startTime?.format('HH:mm:ss') || ''),
            end_time: bookingDate.format('YYYY-MM-DD') + 'T' + (endTime?.format('HH:mm:ss') || ''),
            status: 'pending_payment',
            amount: 99,
          },
          seatLabel,
        },
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const seatsByRow = seats.reduce<Record<number, Seat[]>>((acc, seat) => {
    if (!acc[seat.y]) acc[seat.y] = [];
    acc[seat.y].push(seat);
    return acc;
  }, {});

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm mb-4 hover:opacity-70 transition-opacity"
        style={{ color: 'hsl(var(--primary))' }}
      >
        <MdArrowBack size={18} /> Back
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
        Select Your Seat
      </h1>
      <p className="text-sm mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
        Tap a seat to select it
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {[
          { label: 'Available', cls: 'seat-available' },
          { label: 'Selected', cls: 'seat-selected' },
          { label: 'Held', cls: 'seat-held' },
          { label: 'Booked', cls: 'seat-booked' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`seat ${item.cls}`} style={{ width: 20, height: 20, fontSize: 8 }} />
            <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spin size="large" /></div>
      ) : (
        <>
          {/* Front indicator */}
          <div
            className="text-center text-xs font-semibold py-2 mb-4 rounded-lg"
            style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}
          >
            ← FRONT (Window Side) →
          </div>

          {/* Seat Grid */}
          <div className="overflow-x-auto pb-4">
            <div className="min-w-fit mx-auto" style={{ width: 'fit-content' }}>
              {Object.entries(seatsByRow)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([row, rowSeats]) => (
                  <div key={row} className="flex items-center gap-2 mb-2">
                    <span className="w-6 text-xs font-bold text-center" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      {String.fromCharCode(65 + Number(row))}
                    </span>
                    <div className="flex gap-2">
                      {rowSeats
                        .sort((a, b) => a.col - b.col)
                        .map((seat) => {
                          // Add aisle gap
                          const hasGap = seat.col === 4;
                          return (
                            <React.Fragment key={seat.id}>
                              {hasGap && <div className="w-4" />}
                              <div
                                className={`seat ${
                                  selectedSeat === seat.id
                                    ? 'seat-selected'
                                    : `seat-${seat.status}`
                                }`}
                                onClick={() => handleSeatClick(seat)}
                                title={`${seat.label} - ${seat.status}`}
                              >
                                {seat.label}
                              </div>
                            </React.Fragment>
                          );
                        })}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Booking panel */}
          {selectedSeat && (
            <div
              className="mt-6 rounded-2xl border p-5 space-y-4"
              style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
            >
              <div className="flex items-center gap-2">
                <MdEventSeat size={20} style={{ color: 'hsl(var(--primary))' }} />
                <span className="font-bold">
                  Seat {seats.find((s) => s.id === selectedSeat)?.label}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>Date</label>
                  <DatePicker
                    value={bookingDate}
                    onChange={(d) => setBookingDate(d)}
                    className="w-full rounded-xl"
                    size="large"
                    disabledDate={(d) => d.isBefore(dayjs(), 'day')}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>Start Time</label>
                  <TimePicker
                    value={startTime}
                    onChange={(t) => setStartTime(t)}
                    format="HH:mm"
                    className="w-full rounded-xl"
                    size="large"
                    minuteStep={30}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>End Time</label>
                  <TimePicker
                    value={endTime}
                    onChange={(t) => setEndTime(t)}
                    format="HH:mm"
                    className="w-full rounded-xl"
                    size="large"
                    minuteStep={30}
                  />
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                block
                loading={bookingLoading}
                onClick={handleBook}
                className="h-12 rounded-xl text-base font-semibold"
                style={{ background: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary))' }}
              >
                Book This Seat
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SeatLayoutPage;
