<?php
	date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/../db_connect.php';

	$db = new DB_CONNECT(0);
	$con = $db->connect(0);
   	ini_set('max_execution_time', 3000);

   	$query = "call gemba_db.getLoginAccounts()";

   	$result = mysqli_query($con, $query);
	if ($result) { // if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_array($result)) {
			$summary = array(
				'DT_RowId' => 'userM_' . $row["id"],
				'id' => $row["id"],
				'user' => $row["username"],
				'pass' => $row["password"],
				'fname' => $row["fullName"] == null ? "--" : $row["fullName"],
				'perm_1' => $row["perm_1"],
				'perm_2' => $row["perm_2"],
				'perm_3' => $row["perm_3"],
				'perm_4' => $row["perm_4"],
				'perm_5' => $row["role"] == 'admin' ? '1' : '0',
			);		
			array_push($response, $summary);
		}
		mysqli_next_result($con);
	}
	$db->close($con);

   	echo json_encode($response);
?>