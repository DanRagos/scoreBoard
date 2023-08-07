<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);
	
	if(isset($_POST['id'])) {
		$result = mysqli_query($con, 
			" call getDeviceJobs(" . $_POST['id'] . ") "
		);

		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				$summary = array(
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
					'devwdt' => $row['wdtEnabled'],
					'devopr' => $row['operator'],
					'devsta' => $row['jobStatus'],
					'devscd' => $row['jobSchedule_status']
				);		
				array_push($response, $summary);
			}
		}
		mysqli_next_result($con);
	}
	$db->close($con);

	echo json_encode($response);
?>