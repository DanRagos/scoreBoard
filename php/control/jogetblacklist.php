<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

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
				'devsta' => $row['state']
			);
		} else {
			$response = array(
				'devuse' => "--",
				'devsta' => "--"
			);
		}
		mysqli_next_result($con);

		$query = "call gemba_db.getRunningJob(" . $_POST['id'] . ")";
		$res = mysqli_query($con, $query);
		if($row = mysqli_fetch_array($res)) {
			$response += [ 'devjob' => $row['job'] ];
			$response += [ 'devsid' => $row['id'] ];	
		} else {
			$response += [ 'devjob' => "--" ];
			$response += [ 'devsid' => "--" ];	
		}
		mysqli_next_result($con);
   	}
   	$db->close($con);

	echo json_encode($response);
?>