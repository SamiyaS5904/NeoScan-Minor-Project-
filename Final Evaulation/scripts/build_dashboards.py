import re
import os

with open(r'D:\MINOR PROJECT G9\Final Evaulation\frontend\dashboard\dashboard.html', 'r', encoding='utf-8') as f:
    dashboard_html = f.read()

# Extract the style block
style_match = re.search(r'<style>(.*?)</style>', dashboard_html, re.DOTALL)
css_styles = style_match.group(1) if style_match else ""

doctor_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NeoScan AI - Doctor Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
{css_styles}
    /* Doctor Specific Styles */
    .doctor-stats {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }}
    .stat-card {{ display: flex; align-items: center; gap: 1rem; padding: 1.25rem; }}
    .stat-icon {{ width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }}
    
    .list-item {{ display: flex; justify-content: space-between; align-items: center; padding: 0.8rem 0; border-bottom: 1px solid var(--border); }}
    .list-item:last-child {{ border-bottom: none; }}
    .patient-info {{ display: flex; align-items: center; gap: 10px; }}
    .patient-avatar {{ width: 38px; height: 38px; border-radius: 50%; object-fit: cover; }}
    .risk-badge {{ padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }}
    .risk-low {{ background: #dcfce7; color: #16a34a; }}
    .risk-med {{ background: #fef08a; color: #ca8a04; }}
    .risk-high {{ background: #fee2e2; color: #ef4444; }}

    .alert-item {{ display: flex; gap: 10px; padding: 0.8rem 0; border-bottom: 1px solid var(--border); font-size: 0.85rem; }}
    .alert-item:last-child {{ border-bottom: none; }}
</style>
</head>
<body>

<div class="wrapper">
    <!-- Sidebar -->
    <nav class="sidebar">
        <div class="logo-container">
            <i class="fas fa-crosshairs"></i>
            <span class="logo-text">NeoScan</span>
        </div>
        <ul class="nav-menu">
            <li class="nav-item"><a class="nav-link active"><i class="fas fa-home"></i><span>Dashboard</span></a></li>
            <li class="nav-item"><a class="nav-link"><i class="fas fa-users"></i><span>My Patients</span></a></li>
            <li class="nav-item"><a class="nav-link"><i class="fas fa-file-medical-alt"></i><span>Scan Reports</span></a></li>
            <li class="nav-item"><a class="nav-link"><i class="fas fa-bell"></i><span>Alerts</span></a></li>
            <li class="nav-item"><a class="nav-link"><i class="fas fa-chart-line"></i><span>Trend Overview</span></a></li>
            <li class="nav-item"><a class="nav-link"><i class="fas fa-clock"></i><span>Reminders</span></a></li>
            <li class="nav-item"><a class="nav-link"><i class="fas fa-user-md"></i><span>Profile</span></a></li>
            <li class="nav-item"><a class="nav-link"><i class="fas fa-cog"></i><span>Settings</span></a></li>
            <li class="nav-item" style="margin-top:auto;"><a href="{{% url 'logout' %}}" class="nav-link logout"><i class="fas fa-sign-out-alt"></i><span>Logout</span></a></li>
        </ul>
    </nav>

    <main class="main-content">
        <!-- Top Header -->
        <header class="top-header">
            <div class="greeting-section" style="display:flex; align-items:center;">
                <button class="icon-btn" onclick="toggleSidebar()" style="margin-right:15px; border:none; background:transparent; width:34px; height:34px;">
                    <i class="fas fa-bars" style="font-size:1.1rem;"></i>
                </button>
                <div>
                    <h1>Good Morning, Dr. {{{{ request.user.username }}}} 👋</h1>
                    <p>Here's an overview of your patients and their health.</p>
                </div>
            </div>
            
            <div class="header-actions">
                <button class="icon-btn" onclick="toggleTheme()"><i class="fas fa-moon" id="theme-icon"></i></button>
                <div style="position:relative;">
                    <button class="icon-btn">
                        <i class="fas fa-bell"></i>
                        <span class="notification-dot" style="display:block;"></span>
                    </button>
                </div>
                <div class="user-profile">
                    <div style="text-align:right;">
                        <div style="font-weight:600; font-size:0.85rem;">Dr. {{{{ request.user.username }}}}</div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">Pediatrician</div>
                    </div>
                    <img src="https://i.pravatar.cc/150?img=32" class="user-avatar">
                </div>
            </div>
        </header>

        <!-- Stats -->
        <div class="doctor-stats">
            <div class="card stat-card fade-reveal">
                <div class="stat-icon" style="background:#eff6ff; color:#3b82f6;"><i class="fas fa-user-injured"></i></div>
                <div>
                    <div style="color:var(--text-muted); font-size:0.8rem;">Total Patients</div>
                    <div style="font-size:1.5rem; font-weight:700;">42</div>
                    <div style="color:var(--success); font-size:0.75rem;">+3 this week</div>
                </div>
            </div>
            <div class="card stat-card fade-reveal">
                <div class="stat-icon" style="background:#f8fafc; color:#64748b;"><i class="fas fa-clipboard-list"></i></div>
                <div>
                    <div style="color:var(--text-muted); font-size:0.8rem;">Scans Reviewed</div>
                    <div style="font-size:1.5rem; font-weight:700;">128</div>
                    <div style="color:var(--success); font-size:0.75rem;">+18 this week</div>
                </div>
            </div>
            <div class="card stat-card fade-reveal">
                <div class="stat-icon" style="background:#fee2e2; color:#ef4444;"><i class="fas fa-heartbeat"></i></div>
                <div>
                    <div style="color:var(--text-muted); font-size:0.8rem;">Positive Cases</div>
                    <div style="font-size:1.5rem; font-weight:700;">7</div>
                    <div style="color:var(--danger); font-size:0.75rem;">+1 this week</div>
                </div>
            </div>
            <div class="card stat-card fade-reveal">
                <div class="stat-icon" style="background:#fef3c7; color:#d97706;"><i class="fas fa-exclamation-triangle"></i></div>
                <div>
                    <div style="color:var(--text-muted); font-size:0.8rem;">Critical Alerts</div>
                    <div style="font-size:1.5rem; font-weight:700;">2</div>
                    <div style="color:var(--warning); font-size:0.75rem;">Needs attention</div>
                </div>
            </div>
        </div>

        <div class="dashboard-layout">
            <!-- LEFT COLUMN -->
            <div class="left-col">
                <div class="card fade-reveal">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                        <h3>Recent Scans</h3>
                        <a href="#" style="font-size:0.8rem; color:var(--primary); text-decoration:none;">View All</a>
                    </div>
                    <div>
                        <div class="list-item">
                            <div class="patient-info">
                                <img src="https://i.pravatar.cc/150?img=1" class="patient-avatar">
                                <div>
                                    <div style="font-weight:600; font-size:0.85rem;">Emma Johnson</div>
                                    <div style="font-size:0.75rem; color:var(--text-muted);">6 days • Female</div>
                                </div>
                            </div>
                            <span class="risk-badge risk-low">Low Risk</span>
                            <span style="font-size:0.75rem; color:var(--text-muted);">2 hours ago</span>
                        </div>
                        <div class="list-item">
                            <div class="patient-info">
                                <img src="https://i.pravatar.cc/150?img=3" class="patient-avatar">
                                <div>
                                    <div style="font-weight:600; font-size:0.85rem;">Liam Williams</div>
                                    <div style="font-size:0.75rem; color:var(--text-muted);">8 days • Male</div>
                                </div>
                            </div>
                            <span class="risk-badge risk-low">Low Risk</span>
                            <span style="font-size:0.75rem; color:var(--text-muted);">4 hours ago</span>
                        </div>
                        <div class="list-item">
                            <div class="patient-info">
                                <img src="https://i.pravatar.cc/150?img=12" class="patient-avatar">
                                <div>
                                    <div style="font-weight:600; font-size:0.85rem;">Noah Brown</div>
                                    <div style="font-size:0.75rem; color:var(--text-muted);">12 days • Male</div>
                                </div>
                            </div>
                            <span class="risk-badge risk-med">Medium Risk</span>
                            <span style="font-size:0.75rem; color:var(--text-muted);">6 hours ago</span>
                        </div>
                        <div class="list-item">
                            <div class="patient-info">
                                <img src="https://i.pravatar.cc/150?img=5" class="patient-avatar">
                                <div>
                                    <div style="font-weight:600; font-size:0.85rem;">Olivia Davis</div>
                                    <div style="font-size:0.75rem; color:var(--text-muted);">5 days • Female</div>
                                </div>
                            </div>
                            <span class="risk-badge risk-low">Low Risk</span>
                            <span style="font-size:0.75rem; color:var(--text-muted);">Yesterday</span>
                        </div>
                    </div>
                </div>

                <div class="card fade-reveal">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                        <h3>Alerts & Notifications</h3>
                        <a href="#" style="font-size:0.8rem; color:var(--primary); text-decoration:none;">View All Alerts</a>
                    </div>
                    <div>
                        <div class="alert-item">
                            <i class="fas fa-exclamation-triangle" style="color:var(--warning); margin-top:3px;"></i>
                            <div style="flex-grow:1;">
                                <div style="font-weight:600;">Noah Brown has a medium risk level</div>
                                <div style="color:var(--text-muted); font-size:0.8rem;">Please review the latest scan report.</div>
                            </div>
                            <span style="color:var(--text-muted); font-size:0.75rem;">6 hours ago</span>
                        </div>
                        <div class="alert-item">
                            <i class="fas fa-bell" style="color:var(--danger); margin-top:3px;"></i>
                            <div style="flex-grow:1;">
                                <div style="font-weight:600;">Olivia Davis scan requires your attention</div>
                                <div style="color:var(--text-muted); font-size:0.8rem;">Jaundice level has increased.</div>
                            </div>
                            <span style="color:var(--text-muted); font-size:0.75rem;">Yesterday</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- RIGHT COLUMN -->
            <div class="right-col">
                <div class="card fade-reveal">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                        <h3>Jaundice Trend Overview</h3>
                        <select style="border:none; color:var(--text-muted); background:transparent; font-size:0.8rem; cursor:pointer; outline:none;">
                            <option>Last 7 Days</option>
                        </select>
                    </div>
                    <div style="display:flex; gap:15px; margin-bottom:15px; font-size:0.75rem; color:var(--text-muted); justify-content:center;">
                        <span style="display:flex; align-items:center; gap:4px;"><span style="width:8px; height:8px; border-radius:50%; background:#10b981;"></span> Low</span>
                        <span style="display:flex; align-items:center; gap:4px;"><span style="width:8px; height:8px; border-radius:50%; background:#f59e0b;"></span> Medium</span>
                        <span style="display:flex; align-items:center; gap:4px;"><span style="width:8px; height:8px; border-radius:50%; background:#ef4444;"></span> High</span>
                    </div>
                    <div style="height: 250px; display:flex; align-items:center; justify-content:center; background:#f8fafc; border-radius:8px; border:1px dashed var(--border);">
                        <span style="color:var(--text-muted); font-size:0.85rem;">[Multi-line Chart Placeholder]</span>
                    </div>
                </div>

                <div class="card fade-reveal">
                    <h3>Quick Actions</h3>
                    <div class="quick-actions-grid" style="grid-template-columns: repeat(4, 1fr);">
                        <div class="quick-action-item">
                            <i class="fas fa-file-alt" style="background:#eff6ff; color:#3b82f6;"></i>
                            <span style="font-size:0.7rem;">All Reports</span>
                        </div>
                        <div class="quick-action-item">
                            <i class="fas fa-user-plus" style="background:#dcfce7; color:#10b981;"></i>
                            <span style="font-size:0.7rem;">Add Patient</span>
                        </div>
                        <div class="quick-action-item" onclick="openDoctorReminderModal()">
                            <i class="fas fa-bell" style="background:#fef3c7; color:#d97706;"></i>
                            <span style="font-size:0.7rem;">Reminder</span>
                        </div>
                        <div class="quick-action-item">
                            <i class="fas fa-comment-medical" style="background:#fce7f3; color:#db2777;"></i>
                            <span style="font-size:0.7rem;">Message</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<!-- Modal Overlay for Doctor Actions -->
<div class="modal-overlay" id="doctorModalOverlay">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="doctorModalTitle" style="font-size: 1.25rem;">Patient Configuration</h2>
            <button class="close-modal" onclick="document.getElementById('doctorModalOverlay').classList.remove('active')"><i class="fas fa-xmark"></i></button>
        </div>
        <div class="modal-body" id="doctorModalBody"></div>
    </div>
</div>

<script>
    function toggleSidebar() {{
        document.querySelector('.sidebar').classList.toggle('collapsed');
        if (window.innerWidth > 768) {{
            const main = document.querySelector('.main-content');
            if (document.querySelector('.sidebar').classList.contains('collapsed')) {{
                main.style.marginLeft = '0';
            }} else {{
                main.style.marginLeft = 'var(--sidebar-width)';
            }}
        }}
    }}

    function toggleTheme() {{
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        const icon = document.getElementById('theme-icon');
        icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    }}
    
    // Reveal animation
    document.addEventListener("DOMContentLoaded", () => {{
        setTimeout(() => {{
            document.querySelectorAll('.fade-reveal').forEach((el, index) => {{
                setTimeout(() => el.classList.add('active'), index * 100);
            }});
        }}, 100);
    }});
    
    // Doctor Reminder/Interval Control Modal
    function openDoctorReminderModal() {{
        const modal = document.getElementById('doctorModalOverlay');
        const body = document.getElementById('doctorModalBody');
        document.getElementById('doctorModalTitle').innerText = 'Set Patient Scan Interval';
        
        body.innerHTML = `
            <div class="input-group" style="margin-bottom:1rem;">
                <label>Select Patient</label>
                <select id="docPatientSelect">
                    <option>Emma Johnson</option>
                    <option>Noah Brown</option>
                </select>
            </div>
            <div class="input-group" style="margin-bottom:1rem;">
                <label>Scan Frequency (Hours)</label>
                <select id="docScanInterval">
                    <option value="2">Every 2 Hours (Critical)</option>
                    <option value="3">Every 3 Hours</option>
                    <option value="4" selected>Every 4 Hours (Default)</option>
                    <option value="6">Every 6 Hours</option>
                    <option value="8">Every 8 Hours</option>
                </select>
            </div>
            <div class="input-group" style="margin-bottom:1rem;">
                <label>Doctor's Message / Alert to Parent</label>
                <textarea id="docMessage" rows="3" placeholder="e.g. Please scan every 2 hours as bilirubin remains high."></textarea>
            </div>
            <div class="input-group" style="margin-bottom:1.5rem;">
                <label>Alert Level</label>
                <select id="docAlertLevel">
                    <option value="info">Info / Routine</option>
                    <option value="warning">Warning / Attention Needed</option>
                    <option value="danger">Danger / Immediate Consult</option>
                </select>
            </div>
            <div class="modal-actions">
                <button class="action-btn" onclick="saveDoctorSettings()">Send Update to Parent Dashboard</button>
            </div>
        `;
        
        modal.classList.add('active');
    }}
    
    function saveDoctorSettings() {{
        const interval = document.getElementById('docScanInterval').value;
        const msg = document.getElementById('docMessage').value;
        const level = document.getElementById('docAlertLevel').value;
        
        const payload = {{
            scan_interval_hours: interval,
            doctor_message: msg,
            alert_level: level
        }};
        
        fetch('/api/update_patient_settings/', {{
            method: 'POST',
            headers: {{
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }},
            body: JSON.stringify(payload)
        }}).then(res => res.json()).then(data => {{
            alert('Settings pushed to Parent Dashboard successfully!');
            document.getElementById('doctorModalOverlay').classList.remove('active');
        }}).catch(err => {{
            alert('Failed to save settings to server. Storing locally for demo.');
            localStorage.setItem('demo_doc_interval', interval);
            localStorage.setItem('demo_doc_msg', msg);
            localStorage.setItem('demo_doc_level', level);
            document.getElementById('doctorModalOverlay').classList.remove('active');
        }});
    }}
    
    function getCookie(name) {{
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {{
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {{
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {{
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }}
            }}
        }}
        return cookieValue;
    }}
</script>

</body>
</html>
"""

admin_html = doctor_html.replace('Doctor Dashboard', 'Admin Dashboard').replace('Dr. {{{{ request.user.username }}}}', 'Admin {{{{ request.user.username }}}}').replace('Pediatrician', 'Super Admin')
# I'll customize Admin HTML further down.
# Let's save doctor_dashboard.html
with open(r'D:\MINOR PROJECT G9\Final Evaulation\frontend\dashboard\doctor_dashboard.html', 'w', encoding='utf-8') as f:
    f.write(doctor_html)
