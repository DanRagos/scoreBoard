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
	$consolidate= $_POST['consolidated'];
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
			if ($consolidate == 'true') {
				$SP_NAME = "gemba_db.exportSummaryOngoingConsolidated";
			} else {
				$SP_NAME = "gemba_db.exportSummaryOngoing";
			}
		} else {
			if ($consolidate == 'true') {
				$SP_NAME = "gemba_db.exportSummaryDailyConsolidated";
			} else {
				$SP_NAME = "gemba_db.exportSummaryDaily";
			}
		}

		$query = "  call " . $SP_NAME . "(" .
				'0' . "," . '50000' . "," .
				"JSON_OBJECT(" .
					$filter .
					"'" . "order" . "','" . $order . "'" .
				")" .
			") ";
	} else {
		if ($consolidate == 'true') {
			$SP_NAME = "gemba_db.exportSummaryViewConsolidated";
		} else {
			$SP_NAME = "gemba_db.exportSummaryView";
		}

		$query = "  call " . $SP_NAME . "(" .
				"'" . $start . "','" . $end . "'," .
				'0' . "," . '50000' . "," .
				"JSON_OBJECT(" .
					$filter .
					"'" . "order" . "','" . $order . "'" .
				")" .
			") ";
	}

	try {
	$result = mysqli_query($con, $query);
	} catch (Exception $e) {
		$error_msg = $e->getMessage();
	}
	if ($result) {
		while($row = mysqli_fetch_array($result)) {
			$runtm = checkUnit($row["runtime"], 'minute');
			$dwntm = checkUnit($row["downtime"], 'minute');
			$prdtm = checkUnit(($row["runtime"] - $row["downtime"]), 'minute');

			$summary = array(
				'devoff' => $row['deviceState'] == '0' ? 'OFFLINE' : 'ONLINE',
				'devsid' => $row["jobSchedule_id"],
				'devdid' => $row["id"],
				'devnme' => $row["devicename"], 
				'devjob' => $row["job"], 
				'devstt' => $row["productionStart"],
				'devend' => $row["productionEnd"],  
				'devmod' => $row["model"] == "" ? "--" : $row["model"],
				'devmat' => $row["material"] == "" ? "--" : $row["material"], 
				'devtgt' => round($row["target"],1), 
				'devpwn' => round($row["prewarn"],1),
				'devcnt' => round($row["count"],1),
				'devrej' => round($row["reject"],1),
				'devrun' => $runtm,
				'devdwn' => $dwntm,
				'devprd' => $prdtm,
				'devsde' => $row["schedEnd"],
				'devnxt' => $row["nextItem"],
				'devopr' => $row["operator"] == "" ? "--" : $row["operator"],
				'devsta' => $row['statusName'],
				'devpre' => round($row["prescale"],1),
				'devcyc' => $row['cycletime'],
				'devrem' => $row['rejectRemarks'],
				'rowCnt' => $rowcnt
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