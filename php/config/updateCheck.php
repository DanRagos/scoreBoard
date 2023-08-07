<?php 
	$response = array();

	for($i = 0; $i < 4; $i++) {
		$fileName = '';
		$cmd = '';
		switch($i) {
			case 0:
				$fileName = '/srv/http/web_version.txt';
				$cmd = 'webpage'; 
				break;

			case 1:
				$fileName = '/srv/http/server_version.txt';
				$cmd = 'server'; 
				break;

			case 2:
				$fileName = '/srv/http/database_version.txt';
				$cmd = 'database'; 
				break;

			case 3:
				$fileName = '/srv/http/mobile_version.txt';
				$cmd = 'mobile'; 
				break;
		}

		$fn = fopen($fileName,"r");
		$result = fgets($fn);
		fclose($fn);

		$command = 'sudo python /srv/http/checkForUpdate.py ' . $cmd;
		$retval = exec($command);

		$response += [ 'return' => str_replace(array("\r\n", "\n", "\r"), "", $retval) ];

		$data1 = str_replace(array("\r\n", "\n", "\r"), "", $result);
		$data2 = str_replace(array("\r\n", "\n", "\r"), "", $retval);

		if($data1 != $data2) {
			// echo $cmd . " is Candidate for update" . '<br>';
			$response += [ $cmd => 'yes' ];
		} else {
			// echo $cmd . " is up to date" . '<br>';
			$response += [ $cmd => 'no' ];
		}
	}
	echo json_encode($response);
?>