import React from 'react';

const PanelAuditLog = ({ auditLog }) => {
  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <span>Remediation Log</span>
        <span className="text-secondary mono">{auditLog?.length || 0} Actions</span>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
        {auditLog && auditLog.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {auditLog.map((log, index) => {
              const isRestricted = log.action === 'Restricted';
              return (
                <div key={log.id} style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  borderLeft: index === 0 ? `2px solid ${isRestricted ? 'var(--accent-red)' : 'var(--accent-green)'}` : '2px solid transparent',
                  backgroundColor: index === 0 ? 'var(--bg-surface-raised)' : 'transparent'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="mono text-secondary" style={{ fontSize: '11px' }}>{log.timestamp} | {log.resource_id}</span>
                    <span style={{ 
                      fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', uppercase: 'transform',
                      padding: '2px 6px', borderRadius: '4px',
                      backgroundColor: isRestricted ? 'var(--accent-red)' : 'var(--accent-green)',
                      color: '#FFF'
                    }}>
                      {log.action.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-primary)', fontStyle: 'italic', wordBreak: 'break-word' }}>
                    {log.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            Awaiting automated healing events...
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelAuditLog;
