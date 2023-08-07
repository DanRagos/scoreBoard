<?php
    date_default_timezone_set("Asia/Singapore");
    // echo date_default_timezone_get();
    $response = array();

    // require_once __DIR__ . '/../db_connect.php';

	$devID = $_POST['devid'];
	$devJB = $_POST['devjb'];
	$devMD = $_POST['devmd'];
	$devMT = $_POST['devmt'];
	$devTG = $_POST['devtg'];
	$devPW = $_POST['devpw'];
	$devPS = $_POST['devps'];
	$devCC = $_POST['devcc'];
	$devST = $_POST['devst'];
	// $devEN = $_POST['deven'];
	$devOP = $_POST['devop'];
	$devFG = $_POST['devfg'];
	$devwd = $_POST['devwd'];


  //  	$today = date("Y-m-d");
  //  	$now = $today . " " . date("H:i:s");
  //  	$today .= " 23:59:59";

  //  	$cmd = "python addNewSchedule.py " . $devID . " '" . $devJB . "' '" . $devMD . "' '"
		// . $devMT . "' " . $devTG . " " . $devPW . " " 
		// . $devPS . " " . $devCC . " '" . $now . "' '" . $today 
		// . "' " . $devFG . " '" . $devOP . "'" . ' ' . $devwd;
    $cmd = "python addNewSchedule.py " . $devID . " '" . $devJB . "' '" . $devMD . "' '"
        . $devMT . "' " . $devTG . " " . $devPW . " " 
		. $devPS . " " . $devCC . " '" . $devST . "' 'today' "
        // . $devPS . " " . $devCC . " 'now' 'today' "
        . $devFG . " '" . $devOP . "'" . ' ' . $devwd;

	$retval = exec($cmd);

	echo json_encode($retval);
?>