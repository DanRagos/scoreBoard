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
	header('Content-Disposition: attachment;filename="Gemba_Log_Records.xlsx"');
	header('Cache-Control: max-age=0');

    if($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST) && $_SERVER['CONTENT_LENGTH'] > 0 ) {
    	exit(999);
    }

    $lang 		= $_POST['lang'];
    $trans 		= $_POST['translation'];
    $start 		= $_POST['start'];
	$end 		= $_POST['end'];
	$filter_temp= json_decode($_POST['filter'], true);
	$order 		= $_POST['order'];
	$consolidate= $_POST['consolidated'];
	$ongoing 	= $_POST['ongoing'];

	if ($filter_temp == '' || $filter_temp == null) {
		$filter = '';
	} else {
		$filter .= join(',', $filter_temp) . ',';
	}

	/* Open DB connection */
	$db = new DB_CONNECT(0);
   	$con = $db->connect(0);

	/**notice: translations in this file may be overlooked when updating
		for improvement: send translation of needed terms in an object **/
    /** Defined headers **/
	// $worksheetTitle = array(
	// 	'en' => array('Production Records', 'Downtime Records'),
	// 	'jp' => array('生産記録', '停止記録'),
	// 	'cn' => array('Production Records', 'Downtime Records')
	// );	
	$worksheetTitle = $trans['title'];
	// $worksheetHeader = array(
	// 	'en' => array(
	// 			array(
	// 				'Machine', 'Job Order', 'Production Start', 'Production End', 'Model', 'Material', 'Target Quantity', 'Prewarn Quantity', 'Output Quantity', 'Reject Quantity', 'Yield (%)', 'Achievement Ratio (%)', 'Job Duration (minutes)', 'Productive Duration (minutes)', 'Total Downtime (minutes)', 'Scheduled End', 'Operator', 'Next Item', 'Status', 'Cycle Time', 'Prescale', 'Reject Remarks'
	// 			),
	// 			array(
	// 				'Machine', 'Job Order', 'Model', 'Material', 'Operator', 'Unproductive Start', 'Unproductive End', 'Duration', 'Unproductive Source', 'Remarks'
	// 			)
	// 		),
	// 	'jp' => array(
	// 			array(
	// 				'設備', 
	// 				'生産指示', 
	// 				'生産開始時刻', 
	// 				'生産終了時刻', '品目', '材料', '目標数', '予報設定', '生産数', '不適合数', '歩留率 (%)', '達成率 (%)', '合計時間 (分)', '稼働時間 (分)', '停止時間 (分)', '終了予定時刻', '作業者', '次生産指示', '状況', 'サイクルタイム', 'プリスケール', '摘要'
	// 			),
	// 			array(
	// 				'設備', '生産指示', '品目', '材料', '作業者', '停止開始', '停止終了', '停止時間', '停止入力', '備考'
	// 			)
	// 		),
	// 	'cn' => array(
	// 			array(
	// 				'機器編號', '工單編號', '生產開始', '生產結束', '型號', '材料名稱', '目標值', '預報值', '總生產值', '不良數', '不良率 (%)', '達成率 (%)', '總工時(分)', '生產持間(分)', '停機時間(分)', '計畫結束時間', '操作員', '下個項目', '生產狀況', '周期', '預設比例', '不良品備註'
	// 			),
	// 			array(
	// 				'機器編號', '工單編號', '型號', '材料名稱', '操作員', '停機開始', '停機結束', '期間', '停機原因', '備註'
	// 			)
	// 		),
	// 	);
	$worksheetHeader = $trans['header'];

    /* Create file instance */
    /** 
	  *	common setting for worksheet headers:
	  * - bold
	  * - centered
	  * - wrap text
	**/
	$defaultStyle = (new StyleBuilder())
					->setFontName('Arial')
					->setFontSize(10)
					->setCellAlignment(CellAlignment::CENTER)
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
	$rowFromValues = WriterEntityFactory::createRowFromArray($worksheetHeader[0], $headerStyle);
	$writer->addRow($rowFromValues);
	/** Start Summary record generation **/
	// $statusTranslation = array(
	// 	'en' => array(
	// 		'PRODUCTIVE' => 'RUNNING',
	// 		'UNPRODUCTIVE' => 'DOWN',
	// 		'RUNNING' => 'RUNNING',
	// 		'DOWN' => 'DOWN',
	// 		'COMPLETED' => 'COMPLETED',
	// 		'COMPLETED*' => 'COMPLETED*',
	// 		'CONTINUED' => 'CONTINUED',
	// 		'OFFLINE' => 'OFFLINE',
	// 	),
	// 	'jp' => array(
	// 		'PRODUCTIVE' => '稼働中',
	// 		'UNPRODUCTIVE' => '停止中',
	// 		'RUNNING' => '稼働中',
	// 		'DOWN' => '停止中',
	// 		'COMPLETED' => '完了',
	// 		'COMPLETED*' => '完了*',
	// 		'CONTINUED' => '継続',
	// 		'OFFLINE' => 'オフライン',
	// 	),
	// 	'cn' => array(
	// 		'PRODUCTIVE' => '生產中',
	// 		'UNPRODUCTIVE' => '停機中',
	// 		'RUNNING' => '生產中',
	// 		'DOWN' => '停機中',
	// 		'COMPLETED' => '結束',
	// 		'COMPLETED*' => '結束*',
	// 		'CONTINUED' => 'CONTINUED',
	// 		'OFFLINE' => '離線',
	// 	),
	// );
	$statusTranslation = $trans['status'];
	/* Get maximum rows to export */
	$CHUNK_SIZE = 10000;
	$MAX_ROWS = 0;
	$SP_NAME = '';
	if ($start == 'none' && $end == 'none') {
		if ($ongoing == 'true') {
			if ($consolidate == 'true') {
				$SP_NAME = "gemba_db.exportSummaryOngoingConsolidatedTotal";
			} else {
				$SP_NAME = "gemba_db.exportSummaryOngoingTotal";
			}
		} else {
			if ($consolidate == 'true') {
				$SP_NAME = "gemba_db.exportSummaryDailyConsolidatedTotal";
			} else {
				$SP_NAME = "gemba_db.exportSummaryDailyTotal";
			}
		}

		$query = "  call " . $SP_NAME . "(" .
				"JSON_OBJECT(" .
					$filter .
					"'" . "order" . "','" . $order . "'" .
				")" .
			") ";
	} else {
		if ($consolidate == 'true') {
			$SP_NAME = "gemba_db.exportSummaryViewConsolidatedTotal";
		} else {
			$SP_NAME = "gemba_db.exportSummaryViewTotal";
		}

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
	if ($result) {
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
					$index . "," . $lastIndex . "," .
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
					$index . "," . $lastIndex . "," .
					"JSON_OBJECT(" .
						$filter .
						"'" . "order" . "','" . $order . "'" .
					")" .
				") ";
		}

		$result = mysqli_query($con, $query);
		if ($result) {
			while($row = mysqli_fetch_array($result)) {
				$response = array();
				array_push($response, $row["devicename"]);
				array_push($response, $row["job"]);
				array_push($response, $row["productionStart"]);
				array_push($response, $row["productionEnd"]);
				array_push($response, $row["model"]);
				array_push($response, $row["material"]);
				array_push($response, $row["target"]);
				array_push($response, $row["prewarn"]);
				array_push($response, $row["count"]);
				array_push($response, $row["reject"]);
				array_push($response, getYield($row["count"], $row["reject"]));
				array_push($response, getAchievementRatio($row["count"], $row["reject"], $row["target"]));
				array_push($response, checkUnit($row["runtime"], 'minute'));
				array_push($response, checkUnit($row["prodDur"], 'minute'));
				array_push($response, checkUnit($row["downtime"], 'minute'));
				array_push($response, $row["schedEnd"]);
				array_push($response, $row["operator"] == '' ? '--' : $row["operator"]);
				array_push($response, $row["nextItem"]);
				array_push($response, $statusTranslation[ $row['statusName'] ]);
				array_push($response, $row["cycletime"]);
				array_push($response, $row['prescale']);
				array_push($response, $row['rejectRemarks']);

				$rowFromValues = WriterEntityFactory::createRowFromArray($response);
				$writer->addRow($rowFromValues);
			}
			mysqli_next_result($con);
			mysqli_free_result($result);
		}
	}

	/* Start a new worksheet */
	$newSheet = $writer->addNewSheetAndMakeItCurrent();
	$newSheet->setName($worksheetTitle[1]);
	/* Write worksheet headers first */
	$headerStyle = (new StyleBuilder())
				->setFontBold()
				->build();
	$rowFromValues = WriterEntityFactory::createRowFromArray($worksheetHeader[1], $headerStyle);
	$writer->addRow($rowFromValues);
	// $misctranslation = array(
	// 	'en' => array(
	// 		'none' => 'No Record',
	// 	),
	// 	'jp' => array(
	// 		'none' => '記録なし',
	// 	),
	// 	'cn' => array(
	// 		'none' => 'No Record',
	// 	),
	// );
	$misctranslation = $trans['misc'];
	/* Get maximum rows to export */
	$CHUNK_SIZE = 10000;
	$MAX_ROWS = 0;
	$SP_NAME = '';
	if ($start == 'none' && $end == 'none') {
		if ($ongoing == 'true') {
			$SP_NAME = "gemba_db.exportSummaryDowntimeOngoingTotal";
		} else {
			$SP_NAME = "gemba_db.exportSummaryDowntimeDailyTotal";
		}
		$query = "  call " . $SP_NAME . "(" .
				"JSON_OBJECT(" .
					$filter .
					"'" . "order" . "','" . $order . "'" .
				")" .
			") ";
	} else {
		$SP_NAME = "gemba_db.exportSummaryDowntimeViewTotal";
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
				$SP_NAME = "gemba_db.exportSummaryDowntimeOngoing";
			} else {
				$SP_NAME = "gemba_db.exportSummaryDowntimeDaily";
			}
			$query = "  call " . $SP_NAME . "(" .
					$index . "," . $lastIndex . "," .
					"JSON_OBJECT(" .
						$filter .
						"'" . "order" . "','" . $order . "'" .
					")" .
				") ";
		} else {
			$SP_NAME = "gemba_db.exportSummaryDowntimeView";
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
				array_push($response, $row["model"]);
				array_push($response, $row["material"]);
				array_push($response, $row["operator"] == '' ? '--' : $row["operator"]);
				// array_push($response, $row["downtimeSrcName"]);
				array_push($response, $row["activeStart"] == '' || $row["activeStart"] === null ? $row["startTime"] : $row["activeStart"]);
				array_push($response, $row["endTime"]);
				array_push($response, checkUnit($row["duration"], 'minute'));
				array_push($response, $row["unproductive_cause"] == '' || $row["unproductive_cause"] === null ? $misctranslation['none'] : str_replace(':',"\n",$row["unproductive_cause"]));
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
		if($target == '--' || $target == 0 || $target == null) {
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