<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);

   	ini_set('max_execution_time', 3000);
	$rowcnt = 0;

 	if (isset($_POST['start']) && isset($_POST['end'])){
		$start = $_POST['start'];
		$end = $_POST['end'];
		$his = $_POST['history'];

		$query = '';
		if($start == 'none' && $end == 'none') {
			if($his == '1') {
				$query = "call gemba_db.getProductionSummaryAndExportDaily()";
			} else {
				$query = "call gemba_db.getProductionSummaryAndExportOnGoing()";
			}
		} else {
			$query = "call gemba_db.getProductionSummaryAndExport('".$start."', '".$end."')";
		}

		$result = mysqli_query($con, $query);

		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				$runtm = checkUnit($row["runtime"], 'minute');
				$dwntm = checkUnit($row["downtime"], 'minute');
				$prdtm = checkUnit(($row["runtime"] - $row["downtime"]), 'minute');

				$summary = array(
					'devoff' => $row['deviceState'] == '0' ? 'OFFLINE' : 'ONLINE',
					'devsid' => $row["jobSchedule_id"],
					'devdid' => $row["id"],
					'devnme' => $row["deviceName"], 
					'devjob' => $row["job"], 
					'devstt' => $row["timestampStart"],
					'devend' => $row["timestampEnd"],  
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
					'rowCnt' => $rowcnt
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