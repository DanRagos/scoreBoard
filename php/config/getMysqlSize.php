<?php
	// $response = 'failed';
	$response = array();
	$disk = shell_exec('sudo df -h | grep /*vg0-root | awk \'{print $4}\'');
	$response += [ 'disk' => trim($disk) ];

	$db = shell_exec('sudo du -sh /var/lib/mysql/ | awk \'{print $1}\'');
	$response += [ 'db' => trim($db) ];
	
	echo json_encode($response);
?>