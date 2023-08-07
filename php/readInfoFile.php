<?php
	$response = array();

	if($file = fopen('info.txt', 'r')) {
		while(!feof($file)) {
			$line = fgets($file);
			if(strpos($line, "#") === false && strlen(trim($line)) != 0) {
				$data = str_replace(array("\n", "\r"), '', substr($line, strpos($line, '=') + 1));
				$head = strstr($line, '=', true);

				$response += [ $head => $data ];
			}
		}
		$output = exec(" uname -s -m -r");
		$response += [ 'os' => $output ];
		$output = exec("uptime -s");
		$response += [ 'boot' => $output ];
		$output = exec("uptime -p");
		$response += [ 'uptime' => $output ];

		$response += [ 'isValid' => true ];
		fclose($file);
	} else {
		$response += [ 'isValid' => false ];
	}

	echo json_encode($response);
?>