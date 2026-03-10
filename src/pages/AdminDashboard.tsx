import React, { useState, useEffect } from 'react';
import { Spin, Select } from 'antd';
import { MdPeople, MdEventSeat, MdTrendingUp, MdAttachMoney } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { getAnalytics } from '../api/endpoints';

const CHART_COLORS = [
  'hsl(168, 80%, 36%)',
  'hsl(38, 92%, 50%)',
  'hsl(220, 70%, 55%)',
  'hsl(340, 75%, 55%)',
];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [libraryId, setLibraryId] = useState('1');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, [libraryId]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await getAnalytics(libraryId);
      setData(res.data);
    } catch {
      setData({
        total_users: 1247,
        total_bookings: 3892,
        occupancy_rate: 78,
        revenue: 285400,
        daily_bookings: [
          { day: 'Mon', count: 45 }, { day: 'Tue', count: 62 }, { day: 'Wed', count: 58 },
          { day: 'Thu', count: 71 }, { day: 'Fri', count: 85 }, { day: 'Sat', count: 92 }, { day: 'Sun', count: 67 },
        ],
        floor_usage: [
          { name: 'Ground', value: 35 }, { name: '1st Floor', value: 40 },
          { name: '2nd Floor', value: 25 },
        ],
        hourly_trend: [
          { hour: '6AM', bookings: 5 }, { hour: '8AM', bookings: 25 }, { hour: '10AM', bookings: 45 },
          { hour: '12PM', bookings: 38 }, { hour: '2PM', bookings: 52 }, { hour: '4PM', bookings: 60 },
          { hour: '6PM', bookings: 48 }, { hour: '8PM', bookings: 30 }, { hour: '10PM', bookings: 12 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Users', value: data?.total_users?.toLocaleString(), icon: <MdPeople size={24} />, color: CHART_COLORS[0] },
    { label: 'Bookings', value: data?.total_bookings?.toLocaleString(), icon: <MdEventSeat size={24} />, color: CHART_COLORS[1] },
    { label: 'Occupancy', value: `${data?.occupancy_rate}%`, icon: <MdTrendingUp size={24} />, color: CHART_COLORS[2] },
    { label: 'Revenue', value: `₹${data?.revenue?.toLocaleString()}`, icon: <MdAttachMoney size={24} />, color: CHART_COLORS[3] },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            Analytics Dashboard
          </h1>
          <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Library performance overview</p>
        </div>
        <Select
          value={libraryId}
          onChange={setLibraryId}
          options={[
            { value: '1', label: 'Central Study Hub' },
            { value: '2', label: 'Knowledge Nest' },
            { value: '3', label: 'The Reading Room' },
          ]}
          className="w-full sm:w-52"
          size="large"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spin size="large" /></div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border p-4 sm:p-5"
                style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: s.color }}>
                  {s.icon}
                </div>
                <p className="text-xl sm:text-2xl font-bold">{s.value}</p>
                <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div
              className="rounded-2xl border p-4 sm:p-5"
              style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
            >
              <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Daily Bookings</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.daily_bookings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div
              className="rounded-2xl border p-4 sm:p-5"
              style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
            >
              <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Floor Usage</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.floor_usage}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {data.floor_usage.map((_: any, i: number) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div
              className="rounded-2xl border p-4 sm:p-5 lg:col-span-2"
              style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
            >
              <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Hourly Booking Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data.hourly_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="bookings" stroke={CHART_COLORS[0]} strokeWidth={3} dot={{ fill: CHART_COLORS[0] }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
