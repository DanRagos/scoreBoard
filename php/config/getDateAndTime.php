<?php
	$tz = "Asia/Singapore";

	if($file = fopen(__DIR__ . '/../info.txt', 'r')) {
		while(!feof($file)) {
			$line = fgets($file);
			if(strpos($line, 'timezone') !== false) {
				$tz = str_replace(array("\n", "\r"), '', substr($line, strpos($line, '=') + 1));
				break;
			}
		}
		fclose($file);
	}

	date_default_timezone_set($tz);

	$today = date("D Y/m/d H:i:s"); 

	$response = array();
	$response += [ 'dnt' => $today . " (" . $tz . ")" ];
	$response += [ 'tz' => $tz ];

	echo json_encode($response); 
?>