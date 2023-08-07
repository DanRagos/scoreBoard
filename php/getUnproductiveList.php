<?php
    date_default_timezone_set("Asia/Singapore");
    require_once __DIR__ . '/db_connect.php';

    $response = array();
    $db = new DB_CONNECT(0);
   	$con = $db->connect(0);

	$result = mysqli_query($con, 
		"  call gemba_db.getUnproductiveCauseList() "
	);

	if ($result) { // if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_array($result)) {
			$summary = array(
				'dtuid' => $row["id"],
				'dtucs' => $row["cause"]
			);		
			array_push($response, $summary);
		}
	}
	mysqli_next_result($con);

	$db->close($con);

	echo json_encode($response);
?>