<?php
    date_default_timezone_set("Asia/Singapore");
    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);

   	$retval = array();
   	if(isset($_POST['devid']) && isset($_POST['devst'])) {
        $query = "call gemba_db.qr_isSchedStartExist('" . $_POST['devid'] . "', '" .  $_POST['devst'] . "')";
   		$result = mysqli_query($con, $query);
		if($row = mysqli_fetch_array($result)) {
        	$temp = array(
				'devid' => $row['deviceId'],
				'scdid' => $row['scheduleId'],
			);
			$retval = $temp;
		}
		mysqli_next_result($con);
   	}
   	$db->close($con);

	echo json_encode($retval);
?>