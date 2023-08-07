<?php
	date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);

   	if(isset($_POST['id'])) {
   		$query = "call gemba_db.getAccountPermission(" . $_POST['id'] . ")";

	   	$result = mysqli_query($con, $query);

		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				$summary = array(
					'role' => $row['role'],
					'perm_1' => $row['perm_1'],
					'perm_2' => $row['perm_2'],
					'perm_3' => $row['perm_3'],
					'perm_4' => $row['perm_4'],
				);
				array_push($response, $summary);
			}
		}
		mysqli_next_result($con);
	}
	$db->close($con);

   	echo json_encode($response);
?>