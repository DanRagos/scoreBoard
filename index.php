<?php
    session_start();
    require_once __DIR__ . '/php/webhost.php';
    $localhost = getHostIp();

    $hasSplashScreen = true;
    $error = '';
    if(isset($_SESSION['sess_id'])) {
        header("Location: https://" . $localhost . "/scoreBoard/" . 'GembaReporter.php');
    } else {
        if(isset($_GET['error'])) {
            $val = $_GET['error'];
            if($val == 'nologin') {
                $error = 'Please fill the login information.';
            } else if($val == 'signout') {
                $error = 'You have been signed out.';
            } else {
                $error = str_replace('%', ' ', $val);
            }
            $hasSplashScreen = false;
        }
    }

    function displayError() {
        global $error;
        return $error == '' ? '<p id="errPrompt" class="text-light mt-2" style="display: none;font-style: italic;background-color: #e0425152;border-radius: 0.25rem;opacity: 0.90;font-size: 0.8rem;">' . $error . '</p>' : '<p id="errPrompt" class="text-light mt-2" style="font-style: italic;background-color: #e0425152;border-radius: 0.25rem;opacity: 0.90;font-size: 0.8rem;">' . $error . '</p>';
    }

    function displayLogin() {
        global $hasSplashScreen;
        return $hasSplashScreen ? 'none' : 'block';
    }

    function displaySplashScreen() {
        global $hasSplashScreen;
        return $hasSplashScreen ? 'block' : 'none';
    }
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <!--  <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no"> -->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="height=device-height, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, target-densitydpi=device-dpi, shrink-to-fit=yes">
    <title>signin page</title>
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/img/000686-ornament.png">
    <link rel="icon" type="image/gif" sizes="32x32" href="assets/img/map.gif">
    <link rel="icon" type="image/png" sizes="255x89" href="assets/img/line%20seiki(2).png">
    <link rel="stylesheet" href="assets/fonts/fontawesome-all.min.css">
    <link rel="stylesheet" href="assets/fonts/font-awesome.min.css">
    <link rel="stylesheet" href="assets/fonts/ionicons.min.css">
    <link rel="stylesheet" href="assets/fonts/fontawesome5-overrides.min.css">
    <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/fonts/simple-line-icons.min.css">
    <link rel="stylesheet" href="assets/css/signin.css?version=5">
    <link rel="stylesheet" href="assets/css/animate.css">
    <link rel="stylesheet" href="assets/css/line-logo.css?version=1">
</head>

