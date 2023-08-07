<?php
    date_default_timezone_set("Asia/Singapore");
	ini_set('max_execution_time', 0);
   	ini_set('memory_limit','512M');

    require_once __DIR__ . '/db_connect.php';
    $response = array();

    $db = new DB_CONNECT(0);
   	$con = $db->connect(0);

 	if (isset($_POST['start']) && isset($_POST['end'])){
		$start =  $_POST['start'];
		$end =  $_POST['end'];

		$productive = array();
		$query = "call gemba_db.getProductionSummaryAndExportByDateFilterById('" . $start . "','" . $end . "'," . $_POST['id'] . ")";
		$result = mysqli_query($con, $query);
		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				$prd = array(
					'devlog' => $row["device_id"],
					'devsid' => $row["jobSchedule_id"],
					'devnme' => $row["deviceName"],
					'devstt' => $row["timestampStart"],
					'devsrc' => 'JO',
					'devend' => $row["timestampEnd"],
					'devjob' => $row["job"],
					'devcus' => 'NONE',
				);	
				array_push($productive, $prd);
			}
		}
		mysqli_next_result($con);

		$unproductive = array();
		if ($start == 'none' && $end == 'none') {
			$query = "call gemba_db.getDeviceProductionDowntimeDaily(" . $_POST['id'] . ")";
		} else {
			$query = "call gemba_db.getDeviceProductionDowntimeByDateFilter('" . $start . "','" . $end . "'," . $_POST['id'] . ")";
		}
		$result = mysqli_query($con, $query);
		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				// $prd = array(
				// 	'devlog' => $row["id"],
				// 	'devsid' => $row["jobSchedule_id"],
				// 	'devnme' => $row["devicename"],
				// 	'devstt' => $row["productionDate"],
				// 	'devsrc' => 'JO',
				// 	'devend' => $row["productionEnd"],
				// 	'devjob' => $row["job"],
				// );
				$upd = array(
					'devlog' => $row["id"],
					'devsid' => $row["jobSchedule_id"],
					'devnme' => $row["devicename"],
					'devstt' => $row["startTime"],
					'devsrc' => $row["downtimeSource"],
					'devend' => ($row["endTime"] == null ? "--" : $row["endTime"]),
					'devjob' => $row["job"],
					'devcus' => ($row["unproductive_cause"] == null ? "NO RECORD" : $row["unproductive_cause"]),
				);		
				// array_push($productive, $prd);
				array_push($unproductive, $upd);
			}
		}
		mysqli_next_result($con);

		// $response += [ 0 => unique_multidimensional_array($productive, 'devsid')];
		$response += [ 0 => $productive];
		$response += [ 1 => $unproductive];
	}
	$db->close($con);

	echo json_encode($response);

	function unique_multidimensional_array($array, $key) {
	    $temp_array = array();
	    $i = 0;
	    $key_array = array();

	    foreach($array as $val) {
	        if (!in_array($val[$key], $key_array)) {
	            $key_array[$i] = $val[$key];
	            $temp_array[$i] = $val;
	            $i++;
	        }
	    }
	    return $temp_array;
	}
?>