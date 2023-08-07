<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $cmd = $_POST['cmd'];
    $jobID = $_POST['sid'];
    $jobVL = $_POST['val'];
    $jobUS = $_POST['pid'];

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
    ini_set('max_execution_time', 3000);

    if($cmd == 'write') {
        if($jobVL == 1) {
            $query = " select gemba_db.jobScheduleSetLock(" . $jobID . ", " . $jobUS . ") ";
        } else {
            $query = " select gemba_db.jobScheduleSetUnlock(" . $jobID . ", " . $jobUS . ") ";
        }
    } else {
        return "Invalid command";
    }

    try {
        if(mysqli_query($con, $query)) {
            echo json_encode("success");
        }
        else {
            echo json_encode("failed");
        }
    } 
    catch (Exception $e) {
        echo json_encode("failed");
    }

    $db->close($con);
?>