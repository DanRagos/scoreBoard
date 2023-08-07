<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 0);
   	ini_set('memory_limit','512M');
	$rowcnt = 0;

 	if (isset($_POST['start']) && isset($_POST['end'])){
		$start =  $_POST['start'];
		$end =  $_POST['end'];
		$his = $_POST['history'];

		$query = "call gemba_db.getProductionDowntimeAllDaily()";

		$result = mysqli_query($con, $query);

		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				$duration = checkUnit($row["duration"], 'minute');

				$summary = array(
					'devdid' => $row["id"],
					'devsid' => $row["jobSchedule_id"],
					'devnme' => $row["devicename"],
					'devpde' => $row["productionDate"],
					'devjob' => $row["job"],
					'devmod' => $row["model"] == null ? "--" : $row["model"],
					'devmat' => $row["material"] == null ? "--" : $row["material"],
					'devopr' => $row["operator"] == null ? "--" : $row["operator"],
					'devdts' => ($row["downtimeSrcName"] == null ? $row["downtimeSource"] : $row["downtimeSrcName"]),
					'devstt' => $row["startTime"],
					'devend' => ($row["endTime"] == null ? "--" : $row["endTime"]),  
					'devdur' => $duration,
					'devrem' => $row['remarks'],
					'devucs' => $row['unproductive_cause'],
					'rowCnt' => $rowcnt,
					'DT_RowId' => 'unprodRow' . $rowcnt . '_',
					'--' => '--'
				);		
				array_push($response, $summary);

				$rowcnt++;
			}
		}
		mysqli_next_result($con);
	}
	$db->close($con);

	echo json_encode($response);

	function checkUnit($value, $unit) {
		$vls = 0;
		if($unit == 'hour'){
			$vls = round( ($value/3600), 2);
		}else if($unit == 'minute'){
			$vls =  round( ($value/60), 2);
		}else if($unit == 'second'){
			$vls =  round( ($value), 2);
		}else{
			$vls = $value;
		}
		return $vls;
	}
?>