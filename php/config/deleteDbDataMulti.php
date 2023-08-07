<?php
    date_default_timezone_set("Asia/Singapore");
    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
   	// ini_set('max_execution_time', 3000);

	$list_temp= json_decode($_POST['idlist'], true);
	$list_id = '';
   	$retval = 0;

	$list_id .= join(',', $list_temp) . ")";
	$from = $_POST['dateFr'];
	$to = $_POST['dateTo'];

   	if(isset($_POST['idlist'])) {
		// $devid = $_POST['idlist'];
        // $query = "select gemba_db.delete_db_data_multi('{$devid}','{$from}','{$to}')";
		$query = "select gemba_db.delete_db_data_multi('" . $from . "','" . $to . "'," . "JSON_OBJECT(" . $list_id . ") ";
		echo ($query);
   		$result = mysqli_query($con, $query);
		if($row = mysqli_fetch_array($result)) {
			$retval = $row[0];
		}
		mysqli_next_result($con);
   	}
   	$db->close($con);

	echo ($list_id);

	echo json_encode($retval);
?>