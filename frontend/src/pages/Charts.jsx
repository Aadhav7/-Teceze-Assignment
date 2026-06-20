import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Charts.css';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Charts() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees');
        const json = await response.json();
        if (Array.isArray(json)) {
          setData(json);
        }
      } catch (error) {
        console.error('Failed to load data for charts', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Prepare data for bar chart (Salary by employee)
  const barChartData = data.map(emp => ({
    name: emp.employeeName,
    salary: emp.salary,
  }));

  // Prepare data for pie chart (Count by designation)
  const designationCounts = data.reduce((acc, emp) => {
    acc[emp.designation] = (acc[emp.designation] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(designationCounts).map(key => ({
    name: key,
    value: designationCounts[key],
  }));

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Analytics</h1>
        <p>Visual breakdown of employee data</p>
      </header>

      {isLoading ? (
        <div className="loading-state">Loading charts...</div>
      ) : data.length === 0 ? (
        <div className="no-data">No data available for charts.</div>
      ) : (
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Salary Overview</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="salary" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3>Employees by Designation</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                {pieChartData.map((entry, index) => (
                  <div key={entry.name} className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span>{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
