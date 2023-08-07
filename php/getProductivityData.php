<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);

   	ini_set('max_execution_time', 3000);

 	if (isset($_POST['devid']) && isset($_POST['schedid']) && $_POST['schedid'] != "0"){
		$devid = $_POST['devid'];
		$schedid = $_POST['schedid'];
		$interval = $_POST['interval']; 
		$intervalType = $_POST['intervalType'];
		$from = $_POST['from'];
		$to = $_POST['to'];

		$query = "call gemba_db.getProductivityDataLog({$devid},{$schedid},{$interval})";//,'{$from}','{$to}')";

		$prevDate = "";
		$duration = 0;
		$lastDuration = '';
		try {
			$result = mysqli_query($con, $query);		
		} catch (Exception $e) {
			$result = false;			
		}
		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				$summary = array(
					'id' => $row["id"],
					'count' => $row["count"],
					'reject' => $row["reject"],
					'timestamp' => $row['log_timestamp'],
					'logInterval' => $row['log_interval'],
					'lastInterval' => $row['last_interval'],
					'pointAtX' => $intervalType == "hour" ? round((float)($row['log_interval']/3600), 2) : round((float)($row['log_interval']/60), 2),
				);		

				array_push($response, $summary);
			}
		}
		mysqli_next_result($con);
	}
	$db->close($con);

	echo json_encode($response);
?>