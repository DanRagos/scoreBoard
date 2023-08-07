<?php
	require_once __DIR__ . '/../db_connect.php';

	$config = array(
		"id" => $_POST["id"],
		"name" => $_POST["name"],
		"ip" => $_POST["ip"],
		"mac" => $_POST["mac"],
		"ssid" => $_POST["ssid"],
		"pass" => $_POST["pass"],
		"bssid" => $_POST["bssid"],
		"desc" => $_POST["desc"],
		"user" => $_POST["user"],
		"ipmode" => "static",
		"gateway" => "",
	);

	/* Save to db */
	$db = new DB_CONNECT(0);
	$con = $db->connect(0);
	ini_set('max_execution_time', 3000);
	$retval = 'failed';

	$query = "select gemba_db.edit_list_device_cluster({$config['id']},'{$config['name']}','{$config['ip']}','{$config['mac']}','{$config['ssid']}','{$config['pass']}',{$config['bssid']},'{$config['desc']}','{$config['user']}')";
	// echo $query;
	if($result = mysqli_query($con, $query)) {
		if($res = mysqli_fetch_array($result)) {
			if($res[0] != '0') {
				$retval = 'success';
			}
		}
	}
	mysqli_next_result($con);
	$db->close($con);

	echo json_encode($retval);

?>