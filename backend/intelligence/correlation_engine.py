import time
from typing import List, Dict

class InsiderExternalCorrelationEngine:
    """Detect coordination between insider threats and external attackers"""
    
    def __init__(self):
        self.correlations = []
        self.detected_coordinates = []
    
    def correlate_threats(self, employee_activities: List[Dict], 
                         external_events: List[Dict]) -> List[Dict]:
        """
        Find correlations between employee activity and external attacks
        
        Returns: List of coordinated attack indicators
        """
        
        correlations = []
        
        # For each external attack
        for attack in external_events:
            attacker_ip = attack.get("attacker_ip")
            attacked_resource = attack.get("resource_name")
            attack_time = attack.get("timestamp")
            
            # Check if any employee accessed same resource recently
            for emp_activity in employee_activities:
                emp_resource = emp_activity.get("resource")
                emp_time = emp_activity.get("timestamp")
                employee_id = emp_activity.get("employee_id")
                access_type = emp_activity.get("access_type")
                
                # Correlation Rule 1: Same resource?
                if emp_resource.lower() in attacked_resource.lower() or \
                   attacked_resource.lower() in emp_resource.lower():
                    
                    # Correlation Rule 2: Within timeframe? (1 hour = 3600 seconds)
                    time_diff = abs(attack_time - emp_time)
                    
                    if time_diff < 3600:
                        
                        # Correlation Rule 3: Is the access type suspicious?
                        if access_type in ["export", "download", "delete"]:
                            
                            correlation_score = self._calculate_correlation_score(
                                time_diff, access_type, emp_resource, attacked_resource
                            )
                            
                            correlation = {
                                "employee_id": employee_id,
                                "attacker_ip": attacker_ip,
                                "resource": attacked_resource,
                                "employee_resource": emp_resource,
                                "employee_accessed_at": emp_time,
                                "attacker_probed_at": attack_time,
                                "time_difference_seconds": int(time_diff),
                                "correlation_score": correlation_score,
                                "risk_level": self._assess_risk(correlation_score),
                                "attack_type": access_type,
                                "likely_scenario": self._determine_scenario(time_diff, access_type)
                            }
                            
                            correlations.append(correlation)
                            self.detected_coordinates.append(correlation)
        
        self.correlations = correlations
        return correlations
    
    def _calculate_correlation_score(self, time_diff: float, access_type: str, 
                                     emp_resource: str, attacked_resource: str) -> int:
        """
        Calculate how likely this is a coordinated attack (0-100)
        """
        
        score = 0
        
        # Time proximity (closer = higher score)
        # 0-300 seconds (5 min): +40 points
        # 300-1800 seconds (30 min): +30 points
        # 1800-3600 seconds (1 hour): +20 points
        if time_diff < 300:
            score += 40
        elif time_diff < 1800:
            score += 30
        elif time_diff < 3600:
            score += 20
        
        # Access type (export/download = higher risk)
        if access_type == "export":
            score += 30
        elif access_type == "download":
            score += 25
        elif access_type == "delete":
            score += 20
        
        # Resource sensitivity
        sensitive_keywords = ["password", "credential", "secret", "key", "token", 
                            "database", "backup", "config", "admin", "customer", "payment"]
        
        if any(kw in emp_resource.lower() for kw in sensitive_keywords):
            score += 15
        if any(kw in attacked_resource.lower() for kw in sensitive_keywords):
            score += 15
        
        return min(score, 100)
    
    def _assess_risk(self, score: int) -> str:
        """Convert score to risk level"""
        
        if score >= 80:
            return "CRITICAL"
        elif score >= 60:
            return "HIGH"
        elif score >= 40:
            return "MEDIUM"
        else:
            return "LOW"
    
    def _determine_scenario(self, time_diff: float, access_type: str) -> str:
        """Determine likely attack scenario"""
        
        if time_diff < 60:
            return "SIMULTANEOUS_ATTACK (same minute - coordinated)"
        elif time_diff < 300:
            return "SEQUENTIAL_ATTACK (within 5 min - likely coordinated)"
        elif time_diff < 1800:
            return "TIMED_ATTACK (within 30 min - possible coordination)"
        elif access_type == "export":
            return "DATA_EXFILTRATION_SETUP (employee exports, attacker retrieves)"
        elif access_type == "download":
            return "CREDENTIAL_THEFT_CHAIN (employee downloads creds, attacker uses them)"
        else:
            return "SUSPICIOUS_CORRELATION (monitor closely)"
    
    def get_high_risk_correlations(self, min_score: int = 70) -> List[Dict]:
        """Get only high-risk correlations"""
        
        return [c for c in self.correlations if c["correlation_score"] >= min_score]
