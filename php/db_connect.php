<?php
	/*
	 * Connection to Database
	 * db_connect()
     * check_connection()
     * check_version()
	 */

    /* Database Configuration */
    class db_connect {

        private static $con;

        function __construct($x) {
            // $this->connect($x);
        }
     
        function connect($param){
        	require_once __DIR__ . '/db_config.php';

            $con = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE);
            
            return $con;
        }

        function check_connection(){
            require_once __DIR__ . '/db_config.php';

            $con = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE);
            if (mysqli_connect_errno()){
                $output = "Not Connected";
            }else{
                $output = "Connected";
            }

            return $output;     
        }

        function check_version(){
            /* if php version is 4.0.0 below use mysql_connect else use mysqli_connect */
            if (version_compare(PHP_VERSION, '7.0.0') >= 0) {
                $version = 'php_version: ' . PHP_VERSION;
            }
            if (version_compare(PHP_VERSION, '4.0.0') >= 0) {
                $version = 'php_version: ' . PHP_VERSION;
            }

            return $version;
        }

        function close($con) {
            mysqli_close($con);
        }
    }
?>
