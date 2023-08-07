<?php
	$cmd = $_POST["cmd"];
	$mac = $_POST["mac"];
	$dev = $_POST["dev"];
	$cnf = $_POST["cnf"];

	$preout = shell_exec("sudo python registerDeviceHandler.py {$cmd} {$mac} {$dev} '{$cnf}'");
	$output = trim($preout);
	// $output = "Failed {$dev}";
	echo json_encode($output);
?>