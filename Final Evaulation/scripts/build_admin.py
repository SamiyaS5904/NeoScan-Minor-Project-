import re
import os

with open(r'D:\MINOR PROJECT G9\Final Evaulation\frontend\dashboard\dashboard.html', 'r', encoding='utf-8') as f:
    dashboard_html = f.read()

style_match = re.search(r'<style>(.*?)</style>', dashboard_html, re.DOTALL)
css_styles = style_match.group(1) if style_match else ""

admin_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NeoScan AI - Admin Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
{css_styles}
    /* Admin Specific Styles */
    .admin-stats {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }}
    .stat-card {{ display: flex; align-items: center; gap: 1rem; padding: 1.25rem; }}
    .stat-icon {{ width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }}
    
    .list-item {{ display: flex; justify-content: space-between; align-items: center; padding: 0.8rem 0; border-bottom: 1px solid var(--border); font-size: 0.85rem; }}
    .list-item:last-child {{ border-bottom: none; }}
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
            <li class="nav-item"><a class="nav-link"><i class="fas fa-users"></i><span>Users</span></a></li>
            <li class="nav-item"><a class="nav-link"><i class="fas fa-user-md"></i><span>Doctors</span></a></li>
            <li class="nav-item"><a class="nav-link"><i class="fas fa-file-medical-alt"></i><span>Scans</span></a></li>
            <li class="nav-item"><a class="nav-link"><i class="fas fa-chart-pie"></i><span>Reports</span></a></li>
            <li class="nav-item"><a class="nav-link"><i class="fas fa-server"></i><span>System Logs</span></a></li>
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
                    <h1>Welcome back, Admin 👋</h1>
                    <p>System overview and management</p>
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
                        <div style="font-weight:600; font-size:0.85rem;">Admin User</div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">Super Admin</div>
                    </div>
                    <div style="width: 38px; height: 38px; border-radius: 50%; background: var(--primary); color: white; display:flex; align-items:center; justify-content:center; font-weight:bold;">A</div>
                </div>
            </div>
        </header>

        <!-- Stats -->
        <div class="admin-stats">
            <div class="card stat-card fade-reveal">
                <div class="stat-icon" style="background:#eff6ff; color:#3b82f6;"><i class="fas fa-users"></i></div>
                <div>
                    <div style="color:var(--text-muted); font-size:0.8rem;">Total Users</div>
                    <div style="font-size:1.5rem; font-weight:700;">256</div>
                    <div style="color:var(--success); font-size:0.75rem;">+12 this week</div>
                </div>
            </div>
            <div class="card stat-card fade-reveal">
                <div class="stat-icon" style="background:#f8fafc; color:#64748b;"><i class="fas fa-user-md"></i></div>
                <div>
                    <div style="color:var(--text-muted); font-size:0.8rem;">Total Doctors</div>
                    <div style="font-size:1.5rem; font-weight:700;">28</div>
                    <div style="color:var(--success); font-size:0.75rem;">+2 this week</div>
                </div>
            </div>
            <div class="card stat-card fade-reveal">
                <div class="stat-icon" style="background:#eff6ff; color:#3b82f6;"><i class="fas fa-file-medical-alt"></i></div>
                <div>
                    <div style="color:var(--text-muted); font-size:0.8rem;">Total Scans</div>
                    <div style="font-size:1.5rem; font-weight:700;">1,482</div>
                    <div style="color:var(--success); font-size:0.75rem;">+56 this week</div>
                </div>
            </div>
            <div class="card stat-card fade-reveal">
                <div class="stat-icon" style="background:#fee2e2; color:#ef4444;"><i class="fas fa-bell"></i></div>
                <div>
                    <div style="color:var(--text-muted); font-size:0.8rem;">Positive Cases</div>
                    <div style="font-size:1.5rem; font-weight:700;">142</div>
                    <div style="color:var(--danger); font-size:0.75rem;">+9 this week</div>
                </div>
            </div>
        </div>

        <div class="dashboard-layout">
            <!-- LEFT COLUMN -->
            <div class="left-col">
                <div class="card fade-reveal">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                        <h3>System Overview</h3>
                        <select style="border:none; color:var(--text-muted); background:transparent; font-size:0.8rem; cursor:pointer; outline:none;">
                            <option>Last 7 Days</option>
                        </select>
                    </div>
                    <div style="height: 250px; display:flex; align-items:center; justify-content:center; background:#f8fafc; border-radius:8px; border:1px dashed var(--border);">
                        <span style="color:var(--text-muted); font-size:0.85rem;">[Area Chart Placeholder]</span>
                    </div>
                </div>

                <div class="card fade-reveal">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                        <h3>Recent Activities</h3>
                        <a href="#" style="font-size:0.8rem; color:var(--primary); text-decoration:none;">View All</a>
                    </div>
                    <div>
                        <div class="list-item">
                            <span><i class="fas fa-user-plus" style="color:var(--primary); margin-right:8px;"></i> New user registered: Sarah Johnson</span>
                            <span style="color:var(--text-muted); font-size:0.75rem;">2 hours ago</span>
                        </div>
                        <div class="list-item">
                            <span><i class="fas fa-file-upload" style="color:var(--success); margin-right:8px;"></i> New scan uploaded by Dr. Sarah</span>
                            <span style="color:var(--text-muted); font-size:0.75rem;">3 hours ago</span>
                        </div>
                        <div class="list-item">
                            <span><i class="fas fa-check-circle" style="color:var(--text-muted); margin-right:8px;"></i> System backup completed</span>
                            <span style="color:var(--text-muted); font-size:0.75rem;">6 hours ago</span>
                        </div>
                        <div class="list-item">
                            <span><i class="fas fa-user-md" style="color:var(--primary); margin-right:8px;"></i> New doctor added: Dr. Michael Brown</span>
                            <span style="color:var(--text-muted); font-size:0.75rem;">Yesterday</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- RIGHT COLUMN -->
            <div class="right-col">
                <div class="card fade-reveal">
                    <h3 style="margin-bottom:1rem;">Scan Distribution</h3>
                    <div style="height: 200px; display:flex; align-items:center; justify-content:center; background:#f8fafc; border-radius:8px; border:1px dashed var(--border);">
                        <div style="text-align:center;">
                            <div style="width: 120px; height: 120px; border-radius: 50%; border: 15px solid #10b981; border-top-color: #f59e0b; border-right-color: #ef4444; margin:0 auto; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:1.2rem;">
                                1,482
                            </div>
                            <span style="color:var(--text-muted); font-size:0.75rem; display:block; margin-top:8px;">Total Scans</span>
                        </div>
                    </div>
                </div>

                <div class="card fade-reveal">
                    <h3>System Status</h3>
                    <div style="margin-top: 1rem;">
                        <div class="list-item">
                            <span><i class="fas fa-brain" style="color:var(--text-muted); margin-right:8px;"></i> AI Model Status</span>
                            <span style="color:var(--success); font-size:0.75rem; background:#dcfce7; padding:4px 8px; border-radius:12px; font-weight:600;">Active</span>
                        </div>
                        <div class="list-item">
                            <span><i class="fas fa-database" style="color:var(--text-muted); margin-right:8px;"></i> Database</span>
                            <span style="color:var(--success); font-size:0.75rem; background:#dcfce7; padding:4px 8px; border-radius:12px; font-weight:600;">Healthy</span>
                        </div>
                        <div class="list-item">
                            <span><i class="fas fa-server" style="color:var(--text-muted); margin-right:8px;"></i> Server Status</span>
                            <span style="color:var(--success); font-size:0.75rem; background:#dcfce7; padding:4px 8px; border-radius:12px; font-weight:600;">Online</span>
                        </div>
                        <div class="list-item">
                            <span><i class="fas fa-clock" style="color:var(--text-muted); margin-right:8px;"></i> Last Backup</span>
                            <span style="color:var(--success); font-size:0.75rem; background:#dcfce7; padding:4px 8px; border-radius:12px; font-weight:600;">Today, 02:00 AM</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
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
</script>

</body>
</html>
"""

with open(r'D:\MINOR PROJECT G9\Final Evaulation\frontend\dashboard\admin_dashboard.html', 'w', encoding='utf-8') as f:
    f.write(admin_html)
