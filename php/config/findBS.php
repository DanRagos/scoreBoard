<?php
	require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);

   	$summary = array();
   	$query = "call gemba_db.getClusterInformation()";
   	$result = mysqli_query($con, $query);
	if ($result) { // if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_array($result)) {
			if ($row["ipAddress"] != "--") {
				array_push($summary, $row["ipAddress"]);
			}
		}
	}
	mysqli_next_result($con);
	$db->close($con);

	shell_exec('sudo python triggerBSFinder.py ' . json_encode($summary));

	// assume its always ok?
	echo json_encode('success');
?>