<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $jobID = $_POST['scdid'];
	$devID = $_POST['devid'];
	$devJB = $_POST['devjb'];
	$devMD = $_POST['devmd'];
	$devMT = $_POST['devmt'];
	$devTG = $_POST['devtg'];
	$devPW = $_POST['devpw'];
	$devPS = $_POST['devps'];
	$devCC = $_POST['devcc'];
	$devST = $_POST['devst'];
	$devEN = $_POST['deven'];
	$devOP = $_POST['devop'];
	$logState = $_POST['logst'];
	$cond1 = $_POST['ongoing'] == 'completed' ? '0' : '1';
	$cond2 = $_POST['status'];

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);
   	
   	$confirm = false;
   	$retval = 'failed';

   	// check first before proceed
   	$query = "call gemba_db.getJobScheduleById(" . $jobID . ")";
   	if($result = mysqli_query($con, $query)) {
		// if (mysqli_num_rows($result) > 0) {
		if ($ret = mysqli_fetch_array($result)) {
			if($ret['jobSchedule_status'] == $cond2 && $ret['isOngoing'] == $cond1) {
				$confirm = true;
			}
		}
		// }
		mysqli_next_result($con);
	}

	if(!$confirm) {
		$db->close($con);

		// echo json_encode("Schedule status has been changed. Please reload the Schedule list.");
        echo json_encode("failstatus");
		return ;
	}

   	if($devEN == '') {
   		$query = "select gemba_db.edit_jobSchedule("
		. $jobID . ", '" . $devID . "', '"
		. $devJB . "', '" . $devMD . "', '"
		. $devMT . "', '" . $devTG . "', '"
		. $devPW . "', '" . $devPS . "', '"
		. $devCC . "', '" . $devST . "', null, '" 
		. $devOP . "', ''"
		. ") ";
   	} else {
   		$query = "select gemba_db.edit_jobSchedule("
		. $jobID . ", '" . $devID . "', '"
		. $devJB . "', '" . $devMD . "', '"
		. $devMT . "', '" . $devTG . "', '"
		. $devPW . "', '" . $devPS . "', '"
		. $devCC . "', '" . $devST . "', '"
		. $devEN . "', '" . $devOP . "', ''"
		. ") ";
   	}

	if($result = mysqli_query($con, $query)) {
		// if (mysqli_num_rows($result) > 0) {
		if ($res = mysqli_fetch_array($result)) {
			if($res[0] == '1') {
				$retval = 'success';

				if($logState == 'running') {
					$cmd = "sudo python control/SENDJOBINFO.py " . $jobID;
					$cmdRet = exec($cmd);
					if($cmdRet != "success") {
						$retval = 'failedsend';
					} else {
						$retval = $cmdRet;
					}
				}
			}
		}
		// }
		mysqli_next_result($con);
	}
	$db->close($con);

	echo json_encode($retval);
?>