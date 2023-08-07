<?php
    date_default_timezone_set("Asia/Singapore");
    $retval = '';

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
    ini_set('max_execution_time', 3000);

    $retval = 'failed';
    if(isset($_POST['user'])) {
        $fname = $_POST['fname'];
        $user = $_POST['user'];
        $pass = $_POST['pass'];
        $perm_1 = $_POST['perm_1'];
        $perm_2 = $_POST['perm_2'];
        $perm_3 = $_POST['perm_3'];
        $perm_4 = $_POST['perm_4'];
        $role = $_POST['perm_5'] == 'false' ? 2 : 1;

        $query = "select gemba_db.add_login_account(";
        $query .=  "'" . $user . "', ";
        $query .=  "'" . $pass . "', ";
        $query .=  "'" . $fname . "', ";
        $query .=  "'', ";
        $query .=  "'', ";
        $query .=  $role . ", ";
        $query .=  $perm_1 . ", ";
        $query .=  $perm_2 . ", ";
        $query .=  $perm_3 . ", ";
        $query .=  $perm_4;
        $query .= ")";

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