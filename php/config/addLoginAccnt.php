<?php
    date_default_timezone_set("Asia/Singapore");
    $retval = 'failed';

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
    ini_set('max_execution_time', 3000);

    if(isset($_POST['uname']) && isset($_POST['fname']) && isset($_POST['pass'])) {
        $query = "select gemba_db.add_login_account('" . $_POST['uname'] . "', '";
        $query .= $_POST['pass'] . "', '" . $_POST['fname'] . "', '";
        $query .= $_POST['dept'] . "', '" . $_POST['mail'] . "', ";
        $query .= $_POST['role'] . ")";

        if($result = mysqli_query($con, $query)) {
            if ($result) { // if (mysqli_num_rows($result) > 0) {
                if($res = mysqli_fetch_array($result)) {
                    if($res[0] != '0') {
                        $retval = 'success';
                    }
                }
            }
        }
        mysqli_next_result($con);
    }
    $db->close($con);

    echo json_encode($retval);
?>