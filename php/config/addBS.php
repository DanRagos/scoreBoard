<?php
	require_once __DIR__ . '/../db_connect.php';

	$ip = $_POST['ip'];
	$mac = $_POST['mac'];
	$ssid = $_POST['ssid'];
	$pass = $_POST['pass'];
	$bssid = $_POST['bssid'];
	exec('sudo python addBS.py ' . $ip, $output, $ret_code);

	if (in_array("Success", $output)) {
		# save to database
		$db = new DB_CONNECT(0);
		$con = $db->connect(0);
		ini_set('max_execution_time', 3000);

		# input_ipAddr
		# input_macAddr
		# input_ssid
		# input_pass
		# input_bssid
		$query = "select gemba_db.ms_AddBS('{$ip}','{$mac}','{$ssid}','{$pass}','${bssid}')";

		if($result = mysqli_query($con, $query)) {
			// if(mysqli_num_rows($result) > 0) {
			if($res = mysqli_fetch_array($result)) {
				if($res[0] != '0') {
					$retval = 'success';
				}
			}
			// }
			mysqli_next_result($con);
		}
		$db->close($con);

		echo json_encode("success");
	} else {
		echo json_encode("failed");
	}
?>