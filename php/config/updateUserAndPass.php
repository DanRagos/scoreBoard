<?php 
    ini_set('max_execution_time', 0);
    $response = array();

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
    ini_set('max_execution_time', 3000);

    $retval = 'failed';
    if (isset($_POST['id']) && isset($_POST['type'])) {
        $query = "UPDATE login_accounts SET " . $_POST['type'] . "='" . $_POST['value'] . "' WHERE id=" . $_POST['id'];

        if($result = mysqli_query($con, $query)) {
        // if (mysqli_num_rows($result) > 0) {
        // 	if ($res = mysqli_fetch_array($result)) {
        // 		if($res[0] != '0') {
        // 			$retval = $res[0];
        // 		}
        // 	}
        // }
            mysqli_next_result($con);
            $retval = 'success';
        }
    }
    $db->close($con);

    echo json_encode($retval);
?>