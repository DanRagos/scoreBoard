<?php
    session_start();

    require_once __DIR__ . '/php/webhost.php';
    require_once __DIR__ . '/php/signin/validateOnRefresh.php';
    $localhost = getHostIp();

    $version = "";
    $versionDate = "";
    $welcomePage = "index.php";
    $isAdmin = false;

    $accntStillValid = revalidateCredentials($_SESSION['sess_user'], $_SESSION['sess_pass']);

    if (isset($_SESSION['sess_id'])) {
        if($_SESSION['sess_role'] == 'admin') {
             $isAdmin = true;
        }

        if ($file = fopen('php/info.txt', 'r')) {
            while (!feof($file)) {
                $line = fgets($file);
                if (strpos($line, "#") === false && strlen(trim($line)) != 0) {
                    $data = str_replace(array("\n", "\r", "v"), '', substr($line, strpos($line, '=') + 1));
                    $head = strstr($line, '=', true);
                    if ($head == 'version') {
                        $version = $data;
                    } else if ($head == 'update') {
                        $versionDate = $data;
                    }
                }
            }
            fclose($file);
        }
    } else {
        session_destroy();
        header("Location: https://" . $localhost . "/scoreBoard/" . $welcomePage . "?error=Login%required.");
    }

    if ($accntStillValid) {
        ///let it go
    } else {
        session_destroy();
        header("Location: https://" . $localhost . "/scoreBoard/" . $welcomePage . "?error=Login%credentials%changed.");
    }

    function getId() {
        return $_SESSION['sess_id'];
    }

    function getRole() {
        return $_SESSION['sess_role'];
    }

    function getUser() {
        return $_SESSION['sess_user'];
    }

    function getName() {
        $parsedName = str_replace('%', ' ', $_SESSION['sess_name']);
        return $parsedName;
    }

    function getFirstChar() {
        return substr($_SESSION['sess_name'], 0, 1);
    }

    function getVersion() {
        global $version;
        return $version;
    }

    function getVersionModified() {
        global $versionDate;
        return $versionDate;
    }

    function setSchedQRTrigger() {
        // $qr_element = '';
        // $clientIp = preg_split ("/\./", getUserIpAddr()); 
        // if ($clientIp[0] == "10") {
        //     $qr_element = '<button class="btn btn-dark btn-sm table-header-btn" id="schedQR-btn-secured" type="button"><i class="fa fa-camera"></i></button>';
        // } else {
        //     $qr_element = '<button class="btn btn-dark btn-sm table-header-btn" id="schedQR-btn" type="button"><i class="fa fa-camera"></i></button>';
        // }
        $qr_element = '<button class="btn btn-dark btn-sm table-header-btn" id="schedQR-btn-secured" type="button"><i class="fa fa-camera"></i></button>';

        return $qr_element;
    }

    function setQRTrigger() {
        // $qr_element = '';
        // $clientIp = preg_split ("/\./", getUserIpAddr()); 
        // if ($clientIp[0] == "10") {
        //     $qr_element = '<label class="qr-other"><i class="fa fa-camera"></i></label>';
        // } else {
        //     $qr_element = '<label class="qr-container"><i class="fa fa-camera"></i><input type="file" accept="image/*" capture="environment" tabindex="-1" onchange="openQRCamera(this)"></label>';
        // }
        $qr_element = '<label class="qr-other"><i class="fa fa-camera"></i></label>';

        return $qr_element;
    }

    function setQRMode() {
        // $qr_element = '';
        // $clientIp = preg_split ("/\./", getUserIpAddr()); 
        // if ($clientIp[0] == "10") {
        //     $qr_element = '<div id="qr-content" style="display: none; position: fixed; top: 46px; left: 0px; width: 100%; height: calc(100vh - 46px);"><!-- video output --><div style="width: 100%; text-align: center; color: white !important; font-size: 0.65rem;"><div class="p-5" id="loadingMessage">🎥 Unable to access video stream (please make sure you have a webcam enabled)</div><canvas id="canvas" hidden=""></canvas><div id="output" hidden=""><div id="outputMessage">No QR code detected.</div><div hidden=""><b>Data:</b><span id="outputData"></span></div></div></div></div>';
        // }
        $qr_element = '<div id="qr-content" style="display: none; position: fixed; top: 46px; left: 0px; width: 100%; height: calc(100vh - 46px);"><!-- video output --><div style="width: 100%; text-align: center; color: white !important; font-size: 0.65rem;"><div class="p-5" id="loadingMessage">🎥 Unable to access video stream (please make sure you have a webcam enabled)</div><canvas id="canvas" hidden=""></canvas><div id="output" hidden=""><div id="outputMessage">No QR code detected.</div><div hidden=""><b>Data:</b><span id="outputData"></span></div></div></div></div>';

        return $qr_element;
    }
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="height=device-height, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=yes">
    <!-- target-densitydpi=device-dpi, -->
    <title>Gemba Reporter</title>
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <style>
        html {
            font-size: 16px;
        }
    </style>
    <link rel="icon" type="image/png" sizes="32x32" href="assets/img/000686-ornament.png">
    <link rel="icon" type="image/gif" sizes="32x32" href="assets/img/map.gif">
    <link rel="icon" type="image/png" sizes="255x89" href="assets/img/line%20seiki(2).png">
    <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
    <link rel="manifest" href="manifest.json">
    <link rel="stylesheet" href="assets/fonts/fontawesome-all.min.css">
    <link rel="stylesheet" href="assets/fonts/font-awesome.min.css">
    <link rel="stylesheet" href="assets/fonts/ionicons.min.css">
    <link rel="stylesheet" href="assets/fonts/fontawesome5-overrides.min.css">
    <link rel="stylesheet" href="assets/fonts/simple-line-icons.min.css">
    <link rel="stylesheet" href="assets/css/DataTables/datatables.min.css">
    <link rel="stylesheet" href="assets/css/Progressbar/progressBar-circle.css">
    <link rel="stylesheet" href="assets/css/Progressbar/progressbar-custom.css">
    <link rel="stylesheet" href="assets/css/Sidepanel/sidebar.css?version=5">
    <link rel="stylesheet" href="assets/css/styles.css?version=3">
    <link rel="stylesheet" href="assets/css/DataTables/Buttons-1.5.6/buttons.bootstrap4.min.css">
    <link rel="stylesheet" href="assets/css/DataTables/Buttons-1.5.6/buttons.dataTables.min.css">
    <link rel="stylesheet" href="assets/css/DataTables/Buttons-1.5.6/buttons.jqueryui.min.css">
    <link rel="stylesheet" href="assets/css/DataTables/Buttons-1.5.6/common.compiled.css">
    <link rel="stylesheet" href="assets/css/DataTables/Buttons-1.5.6/mixins.compiled.css">
    <link rel="stylesheet" href="assets/css/DataTables/FixedHeader-3.1.4/fixedHeader.bootstrap4.min.css">
    <link rel="stylesheet" href="assets/css/DataTables/FixedHeader-3.1.4/fixedHeader.dataTables.min.css">
    <link rel="stylesheet" href="assets/css/DataTables/FixedHeader-3.1.4/fixedHeader.jqueryui.min.css">
    <link rel="stylesheet" href="assets/css/DataTables/Responsive-2.2.2/responsive.bootstrap4.min.css">
    <link rel="stylesheet" href="assets/css/DataTables/Responsive-2.2.2/responsive.dataTables.min.css">
    <link rel="stylesheet" href="assets/css/DataTables/Responsive-2.2.2/responsive.jqueryui.min.css">
    <link rel="stylesheet" href="assets/css/DataTables/RowGroup-1.1.0/rowGroup.bootstrap4.min.css">
    <link rel="stylesheet" href="assets/css/DataTables/RowGroup-1.1.0/rowGroup.dataTables.min.css">
    <link rel="stylesheet" href="assets/css/DataTables/RowGroup-1.1.0/rowGroup.jqueryui.min.css">
    <link rel="stylesheet" href="assets/css/DataTables/Select-1.3.0/select.bootstrap4.min.css">
    <link rel="stylesheet" href="assets/css/DataTables/Select-1.3.0/select.dataTables.min.css">
    <link rel="stylesheet" href="assets/css/DataTables/Select-1.3.0/select.jqueryui.min.css">
    <link rel="stylesheet" href="assets/css/card-custom.css?version=1">
    <link rel="stylesheet" href="assets/css/DataTables/DataTables-1.10.18/dataTables.bootstrap4.min.css">
    <link rel="stylesheet" href="assets/css/DataTables/DataTables-1.10.18/jquery.dataTables.min.css">
    <link rel="stylesheet" href="assets/css/jquery-ui.min.css">
    <link rel="stylesheet" href="assets/css/jquery-ui-timepicker-addon.css">
    <link rel="stylesheet" href="assets/css/animate.css">
    <link rel="stylesheet" href="assets/css/bootstrap-select.css">
    <link rel="stylesheet" href="assets/css/bootstrap-select.min.css">
    <link rel="stylesheet" href="assets/css/Custom/dashboardDesktop.css?version=5">
    <link rel="stylesheet" href="assets/css/Custom/dashboardMobile.css?version=4">
    <link rel="stylesheet" href="assets/css/Custom/config.css?version=8">
    <link rel="stylesheet" href="assets/css/Custom/filterOption.css">
    <link rel="stylesheet" href="assets/css/Custom/overview.css?version=1">
    <link rel="stylesheet" href="assets/css/Custom/scheduleModal.css">
    <link rel="stylesheet" href="assets/css/Custom/slider-button.css?version=2">
    <link rel="stylesheet" href="assets/css/Custom/sortableCluster.css">
    <link rel="stylesheet" href="assets/css/Custom/table-extra-btn.css?version=2">
    <link rel="stylesheet" href="assets/css/Custom/tables-custom.css?version=12">
    <link rel="stylesheet" href="assets/css/Custom/update.css">
    <link rel="stylesheet" href="assets/css/line-logo.css">
    <link rel="stylesheet" href="assets/css/signin.css">
    <link rel="stylesheet" href="assets/css/Custom/qr.css?version=4">
    <link rel="stylesheet" href="assets/css/Custom/buttonPanel.css?version=3">
    <link rel="stylesheet" href="assets/css/Custom/timechart.css?version=2">
    <link rel="stylesheet" href="assets/css/Custom/newconfig.css?version=18">
    <link rel="stylesheet" href="assets/css/Custom/buttonsizeControl.css?version=3">
    <link rel="stylesheet" href="assets/css/Custom/visualization.css?version=2">
    <link rel="stylesheet" href="assets/css/Custom/about.css">
    <link rel="stylesheet" href="assets/css/Custom/control.css">
    <link rel="stylesheet" href="assets/css/Custom/schedchart.css">
    <link rel="stylesheet" href="assets/css/Custom/visualizationv2.css">
    <link rel="stylesheet" href="assets/css/Custom/summary.css">
    <link rel="stylesheet" href="assets/css/Custom/reject.css">
    <link rel="stylesheet" href="assets/css/Custom/detail.css">
    <link rel="stylesheet" href="assets/css/Custom/darkmode.css?version=14">
