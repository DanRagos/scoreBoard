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
			$SP_NAME = "gemba_db.getProductionRejectsOnGoingv2";
		} else {
			$SP_NAME = "gemba_db.getProductionRejectsDailyv2";
		}
		$query = "  call " . $SP_NAME . "(" .
				"JSON_OBJECT(" .
					$filter .
					"'" . "order" . "','" . $order . "'" .
				")" .
			") ";
	} else {
		$SP_NAME = "gemba_db.getProductionRejectsv2";
		$query = "  call " . $SP_NAME . "(" .
				"'" . $start . "','" . $end . "'," .
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
				'devrem' => $row["rejectRemarks"],
				'rowCnt' => $rowcnt,
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