<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
   	$con = $db->connect(0);

   	$min = $_POST["min"];
   	$max = $_POST["max"];

	$result = mysqli_query($con, 
		"  call gemba_db.getProductionDashboardDuration({$min},{$max}) "
	);

	if ($result) { // if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_array($result)) {
			$summary = array(
				'devdid' => $row["deviceOrder"],
				'devbck' => $row["onBacklog"],
				'devnme' => $row["devicename"], 
				'devsta' => $row["state"], 
				'devsid' => $row["jobSchedule_ID"],
				'devmst' => $row["machineStatus"],  
				'devjbd' => secToTimeFormat($row["duration"]),
				'devdtd' => secToTimeFormat($row["downtime"])
			);		
			array_push($response, $summary);
		}
	}
	mysqli_next_result($con);
	$db->close($con);

	echo json_encode($response);

	function secToTimeFormat($seconds) {
		if($seconds == '--') {
			return '-- : -- : --';
		}
		$t = round($seconds);
		return sprintf('%02d:%02d:%02d', ($t/3600),($t/60%60), $t%60);
	}
?>