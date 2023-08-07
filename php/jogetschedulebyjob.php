<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);

   	if(isset($_POST['sid'])) {
		$result = mysqli_query($con, 
			" call getJobScheduleById(" . $_POST['sid'] . ") "
		);

		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				$response = array(
					'devdid' => $row['id'],
					'devjob' => $row['job'],
					'devmod' => $row['model'],
					'devmat' => $row['material'],
					'devtgt' => $row['target'],
					'devpwn' => $row['prewarn'],
					'devpre' => $row['prescale'],
					'devcyc' => $row['cycletime'],
					'devstt' => $row['schedStart'],
					'devend' => $row['schedEnd'],
					'devflg' => $row['autoEndStatus'],
					'devopr' => $row['operator'],
					'devsta' => $row['jobSchedule_status'],
					'devlck' => $row['isLocked'],
					'devong' => $row['isOngoing'] == "0" ? 'completed' : 'running', //devsta
					'devjst' => $row['jobSchedule_status'], //devflg
					'devusr' => $row['currentEditUser']
				);	
				// array_push($response, $summary);
			}
		}
		mysqli_next_result($con);
	}
	$db->close($con);

	echo json_encode($response);
?>