</head>
<body class="flex-grow-1 dark-bg" style="width: 100%;height: 100%;">
    <div id="page-header" style="background-color: #444f51;">
        <div id="headerShadow"></div>
        <button class="btn btn-primary m-1" id="open-sidebar" type="button" style="background-color: rgb(68,79,81);">
            <i class="fa fa-bars"></i>
        </button>
        <button class="btn btn-primary m-1" id="qr-back-btn" type="button" style="background-color: rgb(68,79,81); display: none;">
            <i class="fa fa-arrow-left"></i>
        </button>
        <label style="color: rgba(0,153,255,0.9);margin-left: 5px;"><img src="assets/img/000686-ornament.png" style="width: 21px;margin-top: -3px;">&nbsp;ScoreBoard</label>
        <button
            class="btn btn-primary btn-sm shadow-none float-right my-2 mr-2" id="logout-btn" type="button" style="background-color: rgb(68,79,81);"><i class="fa fa-sign-out text-danger"></i><label style="margin-bottom: 0;" for="logout-btn">&nbsp;<span>Logout</span></label>
        </button>
        <button class="btn btn-primary btn-sm shadow-none float-right my-2" id="pref-btn" type="button" style="background-color: rgb(68,79,81);margin-right: 0px;margin-left: 0px;"><i class="fa fa-cog"></i><label style="margin-bottom: 0;" for="pref-btn">&nbsp;<span>Preferences</span></label></button>
    </div>
    <!-- height: 100vh -->
    <div id="sidebar" style="position: fixed; background-color: rgba(74,80,89,0.98);height: 100%; overflow: hidden;color: rgb(33,37,41);">
        <div id="sidebar-header" style="background-color: rgba(48,56,58,0.75);padding-right: 7px;padding-left: 15px;opacity: 1;">
            <label style="color: rgba(0,153,255,0.9);margin-top: 10px;"><img src="assets/img/000686-ornament.png" style="width: 21px;margin-top: -3px;">&nbsp;ScoreBoard</label>
            <button class="btn btn-primary btn-sm border rounded-circle float-right m-2" id="close-sidebar" type="button" style="background-color: rgba(0,123,255,0.6);">
                <i class="fa fa-chevron-left" style="padding-right: 3px;padding-left: 1px;"></i>
            </button>
        </div>
        <div class="tablist-container">
            <ul role="tablist">
                <!-- Start: control -->
                   
                        
                            <li><button class="btn btn-primary btn-tab" type="button" role="tab" data-toggle="tab" data-target="#dashboard-tab"><i class="fa fa-tachometer"></i>&nbsp;<span id="tabDashboardtitle">Count Dashboard</span></button></li>
                <li><button id="control-tab-btn" class="btn btn-primary btn-tab" type="button" style="color: #f8f9fa; display:none;" data-toggle="tab" data-target="#control-tab" role="tab">
                    <i class="fa fa-toggle-on"></i>&nbsp;<span id="tabControltitle">Control</span>
                </button></li>
               
                <!-- End: control -->
                <!-- Start: display -->
              
                <!-- End: display -->
                <!-- Start: records -->
                
                            <li><button id="summary-tab-btn" class="btn btn-primary btn-tab" type="button" role="tab" data-toggle="tab" data-target="#summary-tab"><i class="fa fa-bar-chart"></i>&nbsp;<span id="tabSummarytitle">Summary</span></button></li>
                            <!-- <li><button id="schedule-tab-btn" class="btn btn-primary btn-tab" type="button" role="tab" data-toggle="tab" data-target="#schedule-tab"><i class="fa fa-calendar"></i>&nbsp; <span id="tabSchedtitle">Schedule</span></button></li> -->
                      
              
                <!-- End: records -->
                <!-- Start: Settings -->
                <li><button class="btn btn-primary" id="sidepanel-config-btn" type="button" data-target="#settings-option" data-toggle="collapse" aria-expanded="false"><i class="fa fa-cogs"></i>&nbsp;<span id="tabConfigtitle">Configuration</span><i class="fa fa-caret-down float-right"></i></button>
                    <div
                        id="settings-option" class="collapse">
                        <ul>
                            <li><button id="cluster-tab-btn" class="btn btn-primary btn-tab" type="button" data-target="#cluster-tab" data-toggle="tab" role="tab"><i class="fa fa-cubes"></i>&nbsp;<span id="tabClustertitle">Clusters</span></button></li>
                            <li><button id="system-tab-btn" class="btn btn-primary btn-tab" type="button" data-target="#date-tab" data-toggle="tab" role="tab"><i class="fa fa-wrench"></i>&nbsp; <span id="tabSystemtitle">System</span></button></li>
                            <!-- <li><button id="swupdate-tab-btn" class="btn btn-primary btn-tab" type="button" data-target="#update-tab" data-toggle="tab" role="tab"><i class="icon ion-ios-reload"></i>&nbsp; <span id="tabUpdatetitle">Software Update</span></button></li> -->
                        </ul>
        </div>
        </li>
        <!-- End: Settings -->
        <!-- Start: about -->
        <li><button class="btn btn-primary btn-tab" type="button" role="tab" data-target="#about-tab" data-toggle="tab"><i class="fa fa-question-circle-o"></i>&nbsp;<span id="tabAbouttitle">About</span></button></li>
        <!-- End: about -->
        </ul>
        </div>
        <hr style="margin-right: 15px;margin-left: 15px;">
        <span id="accntInfoHolder" hidden data-aid=<?php echo getId(); ?>><?php echo getUser(); ?></span>
        <div id="sidebar-footer" style="background-color: #373e41;">
            <button class="btn btn-primary border rounded-circle" type="text" 
                style="width: 40px;height: 40px;background-color: rgba(46,119,198,0.27);color: #0079ff;"><?php echo getFirstChar(); ?></button>
            <label id="accntName"><?php echo getUser(); ?></label>  <!-- previously getName(), changed as requested by LSJ-0908 -->
            <label id="accntInfo" data-role=<?php echo getRole(); ?>><?php echo getRole(); ?></label>
        </div>
        </div>
        <!-- Start: page-content -->
        <div id="page-content" class="tab-content">
        <?php //include 'pages/control-tab.php' ;?>
        <?php include 'pages/dashboard-tab.php' ;?>
        <?php //include 'pages/duration-tab.php' ;?>
        <?php //include 'pages/overview-tab.php' ;?>
        
            <div id="summary-tab" class="tab-pane fade" role="tabpanel">
                <!-- Start: header -->
                <div id="summary-subheader">
                    <span id="summary-title"></span>
                    <button id="summary-view-btn" type="button" class="btn dark btn-sm view-btn"><i class="fas fa-calendar-check"></i><span>&nbsp;View</span></button>
                    <button id="summary-show-data-btn" type="button" class="btn dark btn-sm"><i class="fas fa-chart-bar text-success"></i><span>&nbsp;Show Chart</span></button>
                    <button id="summary-export-btn" type="button" class="btn dark btn-sm"><i class="fa fa-download text-success"></i><span>&nbsp;Export</span></button>
                    <button id="summary-today-btn" type="button" class="btn dark btn-sm active today-btn"><i class="fas fa-cloud-sun kulayng-araw"></i><span>&nbsp;Today</span></button>
                    <button id="summary-filter-btn" type="button" class="btn dark btn-sm filter-btn"><i class="fa fa-filter"></i><span>&nbsp;Filter</span></button>
                    <div id="summary-fr" class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text dark" id="inputGroup-sizing-sm" style="width: 49px !important;"><i class="fa fa-calendar"></i>&nbsp;Fr</span>
                        </div>
                        <input type="text" class="form-control dateFr" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readonly="" placeholder="-- / -- / --">
                    </div>
                    <div id="summary-to" class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text dark" id="inputGroup-sizing-sm"><i class="fa fa-calendar"></i>&nbsp;To</span>
                        </div>
                        <input type="text" class="form-control dateTo" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readonly="" placeholder="-- / -- / --">
                    </div>
                    <button id="toggle-summary" type="button" class="btn dark btn-sm table-opt"><span>Show Options</span>&nbsp;<i class="fas fa-caret-down"></i></button>
                    
                </div>
                <!-- End: header -->
                <!-- Start: table -->
                <div id="summary-content" class="tbl-container">
                    <div class="table-responsive text-center">
                    <table class="table table-sm nowrap" id="summaryTbl" collspacing="0" width="100%">
                            <thead>
                                <tr>
                                    <th>Machine</th>
                                    <th>Job Order</th>
                                    <th>Production Start</th>
                                    <th>Production End</th>
                                    <th>Model</th>
                                    <th>Material</th>
                                    <th>Target Quantity</th>
                                    <th>Prewarn Quantity</th>
                                    <th>Output Quantity</th>
                                
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <div id="timechart">
                        <div id="timechart-content"></div>
                        <!-- <svg id="chart-1" width="100%" height="100%"></svg> -->
                        <div class="text-center text-sm-center text-md-left text-lg-left text-xl-left py-1 pr-1 manualUpdate-footer" style="padding-left: 2px; display: flex; align-items: center">
                            <button class="btn btn-dark btn-sm mr-2 refresh-btn" type="button">
                                <i class="fa fa-undo"></i>&nbsp;<span>Refresh</span>
                            </button>
                            <label class="last-update table-update">Last Update: 0000-00-00 00:00:00</label>
                            <span style="margin-left: auto; display: flex">
                                <span id="timechart-nav">
                                    <button class="btn btn-dark btn-sm ml-auto mr-2" id="timechart-prev-btn" type="button">
                                        <i class="fa fa-arrow-left"></i>&nbsp;<span>Previous</span>
                                    </button>
                                    <div id="timechart-pagination-container"></div>
                                    <button class="btn btn-dark btn-sm ml-2 mr-2" id="timechart-next-btn" type="button">
                                        <i class="fa fa-arrow-right"></i>&nbsp;<span>Next</span>
                                    </button>
                                </span>
                            </span>
                        </div>
                    </div>

                </div>
                <!-- End: table -->
            </div>
          <?php //include 'pages/reject-tab.php' ; ?>
          <?php //include 'pages/unproductive-tab.php' ; ?>
          <?php include 'pages/detail-tab.php' ; ?>
            <!-- JO TIME CHART -->

            <?php //include 'pages/schedule-tab.php' ; ?>
        
            <!-- Hanz: Change from vw to % due to problems of vw on mobile phones -->
            <?php //include 'pages/visual-tab.php' ; ?>
            <div id="cluster-tab" class="tab-pane fade" role="tabpanel">
                <!-- Start: header -->
                <div class="page-subheader">
                    <div><span style="font-weight: 300;"><span id="pgeClustertitle" class="pl-3" style="background-color: rgba(196,204,204,0);" disabled>Cluster Configuration</span></span>
                    </div>
                </div>
                <!-- End: header -->
                <!-- Start: body -->
                <div class="config-content">
                    <div>
                        <ul class="nav nav-tabs text-dark minitabs"><!-- nav-fill removed -->
                            <li class="nav-item"><a class="nav-link active" role="tab" data-toggle="tab" id="viewClusterBtn" href="#viewClusterTab">View Clusters</a></li>
                            <li class="nav-item"><a class="nav-link" role="tab" data-toggle="tab" id="viewDevicesBtn" href="#viewDevicesTab">View Devices</a></li>
                            <li class="nav-item"><a class="nav-link" role="tab" data-toggle="tab" id="mngDevicesBtn" href="#mngDevicesTab" hidden="true">Manage Devices</a></li>
                        </ul>
                        <div class="tab-content config-tabs">
                            <div class="tab-pane fade show active" role="tabpanel" id="viewClusterTab" style="padding-top: 10px;">
                                <div class="row no-gutters">
                                    <!-- Start: main-content-pane -->
                                    <div class="col-12 col-sm-12 col-md-12 col-lg-9 col-xl-10 mb-2 px-3">
                                        <div class="config-main-pane">
                                            <!-- Start: header -->
                                            <div class="config-tab-header" style="display: flex;">
                                                <label style="flex: 1;">View Available Clusters</label>
                                                <button class="btn btn-sm btn-dark-csm" id="scanBSBtn" hidden>
                                                    <i class="fas fa-search"></i>
                                                    <span>Scan</span></button>
                                            </div>
                                            <!-- End: header -->
                                            <!-- Start: body -->
                                            <!-- gradientbackground removed -->
                                            <div class="config-tab-body content" style="background-color: #2f2f2f1a;">
                                                <!-- Start: card-io -->
                                                <div class="cardio">
                                                    <!-- Start: card-head -->
                                                    <div class="cardio-header">
                                                        <!-- Start: card-title -->
                                                        <div class="cardio-title">
                                                            <div class="row no-gutters">
                                                                <div class="col text-truncate"><label class="col-form-label">Cluster A</label></div>
                                                                <div class="col text-right"><button class="btn btn-outline-primary btn-sm border rounded editCluster-btn" type="button" style="padding: 0px;padding-right: 0;margin-right: -5px;"><i class="fa fa-edit fa-sm" style="padding: 5px;" data-toggle="tooltip" data-placement="left" title="Edit Information"></i></button></div>
                                                            </div>
                                                        </div>
                                                        <!-- End: card-title -->
                                                        <!-- Start: card-name -->
                                                        <div class="cardio-details"><label class="text-truncate">N/A (SSID)</label>
                                                            <p class="text-left">Broadcast SSID:&nbsp;<i class="fa fa-check text-success"></i></p>
                                                            <p class="text-left">IP Address: 0.0.0.0</p>
                                                            <p class="text-left">No. of Devices: 0</p>
                                                        </div>
                                                        <!-- End: card-name -->
                                                    </div>
                                                    <!-- End: card-head -->
                                                    <!-- Start: card-body -->
                                                    <div class="cardio-body"><button class="btn btn-dark btn-sm" type="button">View Devices</button></div>
                                                    <!-- End: card-body -->
                                                </div>
                                                <!-- End: card-io -->
                                            </div>
                                            <!-- End: body -->
                                        </div>
                                    </div>
                                    <!-- End: main-content-pane -->
                                    <!-- Start: info-content-pane -->
                                    <div class="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-2 mb-2 px-3">
                                        <div class="config-sub-pane">
                                            <!-- Start: header -->
                                            <div class="config-tab-header bg-none"><label><i class="fa fa-info-circle text-primary"></i>&nbsp;<span class="infolbl">Information</span></label></div>
                                            <!-- End: header -->
                                            <!-- Start: body -->
                                            <div class="config-tab-body">
                                                <p>Displays the basic information</p>
                                                <p><strong>Broadcast SSID</strong> - SSID of the Cluster is visible to all devices</p>
                                                <p><strong>IP Address</strong> - Address of the Cluster on the network</p>
                                                <p><strong>No. of devices</strong> - number of devices associated with the respective Cluster</p>
                                                <p><strong>View Devices </strong>- shows the device list associated with the Cluster</p>
                                            </div>
                                            <!-- End: body -->
                                        </div>
                                    </div>
                                    <!-- End: info-content-pane -->
                                </div>
                            </div>
                            <div class="tab-pane fade" role="tabpanel" id="viewDevicesTab" style="padding-top: 10px;">
                                <div class="row no-gutters">
                                    <!-- Start: main-content-pane -->
                                    <div class="col-12 col-sm-12 col-md-12 col-lg-9 col-xl-10 mb-2 px-3">
                                        <div class="config-main-pane">
                                            <!-- Start: header -->
                                            <div class="config-tab-header"><label>View Device per Cluster</label></div>
                                                <!-- End: header -->
                                                <!-- Start: body -->
                                                <!-- gradient background remove -->
                                            <div class="config-tab-body" style="background-color: #2f2f2f1a;">
                                                <div class="row no-gutters align-items-center">
                                                    <div class="col-10 text-left">
                                                        <select class="custom-select custom-select-sm float-left mb-2" id="select-cluster">
                                                            <option value="0">Select Cluster Name</option>
                                                        </select>
                                                    </div>
                                                    <div class="col mb-2">
                                                        <button class="btn btn-light float-right" id="deleteDeviceBtn" type="button"><i class="fa fa-trash"></i></button>
                                                    </div>
                                                </div>
                                                    <!-- <button class="btn btn-light btn-lg float-right deleteDraggable" id="deleteDeviceBtn" type="button"><i class="fa fa-trash"></i></button> -->
                                                <!-- </div>     -->
                                                <!-- </div> -->
                                                <!-- Start: table -->
                                                <div>
                                                    <div class="table-responsive text-center">
                                                        <table class="table table-sm nowrap" id="devPerClusterTbl" collspacing="0" width="100%">
                                                            <thead>
                                                                <tr>
                                                                    <th>Device Name</th>
                                                                    <th>Device Type</th>
                                                                    <th>Node ID</th>
                                                                    <th>Device Status</th>
                                                                    <th>Rename Device</th>
                                                                    <th>Delete</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody></tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <!-- End: table -->
                                                <!-- <div class="col">
                                                    <button class="btn btn-light btn-lg float-right deleteDraggable" id="deleteDeviceBtn" type="button"><i class="fa fa-trash"></i></button>
                                                </div> -->
                                            </div>
                                            <!-- End: body -->
                                        </div>
                                    </div>
                                    <!-- End: main-content-pane -->
                                    <!-- Start: info-content-pane -->
                                    <div class="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-2 mb-2 px-3">
                                        <div class="config-sub-pane">
                                            <!-- Start: header -->
                                            <div class="config-tab-header bg-none"><label><i class="fa fa-info-circle text-primary"></i>&nbsp;<span class="infolbl">Information</span></label></div>
                                            <!-- End: header -->
                                            <!-- Start: body -->
                                            <div class="config-tab-body">
                                                <p>Displays the basic information of all the devices associated with the selected Cluster</p>
                                                <p><strong>Device Name</strong> - assigned device name on the network</p>
                                                <p><strong>Device Type</strong> - indicates device function</p>
                                                <p><strong>Status</strong> - Active state indicates the device is <em>Connected</em><strong><em>&nbsp;</em></strong>while Inactive state indicates the device is <em>Disconnected</em></p>
                                            </div>
                                            <!-- End: body -->
                                        </div>
                                    </div>
                                    <!-- End: info-content-pane -->
                                </div>
                            </div>
                            <div class="tab-pane fade" role="tabpanel" id="mngDevicesTab" style="padding-top: 10px; " hidden = "true">
                                <div class="row no-gutters">
                                    <!-- Start: main-content-pane -->
                                    <div class="col-12 col-sm-12 col-md-12 col-lg-9 col-xl-10 mb-2 px-3">
                                        <div class="config-main-pane">
                                            <!-- Start: header -->
                                            <div class="config-tab-header"><label>Manage Device Allocation</label></div>
                                            <!-- End: header -->
                                            <!-- Start: body -->
                                            <!-- grdientBackground removed -->
                                            <div class="config-tab-body" style="background-color: transparent;">
                                                <!-- Uncomment for LARGE SYSTEM -->
                                                <!-- <div class="row no-gutters">
                                                    <div class="col text-left clusterlbl">Cluster List</div>
                                                </div>
                                                <div class="row no-gutters">
                                                    <div class="col text-left clusterLegend" style="margin-right: 15px; margin-left: 15px;"></div>
                                                </div> -->
                                                <div class="row no-gutters">
                                                    <div class="col text-left">
                                                        <!-- <label>Reorder Devices</label> -->
                                                        <select class="form-control-sm" hidden id="reorderMode">
                                                            <option value="device" selected>Dashboard Device Allocation</option>
                                                            <option value="cluster">Cluster Allocation</option>
                                                        </select>
                                                        <!-- <button class="btn btn-light btn-sm float-right deleteDraggable" id="deleteDeviceBtn" type="button"><i class="fa fa-trash"></i></button> -->
                                                    </div>
                                                </div>
                                                <div class="row no-gutters">
                                                    <div class="col">
                                                        <div class="draggable-wrapper-x"></div>
                                                        <button class="btn btn-light btn-lg float-right deleteDraggable" id="deleteDeviceBtn" type="button"><i class="fa fa-trash"></i></button>
                                                    </div>
                                                </div>
                                                <div class="row no-gutters">
                                                    <div class="col text-right">
                                                        <button class="btn btn-dark mr-2" id="refreshDevicesOrderBtn" type="button">Refresh</button>
                                                        <button class="btn btn-dark" id="applyDeviceOrderBtn" type="button">Apply</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- End: body -->
                                        </div>
                                    </div>
                                    <!-- End: main-content-pane -->
                                    <!-- Start: info-content-pane -->
                                    <div class="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-2 mb-2 px-3">
                                        <div class="config-sub-pane">
                                            <!-- Start: header -->
                                            <div class="config-tab-header bg-none"><label><i class="fa fa-info-circle text-primary"></i>&nbsp;<span class="infolbl">Information</span></label></div>
                                            <!-- End: header -->
                                            <!-- Start: body -->
                                            <div class="config-tab-body">
                                                <p>Allows the devices to be either assigned to display on specific pages or removed from its Cluster</p>
                                                <p><strong>Yellow Indicator</strong>- indicates the device that will be swapped from the current page</p>
                                                <p><strong>Note</strong>: Devices that are swapped from its current pages will always be positioned as the last item of the source page.</p>
                                                <p><strong>Note</strong>: To delete a device, drag the device to the trash <i class="fa fa-trash"></i> icon.</p>
                                            </div>
                                            <!-- End: body -->
                                        </div>
                                    </div>
                                    <!-- End: info-content-pane -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End: body -->
            </div>
            <div id="date-tab" class="tab-pane fade" role="tabpanel">
                <!-- Start: header -->
                <div class="page-subheader">
                    <div><span id="pgeSystemtitle" style="font-weight: 300;"><span class="pl-3" style="background-color: rgba(196,204,204,0);">System Configuration</span></span>
                    </div>
                </div>
                <!-- End: header -->
                <!-- Start: body -->
                <div class="config-content">
                    <div class="row" style="margin-right: 0;margin-left: 0;">
                        <div id="sideBtnContainer" class="active">
                            <div class="d-flex flex-column flex-grow-0 flex-shrink-0 justify-content-center content">
                                <button class="btn btn-primary system-route active" type="button" role="tab" data-toggle="tab" data-target="#dnt-config-page">
                                    <span>Date &amp; Time Settings</span>
                                    <span><i class="fa fa-caret-right"></i></span>
                                </button>
                                <button class="btn btn-primary system-route" type="button" role="tab" data-toggle="tab" data-target="#net-config-page">
                                    <span>Network Configuration</span>
                                    <span><i class="fa fa-caret-right"></i></span>
                                </button>
                                <button class="btn btn-primary system-route" type="button" role="tab" data-toggle="tab" data-target="#usr-config-page">
                                    <span>Users Management</span>
                                    <span><i class="fa fa-caret-right"></i></span>
                                </button>
                                <button class="btn btn-primary system-route" type="button" role="tab" data-toggle="tab" data-target="#csr-config-page">
                                    <span>Cause Registration</span>
                                    <span><i class="fa fa-caret-right"></i></span>
                                </button>
                                <button class="btn btn-primary system-route" type="button" role="tab" data-toggle="tab" data-target="#ind-config-page" disabled hidden>
                                    <span>Smart Counter Registration</span>
                                    <span><i class="fa fa-caret-right"></i></span>
                                </button>
                                <button class="btn btn-primary system-route" type="button" role="tab" data-toggle="tab" data-target="#dbm-config-page">
                                    <span>Data Management</span>
                                    <span><i class="fa fa-caret-right"></i></span>
                                </button>
                            </div>
                            <div class="d-flex flex-column flex-grow-1 justify-content-center align-items-center align-content-center" id="drawerBtn">
                                <button class="btn btn-sm" type="button" style="height: 100%;width: 13px;padding-right: 0px;padding-left: 0px;">
                                    <i class="fa fa-angle-double-right"></i>
                                </button>
                            </div>
                        </div>
                        <!-- Start: System Mgmt Content -->
                        <div class="d-flex flex-column systemContent config-tabs">
                            <div class="d-flex align-items-center px-2 py-1 header">
                                <span class="d-flex flex-grow-1">Date &amp; Time Settings</span>
                                <button class="btn btn-primary btn-sm mr-2" id="systemBtn-1" type="button">Sync</button>
                                <button class="btn btn-primary btn-sm" id="systemBtn-2" type="button">Save</button>
                            </div>
                            <div class="d-flex flex-column flex-grow-1 body">
                                <div id="dnt-config-page" class="tab-pane fade active show" role="tabpanel">
                                    <!-- date and time -->
                                    <div class="row">
                                        <div class="col-12 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                                            <label class="form-control-plaintext">Server Date and Time</label>
                                        </div>
                                        <div class="col">
                                            <input id="serverdnt" type="text" class="form-control-plaintext" value="YYYY/MM/DD HH:mm:ss (Capital/Country)" readonly />
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            <hr />
                                        </div>
                                    </div>
                                    <div class="row mb-2">
                                        <div class="col-12 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                                            <label class="form-control-plaintext">Set Server Timezone</label>
                                        </div>
                                        <div class="col align-self-center">
                                            <select id="tzList" class="form-control-sm"></select>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-12 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                                            <label class="form-control-plaintext">Set Server Date and Time</label>
                                        </div>
                                        <div class="col align-self-center">
                                            <form class="form-inline">
                                                <input id="inputdt" type="text" class="form-control form-control-sm system" readonly placeholder="YYYY-MM-DD hh:mm:ss"/>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div id="net-config-page" class="tab-pane fade" role="tabpanel">
                                    <!-- Network Configuration -->
                                    <div class="row mb-2">
                                        <div class="col-4 col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                            <label class="form-control-plaintext">IP Setting</label>
                                        </div>
                                        <div class="col align-self-center">
                                            <select class="form-control-sm" id="selIpMode">
                                                <option value="dhcp" selected="">DHCP</option>
                                                <option value="static">Static</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="row mb-2">
                                        <div class="col-4 col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                            <label class="form-control-plaintext">IP Address</label>
                                        </div>
                                        <div class="col align-self-center">
                                            <form class="form-inline">
                                                <input class="form-control form-control-sm" type="text" id="srvIP" placeholder="0.0.0.0">
                                            </form>
                                        </div>
                                    </div>
                                    <div class="row mb-2">
                                        <div class="col-4 col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                            <label class="form-control-plaintext">Gateway IP</label>
                                        </div>
                                        <div class="col align-self-center">
                                            <form class="form-inline">
                                                <input class="form-control form-control-sm" type="text" id="srvGW" placeholder="0.0.0.0">
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div id="usr-config-page" class="tab-pane fade" role="tabpanel">
                                    <!-- Users Management -->
                                    <table class="table table-sm dt-responsive wrap text-center" id="usrMngmt" collspacing="0" width="100%">
                                        <thead>
                                            <tr>
                                                <th class="all">
                                                    <input class="checkBtn-user-master" type="checkbox"/>
                                                </th>
                                                <th class="all">Username</th>
                                                <th class="all">Password</th>
                                                <th width="40%" class="small-desktop">Permission</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                                <div id="dbm-config-page" class="tab-pane fade" role="tabpanel">
                                    <!-- Data Management -->
                                    <div class="row">
                                        <!-- <div class="col-12 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                                            <input type="text" class="form-control-plaintext" value="Database Memory" readonly />
                                        </div> -->
                                        <div class="col-12 col-sm-8 col-md-6 col-lg-3 col-xl-3">
                                            <label class="form-control-plaintext" id="dbmemlbl">Database Memory</label>
                                        </div>
                                        <div class="col-12 col-sm-4 col-md-6 col-lg-3 col-xl-3">
                                            <input id="dbmem" type="text" class="form-control-plaintext" value=" -- MB " readonly />
                                        </div>
                                        <div class="col-12 col-sm-8 col-md-6 col-lg-3 col-xl-3">
                                            <label class="form-control-plaintext" id="diskmemlbl">Available Disk</label>
                                        </div>
                                        <div class="col-12 col-sm-4 col-md-6 col-lg-3 col-xl-3">
                                            <input id="diskmem" type="text" class="form-control-plaintext" value=" -- GB " readonly />
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            <hr />
                                        </div>
                                    </div>
                                    <div class="row mb-3" display="flex">
                                        <div class="col-12 col-sm-8 col-md-4 col-lg-3 col-xl-3">
                                            <label class="form-control-plaintext" id="selDBModelbl">Select Database Option</label>
                                        </div>
                                        <div class="col align-self-center">
                                            <select class="form-control-sm" id="selDBMode">
                                                <!-- <option value="optimize" selected="">Compress DB</option> -->
                                                <option value="partial">Partial DB Delete</option>
                                                <option value="full">Full DB Delete</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="row mb-3" id="selDateRange">
                                        <div class="col-12 col-sm-8 col-md-4 col-lg-3 col-xl-3">
                                            <label class="form-control-plaintext" id="dbmdatelbl">Select Date Range</label>
                                        </div>
                                        <!-- Start: From -->
                                        <div class="col-12 col-sm-5 col-md-4 col-lg-3 col-xl-3 align-self-center" style="margin:2.5px 0px;">
                                            <div class="date-container" id="dbm-from">
                                                <div class="input-group input-group-sm">
                                                    <div class="input-group-prepend">
                                                        <span class="input-group-text" style="width: 45px !important;">
                                                            <i class="fa fa-calendar"></i>&nbsp;Fr
                                                        </span>
                                                    </div>
                                                    <input class="form-control dateFr dbmDate" type="text" readonly="" placeholder=" -- / -- / -- ">
                                                </div>
                                            </div>
                                            <!-- End: From -->
                                        </div>
                                        <div class="col-12 col-sm-5 col-md-4 col-lg-3 col-xl-3 align-self-center" style="margin:2.5px 0px;">
                                            <!-- Start: To -->
                                            <div class="date-container" id="dbm-to">
                                                <div class="input-group input-group-sm">
                                                    <div class="input-group-prepend">
                                                        <span class="input-group-text" style="width: 45px !important;">
                                                            <i class="fa fa-calendar"></i>&nbsp;To  
                                                        </span>
                                                    </div>
                                                    <input class="form-control dateTo dbmDate" type="text" readonly="" placeholder=" -- / -- / -- ">
                                                </div>
                                            </div>
                                            <!-- End: To -->
                                        </div>
                                    </div>
                                    <!-- <div class="row mb-2">
                                        <div class="col-12 col-sm-8 col-md-4 col-lg-3 col-xl-3">
                                            <input type="text" class="form-control-plaintext" value="Gateway IP" readonly />
                                        </div>
                                        <div class="col align-self-center">
                                            <form class="form-inline">
                                                <input class="form-control form-control-sm" type="text" id="srvGW" placeholder="0.0.0.0">
                                            </form>
                                        </div>
                                    </div> -->
                                </div>
                                <!-- Start: CauseReg-pane -->
                                <div id="csr-config-page" class="tab-pane fade causeReg" role="tabpanel">
                                    <!-- Cause Registration -->
                                    <div class="d-flex flex-row flex-grow-1 causeReg">
                                        <div class="d-flex flex-column flex-grow-1" id="causeReg-1">
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" class="causeReg-all"/>
                                                </span>
                                                <span class="causeReg-span text-center">No.</span>
                                                <span class="d-flex flex-grow-1 justify-content-center">Cause</span>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                        </div>
                                        <div class="d-flex flex-column flex-grow-1" id="causeReg-2">
                                           <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" class="causeReg-all"/>
                                                </span>
                                                <span class="causeReg-span text-center">No.</span>
                                                <span class="d-flex flex-grow-1 justify-content-center">Cause</span>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                            <div class="d-flex flex-row flex-grow-1">
                                                <span class="align-self-center">
                                                    <input type="checkbox" />
                                                </span>
                                                <span class="flex-shrink-0 align-self-center causeReg-span text-center itemNum">--</span>
                                                <form class="flex-grow-1 align-self-center">
                                                    <input type="text" class="form-control form-control-sm text-truncate" maxlength="32" placeholder="--" />
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- End: CauseReg-pane -->
                                <div id="ind-config-page" class="tab-pane fade" role="tabpanel">
                                    <h1>Test E</h1> 
                                </div>
                            </div>
                            <div class="d-flex flex-row align-items-center footer">
                                <div class="flex-grow-1 ml-1 hideable">
                                    <span id="alarmlbl">Alarm</span>
                                    <select class="form-control-sm">
                                        <option value="12" id="alarmpulse" selected>Pulse</option>
                                    </select>
                                </div>
                                <button class="btn btn-dark btn-sm mr-2 hideable" id="causeReg-prev" type="button">
                                    <i class="fa fa-angle-left"></i>&nbsp;Prev
                                </button>
                                <button class="btn btn-dark btn-sm mr-2 hideable" id="causeReg-next" type="button">
                                    Next&nbsp;<i class="fa fa-angle-right"></i>
                                </button>
                            </div>
                        </div>
                        <!-- End: System Mgmt Content -->
                    </div>
                </div>
                <!-- End: body -->
            </div>
            <div id="update-tab" class="tab-pane fade" role="tabpanel">
                <div class="page-subheader">
                    <div><span style="font-weight: 300;"><span id="pgeUpdatetitle" class="pl-3" style="background-color: rgba(196,204,204,0);">Software Update</span></span>
                    </div>
                </div>
                <div class="update-content">
                    <h4>Gemba Reporter v<?php echo getVersion(); ?></h4>
                    <h4 style="opacity: 0.90;"><span id="sofware-last-update"> Last Updated:</span> <?php echo getVersionModified(); ?></h4>
                    <div class="row no-gutters">
                        <div class="col"><button id="software-update-btn" class="btn mt-2" type="button"disabled="">Check for Software Update</button></div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col"><button id="dl-update-btn" class="btn mt-2" type="button" disabled="">Download Update</button></div>
                    </div>
                </div>
            </div>
            <div id="about-tab" class="tab-pane fade" role="tabpanel">
                <h6 style="color: rgba(255,255,255,0.8);" class="m-2" id="about-title">About</h6>
                <h3 style="color: white;" class="mx-2 mb-0">Gemba Reporter v<?php echo getVersion(); ?></h3>
                <span style="font-weight: 300; font-style: italic; color: rgba(255,255,255,0.6);" class="mx-2">&#169;&nbsp;<span id="companyName">Line Seiki Inc.</span></span>
                <div style="margin-top: auto; margin-bottom: 1.2rem; font-size: 0.8rem">
                    <span id="about-ip-label" class="m-2">IP Address: </span><span id="about-ip-content"></span>
                </div>
            </div>
        </div>
        <!-- End: page-content -->

        <?php echo setQRMode(); ?>

        <!-- Start: manage cluster -->
        <div class="modal fade" role="dialog" tabindex="-1" id="editCluster" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header text-light bg-dark">
                        <h5 class="modal-title"><i class="fa fa-edit"></i>&nbsp;<span>Edit Cluster Information</span></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>
                    <div class="modal-body">
                        <h6>Access Point Configuration</h6>
                        <div class="row no-gutters mb-2">
                            <div class="col-4 col-sm-3 col-md-3 col-lg-3 col-xl-3"><label class="col-form-label editCluster-label">Cluster Name</label></div>
                            <div class="col-8 col-sm-9 col-md-9 col-lg-9 col-xl-9 editCluster-input">
                                <form><input class="form-control form-control-sm clstr" type="text" minlength="1" maxlength="45" required="" placeholder="Required"></form>
                            </div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-4 col-sm-3 col-md-3 col-lg-3 col-xl-3"><label class="col-form-label editCluster-label">SSID</label></div>
                            <div class="col-8 col-sm-9 col-md-9 col-lg-9 col-xl-9 editCluster-input">
                                <form><input class="form-control form-control-sm ssidInput clstr" type="text" minlength="5" maxlength="32" required="" 
                                    placeholder="Required"
                                    title="Must have 5-32 alphanumeric characters, accepts only (_) and (-), cannot start and end with special character"></form>
                            </div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-4 col-sm-3 col-md-3 col-lg-3 col-xl-3"><label class="col-form-label editCluster-label">Passphrase</label></div>
                            <div class="col editCluster-input">
                                <div class="input-group input-group-sm"><input class="form-control form-control-sm passInput clstr" type="password" minlength="8" maxlength="32" required="" 
                                    placeholder="Required" 
                                    title="Must have 8-32 characters, cannot start and end with special character">
                                    <div class="input-group-append"><button class="btn btn-dark passwBtn" type="button"><i class="fa fa-eye-slash"></i></button></div>
                                </div>
                            </div>
                        </div>
                        <div class="row no-gutters mb-2" hidden>
                            <div class="col-4 col-sm-3 col-md-3 col-lg-3 col-xl-3"><label class="col-form-label editCluster-label">Broadcast SSID</label></div>
                            <div class="col-8 col-sm-9 col-md-9 col-lg-9 col-xl-9 editCluster-input d-flex">
                                <form style="align-self: center;">
                                    <div class="custom-control custom-switch"><input class="custom-control-input" type="checkbox" id="bssidBtn">
                                        <label class="custom-control-label" for="bssidBtn"></label>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <!-- <div class="row no-gutters mb-2">
                            <div class="col-4 col-sm-3 col-md-3 col-lg-3 col-xl-3"><label class="col-form-label editCluster-label">IP Address</label></div>
                            <div class="col-8 col-sm-9 col-md-9 col-lg-9 col-xl-9 editCluster-input">
                                <select class="custom-select custom-select-sm float-left mb-2">
                                    <option disabled="" selected="" hidden="" value="">Select IP Mode</option>
                                    <option value="static">static</option>
                                    <option value="dhcp">DHCP</option>
                                </select>
                            </div>
                        </div> -->
                        <div class="row no-gutters mb-2">
                            <div class="col-4 col-sm-3 col-md-3 col-lg-3 col-xl-3"><label class="col-form-label editCluster-label">IP Address</label></div>
                            <div class="col-8 col-sm-9 col-md-9 col-lg-9 col-xl-9 editCluster-input">
                                <form><input class="form-control form-control-sm ipInput" type="text" placeholder="Required"></form>
                            </div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-4 col-sm-3 col-md-3 col-lg-3 col-xl-3"><label class="col-form-label editCluster-label">MAC Address</label></div>
                            <div class="col-8 col-sm-9 col-md-9 col-lg-9 col-xl-9 editCluster-input">
                                <form><input class="form-control form-control-sm clstr" type="text" minlength="1" maxlength="45" readonly></form>
                            </div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-4 col-sm-3 col-md-3 col-lg-3 col-xl-3"><label class="col-form-label editCluster-label">Description</label></div>
                            <div class="col-8 col-sm-9 col-md-9 col-lg-9 col-xl-9 editCluster-input">
                                <form>
                                    <textarea class="form-control editCluster-txtarea" placeholder="User description here" rows="3" autofocus="" maxlength="100" style="resize: none;"></textarea>
                                    <label style="font-size: 0.8rem;"><span class="charCnt">Characters</span>: <span id="clusDescChar">0</span> / 100</label>
                                </form>
                            </div>
                        </div>
                        <!-- <div class="row no-gutters mb-2">
                            <div class="col-4 col-sm-3 col-md-3 col-lg-3 col-xl-3"><label class="col-form-label editCluster-label"></label></div>
                            <div class="col-8 col-sm-9 col-md-9 col-lg-9 col-xl-9 editCluster-input text-right"><button class="btn btn-dark savelbl" type="button">Save</button></div>
                        </div> -->
                        <!-- <hr>
                        <h6>Rename Cluster</h6>
                        <div class="row no-gutters mb-2">
                            <div class="col-4 col-sm-3 col-md-3 col-lg-3 col-xl-3"><label class="col-form-label editCluster-label">New Cluster&nbsp;<br>Name<br></label></div>
                            <div class="col-8 col-sm-9 col-md-9 col-lg-9 col-xl-9 editCluster-input">
                                <form><input class="form-control form-control-sm" type="text" minlength="1" maxlength="45"></form>
                            </div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"><label class="col-form-label editCluster-label"></label></div>
                            <div class="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9 editCluster-input text-right"><button class="btn btn-dark savelbl" type="button">Save</button></div>
                        </div> -->
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-light closelbl" type="button" data-dismiss="modal">Close</button>
                        <button class="btn btn-dark savelbl" type="button" data-dismiss="modal">Save</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End: manage cluster -->
        <!-- Start: preferences -->
        <div class="modal fade" role="dialog" tabindex="-1" id="prefModal" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light"><i class="fa fa-cog"></i>&nbsp;<label class="preflbl">Preferences</label></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>
                    <div class="modal-body">
                        <h6 class="items">General</h6>
                        <div class="row no-gutters mb-2">
                            <div class="col-5"><label class="col-form-label pl-3 items">Theme</label></div>
                            <div class="col"><select class="custom-select" id="themeSel"><option value="dark" selected="">dark</option><option value="light">light</option></select></div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-5"><label class="col-form-label pl-3 items">Language</label></div>
                            <div class="col"><select class="custom-select" id="langSel"><option value="en" selected="">English</option><option value="jp">Japanese</option><option value="cn">Chinese</option></select></div>
                        </div>
                        <div class="row no-gutters">
                            <div class="col-5"><label class="col-form-label pl-3 items">Alarm Sound</label></div>
                            <div class="col align-self-center">
                                <div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input" id="audio-btn" /><label class="custom-control-label noselect" for="audio-btn">OFF</label></div>
                            </div>
                        </div>
                        <div class="row no-gutters">
                            <div class="col-5"><label class="col-form-label pl-3 items">Show Helper prompts</label></div>
                            <div class="col align-self-center">
                                <div class="custom-control custom-switch"><input class="custom-control-input" type="checkbox" id="helper-btn"><label class="custom-control-label noselect" for="helper-btn">OFF</label></div>
                            </div>
                        </div>
                        <div class="row no-gutters">
                            <div class="col-5"><label class="col-form-label pl-3 items">Fullscreen</label></div>
                            <div class="col align-self-center">
                                <div class="custom-control custom-switch"><input class="custom-control-input" type="checkbox" id="fs-btn"><label class="custom-control-label noselect" for="fs-btn">OFF</label></div>
                            </div>
                        </div>
                        <hr hidden>
                        <h6 class="items" hidden>Dashboard</h6>
                        <div class="row no-gutters mb-2" hidden>
                            <div class="col-5"><label class="col-form-label pl-3 items">Scroll Interval (seconds)</label></div>
                            <div class="col">
                                <form><input class="form-control" type="number" id="interval-btn" value="10"></form>
                            </div>
                        </div>
                        <div class="row no-gutters" hidden>
                            <div class="col-5"><label class="col-form-label pl-3 items">Autoscroll</label></div>
                            <div class="col align-self-center">
                                <div class="custom-control custom-switch"><input class="custom-control-input" type="checkbox" id="autoscroll-btn"><label class="custom-control-label noselect" for="autoscroll-btn">OFF</label></div>
                            </div>
                        </div>
                        <div class="row no-gutters" hidden>
                            <div class="col-5"><label class="col-form-label pl-3 items">Large Display Mode</label></div>
                            <div class="col align-self-center">
                                <div class="custom-control custom-switch"><input class="custom-control-input" type="checkbox" id="kiosk-btn" for="kiosk-btn"><label class="custom-control-label noselect" for="kiosk-btn">OFF</label></div>
                            </div>
                        </div>
                        <hr>
                        <h6 class="items">Tabular View</h6>
                        <div class="row no-gutters">
                            <div class="col-5"><label class="col-form-label pl-3 items">Wrap Columns</label></div>
                            <div class="col align-self-center">
                                <div class="custom-control custom-switch"><input class="custom-control-input" type="checkbox" id="colWrap-btn"><label class="custom-control-label noselect" for="colWrap-btn">OFF</label></div>
                            </div>
                        </div>
                        <hr hidden>
                        <h6 class="items" hidden>Timechart</h6>
                        <div class="row no-gutters mb-2" hidden>
                            <div class="col-5"><label class="col-form-label pl-3 items">Items Per Page</label></div>
                            <div class="col">
                                <form><input class="form-control" type="number" id="chartitem-btn" value="6" max="24" min="1"></form>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer"><button class="btn btn-light closelbl" type="button" data-dismiss="modal">Close</button><button class="btn btn-dark savelbl" id="pref-save-btn" type="button">Save</button></div>
                </div>
            </div>
        </div>
        <!-- End: preferences -->
        <!-- Start: filter pane -->
        <div class="modal fade" role="dialog" tabindex="-1" id="filterModal" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light"><i class="fa fa-filter"></i>&nbsp;<span>Filter Options</span></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>
                    <div class="modal-body">
                        <h6 class="itemSel"><span class="label">Items Selected</span>:&nbsp;<span class="value">0</span></h6>
                        <div class="row no-gutters mb-3">
                            <div class="col-5"><label class="col-form-label pl-3">Filter</label></div>
                            <div class="col"><select class="selectpicker" data-size="14" multiple="" data-display="static"></select></div>
                        </div>
                        <div class="row no-gutters mb-3">
                            <div class="col-5"><label class="col-form-label pl-3">Filter</label></div>
                            <div class="col"><select class="selectpicker" data-size="14" multiple="" data-display="static"></select></div>
                        </div>
                        <div class="row no-gutters mb-3">
                            <div class="col-5"><label class="col-form-label pl-3">Filter</label></div>
                            <div class="col"><select class="selectpicker" data-size="14" multiple="" data-display="static"></select></div>
                        </div>
                        <div class="row no-gutters mb-3">
                            <div class="col-5"><label class="col-form-label pl-3">Filter</label></div>
                            <div class="col"><select class="selectpicker" data-size="14" multiple="" data-display="static"></select></div>
                        </div>
                        <div class="row no-gutters mb-3">
                            <div class="col-5"><label class="col-form-label pl-3">Filter</label></div>
                            <div class="col"><select class="selectpicker" data-size="14" multiple="" data-display="static"></select></div>
                        </div>
                        <div class="row no-gutters mb-3">
                            <div class="col-5"><label class="col-form-label pl-3">Filter</label></div>
                            <div class="col"><select class="selectpicker" data-size="14" multiple="" data-display="static"></select></div>
                        </div>
                        <div class="summary-checkbox">
                            <hr>
                            <div class="row no-gutters mb-2">
                                <div class="col-10"><label class="col-form-label pl-3 items">Show sasScheduled End</label></div>
                                <div class="col align-self-center">
                                    <div class="custom-control custom-switch"><input class="custom-control-input" type="checkbox" id="show-schedend"><label class="custom-control-label" for="show-schedend">OFF</label></div>
                                </div>
                            </div>
                            <div class="row no-gutters mb-2">
                                <div class="col-10"><label class="col-form-label pl-3 items">Show Actual Production End</label></div>
                                <div class="col align-self-center">
                                    <div class="custom-control custom-switch"><input class="custom-control-input" type="checkbox" id="show-prodend" for="formCheck-5"><label class="custom-control-label" for="show-prodend">OFF</label></div>
                                </div>
                            </div>
                            <div class="row no-gutters mb-2">
                                <div class="col-10"><label class="col-form-label pl-3 items">Consolidate Jobs from the same Job Schedule</label></div>
                                <div class="col align-self-center">
                                    <div class="custom-control custom-switch"><input class="custom-control-input" type="checkbox" id="consolidate-btn" for="formCheck-5"><label class="custom-control-label" for="consolidate-btn">OFF</label></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <label class="m-0" style="visibility: hidden">Apply Filter</label>&nbsp;
                        <div id="apply-filter-btn" class="switch" style="visibility: hidden"><input type="checkbox">
                            <div class="slider round"><span class="on">ON</span><span class="off">OFF</span></div>
                        </div>
                        <button class="btn btn-dark add-btn" id="clear-filter-btn" type="button" style="border-radius: 34px;"><i class="fa fa-undo"></i>&nbsp;<span>Reset</span></button></div>
                </div>
            </div>
        </div>
        <!-- End: filter pane -->
        <!-- Start: prompt -->
        <div class="modal fade" role="dialog" tabindex="-1" id="promptModal" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light"><i class="fa fa-exclamation-circle text-primary"></i>&nbsp;<label>Status</label></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>
                    <div class="modal-body">
                        <h6><i class="fa fa-question-circle"></i>&nbsp;Prompt message here.</h6>
                    </div>
                    <div class="modal-footer"><button class="btn btn-dark closelbl" type="button" data-dismiss="modal">Close</button></div>
                </div>
            </div>
        </div>
        <!-- End: prompt -->
        <!-- Start: warning -->
        <div class="modal fade" role="dialog" tabindex="-1" id="warningModal" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light">
                            <i class="fa fa-warning text-warning"></i>&nbsp;&nbsp;<label>Warning!</label>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    </div>
                    <div class="modal-body">
                        <h6>Prompt message here.</h6>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-dark yeslbl" id="warnYes" type="button" data-topic="">Yes</button>
                        <button class="btn btn-dark nolbl" id="warnNo" type="button" data-dismiss="modal">No</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End: warning -->
        <!-- Start: downtime cause -->
        <div class="modal fade" role="dialog" tabindex="-1" id="downModalBox" data-backdrop="static">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-center text-light w-100">&nbsp;<label><span id="machinelbl">Machine ID:</span>&nbsp;<span class="machineName">-</span>&nbsp;設備停止<br></label></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close" hidden=""><span aria-hidden="true">×</span></button></div>
                    <div class="modal-body" style="padding-top: 10px;padding-bottom: 10px;">
                        <div>
                            <div class="row no-gutters">
                                <div class="col-1 text-center align-self-center"><button class="btn btn-left" type="button"><i class="fa fa-caret-left"></i></button></div>
                                <div class="col text-center">
                                    <div class="mb-2">
                                        <div class="row">
                                            <div class="col text-center align-self-center mx-auto">
                                                <form><input type="text" class="form-control text-center" id="stop-label" value="Please enter stop cause" style="background-color: #c72a39; color: white;" readonly/></form>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="button-panel">
                                        <div class="panel-container"></div>
                                    </div>
                                </div>
                                <div class="col-1 text-center align-self-center"><button class="btn btn-right" type="button"><i class="fa fa-caret-right"></i></button></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer"><button class="btn btn-dark closelbl" id="registerClose" type="button" data-dismiss="modal">Close</button><button class="btn btn-dark" id="registerBtn" type="button" data-lid="">Save</button></div>
                </div>
            </div>
        </div>
        <!-- End: downtime cause -->
        <!-- Start: help -->
        <div class="modal fade" role="dialog" tabindex="-1" id="helpModal">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light"><i class="fa fa-info-circle text-primary"></i>&nbsp;<label>Notice</label></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>
                    <div class="modal-body">
                        <p class="text-left mb-1 items">View Mode does not display ongoing logs</p>
                        <ul style="padding-left: 40px;">
                            <li class="items" style="list-style: disc !important;">Productive</li>
                            <li class="items" style="list-style: disc !important;">Unproductive</li>
                        </ul>
                        <p class="text-left mb-2 items">Note: Automatic page update disabled</p>
                    </div>
                    <div class="modal-footer">
                        <form style="position: absolute; left: 15px;">
                            <div class="form-check"><input class="form-check-input" type="checkbox" id="donotshow"><label class="form-check-label" for="donotshow">Do not show this message again</label></div>
                        </form><button class="btn btn-dark closelbl" type="button" data-dismiss="modal">Close</button></div>
                </div>
            </div>
        </div>
        <!-- End: help -->
        <!-- Start: audio prompt -->
        <div class="modal fade" role="dialog" tabindex="-1" id="audioModal" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light"><i class="fa fa-volume-up"></i>&nbsp;<label class="permlbl">Permission</label></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>
                    <div class="modal-body">
                        <p class="text-left mb-1">Allow Gemba App to play audio?</p>
                    </div>
                    <div class="modal-footer">
                       <button id="audioNo" class="btn btn-dark denylbl" type="button" data-dismiss="modal">Deny</button><button id="audioYes" class="btn btn-dark allowlbl" type="button" data-dismiss="modal">Allow</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End: audio prompt -->
        <!-- Start: fullscreen prompt -->
        <div class="modal fade" role="dialog" tabindex="-1" id="fsModal" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light"><i class="icon-size-fullscreen"></i>&nbsp;<label>&nbsp;Permission</label></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>
                    <div class="modal-body">
                        <p class="text-left mb-1">Allow Gemba App to display in fullscreen?</p>
                    </div>
                    <div class="modal-footer">
                       <button id="fsNo" class="btn btn-dark" type="button" data-dismiss="modal">Deny</button><button id="fsYes" class="btn btn-dark" type="button" data-dismiss="modal">Allow</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End: fullscreen prompt -->
        <!-- Start: logout prompt -->
        <div class="modal fade" role="dialog" tabindex="-1" id="logoutModal">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light"><i class="fa fa-sign-out text-danger"></i>&nbsp;<label class="logoutlbl">Logout</label></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>
                    <div class="modal-body">
                        <p class="text-left mb-1 logoutPrompt">Are you sure you want to Logout?</p>
                    </div>
                    <div class="modal-footer">
                       <button class="btn btn-light cancelbl" type="button" data-dismiss="modal">Cancel</button><button id="logoutYes" class="btn btn-dark proceedlbl" type="button" data-dismiss="modal">Proceed</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End: logout prompt -->
        <!-- Start: qr schedule prompt -->
        <div role="dialog" tabindex="-1" class="modal fade" id="qrSchedModal" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light"><i class="fa fa-check-circle text-success" value="Plain Text Value" readonly></i> Schedule Added</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>
                    <div class="modal-body">
                        <h6 class="schedInfolbl">Schedule Information</h6>
                        <div class="row no-gutters mb-2">
                            <div class="col-6"><label class="col-form-label pl-3">Machine</label></div>
                            <div class="col"><input type="text" class="form-control-plaintext" readonly value="--" style="color: #111111;" /></div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-6"><label class="col-form-label pl-3">Job Order</label></div>
                            <div class="col"><input type="text" class="form-control-plaintext" readonly style="color: #111111;" value="--" /></div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-6"><label class="col-form-label pl-3">Model</label></div>
                            <div class="col"><input type="text" class="form-control-plaintext" readonly style="color: #111111;" value="--" /></div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-6"><label class="col-form-label pl-3">Material</label></div>
                            <div class="col"><input type="text" class="form-control-plaintext" value="--" readonly style="color: #111111;" /></div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-6"><label class="col-form-label pl-3">Target Quantity</label></div>
                            <div class="col"><input type="text" class="form-control-plaintext" readonly style="color: #111111;" value="--" /></div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-6"><label class="col-form-label pl-3">Prewarn</label></div>
                            <div class="col"><input type="text" class="form-control-plaintext" value="--" readonly style="color: #111111;" /></div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-6"><label class="col-form-label pl-3">Operator</label></div>
                            <div class="col"><input type="text" class="form-control-plaintext" value="--" readonly style="color: #111111;" /></div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-6"><label class="col-form-label pl-3">Scheduled Start</label></div>
                            <div class="col"><input type="text" class="form-control-plaintext" value="--" readonly style="color: #111111;" /></div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-6"><label class="col-form-label pl-3">Scheduled End</label></div>
                            <div class="col"><input type="text" class="form-control-plaintext" readonly style="color: #111111;" value="--" /></div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-6"><label class="col-form-label pl-3">Cycle Time</label></div>
                            <div class="col"><input type="text" class="form-control-plaintext" value="--" readonly style="color: #111111;" /></div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-6"><label class="col-form-label pl-3">Prescale</label></div>
                            <div class="col"><input type="text" class="form-control-plaintext" value="--" readonly style="color: #111111;" /></div>
                        </div>
                    </div>
                    <div class="modal-footer"><button class="btn btn-dark closelbl" type="button" data-dismiss="modal">Close</button></div>
                </div>
            </div>
        </div>
        <!-- End: qr schedule prompt -->
        <!-- Start: start n' stop prompt -->
        <div class="modal fade" role="dialog" tabindex="-1" id="snsModal" data-backdrop="static" data-keyboard = "false">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <p class="text-center mb-0 px-3 py-2">
                            <span role="status" class="spinner-border spinner-border-sm text-primary"></span>&nbsp;&nbsp;<span class="snsPrompt">Unknown</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- End: start n' stop prompt -->
        <img id="qr-img" height="156" width="156" src="" alt="" hidden="true" />
        <!-- Start: Add new user prompt -->
        <div role="dialog" tabindex="-1" class="modal fade" id="addUserMngmtModal">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light"><i class="fa fa-plus"></i>&nbsp;<span class="addnewuser">Add New User</span></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>
                    <div class="modal-body">
                        <div class="row no-gutters mb-2">
                            <div class="col-5"><label class="col-form-label">Full Name</label></div>
                            <div class="col">
                                <form><input type="text" class="form-control accntInput" placeholder="Account name" /></form>
                            </div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-5"><label class="col-form-label">Username<span class="uname-error text-danger" style="display: none; font-weight: bolder;">&nbsp;*</span></label></div>
                            <div class="col">
                                <form><input type="text" class="form-control accntInput" onchange="userValidation(null, this, true)" placeholder="Must have 5-16 characters"/></form>
                            </div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-5"><label class="col-form-label">Password<span class="pass-error text-danger" style="display: none; font-weight: bolder;">&nbsp;*</span></label></div>
                            <div class="col">
                                    <!-- <form> -->
                                    <div class="input-group">
                                        <input type="password" name="accntpassword" class="form-control accntInput accntPassword" onchange="passValidation(null, this, true)" 
                                        placeholder="Must have 8-16 char, atleast 1 special char, atleast 1 capital letter" 
                                        title="Must have 8-16 characters, atleast 1 special character, atleast 1 capital letter, at least 1 small letter, at least 1 number"/>
                                        <!-- <span class="input-group-addon" role="button" title="view password" id="passBtn">
                                        <i class="fa fa-eye fa-fw" aria-hidden="true"></i></span> -->
                                        <div class="input-group-append"><button class="btn btn-dark accntpasswBtn" type="button"><i class="fa fa-eye-slash"></i></button></div>
                                    </div>
                                    <!-- </form> -->
                            </div>
                        </div>
                        <div class="row no-gutters mb-2">
                            <div class="col-5"><label class="col-form-label">Confirm Password<span class="vpass-error text-danger" style="display: none; font-weight: bolder;">&nbsp;*</span></label></div>
                            <div class="col">
                                <!-- <form> -->
                                <div class="input-group">
                                    <input type="password" name="accntpassword" class="form-control accntInput accntPassword" placeholder="Retype Password"/>
                                    <!-- <div class="input-group-append"><button class="btn btn-dark accntpasswBtn" type="button"><i class="fa fa-eye-slash"></i></button></div> -->
                                </div>
                                <!-- </form> -->
                            </div>
                        </div>
                        <div class="row no-gutters">
                            <div class="col-5"><label class="col-form-label">JO Dashboard</label></div>
                            <div class="col align-self-center">
                                <div class="form-check"><input type="checkbox" class="form-check-input" id="perm_1"/><label class="form-check-label" for="perm_1">Enable</label></div>
                            </div>
                        </div>
                        <div class="row no-gutters">
                            <div class="col-5"><label class="col-form-label">Schedule</label></div>
                            <div class="col align-self-center">
                                <div class="form-check"><input type="checkbox" class="form-check-input" id="perm_2"/><label class="form-check-label" for="perm_2">Enable</label></div>
                            </div>
                        </div>
                        <div class="row no-gutters">
                            <div class="col-5"><label class="col-form-label">Rejects Input</label></div>
                            <div class="col align-self-center">
                                <div class="form-check"><input type="checkbox" class="form-check-input" id="perm_3"/><label class="form-check-label" for="perm_3">Enable</label></div>
                            </div>
                        </div>
                        <div class="row no-gutters">
                            <div class="col-5"><label class="col-form-label">Data Amendment</label></div>
                            <div class="col align-self-center">
                                <div class="form-check"><input type="checkbox" class="form-check-input" id="perm_4"/><label class="form-check-label" for="perm_4">Enable</label></div>
                            </div>
                        </div>
                        <div class="row no-gutters">
                            <div class="col-5"><label class="col-form-label">Admin Access</label></div>
                            <div class="col align-self-center">
                                <div class="form-check"><input type="checkbox" class="form-check-input" id="perm_5"/><label class="form-check-label" for="perm_5">Enable</label></div>
                            </div>
                        </div>
                        <div class="row no-gutters">
                            <div class="col align-self-center">
                                <label class="col-form-label error text-danger"></label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer"><button class="btn btn-light closelbl" type="button" data-dismiss="modal">Close</button><button class="btn btn-dark savelbl" id="userMngmt-save" type="button">Save</button></div>
                </div>
            </div>
        </div>
        <!-- End: Add new user prompt -->
        <!-- Start: graph prompt -->
        <div class="modal fade" role="dialog" tabindex="-1" id="graphModal" data-backdrop="static">
            <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <p class="text-center mb-0 px-3 py-2">
                            <span class="snsPrompt">Unknown</span><span>...</span>
                        </p>
                        <p class="text-center mb-0 px-3 pt-2 pb-3">
                            <span role="status" class="spinner-border spinner-border text-primary"></span>
                        </p>
                        <button id="cancelLoading" type="button" class="btn btn-dark btn-block cancelbl" disabled>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End: graph prompt -->
        <!-- Start: network change prompt -->
        <div class="modal fade" role="dialog" tabindex="-1" id="networkModal" data-backdrop="static">
            <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
                <div class="modal-content">
                    <p class="text-center mb-0 px-3 py-2">
                        <span class="snsPrompt"></span><span>...</span>
                    </p>
                    <p class="text-center mb-0 px-3 pt-2 pb-3">
                        <span role="status" class="spinner-border spinner-border text-primary"></span>
                    </p>
                </div>
            </div>
        </div>
        <!-- End: network change prompt -->
        <!-- Start: Scan basestation prompt -->
        <div class="modal fade" role="dialog" tabindex="-1" id="scanBSModal" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light"><label class="scanlbl">Scanned Basestations</label></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>
                    <div class="modal-body">
                        <h6>Select Basestation to add</h6>
                        <div class="bsList">
                            <!-- Contents here -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="refreshBSBtn" class="btn btn-dark float-left" type="button" data-dismiss="modal" style="position: absolute; left: 15px;"><i class="fas fa-redo-alt"></i>&nbsp;<span class="rescanlbl">Re-scan</span></button>
                        <button class="btn btn-light cancelbl" type="button" data-dismiss="modal">Cancel</button>
                        <button id="saveBSBtn" class="btn btn-dark savelbl" type="button">Save</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End: scan basestation prompt -->
        <!-- Start: large display prompt -->
        <div class="modal fade" role="dialog" tabindex="-1" id="lgDispModal" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light">
                            <i class="fa fa-warning text-warning"></i>&nbsp;&nbsp;<label>Warning!</label>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-justify mb-0 px-3 mb-1 note"></p>
                        <p class="text-justify mb-0 px-3 continue"></p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-dark yeslbl" type="button">Yes</button>
                        <button class="btn btn-dark nolbl" type="button" data-dismiss="modal">No</button></div>
                </div>
            </div>
        </div>
        <!-- End: large display prompt -->
        <!-- Start: overview help -->
        <div class="modal fade" role="dialog" tabindex="-1" id="overviewHelp">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light"><i class="fa fa-info-circle text-primary"></i>&nbsp;<label class="noticelbl">Notice</label></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>
                    <div class="modal-body">
                        <!-- <p class="text-left mb-1 items">Loading of Overview page may take sometime.</p>
                        <p class="text-left mb-1 items">Please click the box of the respective device to update its status immediately.</p> -->
                        <p class="text-left mb-1 items" id="loadingNote">Loading of Overview page may take sometime.<br>Please click the box of the respective device to update its status immediately.</p>
                    </div>
                    <div class="modal-footer">
                        <form style="position: absolute; left: 15px;">
                            <div class="form-check"><input class="form-check-input" type="checkbox" id="donotshow-1"><label class="form-check-label" for="donotshow-1">Do not show this message again</label></div> <!-- donotshow-1 -->
                        </form><button class="btn btn-dark closelbl" type="button" data-dismiss="modal">Close</button></div>
                </div>
            </div>
        </div>
        <!-- End: overview help -->
        <!-- Start: rename modal -->
        <div class="modal fade" role="dialog" tabindex="-1" id="renameModal">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light">
                            <i class="fa fa-edit text-light"></i>&nbsp;<label class="renamelbl">Set New Device Name</label>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    </div>
                    <div class="modal-body">
                        <div class="row no-gutters mb-2">
                            <div class="col">
                                <form><input class="form-control form-control-sm renameInput" type="text" placeholder="New Device Name"/></form>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                       <button class="btn btn-light cancelbl" type="button" data-dismiss="modal">Cancel</button>
                       <button class="btn btn-dark savelbl" type="button" data-dismiss="modal">Save</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End: rename modal -->
        <!-- Start: Enable AP0 modal -->
        <div class="modal fade" role="dialog" tabindex="-1" id="enAP0Modal">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light">
                            <i class="fa fa-warning text-warning"></i>&nbsp;
                            <label class="title">Enable Scanning Access Point</label>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    </div>
                    <div class="modal-body" id="startApMsg">
                        <p class="text-justify mb-1 items">
                            Scanning access point will be enabled.
                        </p>
                        <!-- <p class="text-justify mb-1 items">
                            This will cause the Base Station access point to be reset and clients (Smart Counters, browsers) directly connected to the Base Station access point will be disconnected.
                        </p> -->
                        <br>
                        <p class="text-justify mb-1 items">
                            Would you like to continue?
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-light cancelbl" type="button" data-dismiss="modal">Cancel</button>
                        <button class="btn btn-dark contlbl" type="button" data-dismiss="modal">Continue</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End: Enable AP0 modal -->
        <!-- Start: Retry SSID/Password Save modal -->
        <div class="modal fade" role="dialog" tabindex="-1" id="retryNwkSaveModal" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light">
                            <i class="fa fa-warning text-warning"></i>&nbsp;&nbsp;<label>Retry Saving Cluster Information</label>
                            <!-- <div id="retryNwkSaveModalTitle">
                                <label class="title">Retry Saving Cluster Information</label>
                                <span class="clusName"></span>
                            </div>  -->
                        </h5>                     
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    </div>
                    <div class="modal-body">
                        <h6>Failed to save network configuration to some devices!</h6>
                        <div class="devFailedList">
                            <!-- Contents here -->
                            <!-- <p class="text-center mb-0 px-3 pt-2 pb-3">
                                <span role="status" class="spinner-border spinner-border text-primary"></span>
                            </p> -->
                        </div>
                        <div class="devFailedStatus"><label>Do you want to proceed?</label></div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-dark" type="button" id="retryNwkSaveBtn">Retry</button>
                        <span style="flex: auto;"></span><!-- Separates Enable button from others -->
                        <button class="btn btn-dark yeslbl" id="nwkSaveYes" type="button">Yes</button>
                        <button class="btn btn-dark nolbl" id="nwkSaveNo" type="button" data-dismiss="modal">No</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End: Retry SSID/Password Save modal -->
        <!-- Start: Scan devices modal -->
        <div class="modal fade" role="dialog" tabindex="-1" id="scanDevModal" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light">
                            <i class="fa fa-search-plus"></i>&nbsp;
                            <div id="scanDevModalTitle">
                                <label class="title">Scan Available Devices</label>
                                <span class="clusName"></span>
                            </div> 
                        </h5>                     
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    </div>
                    <div class="modal-body">
                        <h6>Select Smart Counters to add</h6>
                        <div class="scanDevList">
                            <!-- Contents here -->
                            <!-- <p class="text-center mb-0 px-3 pt-2 pb-3">
                                <span role="status" class="spinner-border spinner-border text-primary"></span>
                            </p> -->
                        </div>
                        <div class="scanStatus"><label>Number of allocated devices:</label>:&nbsp;<span>0</span></div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-dark" type="button" id="defHostEn">Enable</button>
                        <span style="flex: auto;"></span><!-- Separates Enable button from others -->
                        <button class="btn btn-light closelbl" type="button" data-dismiss="modal">Close</button>
                        <button class="btn btn-dark startlbl" type="button" id="startDevScan" >Start</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End: Scan devices modal -->
        <!-- Start: Remove devices modal -->
        <div class="modal fade" role="dialog" tabindex="-1" id="removeDevModal" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light"><i class="fa fa-search-plus"></i>&nbsp;<label class="title">Remove Device</label><span class="clusName"></span></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    </div>
                    <div class="modal-body">
                        <h6>Select Smart Counter Device to be removed.</h6>
                        <div class="removeDevList">
                            <!-- Contents here -->
                            <!-- <p class="text-center mb-0 px-3 pt-2 pb-3">
                                <span role="status" class="spinner-border spinner-border text-primary"></span>
                            </p> -->
                        </div>
                        <div class="removeStatus"><label>Number of Registered devices</label>:&nbsp;<span>0</span></div>
                    </div>
                    <div class="modal-footer">
                        <button id="cancelDevRemove" class="btn btn-light cancellbl" type="button" data-dismiss="modal">Cancel</button>
                        <button id="refreshDevRemove" class="btn btn-dark refreshlbl" type="button">Refresh</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End: Remove devices modal -->
        <!-- Start: List Active devices modal -->
        <div class="modal fade" role="dialog" tabindex="-1" id="activeDevModal" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light"><i class="fa fa-search-plus"></i>&nbsp;<label class="title">Smart Counter Devices</label></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                    </div>
                    <div class="modal-body">
                        <h6>Select Smart Counter Device.</h6>
                        <div class="activeDevList">
                            <!-- Contents here -->
                            <!-- <p class="text-center mb-0 px-3 pt-2 pb-3">
                                <span role="status" class="spinner-border spinner-border text-primary"></span>
                            </p> -->
                        </div>
                        <div class="activeStatus"><label>Number of Registered devices</label>:&nbsp;<span>0</span></div>
                    </div>
                    <div class="modal-footer">
                        <button id="cancelDBDelete" class="btn btn-light cancellbl" type="button" data-dismiss="modal">Cancel</button>
                        <button id="applyDBDelete" class="btn btn-dark deletelbl" type="button">Delete from DB</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End: List Active devices modal -->
        <!-- Start: camera modal -->
        <div class="modal fade" role="dialog" tabindex="-1" id="cameraModal" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark">
                        <h5 class="modal-title text-light"><i class="fa fa-cog"></i>&nbsp;<label class="cameralbl">Select Camera Device</label></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>
                    <div class="modal-body">
                        <h6 class="items" id="camera-pref-lbl">Camera Preference</h6>
                        <div class="row no-gutters mb-2">
                            <div class="col-5"><label class="col-form-label pl-3 items" id="camera-title">Camera</label></div>
                            <div class="col"><select class="custom-select" id="cameraSel"><option value="dark" disabled selected>No device</option></select></div>
                        </div>
                    </div>
                    <div class="modal-footer"><button class="btn btn-light closelbl" type="button" data-dismiss="modal">Close</button><button class="btn btn-dark savelbl" id="camera-save-btn" type="button">Save</button></div>
                </div>
            </div>
        </div>
        <button class="btn btn-dark btn-sm table-header-btn" id="switch-camera-btn" type="button"><i class="fa fa-camera"></i></button>
        <!-- End: scan devices prompt -->
        <div id="sound"></div>

        <script src="assets/js/jquery.min.js"></script>
        <script src="assets/bootstrap/js/bootstrap.min.js"></script>
        <script src="assets/js/sidebar.js?version=2"></script>
        <script src="assets/js/DataTables/datatables.min.js"></script>
        <script src="assets/js/DataTables/Buttons-1.5.6/buttons.bootstrap4.min.js"></script>
        <script src="assets/js/DataTables/Buttons-1.5.6/buttons.colVis.min.js"></script>
        <script src="assets/js/DataTables/Buttons-1.5.6/buttons.jqueryui.min.js"></script>
        <script src="assets/js/DataTables/Buttons-1.5.6/dataTables.buttons.js"></script>
        <script src="assets/js/DataTables/Buttons-1.5.6/dataTables.buttons.min.js"></script>
        <script src="assets/js/DataTables/DataTables-1.10.18/dataTables.bootstrap4.min.js"></script>
        <script src="assets/js/DataTables/DataTables-1.10.18/dataTables.jqueryui.min.js"></script>
        <script src="assets/js/DataTables/DataTables-1.10.18/jquery.dataTables.min.js"></script>
        <script src="assets/js/DataTables/FixedHeader-3.1.4/dataTables.fixedHeader.min.js"></script>
        <script src="assets/js/DataTables/FixedHeader-3.1.4/fixedHeader.bootstrap4.min.js"></script>
        <script src="assets/js/DataTables/FixedHeader-3.1.4/fixedHeader.dataTables.js"></script>
        <script src="assets/js/DataTables/FixedHeader-3.1.4/fixedHeader.jqueryui.min.js"></script>
        <script src="assets/js/DataTables/Responsive-2.2.2/dataTables.responsive.min.js"></script>
        <script src="assets/js/DataTables/Responsive-2.2.2/responsive.bootstrap4.min.js"></script>
        <script src="assets/js/DataTables/Responsive-2.2.2/responsive.jqueryui.min.js"></script>
        <script src="assets/js/DataTables/RowGroup-1.1.0/dataTables.rowGroup.min.js"></script>
        <script src="assets/js/DataTables/RowGroup-1.1.0/rowGroup.bootstrap4.min.js"></script>
        <script src="assets/js/DataTables/RowGroup-1.1.0/rowGroup.dataTables.js"></script>
        <script src="assets/js/DataTables/RowGroup-1.1.0/rowGroup.jqueryui.min.js"></script>
        <script src="assets/js/DataTables/Select-1.3.0/dataTables.select.min.js"></script>
        <script src="assets/js/DataTables/Select-1.3.0/select.bootstrap4.min.js"></script>
        <script src="assets/js/DataTables/Select-1.3.0/select.dataTables.js"></script>
        <script src="assets/js/DataTables/Select-1.3.0/select.jqueryui.min.js"></script>
        <script src="assets/js/jquery-ui.min.js"></script>
        <script src="assets/js/jquery-ui-timepicker-addon.js"></script>
        <script src="assets/js/bootstrap-select.js"></script>
        <script src="assets/js/bs-animation.js"></script>
        <script src="assets/js/jquery.canvasjs.min.js"></script>
        <script src="assets/js/Custom/controlScript.js?version=35"></script>
        <script src="assets/js/Custom/dashboardScript.js?version=8"></script>
        <script src="assets/js/Custom/durationScript.js?version=4"></script>
        <script src="assets/js/Custom/exportScript.js?version=38"></script>
        <script src="assets/js/Custom/filterScript.js?version=2"></script>
        <script src="assets/js/Custom/overviewScriptRevised.js?version=18"></script>
        <script src="assets/js/Custom/signinScript.js?version=2"></script>
        <script src="assets/js/Custom/timerScript.js?version=13"></script>
      
        <script src="assets/js/natural.js"></script>
        <script src="assets/js/progressBar-circle.js?version=2"></script>
        <script src="assets/js/snap.svg-min.js"></script>
        <script src="assets/js/moment.min.js"></script>
        <script src="assets/js/qr_packed.min.js"></script>
        <script src="assets/js/Custom/qrScript.js?version=32"></script>
        <script src="assets/js/Canvas/rgbcolor.min.js"></script>
        <script src="assets/js/Canvas/html2canvas.min.js"></script>
        <script src="assets/js/Canvas/canvg.min.js"></script>
        <script src="assets/js/Custom/paginationModule.js"></script>
        <script src="assets/js/jsQR.js"></script>
        <script src="assets/js/Custom/liveQRScript.js?version=4"></script>
        <script src="assets/js/Custom/scheduleScript.js?version=13"></script>
        <script src="assets/js/Custom/rejectScript.js?version=13"></script>
        <script src="assets/js/Custom/clusterConfig.js?version=90"></script>
        <script src="assets/js/Custom/summaryScript.js?version=24"></script>
        <!-- -->
        <script src="assets/js/Custom/newSystemScript.js?version=26"></script>
        <script src="assets/js/Custom/unproductiveScript.js?version=23"></script>
        <script src="assets/js/Custom/simplifiedTimeChart.js?version=51"></script>
        <script src="assets/js/Custom/detailedLogScript.js?version=26"></script>
        <script src="assets/js/Custom/timeGraph.js?version=20"></script>
        <script src="assets/js/Custom/timeGraphNew.js?version=1"></script>
        <script src="assets/js/Custom/translatePage.js?version=8"></script>
        <script src="assets/js/Custom/joTimeChart.js?version=3"></script>
        <!-- -->
        <script src="assets/js/Custom/main.js?version=10"></script>
        <script src="assets/js/Custom/visualizationv2.js?version=24"></script>
        <!--  -->
        <script src="assets/js/Custom/scheduleChart.js?version=1"></script>
        <script src="assets/js/Custom/downtimeScript.js?version=1"></script>
        <script src="assets/js/Custom/productivityScript.js?version=1"></script>

        <script src="assets/js/xlsx.full.min.js?version=1"></script>
      
        <script src="assets/js/Custom/joExportProductivity.js?version=1"></script>
        <script src="assets/js/jquery.resize.js"></script>

        <!-- Old Comments
      <script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script> 
      <script src="assets/js/Custom/joTimeChartNew.js"></script>
       <script src="assets/js/Custom/visualization.js?version=23"></script>
    <script src="assets/js/Custom/systemScript.js?version=3"></script> 
    <script src="assets/js/dataTables.pageResize.min.js"></script>
    -->
</body>

</html>