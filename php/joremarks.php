<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $jobID = $_POST['did'];
    $jobRM = $_POST['rem'];

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);

   	$retval = 'failed';
	if($result = mysqli_query($con, 
		" select gemba_db.edit_downtime_remarks(" . $jobID . ", '" .  ($jobRM == '' ? '--' : rtrim($jobRM)) . "', '') "
	)) {
		// if (mysqli_num_rows($result) > 0) {
		if ($res = mysqli_fetch_array($result)) {
			if($res[0] != '0') {
				// $retval = 'success';
				$retval = $res[0];
			}
		}
		// }
		mysqli_next_result($con);
	}
	$db->close($con);

	echo json_encode($retval);
?>