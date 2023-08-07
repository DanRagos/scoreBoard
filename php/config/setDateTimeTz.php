<?php
	$response = 'failed';

	if(isset($_POST['mode'])) {
		if(isset($_POST['timezone']) && (isset($_POST['date']) || isset($_POST['curr']))) {
			if($_POST['timezone'] != '' || $_POST['timezone'] != null) {
				exec('sudo timedatectl set-timezone ' . $_POST['timezone']);

				$data = file(__DIR__ . '/../info.txt');
				function replace_a_line($data) {
					if (stristr($data, 'timezone')) {
						return 'timezone=' . $_POST['timezone'] . "\r\n";
					}
					return $data;
				}
				$data = array_map('replace_a_line', $data);
				file_put_contents(__DIR__ . '/../info.txt', implode('', $data));
			}

			if($_POST['mode'] == 'manual') {
				if($_POST['date'] != '' || $_POST['date'] != null) {
					exec('sudo systemctl stop mysqld');
					exec('sudo timedatectl set-time "' . $_POST['date'] . '"');
					exec('sudo systemctl start mysqld');
				}

				$response = 'success';
			} else {
				if(isset($_POST['curr'])) {
					exec('sudo systemctl stop mysqld');
					exec('sudo timedatectl set-time "' . $_POST['curr'] . '"');
					exec('sudo systemctl start mysqld');
				}
	
				$response = 'success';
			}
            // restart all running python scripts to update datetime
            exec('sudo systemctl restart gemba@*');
            exec('sudo systemctl restart gembaL@*');
            // exec('sudo systemctl restart endpointHandler');
            exec('sudo systemctl restart inputDevHandler');
            // restart mosquitto to update device datetime
            exec('sudo systemctl restart mosquitto');
		}
	}

	echo json_encode($response);
?>