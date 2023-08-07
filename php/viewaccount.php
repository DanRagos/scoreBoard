<?php
	$response = array();
	$temp = array(
			'name' => 'Airi Satou',
			'dept' => 'Production',
			'pos' => 'Operator',
			'accs' => '3'
		);

		array_push($response, $temp);

	$temp = array(
			'name' => 'Angelica Ramos',
			'dept' => 'Production',
			'pos' => 'Planner',
			'accs' => '1'
		);

		array_push($response, $temp);

	$temp = array(
			'name' => 'Ashton Cox',
			'dept' => 'Production',
			'pos' => 'Operator',
			'accs' => '3'
		);

		array_push($response, $temp);

	$temp = array(
			'name' => 'Bradley Greer',
			'dept' => 'Production',
			'pos' => 'Operator',
			'accs' => '3'
		);

		array_push($response, $temp);

	$temp = array(
			'name' => 'Brenden Wagner',
			'dept' => 'Production',
			'pos' => 'Operator',
			'accs' => '3'
		);

		array_push($response, $temp);

	$temp = array(
			'name' => 'Brielle Williamson',
			'dept' => 'Production',
			'pos' => 'Operator',
			'accs' => '3'
		);

		array_push($response, $temp);

	$temp = array(
			'name' => 'Caesar Vance',
			'dept' => 'Production',
			'pos' => 'Planner',
			'accs' => '3'
		);

		array_push($response, $temp);

	$temp = array(
			'name' => 'Cedric Kelly',
			'dept' => 'Production',
			'pos' => 'Planner',
			'accs' => '1'
		);

		array_push($response, $temp);

	$temp = array(
			'name' => 'Cara Stevens',
			'dept' => 'Admin',
			'pos' => 'IT Specialist',
			'accs' => '4'
		);

		array_push($response, $temp);

	echo json_encode($response);
?>