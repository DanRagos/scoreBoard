<?php
	date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/../db_connect.php';

	$db = new DB_CONNECT(0);
	$con = $db->connect(0);
   	ini_set('max_execution_time', 3000);

   	if(isset($_POST['id'])) {
	   	$query = "call gemba_db.getLoginAccountsById(" . $_POST['id'] . ")";

	   	$result = mysqli_query($con, $query);
		if ($result) { // if (mysqli_num_rows($result) > 0) {
			if($row = mysqli_fetch_array($result)) {
				$response = array(
					'id' => $_POST['id'],
					'user' => $row["username"],
					'role' => $row["role"],
					'dept' => $row["department"],
					'email' => $row["emailAddress"],
					'fullname' => $row["fullName"]
				);
			}
		}
		mysqli_next_result($con);
	}
	$db->close($con);

   	echo json_encode($response);
?>