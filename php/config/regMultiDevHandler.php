<?php
	$data = json_decode($_POST["data"], true);

	foreach ($data as $item) {
		$state = false;
		for ($i=0; $i < 3; $i++) { 
			$preout = shell_exec("sudo python registerDeviceHandler.py espconfig {$item['cluster']} {$item['node']} '{$item['ssid']},{$item['pass']}'");
			$output = trim($preout);

			if (strpos($output, "Failed") == false) {
				$state = true;
				break;
			}
		}

		if ($state) {
			for ($i=0; $i < 3; $i++) { 
				$preout = shell_exec("sudo python registerDeviceHandler.py add {$item['newcluster']} {$item['node']} ''");
				$output = trim($preout);

				if (strpos($output, "Failed") == false) break;
			}
		}
	}

	echo json_encode("Success");
?>