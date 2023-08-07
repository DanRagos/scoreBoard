<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);
	$rowcnt = 0;

 	if (isset($_POST['start']) && isset($_POST['end'])){
		$start =  $_POST['start'];
		$end =  $_POST['end'];
		$his = $_POST['history'];

		$query = '';
		if($start == 'none' && $end == 'none') {
			if($his == '1') {
				$query = "call gemba_db.getProductionSummaryAndExportConsolidatedDaily()";
			} else {
				$query = "call gemba_db.getProductionSummaryAndExportConsolidatedOnGoing()";
			}
		} else {
			$query = "call gemba_db.getProductionSummaryAndExportConsolidated('".$start."', '".$end."')";
		}

		$result = mysqli_query($con, $query);

		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				$runtm = checkUnit($row["duration"], 'minute');
				$dwntm = checkUnit($row["downtime"], 'minute');
				$prdtm = checkUnit(($row["duration"] - $row["downtime"]), 'minute');

				$summary = array(
					'devoff' => $row['deviceState'] == '0' ? 'OFFLINE' : 'ONLINE',
					'devsid' => $row["jobSchedule_id"],
					'devdid' => $row["device_id"],
					'devnme' => $row["deviceName"], 
					'devjob' => $row["job"], 
					'devstt' => $row["productionStart"],
					'devend' => $row["productionEnd"],  
					'devmod' => $row["model"] == "" ? "--" : $row["model"],
					'devmat' => $row["material"] == "" ? "--" : $row["material"], 
					'devtgt' => round($row["target"],1), 
					'devpwn' => round($row["prewarn"],1),
					'devcnt' => round($row["output"],1),
					'devrej' => round($row["reject"],1),
					'devrun' => $runtm,
					'devdwn' => $dwntm,
					'devprd' => $prdtm,
					'devsde' => $row["schedEnd"] == "" ? "--" : $row["schedEnd"],
					'devnxt' => $row["nextItem"],
					'devopr' => $row["operator"] == "" ? "--" : $row["operator"],
					'devsta' => $row['itemStatus'],
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