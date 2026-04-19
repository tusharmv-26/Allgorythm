import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// Stockholm (EU-NORTH-1)
const destinationCoords = [18.0686, 59.3293]; 

// Fake city nodes to make the map look active and populated like the reference image
const glowingCities = [
  [-74.006, 40.7128], [-118.2437, 34.0522], [-0.1276, 51.5074], [139.6917, 35.6895], 
  [103.8198, 1.3521], [151.2093, -33.8688], [37.6173, 55.7558], [-43.1729, -22.9068],
  [121.4737, 31.2304], [28.0473, -26.2041], [-99.1332, 19.4326]
];

const PanelWorldMap = ({ events }) => {
  const [dots, setDots] = useState([]);

  const getCoordinates = (ip) => {
    let hash = 0;
    for (let i = 0; i < ip.length; i++) { hash = (hash << 5) - hash + ip.charCodeAt(i); }
    const lng = -120 + Math.abs(hash % 240);
    const lat = -40 + Math.abs((hash * 7) % 100);
    return [lng, lat];
  };

  useEffect(() => {
    if (!events) return;
    const newDots = events.map(ev => ({
      id: ev.id,
      ip: ev.attacker_ip,
      coords: getCoordinates(ev.attacker_ip),
      recent: true
    })).slice(0, 10);
    
    setDots(newDots);
    if (newDots.length > 0) {
      const timer = setTimeout(() => {
        setDots(prev => prev.map(d => ({ ...d, recent: false })));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [events]);

  return (
    <div className="panel" style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header" style={{ position: 'relative', zIndex: 2, background: 'transparent', borderBottom: '1px solid rgba(0,255,255,0.2)' }}>
        <span style={{ color: '#E0E7FF' }}>Global Threat Origins</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0FF', textShadow: '0 0 10px #0FF', fontWeight: 600 }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: '#0FF', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', animation: 'pulse 2s infinite' }}></div>
          AWS EU-NORTH-1
        </span>
      </div>
      
      <div style={{ flex: 1, width: '100%', position: 'relative', overflow: 'hidden', background: '#02050A' }}>
        
        {/* Holographic Radar Grid Background */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          zIndex: 0
        }}></div>

        <ComposableMap 
          projection="geoMercator" 
          width={1000} 
          height={400} 
          projectionConfig={{ scale: 160, center: [0, 30] }} 
          style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
        >
          <defs>
            <pattern id="dot-matrix" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="rgba(0, 255, 255, 0.35)" />
            </pattern>
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="amber-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  fill="url(#dot-matrix)" 
                  stroke="rgba(0, 255, 255, 0.7)" 
                  strokeWidth="0.5"
                  style={{
                    default: { outline: "none", filter: "url(#neon-glow)" },
                    hover: { fill: "rgba(0, 255, 255, 0.8)", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Background Cities to make it look alive */}
          {glowingCities.map((coords, i) => (
            <Marker key={`city-${i}`} coordinates={coords}>
              <circle r={2} fill="#0FF" style={{ filter: 'url(#neon-glow)', opacity: 0.8 }} />
            </Marker>
          ))}

          {/* Stockholm Destination Marker */}
          <Marker coordinates={destinationCoords}>
            <circle r={5} fill="#FFF" style={{ filter: 'drop-shadow(0 0 10px #FFF)' }} />
            <circle r={25} fill="transparent" stroke="#0FF" strokeWidth={1.5} style={{ animation: 'pulseRing 2s infinite' }} />
            <circle r={12} fill="transparent" stroke="#0FF" strokeWidth={2} style={{ animation: 'pulseRing 2s infinite 0.5s' }} />
          </Marker>

          {/* Attacker Origins and Vectors */}
          {dots.map(d => (
            <React.Fragment key={d.id}>
              <Line
                from={d.coords}
                to={destinationCoords}
                stroke={d.recent ? "#FFB800" : "#0FF"}
                strokeWidth={d.recent ? 3 : 1}
                strokeLinecap="round"
                strokeDasharray="6,6"
                style={{
                  opacity: d.recent ? 1 : 0.2,
                  transition: 'all 1s ease',
                  filter: d.recent ? 'url(#amber-glow)' : 'none',
                  animation: d.recent ? 'dash 1s linear infinite' : 'none'
                }}
              />
              <Marker coordinates={d.coords}>
                <circle r={d.recent ? 8 : 4} fill={d.recent ? "#FFB800" : "#0FF"} style={{ transition: 'all 0.5s ease', filter: d.recent ? 'url(#amber-glow)' : 'url(#neon-glow)' }} />
                {d.recent && <circle r={30} fill="transparent" stroke="#FFB800" strokeWidth={2} style={{ animation: 'pulseRing 1s infinite' }} />}
              </Marker>
            </React.Fragment>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
};

export default PanelWorldMap;
