import React, { useState, useEffect } from 'react';

export default function PanelCorrelations() {
  const [correlations, setCorrelations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState('correlations');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch correlations
        const corrRes = await fetch('http://13.61.240.101:8000/correlations');
        if (corrRes.ok) {
          setCorrelations(await corrRes.json());
        }

        // Fetch employees
        const empRes = await fetch('http://13.61.240.101:8000/employees');
        if (empRes.ok) {
          setEmployees(await empRes.json());
        }
      } catch (err) {
        console.error("Failed to fetch correlation data", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'var(--accent-red)';
      case 'HIGH': return 'var(--accent-amber)';
      case 'MEDIUM': return 'var(--accent-orange)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div style={{
      padding: '16px',
      backgroundColor: 'var(--bg-surface)',
      borderRadius: '8px',
      border: '1px solid var(--border-subtle)',
      marginBottom: '16px',
      maxHeight: '600px',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('correlations')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'correlations' ? 'var(--accent-red)' : 'var(--bg-base)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          🔗 Correlations ({correlations.length})
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'employees' ? 'var(--accent-amber)' : 'var(--bg-base)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          👤 Employees ({employees.length})
        </button>
      </div>

      {activeTab === 'correlations' && (
        <div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>
            🚨 Detected Coordinated Attacks
          </h3>
          
          {correlations.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No correlations detected.</p>
          ) : (
            correlations.map((corr, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-base)',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  borderLeft: `3px solid ${getRiskColor(corr.risk_level)}`
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontWeight: 600,
                    color: getRiskColor(corr.risk_level)
                  }}>
                    {corr.risk_level} - {corr.correlation_score}% confidence
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {new Date(corr.employee_accessed_at * 1000).toLocaleTimeString()}
                  </span>
                </div>

                <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                  <p><strong>Employee:</strong> {corr.employee_id}</p>
                  <p><strong>Action:</strong> {corr.attack_type.toUpperCase()} on {corr.employee_resource}</p>
                  <p><strong>Attacker:</strong> {corr.attacker_ip} probed {corr.resource}</p>
                  <p><strong>Time Gap:</strong> {corr.time_difference_seconds}s</p>
                  <p style={{ color: getRiskColor(corr.risk_level) }}>
                    <strong>Scenario:</strong> {corr.likely_scenario}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'employees' && (
        <div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>
            👤 Employee Risk Profiles
          </h3>

          {employees.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No employee data.</p>
          ) : (
            employees.map((emp, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-base)',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  borderLeft: `3px solid ${getRiskColor(emp.threat_level)}`
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontWeight: 600 }}>{emp.employee_id}</span>
                  <span style={{
                    color: getRiskColor(emp.threat_level),
                    fontWeight: 600
                  }}>
                    {emp.threat_level}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '16px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}>
                  <span>📊 Total: {emp.total_accesses}</span>
                  <span>⚠️ Suspicious: {emp.suspicious_accesses}</span>
                  <span>📈 Avg Risk: {emp.avg_risk_score}/100</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
