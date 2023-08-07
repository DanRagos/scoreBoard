<?php
	require_once __DIR__ . '/../db_connect.php';

	$db = new DB_CONNECT(0);
	$con = $db->connect(0);
   	ini_set('max_execution_time', 3000);

   	$retval = "success";

	if(isset($_POST['schedid']) && isset($_POST['id'])) {
		if($_POST['cmd'] == 'start') {
			$cmd = "python startjob.py " . $_POST['id'] . " " . $_POST['schedid'];
			$retval = exec($cmd);
			if($retval == 'success') {
				if(isset($_POST['autoend']) && isset($_POST['wdtenabled'])) {
					$flag = $_POST['autoend'];
					$wdtVal = $_POST['wdtenabled'];
					$query = "UPDATE job_schedule SET autoEndStatus = " . $flag . ", wdtEnabled = " . $wdtVal . " WHERE id=" . $_POST['schedid'];
					$result = mysqli_query($con, $query);
				}
			}
		} else if($_POST['cmd'] == 'end') {
			$cmd = "python endjob.py " . $_POST['id'];
			$retval = exec($cmd);
		} else if($_POST['cmd'] == 'check') {
			$cmd = "python jobChecker.py " . $_POST['id'];
			$retval = exec($cmd);
		} else if($_POST['cmd'] == 'compare') {
			$cmd = "python schedComparison.py " . $_POST['id'] . " " . $_POST['schedid'];
			$retval = exec($cmd);
		} else {
			$retval = "unknown";
		}
	}
	$db->close($con);

	echo json_encode($retval);
?>