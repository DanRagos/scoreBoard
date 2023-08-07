<?php
    date_default_timezone_set("Asia/Singapore");
    ini_set('max_execution_time', 0);
    ini_set('memory_limit','256M');

    require_once __DIR__ . '/db_connect.php';
	require_once '../Spout/vendor/box/spout/src/Spout/Autoloader/autoload.php';

	use Box\Spout\Common\Entity\Style\CellAlignment;
	use Box\Spout\Writer\Common\Creator\Style\StyleBuilder;
	use Box\Spout\Writer\Common\Creator\WriterEntityFactory;
	use Box\Spout\Common\Entity\Row;

	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename="Gemba_Downtime_Records.xlsx"');
	header('Cache-Control: max-age=0');

    if($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST) && $_SERVER['CONTENT_LENGTH'] > 0 ) {
    	exit(999);
    }

    $lang 		= $_POST['lang'];
    $start 		= $_POST['start'];
	$end 		= $_POST['end'];
	$filter_temp= json_decode($_POST['filter'], true);
	$order 		= $_POST['order'];
	$ongoing 	= $_POST['ongoing'];

	if ($filter_temp == '' || $filter_temp == null) {
		$filter = '';
	} else {
		$filter .= join(',', $filter_temp) . ',';
	}

	/* Open DB connection */
	$db = new DB_CONNECT(0);
   	$con = $db->connect(0);

    /** Defined headers **/
	$worksheetTitle = array('Downtime Records');
	$worksheetHeader = array(
		'en' => array(
			'Machine', 'Job Order', 'Production Start', 'Model', 'Material', 'Operator', 'Unproductive Start', 'Unproductive End', 'Duration', 'Unproductive Cause', 'Remarks'
		),
		'jp' => array(
			'機械', '生産指示', '生産開始', '機種', '材質', '作業者', '停止開始', '停止終了', '停止時間', 'Unproductive Cause', '備考'
		),
		'cn' => array(
			'機器編號', '工單編號', 'Production 開始', '型號', '材料名稱', '操作員', '停機開始', '停機結束', 'Duration', 'Unproductive Cause', '備註'
		),
	);

    /* Create file instance */
    /** 
	  *	common setting for worksheet headers:
	  * - bold
	  * - centered
	  * - wrap text
	**/
	$defaultStyle = (new StyleBuilder())
					->setFontName('Arial')
					->setFontSize(11)
					->setCellAlignment(CellAlignment::CENTER)
					// ->setShouldWrapText()
					->build();

	$writer = WriterEntityFactory::createXLSXWriter();
	ob_start();
	$writer->setDefaultRowStyle($defaultStyle)->openToFile('php://output'); // write data to a file or to a PHP stream
	/* Set sheet name */
	$firstSheet = $writer->getCurrentSheet();
	$firstSheet->setName($worksheetTitle[0]);

	/* Write worksheet headers first */
	$headerStyle = (new StyleBuilder())
				->setFontBold()
				->build();
	$rowFromValues = WriterEntityFactory::createRowFromArray($worksheetHeader[$lang], $headerStyle);
	$writer->addRow($rowFromValues);
	/* Get maximum rows to export */
	$CHUNK_SIZE = 10000;
	$MAX_ROWS = 0;
	$SP_NAME = '';
	if ($start == 'none' && $end == 'none') {
		if ($ongoing == 'true') {
			$SP_NAME = "gemba_db.exportDowntimeOngoingTotal";
		} else {
			$SP_NAME = "gemba_db.exportDowntimeDailyTotal";
		}
		$query = "  call " . $SP_NAME . "(" .
				"JSON_OBJECT(" .
					$filter .
					"'" . "order" . "','" . $order . "'" .
				")" .
			") ";
	} else {
		$SP_NAME = "gemba_db.exportDowntimeViewTotal";
		$query = "  call " . $SP_NAME . "(" .
				"'" . $start . "','" . $end . "'," .
				"JSON_OBJECT(" .
					$filter .
					"'" . "order" . "','" . $order . "'" .
				")" .
			") ";
	}

	/* Send DB query */
	$result = mysqli_query($con, $query);
	if ($result) { // if (mysqli_num_rows($result) > 0) {
		if ($row = mysqli_fetch_array($result)) {
			$MAX_ROWS = (int)$row["MAX_ROWS"];
		}
		mysqli_next_result($con);
		mysqli_free_result($result);
	}
	/* Get data in chunks */
	for ($itr = 0; $itr < ceil($MAX_ROWS / $CHUNK_SIZE); $itr++) {
		$index = (int)($itr * $CHUNK_SIZE);
		$lastIndex = $CHUNK_SIZE;

		if ($start == 'none' && $end == 'none') {
			if ($ongoing == 'true') {
				$SP_NAME = "gemba_db.exportDowntimeOngoing";
			} else {
				$SP_NAME = "gemba_db.exportDowntimeDaily";
			}
			$query = "  call " . $SP_NAME . "(" .
					$index . "," . $lastIndex . "," .
					"JSON_OBJECT(" .
						$filter .
						"'" . "order" . "','" . $order . "'" .
					")" .
				") ";
		} else {
			$SP_NAME = "gemba_db.exportDowntimeView";
			$query = "  call " . $SP_NAME . "(" .
					"'" . $start . "','" . $end . "'," .
					$index . "," . $lastIndex . "," .
					"JSON_OBJECT(" .
						$filter .
						"'" . "order" . "','" . $order . "'" .
					")" .
				") ";
		}

		$result = mysqli_query($con, $query);
		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				$response = array();
				array_push($response, $row["devicename"]);
				array_push($response, $row["job"]);
				array_push($response, $row["productionStart"]);
				array_push($response, $row["model"]);
				array_push($response, $row["material"]);
				array_push($response, $row["operator"]);
				// array_push($response, $row["downtimeSrcName"]);
				array_push($response, $row["activeStart"] == '' || $row["activeStart"] === null ? $row["startTime"] : $row["activeStart"]);
				array_push($response, $row["endTime"]);
				array_push($response, checkUnit($row["duration"], 'minute'));
				array_push($response, $row["unproductive_cause"] == '' || $row["unproductive_cause"] === null ? 'No Record' : str_replace(':',"\n",$row["unproductive_cause"]));
				array_push($response, $row['remarks']);

				$rowFromValues = WriterEntityFactory::createRowFromArray($response);
				$writer->addRow($rowFromValues);
			}
			mysqli_next_result($con);
			mysqli_free_result($result);
		}
	}
	/* Close DB connection */
	$db->close($con);
	$writer->close();

	$xlsData = ob_get_contents();
	ob_end_clean();

	$response =  array(
        'op' => 'ok',
        'file' => base64_encode($xlsData) //"data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,".
    );
	die(json_encode($response));
	exit;

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

	function shutDownFunction() { 
	    $error = error_get_last();
	    // fatal error, E_ERROR === 1
	    if ($error['type'] === E_ERROR) { 
	        //do your stuff 
	        echo json_encode('');   
	    } 
	}
?>