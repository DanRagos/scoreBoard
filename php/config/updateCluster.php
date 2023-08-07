<?php
    date_default_timezone_set("Asia/Singapore");
    $retval = 'failed';

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
    ini_set('max_execution_time', 3000);

    if(isset($_POST['ipaddr']) && isset($_POST['macaddr']) && isset($_POST['id'])) {
        $query = "select gemba_db.edit_list_device_cluster(" . $_POST['id'] . ", '" . $_POST['name'] . "', '";
        $query .= $_POST['ipaddr'] . "', '" . $_POST['macaddr'] . "', '";
        $query .= $_POST['ssid'] . "', '" . $_POST['pass'] . "', ";
        $query .= $_POST['bsid'] . ", '" . $_POST['desc'];
        $query .= "', '')";

        if($result = mysqli_query($con, $query)) {
            // if (mysqli_num_rows($result) > 0) {
            if ($res = mysqli_fetch_array($result)) {
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