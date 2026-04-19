import React, { useState, useEffect } from 'react';

const PanelEventFeed = ({ events }) => {
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [highlightId, setHighlightId] = useState(null);

  useEffect(() => {
    // When events update, trigger highlight for the newest one
    if (events && events.length > 0) {
      if (!displayedEvents.length || events[0].id !== displayedEvents[0].id) {
        setHighlightId(events[0].id);
        const timer = setTimeout(() => setHighlightId(null), 1500);
        setDisplayedEvents(events);
        return () => clearTimeout(timer);
      }
    }
    setDisplayedEvents(events || []);
  }, [events]);

  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <span>Live Threat Feed</span>
        <span style={{ color: 'var(--accent-cyan)' }}>{events?.length || 0} Events</span>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-surface-raised)', zIndex: 1, boxShadow: '0 1px 0 var(--border-subtle)' }}>
            <tr>
              <th style={{ padding: '8px 16px', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time</th>
              <th style={{ padding: '8px 16px', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Source IP</th>
              <th style={{ padding: '8px 16px', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Targeted Asset</th>
              <th style={{ padding: '8px 16px', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk</th>
            </tr>
          </thead>
          <tbody>
            {displayedEvents.map((ev) => {
              const riskColor = ev.risk_score >= 70 ? 'var(--accent-red)' : ev.risk_score >= 40 ? 'var(--accent-amber)' : 'var(--accent-cyan)';
              const isHighlight = highlightId === ev.id;
              
              return (
                <tr key={ev.id} style={{ 
                  borderBottom: '1px solid var(--border-subtle)',
                  animation: isHighlight ? (ev.risk_score >= 70 ? 'flashRowRed 1.8s' : 'flashRow 1.5s') : 'none',
                  borderLeft: `3px solid ${riskColor}`,
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.3s'
                }}>
                  <td className="mono" style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-mono)' }}>{ev.timestamp}</td>
                  <td className="mono" style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-primary)' }}>{ev.attacker_ip}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{ev.resource_name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ 
                      display: 'inline-flex', alignItems: 'center', padding: '2px 6px',
                      backgroundColor: riskColor + '20', /* 20% opacity */
                      color: riskColor,
                      borderRadius: '4px',
                      fontSize: '11px', fontWeight: 600
                    }}>
                      {ev.risk_score} - {ev.status_badge.toUpperCase()}
                    </div>
                  </td>
                </tr>
              )
            })}
            {(!displayedEvents || displayedEvents.length === 0) && (
              <tr>
                <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px', fontStyle: 'italic' }}>
                  No threats detected. System monitoring active<span style={{ animation: 'pulse 1s infinite' }}>_</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanelEventFeed;
