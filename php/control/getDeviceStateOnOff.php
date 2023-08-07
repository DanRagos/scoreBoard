<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array('devvld' => "false");

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);
	
	if(isset($_POST['id'])) {
		$query = "call gemba_db.getBlacklist(" . $_POST['id'] . ")";
		$result = mysqli_query($con, $query);
	 	if($row = mysqli_fetch_array($result)) {
		 	$response = array(
				 'devuse' => $row['inUse'],
				 'devsta' => $row['state'],
				 'devvld' => "true",
				 'devname'=> $row['devicename']
		 	);
		} else {
			$response = array(
				'devuse' => "--",
				'devsta' => "--"
			);
		}
		mysqli_next_result($con);
	}
	$db->close($con);

	echo json_encode($response);
?>