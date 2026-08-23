import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Charts = ({ resources = [] }) => {
  const chartData = resources.map((item) => ({
    name: item.type,
    planned: Number(item.plannedQty) || 0,
    actual: Number(item.availableQty) || 0,
  }));

  const maxValue = Math.max(
    10,
    ...chartData.flatMap((item) => [item.planned, item.actual]),
  );
  const yAxisMax = Math.ceil((maxValue * 1.2) / 10) * 10;

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h5 className="card-title mb-4">Planned vs Actual</h5>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, yAxisMax]} tickCount={6} />
              <Tooltip />
              <Bar dataKey="planned" fill="#003366" radius={[6, 6, 0, 0]} />
              <Bar dataKey="actual" fill="#0056b3" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
