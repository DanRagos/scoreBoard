<?php
	ini_set('max_execution_time', 0);
	set_time_limit(30);

    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
   	$con = $db->connect(0);

    $dev_id = $_POST["dev_id"];
    $sched_id = $_POST["sched_id"];

	$result = mysqli_query($con, 
		" call gemba_db.getDowntimeByDevIDSchedID($dev_id, $sched_id) "
	);
    
	$rowcnt = 1;

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
				'devstt' => ($row["activeStart"] == '--' ? $row["startTime"] : $row["activeStart"]),
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
	$db->close($con);

	echo json_encode($response);

    
	function getAchievementRatio($count, $reject, $target) {
		$aratio = 0;
		if($target == '--') {
			$target = 1;
		}

		$aratio = round(( ($count - $reject) / $target ) * 100, 2);
		if($aratio <= 0) {
			$aratio = '0';
		}

		return $aratio;
	}

	function getYield($count, $reject) {
		$yield = 0;
		if($count > 0) {
			$yield = round((1 - ($reject / $count) ) * 100, 2);
			if($yield <= 0) {
				$yield = '0';
			}
		} else {
			$yield = '0';
		}

		return $yield;
	}

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

		if($vls <= 0) {
			$vls = '0';
		}

		return $vls;
	}
?>