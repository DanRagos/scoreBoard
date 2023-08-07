<?php
	session_start();
	
	if(!empty($_SESSION)) {
		session_unset();
		session_destroy();
	}

	require_once __DIR__ . '/../webhost.php';
	$localhost = getHostIp();

	$welcomePage = "index.php";
	$page = "https://" . $localhost . "/scoreBoard/" . $welcomePage . "?error=signout";
	echo json_encode($page);
	// header($page);
?>