<?php
	ini_set('max_execution_time', 0);
	set_time_limit(30);

    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
   	$con = $db->connect(0);

   	$job_id = $_POST["job_id"];

	$result = mysqli_query($con, 
		" call gemba_db.getDowntimeByJobId({$job_id}) "
	);

	if ($result) { // if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_array($result)) {
			$response = array(
				'devlid' => $row["unproductiveLog_id"],
				'devcus' => $row['unproductiveCause'],
			);
		}
	}
	mysqli_next_result($con);
	$db->close($con);

	echo json_encode($response);
?>