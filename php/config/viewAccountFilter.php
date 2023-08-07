<?php
	date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
	ini_set('max_execution_time', 3000);

    if(isset($_POST['dept']) && isset($_POST['accnt'])) {
	   	$query = "call gemba_db.getLoginAccounts()";

	   	$result = mysqli_query($con, $query);
		if ($result) { // if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_array($result)) {
				$addThis = true;

				if($_POST['dept'] != 'all' && $_POST['dept'] != $row["department"]) {
					$addThis = false;
				}

				if($_POST['accnt'] != 'all' && $_POST['accnt'] != $row["role"]) {
					$addThis = false;
				}

				if($addThis) {
					$summary = array(
						'user' => $row["username"],
						'role' => $row["role"],
						'dept' => $row["department"] == null ? "--" : $row["department"],
						'email' => $row["emailAddress"] == null ? "--" : $row["emailAddress"],
						'fullname' => $row["fullName"] == null ? "--" : $row["fullName"]
					);		
					array_push($response, $summary);
				}
			}
		}
		mysqli_next_result($con);
    }
    $db->close($con);

   	echo json_encode($response);
?>