<?php
    date_default_timezone_set("Asia/Singapore");
    ini_set('max_execution_time', 0);
    ini_set('memory_limit','256M');

    require_once __DIR__ . '/db_connect.php';

    $lang 		= $_POST['lang'];
    $start 		= $_POST['start'];
	$end 		= $_POST['end'];
	$filter_temp= json_decode($_POST['filter'], true);
	$order 		= $_POST['order'];
	$ongoing 	= $_POST['ongoing'];
	$rowcnt = 1;
	$filter = '';

	if ($filter_temp == '' || $filter_temp == null) {
		$filter = '';
	} else {
		$filter .= join(',', $filter_temp) . ',';
	}

	$response = array();
	/* Open DB connection */
	$db = new DB_CONNECT(0);
   	$con = $db->connect(0);

	if ($start == 'none' && $end == 'none') {
		if ($ongoing == 'true') {
			$SP_NAME = "gemba_db.getProductionDowntimeOnGoingv2";
		} else {
			$SP_NAME = "gemba_db.getProductionDowntimeDailyv2";
		}
		$query = "  call " . $SP_NAME . "(" .
				"JSON_OBJECT(" .
					$filter .
					"'" . "order" . "','" . $order . "'" .
				")" .
			") ";
	} else {
		$SP_NAME = "gemba_db.getProductionDowntimev2";
		$query = "  call " . $SP_NAME . "(" .
				"'" . $start . "','" . $end . "'," .
				"JSON_OBJECT(" .
					$filter .
					"'" . "order" . "','" . $order . "'" .
				")" .
			") ";
	}

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
				// 'devstt' => $row["startTime"],
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
	/* Close DB connection */
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