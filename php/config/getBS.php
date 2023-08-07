<?php
	require_once __DIR__ . '/../db_connect.php';

	exec('sudo python getBS.py', $output, $ret_code);

	$ret = array();
	$response = array();

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);

   	$query = "SELECT ipAddress, macAddress FROM gemba_db.list_device_cluster where isArchived=0";

   	$result = mysqli_query($con, $query);
	if ($result) { // if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_array($result)) {
			$summary = array(
				'ip' => $row["ipAddress"] == null ? '' : $row["ipAddress"],
				'mac' => $row["macAddress"] == null ? '' : $row["macAddress"],
			);		
			array_push($response, $summary);
		}
	}
	mysqli_next_result($con);
	$db->close($con);

	array_push($ret, $output);
	array_push($ret, $response);

	echo json_encode($ret);
?>