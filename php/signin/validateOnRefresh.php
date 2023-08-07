<?php
	require_once __DIR__ . '/../webhost.php';
	require_once __DIR__ . '/../db_connect.php';

	function revalidateCredentials($user, $pass) {
		$isValid = false;
		if (!empty($user) && !empty($pass)) {
			$db = new DB_CONNECT(0);
		    $con = $db->connect(0);
		   	ini_set('max_execution_time', 3000);

		   	$query = "select gemba_db.check_login('" . $user . "', '" . $pass . "')";

			if($result = mysqli_query($con, $query)) {
				// if(mysqli_num_rows($result) > 0) {
				if($res = mysqli_fetch_array($result)) {
					if($res[0] != '0') {
						$isValid = true;
					}
				}
				// }
			}
			mysqli_next_result($con);
			$db->close($con);
		}

		return $isValid;
	}
?>