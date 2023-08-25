<?php 
 require( 'ssp_class.php' );
date_default_timezone_set("Asia/Singapore");
ini_set('max_execution_time', 0);
ini_set('memory_limit','256M');


$sql_details = array(
    'user' => 'gemba_user',
    'pass' => 'CHATEAU_P3_RHQ',
    'db'   => 'gemba_db',
    'host' => '127.0.0.1'
);

print_r($_POST);
$lang 		= $_POST['lang'];
$start 		= $_POST['start'];
$end 		= $_POST['end'];
$filter_temp= json_decode($_POST['filter'], true);
$order 		= $_POST['order'];
$consolidate= $_POST['consolidated'];
$ongoing 	= $_POST['ongoing'];
$rowcnt = 1;
$filter = '';

if ($filter_temp == '' || $filter_temp == null) {
    $filter = '';
} else {
    $filter .= join(',', $filter_temp) . ',';
}
 


if ($start == 'none' && $end == 'none') {
    if ($ongoing == 'true') {
        if ($consolidate == 'true') {
            $SP_NAME = "gemba_db.exportSummaryOngoingConsolidated";
        } else {
            $SP_NAME = "gemba_db.exportSummaryOngoing";
        }
    } else {
        if ($consolidate == 'true') {
            $SP_NAME = "gemba_db.exportSummaryDailyConsolidated";
        } else {
            $SP_NAME = "gemba_db.exportSummaryDaily";
        }
    }

    $query = "  call " . $SP_NAME . "(" .
            '0' . "," . '50000' . "," .
            "JSON_OBJECT(" .
                $filter .
                "'" . "order" . "','" . $order . "'" .
            ")" .
        ") ";
} else {
    if ($consolidate == 'true') {
        $SP_NAME = "gemba_db.exportSummaryViewConsolidated";
    } else {
        $SP_NAME = "gemba_db.exportSummaryView";
    }

    $query = "  call " . $SP_NAME . "(" .
            "'" . $start . "','" . $end . "'," .
            '0' . "," . '50000' . "," .
            "JSON_OBJECT(" .
                $filter .
                "'" . "order" . "','" . $order . "'" .
            ")" .
        ") ";
}

// DB table to use

$primaryKey = 'id'; 
$table = <<<EOT
($query) temp
EOT;

echo $table;
$columns = array(
    array( 'db' => 'deviceState', 'dt' => 'devoff'),
    array( 'db' => 'jobSchedule_id', 'dt' => 'devsid'),
    array( 'db' => 'id', 'dt' => 'devdid'),
    array('db' => 'devicename', 'dt'=>'devnme'),
    array('db' => 'job', 'dt'=>'devjob'),
    array('db' => 'productionStart', 'dt'=>'devstt'),
    array('db' => 'productionEnd', 'dt'=>'devend'),
    array('db' => 'model', 'dt'=>'devmod'),
    array('db' => 'material', 'dt'=>'devmat'),
    array('db' => 'target', 'dt'=>'devtgt'),
    array('db' => 'prewarn', 'dt'=>'devpwn'),
    array('db' => 'count', 'dt'=>'devcnt'),
    array('db' => 'count', 'dt'=>'devdif'),
    array('db' => 'reject', 'dt'=>'devrej'),
    array('db' => 'target', 'dt'=>'devrun'),
    array('db' => 'target', 'dt'=>'devdwn'),
    array('db' => 'target', 'dt'=>'prdtm'),
    array('db' => 'schedEnd', 'dt'=>'devsde'),
    array('db' => 'operator', 'dt'=>'devopr'),
    array('db' => 'statusName', 'dt'=>'devsta'),
    array('db' => 'prescale', 'dt'=>'devpre'),
    array('db' => 'cycletime', 'dt'=>'devcyc'),
    array('db' => 'rejectRemarks', 'dt'=>'devrem'),
    array('db' => 'rejectRemarks', 'dt'=>'rowCnt'),
    
    );


echo json_encode(
    SSP::simple( $_GET, $sql_details, $table, $primaryKey, $columns )
);

?>