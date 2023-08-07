<?php
    ini_set('max_execution_time', 0);
    set_time_limit(30);

    date_default_timezone_set("Asia/Singapore");
    $response = array();

    require_once __DIR__ . '/db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);

    /** Web worker input **/
    $obj = json_decode(file_get_contents('php://input')); 
    $min = $obj->min;
    $max = $obj->max;

    $result = mysqli_query($con, 
        "  call gemba_db.getProductionOverviewv2({$min},{$max}) "
    );

    if ($result) { // if (mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_array($result)) {
            $summary = array(
                // 'devdid' => $row["id"],
                'devdid' => $row["deviceOrder"],
                'devbck' => $row["onBacklog"],
                'devnme' => $row["devicename"], 
                'devsta' => $row["state"],
                'devjid' => $row["jobInfo_id"], 
                'devsid' => $row["jobSchedule_ID"],
                'devmst' => $row["machineStatus"],  
                'devpwn' => $row["prewarn"] == "--" ? 0 : round($row["prewarn"],1),
                'devcnt' => $row["countTotal"] == "--" ? 0 : round($row["countTotal"],1),
                'devtgt' => $row["target"] == "--" ? 0 : round($row["target"],1),
                'devlid' => $row['unproductiveLog_id'], // this parameter is not returned
                'devcus' => $row['unproductiveCause'],
            );      
            array_push($response, $summary);
        }
    }
    mysqli_next_result($con);
    $db->close($con);

    echo json_encode($response);
?>