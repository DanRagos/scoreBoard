<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $jobID = $_POST['did'];
    $jobVL = $_POST['val'];

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);

   	$retval = 'failed';
	if($result = mysqli_query($con, 
		"SELECT gemba_db.setRejectRemarks({$jobID},'{$jobVL}')"
	)) {
		if ($res = mysqli_fetch_array($result)) {
			if($res[0] != '0') {
				$retval = $res[0];
			}
		}
		mysqli_next_result($con);
	}
	$db->close($con);

	echo json_encode($retval);
?>