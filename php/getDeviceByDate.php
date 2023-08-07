<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);
	
	if(isset($_POST['fr']) && isset($_POST['to'])) {
		$fr = $_POST['fr'];
		$to = $_POST['to'];

		$result = mysqli_query($con, 
			"call gemba_db.getDeviceByDate('{$fr}','{$to}')"
		);

		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				$summary = array(
					'devdid' => $row['id'],
					'devnme' => $row['devicename'],
				);		
				array_push($response, $summary);
			}
		}
		mysqli_next_result($con);
	}
	$db->close($con);

	echo json_encode($response);
?>