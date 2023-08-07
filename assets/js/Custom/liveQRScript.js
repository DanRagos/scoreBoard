var localStream, videoActive = false;

$('.qr-other, #schedQR-btn-secured').on('click', function() {
    $('#page-content').hide();
    $('#qr-content').show();
    $('#open-sidebar').hide();
    $('#qr-back-btn').show();
    scanLiveQR();
});

const switchCameraBtn = $('#switch-camera-btn');

switchCameraBtn.on('click', () => {
    toggleCameraModal();
});

/* Handle back to regular page */
$('#qr-back-btn').off().on('click', function () {
    if (videoActive) {
        localStream.getTracks().forEach( (track) => {
            track.stop();
            videoActive = false;
        });
    }
    $('#qr-content').hide();
    $('#page-content').show();
    $('#open-sidebar').show();
    $('#qr-back-btn').hide();

    switchCameraBtn.hide();
});

$('#open-sidebar').on('click', function() {
    if (videoActive) {
        localStream.getTracks().forEach( (track) => {
            track.stop();
            videoActive = false;
            $('#qr-content').hide();
            $('#page-content').show();
        });
    }
});


let videoDevices = [];
let currentCameraDevice = '';

const switchCamera = (cameraId) => {

    currentCameraDevice = cameraId;

    function destroyQR() {
        localStream.getTracks().forEach( (track) => {
            track.stop();
            videoActive = false;
            // $('#qr-content').hide();
            // $('#page-content').show();
            // $('#open-sidebar').show();
            // $('#qr-back-btn').hide();
        });
    }

    destroyQR();

    var video = document.createElement("video");
    var canvasElement = document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");
    var loadingMessage = document.getElementById("loadingMessage");
    var outputContainer = document.getElementById("output");
    var outputMessage = document.getElementById("outputMessage");
    var outputData = document.getElementById("outputData");

    function drawLine(begin, end, color) {
        canvas.beginPath();
        canvas.moveTo(begin.x, begin.y);
        canvas.lineTo(end.x, end.y);
        canvas.lineWidth = 4;
        canvas.strokeStyle = color;
        canvas.stroke();
    }
    
    var qrScanned = false;
    function tick() {
        loadingMessage.innerText = "⌛ Loading video..."
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            loadingMessage.hidden = true;
            canvasElement.hidden = false;
            outputContainer.hidden = false;

            canvasElement.height = video.videoWidth + (video.videoWidth * 0.1); //video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            var code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code && qrScanned == false) {
                qrScanned = true;
                drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
                drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
                drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
                drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
                outputMessage.hidden = true;
                outputData.parentElement.hidden = false;
                outputData.innerText = code.data;

                setTimeout(function() {
                    destroyQR();
                    console.log('switchCamera ', code.data);
                    handleQRInputs(code.data);
                }, 1000);
            } else {
                outputMessage.hidden = false;
                outputData.parentElement.hidden = true;
            }
        }
        if (videoActive) {
            requestAnimationFrame(tick);
        }
    }

    navigator.mediaDevices.getUserMedia({ video: { deviceId: {exact: cameraId} } }).then(function(stream) {
        localStream = stream;
        videoActive = true;
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.play();
        requestAnimationFrame(tick);
    });
};

const toggleCameraModal = () => {
    const cameraModal = $('#cameraModal');
    if (cameraModal.hasClass('show')) {
        cameraModal.modal('hide');
    } else {
        cameraModal.modal('show');
    }
};

const cameraSaveBtn = $('#camera-save-btn');
cameraSaveBtn.on('click', () => {
    const cameraElem = $('#cameraSel');
    const selectedCamera = cameraElem.val();
    console.log(`selectedCamera: ${selectedCamera}`);
    console.log(`currentCameraDevice: ${currentCameraDevice}`);
    if (currentCameraDevice !== selectedCamera) {
        switchCamera(cameraElem.val());
    }
    toggleCameraModal();
});

function scanLiveQR() {

    videoDevices = [];
    
    const cameraSel = $('#cameraSel');
    cameraSel.empty();

    var video = document.createElement("video");
    var canvasElement = document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");
    var loadingMessage = document.getElementById("loadingMessage");
    var outputContainer = document.getElementById("output");
    var outputMessage = document.getElementById("outputMessage");
    var outputData = document.getElementById("outputData");

    function drawLine(begin, end, color) {
        canvas.beginPath();
        canvas.moveTo(begin.x, begin.y);
        canvas.lineTo(end.x, end.y);
        canvas.lineWidth = 4;
        canvas.strokeStyle = color;
        canvas.stroke();
    }

    if (isMobile()) {
        switchCameraBtn.hide();
        // Use facingMode: environment to attemt to get the front camera on phones
        navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } }).then(function(stream) {
            localStream = stream;
            videoActive = true;
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
            video.play();
            requestAnimationFrame(tick);
        });

    } else {
        switchCameraBtn.show();
        // List all available camera for desktop or laptop mode
        navigator.mediaDevices.enumerateDevices().then(function (devices) {
            for(var i = 0; i < devices.length; i ++){
                var device = devices[i];
                if (device.kind === 'videoinput' && device.label !== "OBS Virtual Camera") {
                    const option = $('<option />');
                    option.html(device.label);
                    option.prop('value', device.deviceId);
                    cameraSel.append(option);
                    videoDevices.push(device.deviceId)
                }
            };
            currentCameraDevice = videoDevices[0];
            navigator.mediaDevices.getUserMedia({ video: { deviceId: {exact: videoDevices[currentCameraDevice]} } }).then(function(stream) {
                localStream = stream;
                videoActive = true;
                video.srcObject = stream;
                video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                video.play();
                requestAnimationFrame(tick);
            });
        });
    }

    var qrScanned = false;
    function tick() {
        loadingMessage.innerText = "⌛ Loading video..."
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            loadingMessage.hidden = true;
            canvasElement.hidden = false;
            outputContainer.hidden = false;

            canvasElement.height = video.videoWidth + (video.videoWidth * 0.1); //video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            var code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code && qrScanned == false) {
                qrScanned = true;
                drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
                drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
                drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
                drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
                outputMessage.hidden = true;
                outputData.parentElement.hidden = false;
                outputData.innerText = code.data;
                // Au: destroyQR to prevent continuous scanning of QR code.
                setTimeout(function() {
                    destroyQR();
                    handleQRInputs(code.data);
                }, 1000);
            } else {
                outputMessage.hidden = false;
                outputData.parentElement.hidden = true;
            }
        }
        if (videoActive) {
            requestAnimationFrame(tick);
        }
    }

    function destroyQR() {
        localStream.getTracks().forEach( (track) => {
            track.stop();
            videoActive = false;
            $('#qr-content').hide();
            $('#page-content').show();
            $('#open-sidebar').show();
            $('#qr-back-btn').hide();
        });
    }
}

const isMobile = () => {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        return true;
    }
    else {
        return false;
    };
 };