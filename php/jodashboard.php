<?php
    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);

    $min = $_POST["min"];
    $max = $_POST["max"];

    $result = mysqli_query($con, 
        "call gemba_db.getProductionDashboard({$min},{$max})"
    );

    if ($result) { // if (mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_array($result)) {
            $summary = array(
                'brdid' => $row["id"],
                'brdord' => $row["deviceOrder"],
                'brdbck' => $row["onBacklog"],
                'brdname' => $row["devicename"], 
                'brdsta' => $row["state"], 
                'jiid' => $row["jobSchedule_ID"], 
                'lnsta' => $row["machineStatus"],  
                'brdtgt' => $row["target"] == "--" ? 0 : round($row["target"],1),
                'brdcnt' => $row["count"] == "--" ? 0 : round($row["count"],1),
            );
            array_push($response, $summary);
        }
    }
    mysqli_next_result($con);
    $db->close($con);

    echo json_encode($response);
?>