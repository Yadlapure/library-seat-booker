import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Spin, Empty, Tag } from 'antd';
import { MdLocationOn, MdStar, MdSearch, MdAccessTime } from 'react-icons/md';
import { searchLibraries } from '../api/endpoints';

interface Library {
  id: string;
  name: string;
  address: string;
  distance?: number;
  rating?: number;
  image?: string;
  opening_hours?: string;
  total_seats?: number;
  available_seats?: number;
}

const LibrariesPage = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadLibraries();
  }, []);

  const loadLibraries = async () => {
    try {
      const res = await searchLibraries(12.9165, 77.6101);
      setLibraries(res.data);
    } catch {
      // Demo data fallback
      setLibraries([
        { id: '1', name: 'Central Study Hub', address: '123 Library St, Bangalore', distance: 0.5, rating: 4.8, opening_hours: '6AM - 11PM', total_seats: 120, available_seats: 34 },
        { id: '2', name: 'Knowledge Nest', address: '456 Book Ave, Koramangala', distance: 1.2, rating: 4.5, opening_hours: '7AM - 10PM', total_seats: 80, available_seats: 12 },
        { id: '3', name: 'The Reading Room', address: '789 Study Ln, Indiranagar', distance: 2.1, rating: 4.9, opening_hours: '24 Hours', total_seats: 200, available_seats: 67 },
        { id: '4', name: 'Scholar Space', address: '321 Learn Rd, HSR Layout', distance: 3.0, rating: 4.3, opening_hours: '8AM - 9PM', total_seats: 60, available_seats: 5 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = libraries.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
          Nearby Libraries
        </h1>
        <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Find and book your perfect study spot
        </p>
      </div>

      <div className="mb-6">
        <Input
          prefix={<MdSearch size={20} style={{ color: 'hsl(var(--muted-foreground))' }} />}
          placeholder="Search libraries..."
          size="large"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl"
          allowClear
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spin size="large" /></div>
      ) : filtered.length === 0 ? (
        <Empty description="No libraries found" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((lib) => (
            <div
              key={lib.id}
              onClick={() => navigate(`/library/${lib.id}/floors`)}
              className="cursor-pointer rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
            >
              <div
                className="h-36 sm:h-40 flex items-end p-4"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--primary) / 0.8), hsl(var(--primary) / 0.4))`,
                }}
              >
                <h3 className="text-lg font-bold text-white drop-shadow-md">{lib.name}</h3>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-start gap-2 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  <MdLocationOn size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'hsl(var(--primary))' }} />
                  <span>{lib.address}</span>
                </div>

                <div className="flex items-center gap-2 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  <MdAccessTime size={16} className="flex-shrink-0" />
                  <span>{lib.opening_hours}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <MdStar size={16} style={{ color: 'hsl(var(--accent))' }} />
                    <span className="text-sm font-semibold">{lib.rating}</span>
                  </div>
                  {lib.distance && (
                    <Tag color="default" className="rounded-full text-xs">{lib.distance} km</Tag>
                  )}
                </div>

                {lib.available_seats !== undefined && (
                  <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                    <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      Available Seats
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: lib.available_seats < 10 ? 'hsl(var(--destructive))' : 'hsl(var(--seat-available))' }}
                    >
                      {lib.available_seats} / {lib.total_seats}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibrariesPage;
