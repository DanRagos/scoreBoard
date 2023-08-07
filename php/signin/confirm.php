<?php
	session_start();
	if(!empty($_SESSION)) {
		session_unset($_SESSION['sess_id']);
		session_destroy();
		session_start();
	}

	require_once __DIR__ . '/../webhost.php';
	require_once __DIR__ . '/../db_connect.php';

	$welcomePage = "index.php";
	$localhost = getHostIp();

	$retval = 'failed';
	$page = "https://" . $localhost . "/scoreBoard/" . $welcomePage . "?error=Login%error.%Please%try%again.";

	if( isset($_POST['username']) && isset($_POST['password']) ) {
	    $db = new DB_CONNECT(0);
	    $con = $db->connect(0);
	   	ini_set('max_execution_time', 3000);

	   	$query = "select gemba_db.check_login('" . $_POST['username'] . "', '" . $_POST['password'] . "')";

		if($result = mysqli_query($con, $query)) {
			// if(mysqli_num_rows($result) > 0) {
			if($res = mysqli_fetch_array($result)) {
				if($res[0] == '2') {
				// if($res[0] != '0') {

					/** save the user role for page access reference **/
					$query = "call gemba_db.getLoginAccountsByAuth('" . $_POST['username'] . "', '" . $_POST['password'] . "')";

					if($result = mysqli_query($con, $query)) {
						// if(mysqli_num_rows($result) > 0) {
						if($res = mysqli_fetch_array($result)) {
							$fname = $res['fullName'] == null ? "No information" : $res['fullName'];
							$_SESSION['sess_id'] = $res['id'];
							$_SESSION['sess_user'] = $res['username'];
							$_SESSION['sess_pass'] = $res['password'];
							$_SESSION['sess_name'] = str_replace(' ','%',$fname);
							$_SESSION['sess_role'] = $res['role'];
							// $page = "Location: http://" . $localhost . "/Gemba2.0/" . 'GembaReporter.php';
							$page = "https://" . $localhost . "/" . 'scoreBoard/GembaReporter.php';
						}
						// }
					}
				}
				elseif ($res[0] == '1') {
					$page = "https://" . $localhost . "/scoreBoard/" . $welcomePage . "?error=password";
				}
				elseif ($res[0] == '0') {
					$page = "https://" . $localhost . "/scoreBoard/" . $welcomePage . "?error=username";
				}
			}
			// }
		}
		mysqli_next_result($con);
		$db->close($con);
	}

	echo json_encode($page);
?>