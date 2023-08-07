<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
   	$con = $db->connect(0);

   	$id = $_POST["id"];

	$result = mysqli_query($con, 
		"  call gemba_db.getRejectsByID($id) "
	);

	if ($result) { // if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_array($result)) {
			$summary = array(
				'devsid' => $row["jobSchedule_ID"],
				'devnme' => $row["devicename"],
        'devjob' => $row["job"],
        'devstt' => $row["timestampStart"],
        'devend' => $row["timestampEnd"],
        'devmod' => $row["model"],
        'devmat' => $row["material"],
        'devcnt' => $row["count"],
        'devrej' => $row["reject"]
			);		
			array_push($response, $summary);
		}
	}
	mysqli_next_result($con);
	$db->close($con);

	echo json_encode($response);
?>