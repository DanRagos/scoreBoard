<?php
	require_once __DIR__ . '/../db_connect.php';

	$db = new DB_CONNECT(0);
	$con = $db->connect(0);

	$response = array();

	$query = "select gemba_db.getDatabaseSize()";
	try {
		$retval = 0;
		$result = mysqli_query($con, $query);
		if($row = mysqli_fetch_array($result)) {
			$retval = $row[0];
		}
		$response += [ 'dbsizeMB' => $retval .= 'M' ];
	} 
	catch (Exception $e) {
		$response += [ 'dbsizeMB' => -1 ];		
	}

	// mysqli_next_result($con);
   	$db->close($con);

	$dfval = shell_exec("df -h --output=used,avail /var/lib/mysql | awk NR==2");
	if (($dfval != null) && ($dfval != false)) {
		$dfarray = preg_split("/[\s]+/", $dfval);

		// NOTE: assuming the output always has space before the needed value
		$response += [ 'db' =>  $dfarray[1] ];
		$response += [ 'disk' => $dfarray[2] ];
	}
	else { // shell_exec fails
		$response += [ 'db' => -1 ];
		$response += [ 'disk' => -1 ];
	}

	echo json_encode($response);
?>