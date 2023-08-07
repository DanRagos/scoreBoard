<?php
date_default_timezone_set("Asia/Singapore");
ini_set('max_execution_time', 0);
ini_set('memory_limit', '256M');

require_once '../Spout/vendor/box/spout/src/Spout/Autoloader/autoload.php';
require_once __DIR__ . '/db_connect.php';
use Box\Spout\Common\Entity\Style\CellAlignment;
use Box\Spout\Writer\Common\Creator\Style\StyleBuilder;
use Box\Spout\Writer\Common\Creator\WriterEntityFactory;
use Box\Spout\Common\Entity\Row;

// Establish Database Connection
$db = new mysqli('127.0.0.1', 'gemba_user', 'CHATEAU_P3_RHQ', 'scoreboard_db');
if ($db->connect_errno) {
    die("Failed to connect to MySQL: " . $db->connect_error);
}

// Execute the provided query
$query = "call getRecordSummary()";
$result = $db->query($query);

// Create the Excel file
$defaultStyle = (new StyleBuilder())
    ->setFontName('Arial')
    ->setFontSize(10)
    ->setCellAlignment(CellAlignment::CENTER)
    ->build();
$writer = WriterEntityFactory::createXLSXWriter();
$writer->setDefaultRowStyle($defaultStyle)->openToBrowser('Gemba_Log_Records.xlsx'); // Open directly in the browser for download

// Create the first worksheet
$worksheetTitle = "Summary Records";
$firstSheet = $writer->getCurrentSheet();
$firstSheet->setName($worksheetTitle);

// Create the header row
$headerStyle = (new StyleBuilder())
    ->setFontBold()
    ->build();
$headerRow = [
    'Device Name',
    'Job Name',
    'Production Start',
    'Production End',
    'Target Quantity',
    'Actual Quantity',
    'Difference',
    'Production Time',
    'Down Time',
    'Status'
];
$rowFromValues = WriterEntityFactory::createRowFromArray($headerRow, $headerStyle);
$writer->addRow($rowFromValues);

// Process the data and add rows to the worksheet
while ($row = $result->fetch_assoc()) {
    $summary = [
        $row["line_name"],
        $row["job_name"],
        $row["production_start"],
        $row["production_end"],
        $row["target_qty"],
        $row["actual_qty"],
        $row["Difference"],
        $row["prod_time"],
        $row["down_time"],
        $row["name"]
    ];

    $rowFromValues = WriterEntityFactory::createRowFromArray($summary);
    $writer->addRow($rowFromValues);
}

// Close the Database Connection


// Close the Excel file
$writer->close();
$xlsData = ob_get_contents();
ob_end_clean();

// Encode the Excel data in Base64
$base64Data = base64_encode($xlsData);

// Close the Database Connection
$result->free();
$db->close();

header('Content-Type: application/json');
echo json_encode(array('file' => $base64Data));
exit;
