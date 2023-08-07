<?php 
    require_once __DIR__ . '/../db_connect.php';
    ini_set('max_execution_time', 3000);

    $retval = 'failed';
    if (isset($_POST['ids'])) {
        $db = new DB_CONNECT(0);
        $con = $db->connect(0);

        $ids = json_decode($_POST['ids'], true);

        $query = "DELETE FROM gemba_db.downtime_cause_list WHERE id IN(";
        for($i = 0; $i < count($ids); $i++) {
            $query .= ($i > 0 ? ',' : '') . $ids[$i]['id'];
        }
        $query .= ")";

        $result = mysqli_query($con, $query);
        if($result) {
            $retval = 'success';
        }
        mysqli_next_result($con);
        $db->close($con);
    }

    echo json_encode($retval);
?>