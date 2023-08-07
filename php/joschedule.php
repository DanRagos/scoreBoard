<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);
	$rowcount = 1;

 	if (isset($_POST['start']) && isset($_POST['end'])){
		$start =  $_POST['start'];
		$end =  $_POST['end'];
		$his = $_POST['history'];

		$query = '';
		if($start == 'none' && $end == 'none') {
			// if($his == '1') {
				$query = "call gemba_db.getJobScheduleSummaryDaily()";
			// } else {
			// 	$query = "call gemba_db.getJobScheduleSummaryOnGoing()";
			// }
		} else {
			// $query = "call gemba_db.getJobScheduleSummary('".$start."', '".$end."')";
			$query = "call gemba_db.getJobScheduleSummary('{$start}', '{$end}')";
		}

		$result = mysqli_query($con, $query);

		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				$summary = array(
					'devdid' => $row["id"],
					'devnme' => $row["devicename"], 
					'devjob' => $row["job"], 
					'devstt' => $row["schedStart"],
					'devend' => $row["schedEnd"] == "" ? "--" : $row["schedEnd"],  
					'devmod' => $row["model"] == "" ? "--" : $row["model"],
					'devmat' => $row["material"] == "" ? "--" : $row["material"], 
					'devtgt' => $row["target"], 
					'devpwn' => $row["prewarn"],
					'devcyc' => $row["cycletime"],
					'devpre' => $row["prescale"],
					'devopr' => $row["operator"] == "" ? "--" : $row["operator"],
					'devflg' => $row["jobSchedule_status"],
					'devsta' => $row["isOngoing"] == "0" ? 'completed' : 'running',
					'devrid' => $row["jobSchedule_id"],
					'devlck' => $row["isLocked"],
					'devusr' => $row["currentEditUser"],
					'rowCnt' => $rowcount,
					'DT_RowId' => 'schedRow' . $rowcount . '_',
					'--' => "--"
				);		
				array_push($response, $summary);
				$rowcount++;
			}
		}	
		mysqli_next_result($con);
	}
	$db->close($con);

	echo json_encode($response);
?>