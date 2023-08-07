<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array('devvld' => "false");

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);
	
	if(isset($_POST['sid'])) {
		$result = mysqli_query($con, 
			" call getMobileDashboard(" . $_POST['sid'] . ") "
		);

		if($row = mysqli_fetch_array($result)) {
			$response = array(
				'devvld' => "true",
				'devjob' => $row['job'],
				'devmod' => $row['model'],
				'devmat' => $row['material'],
				'devtgt' => round($row['target'],1),
				'devpwn' => round($row['prewarn'],1),
				'devpre' => round($row['prescale'],1),
				'devcyc' => $row['cycletime'],
				'devstt' => $row['schedStart'],
				'devend' => $row['schedEnd'],
				'devopr' => $row['operator'],
				'devcnt' => round($row['totalCount'],1),
				'devrej' => round($row['totalReject'],1),
				'devsta' => $row['jobStatus'],
				'devflg' => $row['jobSchedule_status'],
				'devbck' => $row['onBacklog'],
				'devwdt' => $row['wdtEnabled'],
			);		
		}
		mysqli_next_result($con);

		$res = mysqli_query($con, 
			" call getBlacklist(" . $row['device_id'] . ") "
		);

		if($row2 = mysqli_fetch_array($res)) {
			$response += [ 'devoff' => $row2['state'] ];
			$response += [ 'devuse' => $row2['inUse'] ];
		}
		mysqli_next_result($con);
	}
	$db->close($con);

	echo json_encode($response);
?>