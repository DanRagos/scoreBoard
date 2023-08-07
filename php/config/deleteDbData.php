<?php
    date_default_timezone_set("Asia/Singapore");
    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	// ini_set('max_execution_time', 3000);

   	$retval = 0;
	// $from = $_POST['dateFr'];
	// $to = $_POST['dateTo'];
	// $devid = $_POST['idlist'];

   	// if(isset($_POST['idlist'])) {
    //     // $query = "select gemba_db.delete_db_data('{$from}','{$to}','{$devid}')";
	// 	$query = "select gemba_db.delete_db_data_all()";
   	// 	$result = mysqli_query($con, $query);
	// 	print ("result");
	// 	if($row = mysqli_fetch_array($result)) {
	// 		print ("fetch here"); 
	// 		echo ($row);
	// 		$retval = $row[0];
	// 	}
	// 	mysqli_next_result($con);
   	// }
	$query = "select gemba_db.delete_db_data_all()";
   		$result = mysqli_query($con, $query);
		if($row = mysqli_fetch_array($result)) {
			$retval = $row[0];
		}
		mysqli_next_result($con);
   	$db->close($con);

	echo json_encode($retval);
?>