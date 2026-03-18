export const regoPolicy = `package medicloud.zero_trust

# Default deny - if no other rule matches, deny access
default allow = false

# Allow access only if all conditions are met
allow {
    input.user.mfa == true
    input.device.trusted == true
    input.network.vpn == true
    input.user.suspended == false
    input.device.compliant == true
}

# Deny reasons for audit logging
deny_reason[reason] {
    not input.user.mfa
    reason := "Multi-factor authentication required"
}

deny_reason[reason] {
    not input.device.trusted
    reason := "Device not in trusted state"
}

deny_reason[reason] {
    not input.network.vpn
    reason := "VPN connection required"
}

deny_reason[reason] {
    input.user.suspended == true
    reason := "User account is suspended"
}

deny_reason[reason] {
    not input.device.compliant
    reason := "Device does not meet compliance requirements"
}

# Risk scoring for continuous evaluation
risk_score = score {
    score := (user_risk * 0.4) + (device_risk * 0.3) + (network_risk * 0.3)
}

user_risk = risk {
    risk := 0.0
    risk := risk + 0.3 if not input.user.mfa
    risk := risk + 0.2 if input.user.suspended
    risk := risk + 0.1 if not input.user.has_recent_activity
}

device_risk = risk {
    risk := 0.0
    risk := risk + 0.4 if not input.device.trusted
    risk := risk + 0.2 if not input.device.compliant
    risk := risk + 0.1 if input.device.location_suspicious
}

network_risk = risk {
    risk := 0.0
    risk := risk + 0.3 if not input.network.vpn
    risk := risk + 0.2 if input.network.unusual_traffic
    risk := risk + 0.1 if input.network.new_location
}

# Time-based access restrictions
allow_time_based {
    current_hour := time.hour(time.now_ns())
    current_hour >= 6   # After 6 AM
    current_hour <= 22  # Before 10 PM
}

# Geographic restrictions
allow_geographic {
    input.network.country in ["US", "CA", "GB"]
}

# Enhanced verification for high-risk scenarios
require_step_up_auth {
    risk_score > 0.7
}`;
