<?php
    date_default_timezone_set("Asia/Singapore");
    require_once __DIR__ . '/db_connect.php';
    ini_set('max_execution_time', 3000);

    $retval = 'failed';
    if(isset($_POST['schedid'])) {
    	$sched = $_POST['schedid'];
		$cause = $_POST['cause'];
		$jobid = $_POST['jobid'];

	    $db = new DB_CONNECT(0);
	    $con = $db->connect(0);

		$query = "select gemba_db.setUnproductiveCause('{$cause}', {$sched}, {$jobid})";

		if($result = mysqli_query($con, $query)) {
			// if (mysqli_num_rows($result) > 0) {
			if ($res = mysqli_fetch_array($result)) {
				if($res[0] != '0') {
					$retval = 'success';
				}
			}
			// }
			mysqli_next_result($con);
		}
		$db->close($con);
    }

	echo json_encode($retval);
?>