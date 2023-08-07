<?php
    date_default_timezone_set("Asia/Singapore");
    $retval = 'failed';

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
    ini_set('max_execution_time', 3000);

    if(isset($_POST['clusterId']) && isset($_POST['deviceId']) && isset($_POST['newName'])) {
        $query = "select gemba_db.edit_device_information(" . $_POST['deviceId'] . ", '";
        $query .= $_POST['newName'] . "', " . $_POST['clusterId'] . ", '')";

        if($result = mysqli_query($con, $query)) {
            // if(mysqli_num_rows($result) > 0) {
            if($res = mysqli_fetch_array($result)) {
                if($res[0] != '0') {
                    $retval = 'success';
                }
            }
            // }
        }
        mysqli_next_result($con);
    }
    $db->close($con);

    echo json_encode($retval);
?>