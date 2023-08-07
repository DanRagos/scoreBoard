<?php
    date_default_timezone_set("Asia/Singapore");
    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	ini_set('max_execution_time', 3000);

   	$retval = 0;
	$from = $_POST['dateFr'];
	$to = $_POST['dateTo'];
	// $devid = $_POST['idlist'];
	$devid= json_decode($_POST['idlist']);
	$query = '';

	
   	if(isset($_POST['idlist'])) {
		foreach($devid as $value){
			$query .= "select gemba_db.delete_db_data('{$from}','{$to}','{$value}');";
		}
        // $query = "select gemba_db.delete_db_data('{$from}','{$to}','{$devid[0]}');";
		// echo ($query);
   		if(mysqli_multi_query($con, $query)) {
			do {
				// Store first result set
				if ($result = mysqli_store_result($con)) {
					while ($row = mysqli_fetch_row($result)) {
						// printf("%s\n", $row[0]);
						$retval += (int) $row[0];
					}
					mysqli_free_result($result);
				}
				// if there are more result-sets, the print a divider
				// if (mysqli_more_results($con)) {
				// 	printf("-------------\n");
				// }
				//Prepare next result set
			} while (mysqli_next_result($con));
		}

   	}
   	$db->close($con);

	echo json_encode($retval);
?>