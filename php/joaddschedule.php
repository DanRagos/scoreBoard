<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

	$devID = $_POST['devid'];
	$devJB = $_POST['devjb'];
	$devMD = $_POST['devmd'];
	$devMT = $_POST['devmt'];
	$devTG = $_POST['devtg'];
	$devPW = $_POST['devpw'];
	$devPS = $_POST['devps'];
	$devCC = $_POST['devcc'];
	$devST = $_POST['devst'];
	$devEN = $_POST['deven'];
	$devOP = $_POST['devop'];

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);

   	if($devEN == '') {
   		$query = "select gemba_db.create_jobSchedule_schedPage("
		. $devID . ", '" . $devJB . "', '" . $devMD . "', '"
		. $devMT . "', " . $devTG . ", " . $devPW . ", " 
		. $devPS . ", " . $devCC . ", '" . $devST . "', NULL, 0, '" . $devOP . "', 1)";
   	} else {
   		$query = "select gemba_db.create_jobSchedule_schedPage("
		. $devID . ", '" . $devJB . "', '" . $devMD . "', '"
		. $devMT . "', " . $devTG . ", " . $devPW . ", " 
		. $devPS . ", " . $devCC . ", '" . $devST . "', '"
		. $devEN . "', 0, '" . $devOP . "', 1)";
   	}

   	$retval = 'failed';
    try {
        $result = mysqli_query($con, $query);
        if ($res = mysqli_fetch_array($result)) {
            if($res[0] != '0') {
                $retval = $res[0];
            } else {
                $retval = 'failed';
            }
        }
    } catch (Exception $e) {
        echo json_encode($e->getMessage());
    }

	$db->close($con);

	echo json_encode($retval);
?>