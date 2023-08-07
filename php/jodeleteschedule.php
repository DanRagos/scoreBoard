<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $jobID = $_POST['scdid'];

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);

	if($result = mysqli_query($con, 
		" select gemba_db.delete_jobSchedule(" . $jobID . ") "
	)) {
		echo json_encode($result);
	} else {
		echo json_encode("failed");
	}

	$db->close($con);
?>