<?php 
    ini_set('max_execution_time', 0);
    $response = array();

    require_once __DIR__ . '/../db_connect.php';

    $db = new DB_CONNECT(0);
    $con = $db->connect(0);
    ini_set('max_execution_time', 3000);

    $retval = 'failed';
    if (isset($_POST['id']) && isset($_POST['perm'])) {
        $query = '';
        if ($_POST['perm'] == 'perm_5') {
            $query = "UPDATE login_accounts SET role=" . ($_POST['state'] == 'true' ? 1 : 2) . " WHERE id=" . $_POST['id'];
        } else {
            $query = "UPDATE login_accounts SET " . $_POST['perm'] . "=" . $_POST['state'] . " WHERE id=" . $_POST['id'];
        }

        if($result = mysqli_query($con, $query)) {
            // if ($res = mysqli_fetch_array($result)) {
            //     if($result != '0') {
            //         $retval = $res[0];
            //     }
            // }
            mysqli_next_result($con);
            $retval = 'success';
        }
    }
    $db->close($con);

    echo json_encode($retval);
?>