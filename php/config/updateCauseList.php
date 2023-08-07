<?php
    date_default_timezone_set("Asia/Singapore");
    $retval = '';

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
    ini_set('max_execution_time', 3000);

    $retval = array(
        'result' => 'failed',
        'success' => 0,
        'fail' => 0,
        'limit' => 0
    );
    if(isset($_POST['data'])) {
        $data = $_POST['data'];

        $retval['limit'] = count($data);
        for ($i = 0; $i < $retval['limit']; $i++) {
            $query = "select gemba_db.updateCauseList(" . $data[$i]['id'] . ", '" . $data[$i]['cause'] . "')";

            if($result = mysqli_query($con, $query)) {
                // if(mysqli_num_rows($result) > 0) {
                if($res = mysqli_fetch_array($result)) {
                    // if($res[0] == '1') {
                    //  $retval = 'updated';
                    // } else if($res[0] == '2') {
                    //  $retval = 'added';
                    // }
                    if ($res[0] == '1' || $res[0] == '2') {
                        $retval['success']++;
                    } else {
                        $retval['fail']++;
                    }
                }
                // }
            }
            mysqli_next_result($con);
        }
    }
    $db->close($con);

    if ($retval['success'] > 0) {
        $retval['result'] = 'updated';
    }

    echo json_encode($retval);
?>