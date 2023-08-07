<?php
	ini_set('max_execution_time', 0);
	require_once("../Spout/vendor/autoload.php");
	use Box\Spout\Writer\Common\Creator\WriterEntityFactory;
	use Box\Spout\Common\Entity\Row;

	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename="Gemba_Log_Records.xlsx"');
	header('Cache-Control: max-age=0');

	$writer = WriterEntityFactory::createXLSXWriter();

	$writer->openToFile('php://output'); // write data to a file or to a PHP stream

	/* simulate large data */
	$rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
	for ($i = 0; $i < 50000; $i++) {
		$rowFromValues = WriterEntityFactory::createRowFromArray($rows);
		$writer->addRow($rowFromValues);
	}

	/** Shortcut: add a row from an array of values */
	// $values = ['Carl', 'is', 'great!'];
	// $rowFromValues = WriterEntityFactory::createRowFromArray($values);
	// $writer->addRow($rowFromValues);

	$writer->close();
?>