<body>
    <!-- Start: Parallax Background -->
    <!-- data-bs-parallax-bg="true" -->
    <div class="shadow-sm bgContainer" style="position: fixed !important; height: 100%; width: 100%; background-image: url(assets/img/mainScreen.jpg);background-position: center;background-size: cover;">
        <svg style="display: <?php echo displaySplashScreen(); ?>; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" id="lineLogoDisplay" version="1.1" preserveAspectRatio="xMidYMid meet" viewBox="0 0 640 640" width="100%" height="640">
            <defs>
                <clipPath id="letterL">
                    <path d="M193.87 237.25L147.87 365.75L466.95 365.75L458.45 388.25L115.17 389.25L170.67 237.25L193.87 237.25Z"></path>
                </clipPath>
                <clipPath id="letterI">
                    <path d="M244.37 237.25L203.37 347.75L180.37 347.75L219.87 237.25L244.37 237.25Z" id="j2dU9Us3B1"></path>
                </clipPath>
                <clipPath id="letterN">
                    <path d="M293.87 237.25L325.87 318.25L355.37 237.25L378.87 237.25L338.87 347.75L314.87 347.75L282.87 267.25L253.37 347.75L229.87 347.75L269.87 237.25L293.87 237.25Z"></path>
                </clipPath>
                <clipPath id="letterE">
                    <path d="M513.55 237.25L506.55 259.75L420.55 259.75L412.05 281.25L498.55 281.25L489.55 302.75L404.05 302.75L397.05 324.75L481.55 324.75L473.81 347.75L365.31 347.75L405.31 237.25L513.55 237.25Z"></path>
                </clipPath>
                <clipPath id="letterCo">
                    <path d="M609.26 312.58C609.26 403.05 476.56 476.49 313.11 476.49C149.66 476.49 16.96 403.05 16.96 312.58C16.96 222.11 149.66 148.66 313.11 148.66C476.56 148.66 609.26 222.11 609.26 312.58Z"></path>
                </clipPath>
                <clipPath id="letterCi">
                    <path d="M597.02 311.53C597.02 395.65 469.91 463.95 313.35 463.95C156.79 463.95 29.68 395.65 29.68 311.53C29.68 227.41 156.79 159.11 313.35 159.11C469.91 159.11 597.02 227.41 597.02 311.53Z"></path>
                </clipPath>
            </defs>
            <g clip-path="url(#letterL)" stroke-width="40">
                <path class="path-1" fill="none" stroke="#0099ff" stroke-miterlimit="10" d="M476.44 375.61L131.01 375.61L182.55 228.22"/>
            </g>
            <g clip-path="url(#letterI)" stroke-width="40">
                <path class="path-2" fill="none" stroke="#0099ff" stroke-miterlimit="10" d="M186.17 359.34L232.29 228.22"/>
            </g>
            <g clip-path="url(#letterN)" stroke-width="40">
                <path class="path-1 path-delay-1" fill="none" stroke="#0099ff" stroke-miterlimit="10" d="M367.93 228.22L326.33 356.62L281.12 230.03L238.62 359.34"/>
            </g>
            <g clip-path="url(#letterE)" stroke-width="40">
                <path class="path-3 path-delay-2" fill="none" stroke="#0099ff" stroke-miterlimit="10" d="M489.1 334.92L381.49 334.92L412.23 247.21L518.03 247.21"/>
            </g>
            <g clip-path="url(#letterE)" stroke-width="40">
                <path class="path-4 path-delay-3" fill="none" stroke="#0099ff" stroke-miterlimit="10" d="M507.18 291.06L395.96 291.06"/>
            </g>
            <g clip-path="url(#letterCo)" stroke-width="40">
                <path class="path-5 path-delay-3" fill="none" stroke="#0099ff" stroke-miterlimit="10" d="M597.02 311.53C597.02 395.65 469.91 463.95 313.35 463.95C156.79 463.95 29.68 395.65 29.68 311.53C29.68 227.41 156.79 159.11 313.35 159.11C469.91 159.11 597.02 227.41 597.02 311.53Z"/>
            </g>
            <animate attributeType="CSS" attributeName="opacity" from="1" to="0" begin="2s" dur="1s" fill="freeze"/>
        </svg>
        <div class="signinCard" style="display: <?php echo displayLogin(); ?>;">
            <div class="shadow-lg cardFrame animated zoomIn">
                <div class="cardHeader">
                    <div class="container h-100">
                        <div class="row h-100">
                            <div class="col align-self-center">
                                <!-- <h2 class="text-primary"><i class="icon-pie-chart text-primary"></i>&nbsp;Gemba Reporter</h2> -->
                                <h2 class="text-primary"><img src="assets/img/000686-ornament.png" style="width: 34px;margin-top: -3px;">&nbsp;Gemba Reporter</h2>
                                <h5 class="text-primary" style="font-weight: normal;">Machine Monitoring System</h5>
                                <!-- <small class="text-secondary" style="font-style: italic;">by <strong>Line Seiki Inc.</strong></small> -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cardBody">
                    <div class="container h-100">
                        <div class="row">
                            <div class="col">
                                <form onSubmit="return false;"><input id="user" class="form-control mb-4" type="text" placeholder="Username" onfocusout="userValidation(this)"></form>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <form onSubmit="return false;"><input id="passw" class="form-control mb-5" type="password" placeholder="Password" onfocusout="passValidation(this)"></form>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <form onSubmit="return false;"><button id="loginbtn" class="btn btn-primary btn-block" type="button">LOGIN</button></form>
                            </div>
                        </div>
                        <?php echo displayError(); ?>
                        <!-- <p class="text-light d-none mt-2" style="font-style: italic;background-color: #e04251;border-radius: 0.25rem;opacity: 0.90;">Error</p> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- End: Parallax Background -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/bootstrap/js/bootstrap.min.js"></script>
    <script src="assets/js/bs-animation.js"></script>
    <script src="assets/js/Custom/translatePage.js?version=3"></script>
    <script src="assets/js/Custom/signinScript.js?version=14"></script>
</body>

</html>
