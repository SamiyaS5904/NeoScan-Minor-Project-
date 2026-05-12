import re

with open(r'D:\MINOR PROJECT G9\Final Evaulation\frontend\dashboard\dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the script block
script_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if script_match:
    js_code = script_match.group(1)
else:
    js_code = ''

new_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NeoScan AI - Premium Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
    :root {{
        --primary: #3b82f6;
        --primary-light: #eff6ff;
        --bg-body: #f8fafc;
        --bg-card: #ffffff;
        --text-main: #0f172a;
        --text-muted: #64748b;
        --border: #e2e8f0;
        --success: #10b981;
        --warning: #f59e0b;
        --danger: #ef4444;
        --sidebar-width: 240px;
        --transition: all .2s ease;
    }}

    [data-theme="dark"] {{
        --bg-body: #0f172a;
        --bg-card: #1e293b;
        --text-main: #f8fafc;
        --text-muted: #94a3b8;
        --border: #334155;
    }}

    * {{ margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }}

    body {{ background: var(--bg-body); color: var(--text-main); overflow-x: hidden; transition: var(--transition); font-size: 14px; line-height: 1.5; }}
    h1, h2, h3, .logo-text {{ font-family: 'Poppins', sans-serif; }}

    .wrapper {{ display: flex; min-height: 100vh; }}
    
    /* Sidebar */
    .sidebar {{
        width: var(--sidebar-width); background: var(--bg-card); border-right: 1px solid var(--border);
        padding: 1.5rem 1rem; display: flex; flex-direction: column; position: fixed; height: 100vh;
        z-index: 100; transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1); overflow-y: auto; overflow-x: hidden;
    }}
    .sidebar.collapsed {{ transform: translateX(-100%); position: absolute; height: 100%; z-index: 1000; }}
    .logo-container {{ display: flex; align-items: center; gap: 10px; margin-bottom: 2.5rem; color: var(--primary); padding-left: 8px; }}
    .logo-text {{ font-size: 1.2rem; font-weight: 700; color: var(--text-main); }}
    .logo-container i {{ color: var(--primary); font-size: 1.4rem; }}
    
    .nav-menu {{ list-style: none; flex-grow: 1; overflow-y: auto; }}
    .nav-item {{ margin-bottom: 0.2rem; }}
    .nav-link {{
        display: flex; align-items: center; gap: 12px; padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.9rem;
        color: var(--text-muted); text-decoration: none; transition: var(--transition); cursor: pointer; font-weight: 500;
    }}
    .nav-link:hover, .nav-link.active {{ background: var(--primary-light); color: var(--primary); }}
    .nav-link.logout {{ color: var(--danger); margin-top: auto; }}

    /* Main Content */
    .main-content {{ 
        flex-grow: 1; margin-left: var(--sidebar-width); padding: 1.5rem 2.5rem; 
        transition: margin-left 0.3s ease, width 0.3s ease; 
        max-width: 1500px; /* Constrain max width so it doesn't stretch huge on ultrawide */
        margin-right: auto;
    }}
    
    /* Top Header */
    .top-header {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }}
    .greeting-section h1 {{ font-size: clamp(1.4rem, 2.5vw, 1.8rem); font-weight: 600; line-height: 1.2; }}
    .greeting-section p {{ color: var(--text-muted); margin-top: 4px; font-size: 0.9rem; }}
    .header-actions {{ display: flex; align-items: center; gap: 1rem; }}
    
    .icon-btn {{
        border: none; background: var(--bg-card); width: 38px; height: 38px; border-radius: 50%;
        border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: var(--transition); color: var(--text-main); position: relative;
    }}
    .icon-btn:hover {{ background: var(--bg-body); transform: translateY(-2px); }}
    .icon-btn i {{ font-size: 0.95rem; }}
    .notification-dot {{ width: 6px; height: 6px; border-radius: 50%; background: var(--danger); position: absolute; top: 8px; right: 10px; display: none; }}
    
    .user-profile {{ display: flex; align-items: center; gap: 10px; padding-left: 1rem; border-left: 1px solid var(--border); cursor: pointer; }}
    .user-avatar {{ width: 38px; height: 38px; border-radius: 50%; object-fit: cover; }}

    /* Layout */
    .dashboard-layout {{ display: grid; grid-template-columns: 2fr 1fr; gap: 1.25rem; align-items: start; }}
    .left-col {{ display: flex; flex-direction: column; gap: 1.25rem; }}
    .right-col {{ display: flex; flex-direction: column; gap: 1.25rem; position: sticky; top: 1.5rem; }}

    .card {{ background: var(--bg-card); border-radius: 16px; padding: 1.25rem; border: 1px solid var(--border); box-shadow: 0 2px 10px rgba(0,0,0,0.02); position: relative; overflow: hidden; }}

    /* Typography */
    h3 {{ font-size: 1.05rem !important; font-weight: 600; margin-bottom: 0.8rem; line-height: 1.3; }}
    
    /* Baby Info */
    .baby-info-card {{ display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; gap: 1rem; }}
    .baby-avatar-container {{ display: flex; align-items: center; gap: 1rem; }}
    .baby-avatar {{ width: 44px; height: 44px; background: #e0f2fe; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }}
    .baby-details {{ display: flex; gap: 2.5rem; align-items: center; }}
    .baby-stat-group {{ display: flex; flex-direction: column; gap: 2px; }}
    .baby-stat-label {{ font-size: 0.8rem; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }}
    .baby-stat-value {{ font-size: 0.9rem; font-weight: 600; color: var(--text-main); }}

    /* Hero */
    .hero-card {{ display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 1rem; align-items: center; }}
    .hero-text h2 {{ font-size: clamp(1.2rem, 1.8vw, 1.5rem); font-weight: 600; margin-bottom: 6px; transition: var(--transition); line-height: 1.2; }}
    .hero-text p {{ color: var(--text-muted); font-size: 0.85rem; line-height: 1.4; margin-bottom: 1rem; }}
    .hero-labels {{ display: flex; gap: 8px; font-size: 0.75rem; color: var(--primary); font-weight: 500; margin-top: 0.5rem; flex-wrap: wrap; }}
    .hero-labels span {{ display: flex; align-items: center; gap: 3px; }}
    .hero-labels span::before {{ content: "•"; }}
    .hero-labels span:first-child::before {{ display: none; }}
    
    .action-btn {{ background: var(--primary); color: #fff; border: none; padding: 0.6rem 1rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: var(--transition); display: inline-flex; align-items: center; gap: 6px; justify-content:center; }}
    .action-btn:hover {{ background: #2563eb; transform: translateY(-2px); }}
    .secondary-btn {{ background: #f1f5f9; color: var(--text-main); border: 1px solid var(--border); }}
    .secondary-btn:hover {{ background: #e2e8f0; }}

    .risk-circle-container {{ display: flex; flex-direction: column; align-items: center; justify-content: center; }}
    .risk-circle {{ width: 110px; height: 110px; border-radius: 50%; border: 6px solid #dcfce7; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }}
    .risk-circle i {{ font-size: 1.2rem; color: #16a34a; margin-bottom: 2px; }}
    .risk-circle .label {{ font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }}
    .risk-circle .value {{ font-size: 1.6rem; font-weight: 700; color: #16a34a; line-height: 1; }}
    
    .hero-mini-cards {{ display: flex; flex-direction: column; gap: 0.75rem; }}
    .mini-card {{ background: var(--bg-body); border-radius: 12px; padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.75rem; border: 1px solid var(--border); }}
    .mini-card i {{ font-size: 1.1rem; }}
    .mini-card .content {{ display: flex; flex-direction: column; }}
    .mini-card .label {{ font-size: 0.75rem; color: var(--text-muted); }}
    .mini-card .value {{ font-size: 0.9rem; font-weight: 600; line-height: 1.2; }}

    /* Quick Actions */
    .quick-actions-grid {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-top: 0.75rem; transition: max-height 0.3s ease, opacity 0.3s ease; overflow: hidden; }}
    .quick-actions-grid.folded {{ max-height: 0; opacity: 0; margin-top: 0; }}
    .quick-action-item {{ display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 0.8rem; background: var(--bg-body); border-radius: 12px; border: 1px solid var(--border); cursor: pointer; transition: var(--transition); text-align: center; }}
    .quick-action-item:hover {{ background: var(--primary-light); transform: translateY(-2px); border-color: var(--primary); }}
    .quick-action-item i {{ font-size: 1.1rem; padding: 8px; border-radius: 50%; }}
    .quick-action-item span {{ font-size: 0.8rem; font-weight: 500; }}

    /* Upload */
    .upload-area {{ border: 1.5px dashed var(--border); border-radius: 16px; padding: 1.5rem; text-align: center; background: var(--bg-body); transition: var(--transition); cursor: pointer; margin-bottom: 1rem; }}
    .upload-area:hover {{ border-color: var(--primary); background: var(--primary-light); }}
    .upload-icon {{ font-size: 1.8rem; color: var(--primary); margin-bottom: 0.5rem; }}

    .preview-container {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.8rem; margin-top: 1rem; }}
    .preview-box {{ background: var(--bg-body); border-radius: 12px; border: 1px solid var(--border); padding: 0.8rem; text-align: center; }}
    .preview-box img {{ width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-top: .4rem; }}
    .placeholder-box {{ width: 100%; height: 100px; border-radius: 8px; background: linear-gradient(135deg,#f1f5f9,#e2e8f0); display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: .8rem; }}

    /* Result Section */
    .result-section {{ text-align: center; margin-top: 0.5rem; }}
    .result-value {{ font-size: 2.2rem; font-weight: 800; color: var(--primary); margin: 5px 0; line-height: 1.1; }}
    .high-risk-alert {{ background: #fee2e2; padding: 0.8rem; border-radius: 10px; border: 1px solid #ef4444; color: #ef4444; font-weight: 600; margin-bottom: 1rem; font-size: 0.85rem; display: none; line-height: 1.4; }}

    /* FAQs */
    .faq-container {{ display: flex; flex-direction: column; gap: 0.8rem; }}
    .faq-item {{ background: var(--bg-body); padding: 1rem; border-radius: 12px; border: 1px solid var(--border); }}
    .faq-item h4 {{ font-size: 0.85rem; margin-bottom: 4px; color: var(--primary); font-weight: 600; }}
    .faq-item p {{ color: var(--text-muted); font-size: 0.8rem; line-height: 1.4; }}

    /* Modals & Chatbot */
    .modal-overlay{{ position:fixed; inset:0; background:rgba(15,23,42,.4); backdrop-filter:blur(4px); z-index:9999; display:none; justify-content:center; align-items:center; padding:1rem; }}
    .modal-overlay.active{{ display:flex; animation:fade .2s ease; }}
    .modal-content{{ background:var(--bg-card); width:100%; max-width:500px; border-radius:20px; border:1px solid var(--border); max-height:90vh; overflow:hidden; animation:scaleIn .2s ease; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }}
    .modal-header{{ padding:1.2rem 1.5rem; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; }}
    .modal-body{{ padding:1.5rem; overflow-y:auto; max-height:75vh; }}
    .close-modal{{ background:none; border:none; font-size:1.2rem; cursor:pointer; color:var(--text-muted); }}

    .form-grid{{ display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1rem; }}
    .input-group{{ display:flex; flex-direction:column; gap:.4rem; }}
    .input-group label {{ font-size: 0.8rem; font-weight: 500; color: var(--text-muted); }}
    .input-group input, .input-group textarea, .input-group select {{ padding:.7rem 1rem; border-radius:10px; border:1px solid var(--border); background:var(--bg-body); color:var(--text-main); font-size: 0.9rem; outline:none; transition: var(--transition); }}
    .input-group input:focus, .input-group select:focus {{ border-color: var(--primary); }}
    .modal-actions{{ display:flex; justify-content:flex-end; gap:0.8rem; margin-top:1.5rem; }}

    /* Chatbot Styles adjustments for scaling */
    .chat-widget {{ width: 320px; bottom: 80px; }}
    .chat-header {{ padding: 12px 16px; font-size: 0.9rem; }}
    .chat-body {{ height: 300px; }}
    .chat-msg {{ font-size: 0.85rem; padding: 10px 14px; line-height: 1.4; }}
    
    .chat-toggle {{ width: 50px; height: 50px; font-size: 1.2rem; }}

    .fade-reveal {{ opacity: 0; transform: translateY(15px); transition: all 0.5s ease; }}
    .fade-reveal.active {{ opacity: 1; transform: translateY(0); }}
    
    @keyframes scaleIn{{ from{{ transform:scale(.95); opacity:0; }} to{{ transform:scale(1); opacity:1; }} }}
    @keyframes fade{{ from{{opacity:0;}} to{{opacity:1;}} }}
    
    .loading-line {{ width: 100%; height: 4px; border-radius: 10px; background: #e2e8f0; overflow: hidden; margin-top: 1rem; }}
    .loading-line span {{ display: block; width: 40%; height: 100%; background: var(--primary); animation: loading 1s infinite linear; border-radius: 10px; }}
    @keyframes loading {{ 0% {{ transform: translateX(-100%); }} 100% {{ transform: translateX(300%); }} }}

    .notification-panel {{ position: absolute; top: 50px; right: 0; width: 280px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 0.8rem; box-shadow: 0 10px 30px rgba(0,0,0,.08); display: none; z-index: 999; }}
    .notification-panel.active {{ display: block; animation: scaleIn .2s ease; }}
    .notification-item {{ display: flex; gap: 10px; padding: 0.8rem 0; border-bottom: 1px solid var(--border); font-size: 0.85rem; }}
    .notification-item:last-child {{ border-bottom: none; }}

    @media(max-width: 1200px) {{
        .dashboard-layout {{ grid-template-columns: 1fr; }}
        .hero-card {{ grid-template-columns: 1fr 1fr; }}
        .right-col {{ position: static; }}
    }}
    @media(max-width: 768px) {{
        .hero-card {{ grid-template-columns: 1fr; text-align: center; }}
        .hero-labels {{ justify-content: center; }}
        .baby-info-card {{ flex-wrap: wrap; gap: 1rem; }}
        .baby-details {{ gap: 1rem; flex-wrap: wrap; }}
        .main-content {{ padding: 1.5rem; }}
    }}
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
            <li class="nav-item"><a class="nav-link" onclick="document.getElementById('fileInput').click()"><i class="fas fa-camera"></i><span>New Scan</span></a></li>
            <li class="nav-item"><a class="nav-link" onclick="openReports()"><i class="fas fa-file-medical-alt"></i><span>Reports</span></a></li>
            <li class="nav-item"><a class="nav-link" onclick="window.scrollTo(0, document.body.scrollHeight)"><i class="fas fa-chart-line"></i><span>Trend Graph</span></a></li>
            <li class="nav-item" id="nav-doctor" style="display:none;"><a class="nav-link" onclick="openDoctorPanel()"><i class="fas fa-stethoscope"></i><span>Doctor Monitoring</span></a></li>
            <li class="nav-item"><a class="nav-link" onclick="alert('Reminders active')"><i class="fas fa-bell"></i><span>Reminders</span></a></li>
            <li class="nav-item"><a class="nav-link" onclick="toggleChat()"><i class="fas fa-robot"></i><span>AI Chatbot</span></a></li>
            <li class="nav-item"><a class="nav-link" onclick="openSettingsModal()"><i class="fas fa-cog"></i><span>Settings</span></a></li>
            <li class="nav-item" id="nav-admin" style="display:none;"><a class="nav-link" onclick="openAdminPanel()"><i class="fas fa-shield-alt"></i><span>Admin Panel</span></a></li>
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
                    <h1>Good Morning, {{{{ request.user.username }}}} 👋</h1>
                    <p>Here's your baby's health overview</p>
                </div>
            </div>
            
            <div class="header-actions">
                <button class="icon-btn" onclick="toggleTheme()"><i class="fas fa-moon" id="theme-icon"></i></button>
                
                <div style="position:relative;">
                    <button class="icon-btn" onclick="toggleNotifications()">
                        <i class="fas fa-bell"></i>
                        <span class="notification-dot"></span>
                    </button>
                    <div class="notification-panel" id="notificationPanel"></div>
                </div>
                
                <div class="user-profile">
                    <div style="text-align:right;">
                        <div style="font-weight:600; font-size:0.85rem;" id="profileName">{{{{ request.user.username }}}}</div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">Parent</div>
                    </div>
                    <img src="https://i.pravatar.cc/150?img=5" class="user-avatar" id="profileImage">
                    <i class="fas fa-chevron-down" style="font-size:0.75rem; color:var(--text-muted); margin-left:4px;"></i>
                </div>
            </div>
        </header>

        <!-- Hidden elements to preserve JS compatibility -->
        <div style="display:none;">
            <div id="totalScans">0</div>
            <div id="positiveCases">0</div>
            <div id="todayScans">0</div>
            <div id="gaugeNeedle"></div>
            <button id="calibrationBtn"></button>
            <div id="historyContainer"></div>
        </div>

        <div class="dashboard-layout">
            <!-- LEFT COLUMN -->
            <div class="left-col">
                <!-- Baby Info Card -->
                <div class="card baby-info-card fade-reveal">
                    <div class="baby-avatar-container">
                        <div class="baby-avatar">👶</div>
                        <div class="baby-stat-group">
                            <span class="baby-stat-value" id="displayBabyName" style="font-size:1rem; font-family:'Poppins', sans-serif;">Emma</span>
                            <span class="baby-stat-label">Patient</span>
                        </div>
                    </div>
                    <div class="baby-details">
                        <div class="baby-stat-group">
                            <span class="baby-stat-label">Age</span>
                            <span class="baby-stat-value"><span id="displayBabyAge">6</span> days</span>
                        </div>
                        <div class="baby-stat-group">
                            <span class="baby-stat-label">Gestational Info</span>
                            <span class="baby-stat-value" id="displayBabyGest">39 Wks | Female</span>
                        </div>
                        <div class="baby-stat-group">
                            <button class="secondary-btn" style="padding:6px 12px; border-radius:8px; font-size:0.75rem; border:1px solid var(--border); background:var(--bg-body); cursor:pointer;" onclick="openBabyModal(false)">Edit Details</button>
                        </div>
                    </div>
                </div>

                <!-- Main Hero Card -->
                <div class="card hero-card fade-reveal">
                    <div class="hero-text">
                        <h2 id="heroGreetingText">Emma is doing great! 💙</h2>
                        <p>Your baby's jaundice risk is low.<br>Keep monitoring regularly.</p>
                        <button class="action-btn" onclick="document.getElementById('fileInput').click()">Start New Scan</button>
                        <div class="hero-labels">
                            <span>Safe</span><span>Non-invasive</span><span>AI Assisted</span>
                        </div>
                    </div>
                    
                    <div class="risk-circle-container">
                        <div class="risk-circle">
                            <i class="fas fa-baby"></i>
                            <div class="label">Current Risk</div>
                            <div class="value" id="heroRiskLevel">LOW</div>
                        </div>
                    </div>
                    
                    <div class="hero-mini-cards">
                        <div class="mini-card">
                            <i class="fas fa-clock" style="color:var(--primary); background:var(--primary-light); padding:8px; border-radius:50%;"></i>
                            <div class="content">
                                <span class="label">Next Scan In</span>
                                <span class="value">4 Hours</span>
                            </div>
                        </div>
                        <div class="mini-card">
                            <i class="fas fa-chart-line" style="color:var(--success); background:#dcfce7; padding:8px; border-radius:50%;"></i>
                            <div class="content">
                                <span class="label">Health Trend</span>
                                <span class="value">Improving</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Upload Section -->
                <div class="card fade-reveal">
                    <h3 style="margin-bottom:1rem;">Upload Baby Skin Image</h3>
                    
                    <div class="upload-area" id="drop-zone" onclick="document.getElementById('fileInput').click()">
                        <i class="fas fa-camera upload-icon"></i>
                        <h4 style="margin-bottom:6px; font-size:0.95rem;">Capture or Upload Image</h4>
                        <p style="color:var(--text-muted); font-size:0.8rem;">Take a clear image of your baby's skin under natural light.</p>
                        <div class="hero-labels" style="justify-content:center; margin-top:0.8rem;">
                            <span>Safe</span><span>Non-invasive</span><span>AI Assisted</span>
                        </div>
                    </div>
                    
                    <input type="file" id="fileInput" accept="image/*" hidden>
                    
                    <div id="processingSection" style="display:none; margin-top:1.5rem;">
                        <h4 style="text-align:center; font-size: 0.9rem;">Analyzing Skin...</h4>
                        <div class="loading-line"><span></span></div>
                    </div>
                    
                    <div class="preview-container">
                        <div class="preview-box">
                            <div style="font-size:0.8rem; margin-bottom:6px; color:var(--text-muted);">Original</div>
                            <div class="placeholder-box" id="originalPlaceholder">Waiting...</div>
                            <img id="uploadedPreview" style="display:none;">
                        </div>
                        <div class="preview-box">
                            <div style="font-size:0.8rem; margin-bottom:6px; color:var(--text-muted);">Skin ROI</div>
                            <div class="placeholder-box" id="roiPreviewPlaceholder">Waiting...</div>
                            <img id="roiPreviewImg" style="display:none;">
                        </div>
                        <div class="preview-box">
                            <div style="font-size:0.8rem; margin-bottom:6px; color:var(--text-muted);">AI Detection</div>
                            <div class="placeholder-box" id="roiOverlayPlaceholder">Waiting...</div>
                            <img id="roiOverlayImg" style="display:none;">
                        </div>
                    </div>
                </div>

                <!-- Trend Graph -->
                <div class="card fade-reveal">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                        <h3>Jaundice Trend <i class="fas fa-info-circle" style="color:var(--text-muted); font-size:0.85rem;"></i></h3>
                        <select style="border:none; color:var(--text-muted); background:transparent; font-weight:500; font-size:0.85rem; outline:none; cursor:pointer;">
                            <option>Last 7 Days</option>
                        </select>
                    </div>
                    <div style="height: 200px;">
                        <canvas id="weeklyChart"></canvas>
                    </div>
                </div>

                <!-- FAQs and Tips -->
                <div class="card fade-reveal" style="margin-bottom: 1.5rem;">
                    <h3 style="margin-bottom:1rem;">Daily Child Care & FAQs</h3>
                    <div class="faq-container">
                        <div class="faq-item">
                            <h4>1. How often should I scan?</h4>
                            <p>It is recommended to scan twice a day during the first week, preferably under consistent lighting.</p>
                        </div>
                        <div class="faq-item">
                            <h4>2. Ensure proper lighting</h4>
                            <p>Always use natural daylight or pure white light when capturing the baby's skin. Avoid direct sunlight or yellow bulbs.</p>
                        </div>
                        <div class="faq-item">
                            <h4>3. When to consult a pediatrician?</h4>
                            <p>If the AI flags the risk level as High, or if you observe yellowing spreading to the whites of the baby's eyes, consult your doctor immediately.</p>
                        </div>
                        <div class="faq-item">
                            <h4>4. What is a normal bilirubin level?</h4>
                            <p>Safe levels depend on the baby's age in hours. NeoScan calculates this automatically using the Bhutani nomogram.</p>
                        </div>
                    </div>
                </div>

            </div>
            
            <!-- RIGHT COLUMN -->
            <div class="right-col">
                <!-- Quick Actions (Foldable) -->
                <div class="card fade-reveal">
                    <div style="display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="document.getElementById('qa-grid').classList.toggle('folded'); this.querySelector('i').classList.toggle('fa-chevron-up'); this.querySelector('i').classList.toggle('fa-chevron-down');">
                        <h3>Quick Actions</h3>
                        <i class="fas fa-chevron-up" style="color:var(--text-muted); font-size: 0.9rem;"></i>
                    </div>
                    <div class="quick-actions-grid" id="qa-grid">
                        <div class="quick-action-item" onclick="document.getElementById('fileInput').click()">
                            <i class="fas fa-camera" style="background:#eff6ff; color:#3b82f6;"></i>
                            <span>New Scan</span>
                        </div>
                        <div class="quick-action-item" onclick="openReports()">
                            <i class="fas fa-file-alt" style="background:#f8fafc; color:#64748b;"></i>
                            <span>View Reports</span>
                        </div>
                        <div class="quick-action-item" onclick="window.scrollTo(0, document.body.scrollHeight)">
                            <i class="fas fa-chart-line" style="background:#eef2ff; color:#6366f1;"></i>
                            <span>Trend Graph</span>
                        </div>
                        <div class="quick-action-item" onclick="toggleChat()">
                            <i class="fas fa-robot" style="background:#f0fdf4; color:#22c55e;"></i>
                            <span>NeoBot</span>
                        </div>
                        <div class="quick-action-item" onclick="alert('Reminders feature coming soon')">
                            <i class="fas fa-bell" style="background:#fef3c7; color:#d97706;"></i>
                            <span>Reminders</span>
                        </div>
                        <div class="quick-action-item" onclick="openDoctorPanel()">
                            <i class="fas fa-stethoscope" style="background:#fce7f3; color:#db2777;"></i>
                            <span>Doctor Review</span>
                        </div>
                    </div>
                </div>

                <!-- NeoBot Snippet Card -->
                <div class="card fade-reveal" style="background: linear-gradient(135deg, #eff6ff, #ffffff); border: 1px solid #bfdbfe;">
                    <div style="display:flex; gap:0.8rem; align-items:flex-start;">
                        <div style="background:#3b82f6; color:#ffffff; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:1rem; box-shadow: 0 4px 10px rgba(59,130,246,0.25);">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div>
                            <div style="font-weight:700; margin-bottom:4px; font-size:0.95rem; color:#1e3a8a;">NeoBot Assistant</div>
                            <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.4;">Hi 👋 I can help you understand the jaundice results today. Ask me anything.</p>
                            <button onclick="toggleChat()" style="background:#3b82f6; color:#fff; border:none; padding:6px 12px; border-radius:8px; font-weight:600; font-size:0.8rem; margin-top:8px; cursor:pointer; box-shadow: 0 2px 6px rgba(59,130,246,0.15);">Chat with NeoBot &rarr;</button>
                        </div>
                    </div>
                </div>

                <!-- AI Analysis Result Card -->
                <div class="card fade-reveal" id="resultCard">
                    <h3 style="margin-bottom:0.5rem;">AI Analysis Result</h3>
                    
                    <div class="result-section">
                        <div class="result-value" id="bilirubinValue">--</div>
                        <p style="color:var(--text-muted); font-size:0.8rem;">Predicted Bilirubin Level</p>
                        
                        <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-top:1rem; padding:6px 12px; background:#f8fafc; border:1px solid var(--border); border-radius:20px; display:inline-flex;" id="riskBadge">
                            <i class="fas fa-clock" id="riskIcon" style="font-size: 0.85rem;"></i>
                            <span id="riskText" style="font-weight:600; font-size:0.85rem;">Awaiting scan</span>
                        </div>
                        
                        <div style="background:var(--bg-body); padding:0.8rem; border-radius:12px; margin-top:1.25rem; border:1px solid var(--border);">
                            <div style="font-weight:600; margin-bottom:6px; font-size:0.85rem; display:flex; align-items:center; justify-content:center; gap:6px;">
                                <i class="fas fa-user-md" style="color:var(--primary);"></i> Clinical Recommendation
                            </div>
                            <p style="font-size:0.8rem; color:var(--text-muted); margin:0; line-height:1.4;" id="recommendationText">Submit an image to receive clinical insights.</p>
                        </div>
                        
                        <div id="highRiskAlert" class="high-risk-alert" style="margin-top:1rem;">
                            <i class="fas fa-exclamation-triangle"></i> HIGH RISK DETECTED<br>
                            <span style="font-size:0.8rem; font-weight:400;">Immediate pediatric review recommended.</span>
                        </div>
                        
                        <button class="action-btn" id="downloadReportBtn" style="width:100%; justify-content:center; margin-top:1.25rem; display:none;" onclick="downloadPDFReport()">
                            <i class="fas fa-file-pdf"></i> Download PDF Report
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    </main>
</div>

<!-- Modal Overlay -->
<div class="modal-overlay" id="modalOverlay">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modalTitle" style="font-size: 1.25rem;">Modal</h2>
            <button class="close-modal" onclick="closeModal()"><i class="fas fa-xmark"></i></button>
        </div>
        <div class="modal-body" id="modalBody"></div>
    </div>
</div>

<!-- Chatbot -->
<div class="chat-toggle" onclick="toggleChat()"><i class="fas fa-comment-medical"></i></div>
<div class="chat-widget" id="chatWidget">
    <div class="chat-header">
        <span><i class="fas fa-robot"></i> NeoBot Assistant</span>
        <i class="fas fa-times" onclick="toggleChat()"></i>
    </div>
    <div class="chat-body" id="chatBody">
        <div class="chat-msg bot">Hello! I am NeoBot, your medical AI assistant. How can I help you today?</div>
    </div>
    <div class="chat-input-area">
        <input type="text" id="chatInput" placeholder="Ask about jaundice..." onkeypress="handleChatEnter(event)">
        <button onclick="sendChatMessage()"><i class="fas fa-paper-plane"></i></button>
    </div>
</div>

<script>
{js_code}
</script>

</body>
</html>
"""

with open(r'D:\MINOR PROJECT G9\Final Evaulation\frontend\dashboard\dashboard.html', 'w', encoding='utf-8') as f:
    f.write(new_html)
