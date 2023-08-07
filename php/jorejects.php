<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);

   	ini_set('max_execution_time', 3000);
	$rowcount = 0;

 	if (isset($_POST['start']) && isset($_POST['end'])){
		$start =  $_POST['start'];
		$end =  $_POST['end'];
		$his = $_POST['history'];

		$query = '';
		if($start == 'none' && $end == 'none') {
			if($his == '1') {
				$query = "call gemba_db.getProductionRejectsDaily()";
			} else {
				$query = "call gemba_db.getProductionRejectsOnGoing()";
			}
		} else {
			$query = "call gemba_db.getProductionRejects('".$start."', '".$end."')";
		}

		$result = mysqli_query($con, $query);

		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				$summary = array(
					'devdid' => $row["id"],
					'devnme' => $row["devicename"],
					'devjob' => $row["jobNo"],
					'devstt' => $row["productionDate"],
					'devend' => $row["productionEnd"],  
					'devmod' => $row["model"] == "" ? "--" : $row["model"],
					'devmat' => $row["material"] == "" ? "--" : $row["material"],
					'devcnt' => (string)round($row["output"],1), 
					'devrej' => (string)round($row["reject"],1), 
					'devsta' => $row["jobstatus"],
					'rowCnt' => $rowcount,
					'--' => '--'
				);		
				array_push($response, $summary);

				$rowcount++;
			}
		}
		mysqli_next_result($con);
	}
	$db->close($con);

	echo json_encode($response);

	function checkUnit($value, $unit) {
		$vls = 0;
		if($unit == 'hour'){
			$vls = round( ($value/3600/1000), 2);
		}else if($unit == 'minute'){
			$vls =  round( ($value/60/1000), 2);
		}else if($unit == 'second'){
			$vls =  round( ($value/1000), 2);
		}else{
			$vls = $value;
		}
		return $vls;
	}
?>