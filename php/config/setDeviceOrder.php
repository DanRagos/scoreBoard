<?php 
    ini_set('max_execution_time', 0);
    $response = array();

    require_once __DIR__ . '/../db_connect.php';

    $data = json_decode($_POST['devorder'], true);

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
    ini_set('max_execution_time', 3000);

    $retval = 'failed';
    for($item = 0; $item < count($data); $item++) {
        // $query = " select gemba_db.setDeviceOrder(" . $data[$item]['did'] . ", '";
        // $query .= $data[$item]['nme'] . "', " . $data[$item]['clu'] . ", " . $data[$item]['ord'] . ") ";
        $query = " select gemba_db.setDeviceOrder(" . $data[$item]['did'] . ", ";
        $query .= $data[$item]['ord'] . ") ";
        // echo $query;

        if($result = mysqli_query($con, $query)) {
            // if (mysqli_num_rows($result) > 0) {
            if ($res = mysqli_fetch_array($result)) {
                if($res[0] != '0') {
                    $retval = $res[0];
                }
            }
            // }
            mysqli_next_result($con);
        }
        $retval = 'success';
    }
    $db->close($con);

    echo json_encode($retval);
?>