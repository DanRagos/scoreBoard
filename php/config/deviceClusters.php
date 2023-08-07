<?php
	date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);

   	if(isset($_POST['id'])) {
   		$query = "call gemba_db.getDevicesByCluster(" . $_POST['id'] . ")";

	   	$result = mysqli_query($con, $query);

		if ($result) {
			while($row = mysqli_fetch_array($result)) {
				$summary = array(
					'id' => $row['id'],
					'node' => $row['node_id'],
					'name' => $row["devicename"] == NULL ? "Device " . $row['id'] : $row["devicename"],
					'type' => $row["devicetype"],
					'stat' => ($row["state"] == "1" ? "Active" : "Inactive"),
					'usag' => $row["inUse"],
					'bsmac'=> $row["clustermac"]
				);
				array_push($response, $summary);
			}
		}
		mysqli_next_result($con);
	}
	$db->close($con);

   	echo json_encode($response);
?>