<?php 
	$response = 'Incorrect parameters';

	if(isset($_POST['file'])) {
		$file = $_POST['file'];

		$output = shell_exec('sudo python /srv/http/SoftwareExtraction.py ' . $file);
		if($output == 0) {
			$response = 'success';
		} else {
			$response = 'failed';
		}
	}

	echo json_encode($response);
?>