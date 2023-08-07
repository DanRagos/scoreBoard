<?php 
	$response = array();

	if(isset($_POST['command'])) {
		// $lanIface = shell_exec('ip link | grep enp | grep "state UP" | awk "{print $2}" | awk -F : "{print $1}"')
		// $lan = shell_exec('ip addr show enp2s0 | grep -m1 "\<inet\>" | awk \'{ print $2 }\' | awk -F "/" \'{ print $1 }\'');
		// $wifi = shell_exec('ip addr show wlp3s0b1 | grep -m1 "\<inet\>" | awk \'{ print $2 }\' | awk -F "/" \'{ print $1 }\'');
		$netServer = shell_exec("ps aux | grep 'dhcpd@enp2s0' | grep -v grep | wc -l");

		if ((int)$netServer == 1) {
			$response = 'server';
		} else {
			if($_POST['command'] == 'getInfo') {
				$execCmd = 'sudo python /srv/http/php/config/ethProfile.py ' . $_POST['command'];
				$retval = shell_exec($execCmd);
				$item = preg_split("/\r\n|\n|\r/", $retval);
				$response += [ 'mode' => str_replace(array("'",')','('), "", substr($item[0], strpos($item[0], "=") + 1)) ];
				# lan
				$lan = shell_exec('ip addr show enp2s0 | grep -w inet  | awk \'{ print $2 }\' | awk -F "/" \'{ print $1 }\'');
				# local wifi
				$wifi = shell_exec('ip addr show label wlp3s0* | grep -w inet | awk \'{ print $2 }\' | awk -F "/" \'{ print $1 }\'');
				# external wifi
				$wifi2 = shell_exec('ip addr show label wlp0* | grep -w inet | awk \'{ print $2 }\' | awk -F "/" \'{ print $1 }\'');
				# prioritize lan
				$response += [ 'ip' => str_replace(array("\n", "\r"), '', $lan == '' ? ($wifi2 == '' ? $wifi : $wifi2) : $lan) ];
				$ip = str_replace(array("\n", "\r"), '', $lan == '' ? ($wifi2 == '' ? $wifi : $wifi2) : $lan);

				$execCmd = '/usr/bin/ip route show | grep ' . $ip . ' | grep via | awk \'{print $3}\'';
				$data = shell_exec($execCmd);
				$response += [ 'gw' => str_replace(array("\n", "\r"), '', $data) ];
			} else {
				$execCmd = 'sudo python /srv/http/php/config/ethProfile.py ' . $_POST['command'] . ' ';
				$execCmd .= $_POST['mode'] . ' ' . $_POST['ip'] . ' ' . $_POST['gate'] . ' ' . $_POST['ip'];

				$retval = shell_exec($execCmd);

				//shell_exec('sudo systemctl stop netctl@enp2s0');
				//shell_exec('sudo systemctl stop netctl-ifplugd@enp2s0');
				//shell_exec('sudo ip link set enp2s0 down');
				//shell_exec('sudo ip addr flush enp2s0');
				//shell_exec('sudo systemctl start netctl@enp2s0');
				//shell_exec('sudo systemctl start netctl-ifplugd@enp2s0');

				$response = null;
			}
		}
	}

	echo json_encode($response);
?>