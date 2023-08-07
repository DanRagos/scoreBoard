<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);
	$count = 0;

	$result = mysqli_query($con, 
		" call getRegisteredDevices() "
	);

	if ($result) { // if (mysqli_num_rows($result) > 0) {
		$clusterDevices = array();
		while($row = mysqli_fetch_array($result)) {
			$summary = array(
				'devdid' => $row['id'],
				'devnme' => $row['devicename'],
				'devord' => $row['deviceOrder'],
				'devcli' => $row['deviceCluster_id'],
				'devnod' => $row['node_id'],
				'devmac' => $row['clustermac'],
				'devsta' => $row['state'],
				'devuse' => $row['inUse']
			);		
			array_push($clusterDevices, $summary);
		}
		$response += [ 'clusterDevices' => $clusterDevices ];
		mysqli_next_result($con);

		$result = mysqli_query($con, 
			" call getClusterInformation() "
		);

		if ($result) { // if (mysqli_num_rows($result) > 0) {
			$clusterInfo = array();
			while($row = mysqli_fetch_array($result)) {
				$summary = array(
					'clusterNum' => $row['id'],
					'clusterNme' => $row['clusterName']
				);
				array_push($clusterInfo, $summary);
			}
			$response += [ 'clusterInfo' => $clusterInfo ];
			mysqli_next_result($con);
		}

		$result = mysqli_query($con, 
			" call getDashboardGroup() "
		);

		if ($result) { // if (mysqli_num_rows($result) > 0) {
			$group = array();
			while($row = mysqli_fetch_array($result)) {
				$summary = array(
					'id' => $row['id'],
					'name' => $row['name']
				);
				array_push($group, $summary);
			}
			$response += [ 'group' => $group ];
			mysqli_next_result($con);
		}
	}
	$db->close($con);

	echo json_encode($response);
?>