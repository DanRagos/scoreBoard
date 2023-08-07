<?php
	session_start();

	require_once __DIR__ . '/../webhost.php';
	$localhost = getHostIp();
	$welcomePage = "signin.php";

	if(isset($_SESSION['sess_user'])) {
		if($_SESSION['sess_user'] != 'superadmin') {
			header("Location: http://" . $localhost . "/Gemba/" . $welcomePage);
		} else {
			sysRestart();
		}
	} else {
		session_destroy();
		header("Location: http://" . $localhost . "/Gemba/" . $welcomePage . "?error=Login%required.");
	}

	function sysRestart() {
		shell_exec('sudo reboot');
	}
?>