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

	$config['gateway'] = trim(shell_exec("ip route show 0.0.0.0/0 | awk '{print $3}'"));

	if ($config['id'] == 1) {
		$output = 'success';
		$cmd = "sudo python /home/lsp_user/gemba/network.py set {$config['ssid']} {$config['pass']} {$config['bssid']}";
		$retval = shell_exec($cmd);
		// $output = trim($retval);

		// shell_exec('sudo systemctl stop netctl@enp2s0');
		// shell_exec('sudo systemctl stop netctl-ifplugd@enp2s0');
		// shell_exec('sudo ip link set enp4s0 down');
		// shell_exec('sudo ip addr flush enp4s0');
		// shell_exec('sudo ip link set enp4s0 up');
		// shell_exec('sudo systemctl start netctl@enp2s0');
		// shell_exec('sudo systemctl start netctl-ifplugd@enp2s0');

		// remove mac value
		$config['mac'] = "DEFAULT";
	} else {
		$preout = shell_exec("sudo python setBS.py ['" . json_encode($config) . "']");
		$output = trim($preout);
	}

	if ($output == 'success') {
		/* Save to db */
	    $db = new DB_CONNECT(0);
	    $con = $db->connect(0);
	   	ini_set('max_execution_time', 3000);

		$query = "select gemba_db.edit_list_device_cluster({$config['id']},'{$config['name']}','{$config['ip']}','{$config['mac']}','{$config['ssid']}','{$config['pass']}',{$config['bssid']},'{$config['desc']}','{$config['user']}')";
		// echo $query;
		if($result = mysqli_query($con, $query)) {
			mysqli_next_result($con);
		}
	    $db->close($con);

		echo json_encode($output);
	} else {
		echo json_encode("failed");
		// echo json_encode($output);
	}
?>