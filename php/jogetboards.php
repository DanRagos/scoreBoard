<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);
	$count = 0;

	$result = mysqli_query($con, 
		" call getRegisteredDevices() "
	);

	if ($result) { // if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_array($result)) {
			$summary = array(
				'brdid' => $row['id'],
				'brdname' => $row['devicename'],
				'brdord' => $row['deviceOrder'],
				'brdcli' => $row['deviceCluster_id'],
				'brdstat'=> $row['state'],
				'brduse' => $row['inUse']
			);		
			array_push($response, $summary);
		}
	}
	mysqli_next_result($con);
	$db->close($con);

	echo json_encode($response);
?>