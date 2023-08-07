<?php
    date_default_timezone_set("Asia/Singapore");
    $response = "";

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
    ini_set('max_execution_time', 3000);

    if(isset($_POST['mac'])) {
        $query = "call gemba_db.getRegDevPerCluster('" . $_POST['mac'] . "')";
        $result = mysqli_query($con, $query);
        if ($result) { // if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_array($result);
            $response = $row['count'];
        }
        mysqli_next_result($con);
    }
    $db->close($con);

    echo json_encode($response);
?>