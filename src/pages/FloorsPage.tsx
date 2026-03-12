import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Empty, Tag } from 'antd';
import { MdLayers, MdEventSeat, MdArrowBack } from 'react-icons/md';
import { getFloors } from '../api/endpoints';

interface Floor {
  id: string;
  name: string;
  floor_number: number;
  total_seats: number;
  available_seats: number;
  description?: string;
}

const FloorsPage = () => {
  const { libraryId } = useParams<{ libraryId: string }>();
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadFloors();
  }, [libraryId]);

  const loadFloors = async () => {
    try {
      const res = await getFloors(libraryId!);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setFloors(res.data);
      } else {
        throw new Error('No data');
      }
    } catch (err) {
      console.log('Using demo floor data', err);
      setFloors([
        { id: 'f1', name: 'Ground Floor', floor_number: 0, total_seats: 40, available_seats: 15, description: 'General reading area with natural lighting' },
        { id: 'f2', name: 'First Floor', floor_number: 1, total_seats: 50, available_seats: 22, description: 'Silent study zone with individual desks' },
        { id: 'f3', name: 'Second Floor', floor_number: 2, total_seats: 30, available_seats: 8, description: 'Group study rooms and discussion area' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio > 0.5) return 'hsl(var(--seat-available))';
    if (ratio > 0.2) return 'hsl(var(--seat-held))';
    return 'hsl(var(--destructive))';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/libraries')}
        className="flex items-center gap-1 text-sm mb-4 hover:opacity-70 transition-opacity"
        style={{ color: 'hsl(var(--primary))' }}
      >
        <MdArrowBack size={18} /> Back to Libraries
      </button>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
          Select Floor
        </h1>
        <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Choose a floor to view available seats</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spin size="large" /></div>
      ) : floors.length === 0 ? (
        <Empty description="No floors available" />
      ) : (
        <div className="space-y-4">
          {floors.map((floor) => (
            <div
              key={floor.id}
              onClick={() => navigate(`/seats/${floor.id}`, { state: { libraryId } })}
              className="cursor-pointer rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-4"
              style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'hsl(var(--primary) / 0.1)' }}
              >
                <MdLayers size={28} style={{ color: 'hsl(var(--primary))' }} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base">{floor.name}</h3>
                {floor.description && (
                  <p className="text-xs mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>{floor.description}</p>
                )}
              </div>

              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 justify-end mb-1">
                  <MdEventSeat size={16} style={{ color: getAvailabilityColor(floor.available_seats, floor.total_seats) }} />
                  <span className="font-bold text-sm" style={{ color: getAvailabilityColor(floor.available_seats, floor.total_seats) }}>
                    {floor.available_seats}
                  </span>
                </div>
                <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  of {floor.total_seats} seats
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloorsPage;
