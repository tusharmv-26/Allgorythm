import React, { useState, useEffect } from 'react';

const PanelAttackerIntelligence = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProfiles = async () => {
        try {
            const res = await fetch('http://13.61.240.101:8000/profiles');
            const data = await res.json();
            setProfiles(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching profiles:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
        const interval = setInterval(fetchProfiles, 3000);
        return () => clearInterval(interval);
    }, []);

    const getThreatColor = (t) => {
        switch (t) {
            case 'CRITICAL': return { bg: 'from-red-600/20 to-red-900/10', border: 'border-red-500/40', text: 'text-red-400', badge: '#dc2626' };
            case 'HIGH': return { bg: 'from-orange-600/20 to-orange-900/10', border: 'border-orange-500/40', text: 'text-orange-400', badge: '#ea580c' };
            case 'MEDIUM': return { bg: 'from-yellow-600/20 to-yellow-900/10', border: 'border-yellow-500/40', text: 'text-yellow-400', badge: '#eab308' };
            case 'LOW': return { bg: 'from-green-600/20 to-green-900/10', border: 'border-green-500/40', text: 'text-green-400', badge: '#22c55e' };
            default: return { bg: 'from-gray-600/20 to-gray-900/10', border: 'border-gray-500/40', text: 'text-gray-400', badge: '#4b5563' };
        }
    };

    const getBehaviorIcon = (b) => {
        switch (b) {
            case 'AUTOMATED_SCANNER': return '🤖';
            case 'MANUAL_ATTACKER': return '👤';
            case 'AGGRESSIVE_ENUMERATION': return '⚡';
            case 'RECONNAISSANCE': return '🔍';
            default: return '❓';
        }
    };

    const getIntentIcon = (i) => {
        switch (i) {
            case 'CREDENTIAL_HARVESTING': return '🔐';
            case 'DATA_EXFILTRATION': return '📤';
            case 'FINANCIAL_TARGETING': return '💰';
            case 'TARGETED_ATTACK': return '🎯';
            case 'BROAD_RECONNAISSANCE': return '📡';
            default: return '❓';
        }
    };

    const getEscalationColor = (score) => {
        if (score >= 75) return 'from-red-500 to-red-600';
        if (score >= 50) return 'from-orange-500 to-orange-600';
        if (score >= 25) return 'from-yellow-500 to-yellow-600';
        return 'from-green-500 to-green-600';
    };

    if (loading && profiles.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="text-center">
                    <div className="text-cyan-500/60 font-mono text-sm mb-2">⟳ INTELLIGENCE MATRIX INITIALIZING</div>
                    <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col pt-4 pb-6 px-4 gap-4 overflow-y-auto custom-scrollbar">
            {profiles.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                        <div className="text-5xl mb-3">🛡️</div>
                        <div className="text-gray-500 font-sans text-sm">No Active Threats Detected</div>
                        <div className="text-gray-600 font-mono text-xs mt-1">Awaiting attacker profiles...</div>
                    </div>
                </div>
            ) : (
                profiles.map((p, idx) => {
                    const threatStyle = getThreatColor(p.threat_level);
                    return (
                        <div 
                            key={idx}
                            className={`group relative overflow-hidden rounded-xl backdrop-blur-xl border ${threatStyle.border} bg-gradient-to-br ${threatStyle.bg} p-5 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/60 hover:scale-105 transform`}
                        >
                            {/* Animated background gradient */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" style={{background: `radial-gradient(circle at 50% 50%, ${threatStyle.badge}, transparent)`}}></div>
                            
                            {/* Main Content */}
                            <div className="relative z-10 flex flex-col">
                                
                                {/* Top Section: IP + Threat Level */}
                                <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/10">
                                    <div className="flex-1">
                                        <div className="font-mono text-xl font-bold text-cyan-300 mb-1 tracking-wider">{p.ip}</div>
                                        <div className="text-xs font-sans text-gray-500 uppercase tracking-wide">IP Address</div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-lg font-mono text-xs font-bold text-white ${threatStyle.text} border ${threatStyle.border}`} style={{backgroundColor: `${threatStyle.badge}20`}}>
                                        <div>{p.threat_level}</div>
                                        <div className="text-[10px] opacity-75">THREAT</div>
                                    </div>
                                </div>

                                {/* Middle Section: Behavior + Intent Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {/* Behavior Card */}
                                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">{getBehaviorIcon(p.behavior_type)}</span>
                                            <div className="text-[10px] font-mono font-bold text-gray-400 uppercase">Behavior</div>
                                        </div>
                                        <div className="font-sans text-sm font-semibold text-cyan-300 capitalize">
                                            {(p.behavior_type || 'Unknown').replace(/_/g, ' ')}
                                        </div>
                                    </div>

                                    {/* Intent Card */}
                                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">{getIntentIcon(p.intent)}</span>
                                            <div className="text-[10px] font-mono font-bold text-gray-400 uppercase">Intent</div>
                                        </div>
                                        <div className="font-sans text-sm font-semibold text-amber-300 capitalize">
                                            {(p.intent || 'Unknown').replace(/_/g, ' ')}
                                        </div>
                                    </div>
                                </div>

                                {/* Status Badges */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {p.is_tor && (
                                        <div className="px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 animate-pulse">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                            <span className="font-mono text-xs font-bold text-red-300 uppercase">Tor Exit</span>
                                        </div>
                                    )}
                                    {p.is_datacenter && !p.is_tor && (
                                        <div className="px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex items-center gap-2">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                            <span className="font-mono text-xs font-bold text-yellow-300 uppercase">Datacenter</span>
                                        </div>
                                    )}
                                    <div className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/50 rounded-lg">
                                        <span className="font-mono text-xs font-bold text-cyan-300 uppercase">
                                            {p.access_count || 0} Targets
                                        </span>
                                    </div>
                                </div>

                                {/* Escalation Probability Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-wide">Escalation Probability</span>
                                        <span className={`font-mono text-sm font-bold ${threatStyle.text}`}>{p.escalation_probability || 0}%</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-900/50 rounded-full overflow-hidden border border-white/10">
                                        <div 
                                            className={`h-full bg-gradient-to-r ${getEscalationColor(p.escalation_probability)} transition-all duration-1000 ease-out rounded-full shadow-lg shadow-current`}
                                            style={{width: `${p.escalation_probability || 0}%`}}
                                        ></div>
                                    </div>
                                </div>

                                {/* Metadata Grid */}
                                <div className="grid grid-cols-3 gap-2 mb-4 text-center py-3 bg-white/5 rounded-lg border border-white/10">
                                    <div>
                                        <div className="font-mono text-xs text-gray-500 mb-1">ACTIVE TIME</div>
                                        <div className="font-mono text-sm font-bold text-cyan-400">{p.session_duration || 0}s</div>
                                    </div>
                                    <div className="border-l border-r border-white/10">
                                        <div className="font-mono text-xs text-gray-500 mb-1">RESOURCES</div>
                                        <div className="font-mono text-sm font-bold text-orange-400">{p.access_count || 0}</div>
                                    </div>
                                    <div>
                                        <div className="font-mono text-xs text-gray-500 mb-1">ORG</div>
                                        <div className="font-mono text-sm font-bold text-gray-300 truncate">{(p.org || 'Unknown').slice(0, 15)}</div>
                                    </div>
                                </div>

                                {/* Attack Pathway */}
                                {p.resources_probed && p.resources_probed.length > 0 && (
                                    <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                                        <div className="font-mono text-xs font-bold text-gray-400 mb-2 uppercase">Attack Pathway</div>
                                        <div className="flex flex-wrap gap-1 items-center">
                                            {p.resources_probed.map((res, i) => (
                                                <React.Fragment key={i}>
                                                    <div className="font-mono text-xs text-gray-300 bg-gray-900/50 px-2 py-1 rounded border border-gray-700 truncate max-w-[120px]" title={res}>
                                                        {res}
                                                    </div>
                                                    {i < p.resources_probed.length - 1 && <span className="text-cyan-500/60 text-xs">→</span>}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Button */}
                                <a 
                                    href={`http://13.61.240.101:8000/report/${p.ip}`}
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="w-full text-center py-2.5 px-4 rounded-lg font-sans font-semibold text-sm uppercase tracking-wide transition-all duration-200 bg-gradient-to-r from-cyan-600/40 to-blue-600/40 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 hover:from-cyan-600/60 hover:to-blue-600/60 hover:shadow-lg hover:shadow-cyan-500/20"
                                >
                                    📄 Generate Forensic Report
                                </a>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default PanelAttackerIntelligence;
