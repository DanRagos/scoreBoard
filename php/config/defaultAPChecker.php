<?php
	$output = shell_exec("ip -o link | grep -c 'wlp3s0*_0'");

	echo json_encode(trim($output));
?>
