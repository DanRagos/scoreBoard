<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);

   	ini_set('max_execution_time', 3000);

 	if (isset($_POST['devid']) && isset($_POST['schedid'])){
		$devid = $_POST['devid'];
		$schedid = $_POST['schedid'];
		$from = $_POST['from'];
		$to = $_POST['to'];

		$query = "call gemba_db.getUnproductivityDataLog({$devid},{$schedid},'{$from}','{$to}')";

		try {
			$result = mysqli_query($con, $query);	
		} catch (Exception $e) {
			$result = false;			
		}
		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				$summary = array(
					'job' => $row["job"],
					'source' => $row["downtimeSource"],
					'start' => $row["startTime"],
					'end' => $row["endTime"],
					'realend' => $row['realEndTime'],
					'duration' => $row['duration'],
				);		
				array_push($response, $summary);
			}
		}
		mysqli_next_result($con);
	}
	$db->close($con);

	echo json_encode($response);
?>