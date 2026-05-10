import re

with open(r'D:\MINOR PROJECT G9\Final Evaulation\frontend\dashboard\dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Upload Area UI
old_upload_area = '<div class="upload-area" id="drop-zone" onclick="document.getElementById(\'fileInput\').click()">'
new_upload_area = '<div class="upload-area" id="drop-zone">'
content = content.replace(old_upload_area, new_upload_area)

old_file_input = '<input type="file" id="fileInput" accept="image/*" hidden>'
new_file_input = """<input type="file" id="fileInput" accept="image/*" hidden>
                    <div style="display:flex; gap:10px; justify-content:center; margin-top:10px;">
                        <button class="action-btn" onclick="document.getElementById('fileInput').click()" style="flex:1;"><i class="fas fa-upload"></i> Upload</button>
                        <button class="action-btn" style="background:#10b981; flex:1;" onclick="openCamera()"><i class="fas fa-camera"></i> Camera</button>
                    </div>"""
content = content.replace(old_file_input, new_file_input)

# 2. Add Camera Modal
camera_modal = """
<!-- Camera Modal -->
<div class="modal-overlay" id="cameraModalOverlay">
    <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
            <h2 style="font-size: 1.25rem;">Capture Photo</h2>
            <button class="close-modal" onclick="closeCamera()"><i class="fas fa-xmark"></i></button>
        </div>
        <div class="modal-body" style="text-align: center;">
            <video id="cameraVideo" autoplay playsinline style="width: 100%; max-height: 400px; background: #000; border-radius: 12px;"></video>
            <canvas id="cameraCanvas" style="display:none;"></canvas>
            <div class="modal-actions" style="justify-content: center; margin-top: 1.5rem;">
                <button class="action-btn" onclick="capturePhoto()" style="background: #10b981; width: 60px; height: 60px; border-radius: 50%;"><i class="fas fa-camera" style="font-size: 1.5rem;"></i></button>
            </div>
        </div>
    </div>
</div>
"""
content = content.replace('<!-- Modal Overlay -->', camera_modal + '\n<!-- Modal Overlay -->')

# 3. Replace JS logic for file input and add camera logic
# I will use a reliable string split to replace the file input listener since it's a big block.
split_start = 'document.getElementById("fileInput").addEventListener("change",function(e){'
split_end = 'function addNotification(title, msg, type) {'

if split_start in content and split_end in content:
    pre = content.split(split_start)[0]
    post = content.split(split_end)[1]
    
    js_camera = """
// Camera Logic
let videoStream;
function openCamera() {
    const video = document.getElementById('cameraVideo');
    document.getElementById('cameraModalOverlay').classList.add('active');
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(function(stream) {
            videoStream = stream;
            video.srcObject = stream;
        })
        .catch(function(err) {
            alert("Camera access denied or not available. Please use the upload button.");
            closeCamera();
        });
    } else {
        alert("Camera API not supported in this browser.");
        closeCamera();
    }
}

function closeCamera() {
    document.getElementById('cameraModalOverlay').classList.remove('active');
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
}

function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('cameraCanvas');
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    closeCamera();
    
    canvas.toBlob(function(blob) {
        const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
        processImageFile(file); // Call the shared processing function
    }, 'image/jpeg');
}

// Shared processing logic
function processImageFile(file) {
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(event){
        document.getElementById("uploadedPreview").src = event.target.result;
        document.getElementById("uploadedPreview").style.display = "block";
        document.getElementById("originalPlaceholder").style.display = "none";
        document.getElementById("processingSection").style.display = "block";
        
        const formData = new FormData();
        formData.append('image', file);
        
        const ageDays = sessionStorage.getItem('babyAge') || 2;
        const gestAge = sessionStorage.getItem('babyGest') || 39;
        
        formData.append('age_days', ageDays); 
        formData.append('gestational_age', gestAge);
        
        fetch('/api/predict/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("processingSection").style.display = "none";
            if(data.status === "success") {
                document.getElementById("bilirubinValue").innerText = data.predicted_bilirubin + " mg/dL";
                document.getElementById("recommendationText").innerText = data.recommendation;
                const riskBadge = document.getElementById("riskBadge");
                const riskIcon = document.getElementById("riskIcon");
                document.getElementById("highRiskAlert").style.display = "none";
                document.getElementById("downloadReportBtn").style.display = "flex";
                
                if (data.risk_zone === "Low Risk") {
                    riskBadge.style.background = "#dcfce7";
                    riskBadge.style.color = "#16a34a";
                    riskIcon.className = "fas fa-check-circle";
                } else if (data.risk_zone === "Intermediate Risk") {
                    riskBadge.style.background = "#fef08a";
                    riskBadge.style.color = "#ca8a04";
                    riskIcon.className = "fas fa-exclamation-triangle";
                } else {
                    riskBadge.style.background = "#fee2e2";
                    riskBadge.style.color = "#ef4444";
                    riskIcon.className = "fas fa-exclamation-circle";
                    document.getElementById("highRiskAlert").style.display = "block";
                }
                document.getElementById("riskText").innerText = data.risk_zone;
                window.latestReportData = data;
                
                if (data.roi_image) {
                    document.getElementById("roiPreviewImg").src = "data:image/jpeg;base64," + data.roi_image;
                    document.getElementById("roiPreviewImg").style.display = "block";
                    document.getElementById("roiPreviewPlaceholder").style.display = "none";
                }
                if (data.roi_overlay) {
                    document.getElementById("roiOverlayImg").src = "data:image/jpeg;base64," + data.roi_overlay;
                    document.getElementById("roiOverlayImg").style.display = "block";
                    document.getElementById("roiOverlayPlaceholder").style.display = "none";
                }
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => {
            document.getElementById("processingSection").style.display = "none";
            alert("API Error: Make sure the Django server is running.");
        });
    };
    reader.readAsDataURL(file);
}

document.getElementById("fileInput").addEventListener("change", function(e) {
    const file = e.target.files[0];
    processImageFile(file);
});

function addNotification(title, msg, type) {
"""
    content = pre + js_camera + post
    
with open(r'D:\MINOR PROJECT G9\Final Evaulation\frontend\dashboard\dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)
