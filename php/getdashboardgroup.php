<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);

    $result = mysqli_query($con, 
        "  call gemba_db.getDashboardGroup() "
    );

    if ($result) { // if (mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_array($result)) {
            array_push($response, $row['name']);
        }
    }
    mysqli_next_result($con);
    $db->close($con);

    echo json_encode($response);
?>