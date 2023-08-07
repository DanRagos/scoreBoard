<?php
	date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);

   	$query = "call gemba_db.getDeviceInformation()";

   	$result = mysqli_query($con, $query);

	if ($result) { // if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_array($result)) {
			$summary = array(
				'macaddr' => $row["macAddress"],
				'ipaddr' => $row["ipAddress"],
				'devname' => $row["devicename"] == NULL ? "Device " . $row['id'] : $row["devicename"],
				'cluster' => $row["name"] == "DEFAULT" ? "DEFAULT CLUSTER" : $row["name"],
				'status' => $row['state'] == "1" ? "Active" : "Inactive"
			);		
			array_push($response, $summary);
		}
	}
	mysqli_next_result($con);
	$db->close($con);

   	echo json_encode($response);
?>