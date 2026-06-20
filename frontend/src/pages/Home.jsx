import { Users, DollarSign, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Home.css';

export default function Home() {
  const [stats, setStats] = useState({ total: 0, avgSalary: 0, totalSalary: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/employees');
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const total = data.length;
          const totalSalary = data.reduce((sum, emp) => sum + Number(emp.salary), 0);
          setStats({
            total,
            totalSalary,
            avgSalary: totalSalary / total
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back to the TECEZE Employee Management System</p>
      </header>

      {isLoading ? (
        <div className="loading-state">Loading metrics...</div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Employees</h3>
              <p className="stat-value">{stats.total}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <h3>Average Salary</h3>
              <p className="stat-value">
                ${stats.avgSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Payroll</h3>
              <p className="stat-value">
                ${stats.totalSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="welcome-banner">
        <div className="banner-content">
          <h2>Manage your team efficiently</h2>
          <p>Navigate to the Employees tab to add, edit, or remove records. Check Analytics for visual insights.</p>
        </div>
      </div>
    </div>
  );
}
