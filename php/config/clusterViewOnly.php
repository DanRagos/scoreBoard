<?php
	date_default_timezone_set("Asia/Singapore");
    $response = array();

    # get ms config
    exec('sudo python getMS.py', $output, $ret);
    $msConfig = json_decode($output[1], true);

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);

   	$query = "call gemba_db.getClusterInformation()";
   	$result = mysqli_query($con, $query);
	if ($result) { // if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_array($result)) {
			$summary;
			if ($row["id"] == "1") {
				$summary = array(
					'id' => $row["id"],
					'cluster' => $row["clusterName"],
					'ip' => $msConfig["ip"],
					'mac' => $msConfig["mac"],
					'pass' => $row["passphrase"] == null ? "" : $row["passphrase"],
					'ssid' => $msConfig["ssid"] == null ? "N/A" : $msConfig["ssid"],
					'bsid' => $msConfig["bssid"],
					'desc' => $row["description"],
					'devices' => $row["clusterSize"]
				);		
			} else {
				$summary = array(
					'id' => $row["id"],
					'cluster' => $row["clusterName"] == null ? "--" : $row["clusterName"],
					'ip' => $row["ipAddress"] == null ? "--" : $row["ipAddress"],
					'mac' => $row["macAddress"] == null ? "--" : $row["macAddress"],
					'pass' => $row["passphrase"] == null ? "" : $row["passphrase"],
					'ssid' => $row["ssid"] == null ? "--" : $row["ssid"],
					'bsid' => $row["broadcast_ssid"],
					'desc' => $row["description"],
					'devices' => $row["clusterSize"]
				);		
			}
			array_push($response, $summary);
		}
	}
	mysqli_next_result($con);
	$db->close($con);

   	echo json_encode($response);
?>