<?php
	date_default_timezone_set("Asia/Singapore");
	ini_set('max_execution_time', 0);
   	ini_set('memory_limit','512M');

    require_once __DIR__ . '/db_connect.php';
    $response = array();

    $db = new DB_CONNECT(0);
   	$con = $db->connect(0);
	$rowcnt = 1;

 	if (isset($_POST['start']) && isset($_POST['end'])) {
		$start =  $_POST['start'];
		$end =  $_POST['end'];
		$min =  $_POST['limitMin'];
		$max =  $_POST['limitMax'];

		$temp = array();
		$query = "call scoreboard_db.getProductionSummaryAndExportByDateFilter('".$start."', '".$end."')";
		// $query = "call gemba_db.getProductionSummaryAndExportByDateFilterv2('{$start}','{$end}',{$min},{$max})";
		$result = mysqli_query($con, $query);
		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				$summary = array(
					'devlog' => $row["jobSchedule_id"],
					'devdid' => $row["deviceOrder"], // $row["device_id"],
					'devnme' => $row["deviceName"],
					'devstt' => $row["timestampStart"],
					'devend' => ($row["timestampEnd"] == null ? "--" : $row["timestampEnd"]),
					'devsid' => $row["jobSchedule_id"],
					'devjob' => $row["job"],
				);
				array_push($temp, $summary);

				$rowcnt++;
			}
		}
		mysqli_next_result($con);

		$response += [ 0 => $temp];

		$temp = array();
		$query = "call scoreboard_db.getProductionDowntimeByDateFilter('".$start."', '".$end."')";
		// $query = "call gemba_db.getProductionDowntimeByDateFilterv2('{$start}','{$end}',{$min},{$max})";
		$result = mysqli_query($con, $query);
		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				$summary = array(
					'devlog' => $row["id"],
					'devdid' => $row["deviceOrder"], // $row["devId"],
					'devnme' => $row["devicename"],
					'devstt' => $row["startTime"],
					'devend' => ($row["endTime"] == null ? "--" : $row["endTime"]),
					'devsid' => $row["jobSchedule_id"],
					'devjob' => $row["job"],
					'prodStart' => $row["productionDate"],
					'prodEnd' => $row["productionDateEnd"],
				);		
				array_push($temp, $summary);

				$rowcnt++;
			}
		}
		mysqli_next_result($con);

		$response += [ 1 => $temp];
	}
	$db->close($con);

	echo json_encode($response);
?>