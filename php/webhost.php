<?php
    //define('localhost', "10.0.0.1");

    if(isset($_POST['cmd'])) {
        if($_POST['cmd'] == 'getip') {
            echo json_encode(getHostIp());
        }
    }

    function getHostIp() {
        $data = shell_exec("ip addr show enp2s0 | grep 'inet\b' | awk '{print $2}' | awk -F/ '{print $1}'");
        $interface = str_replace(array("\n", "\r"), '', $data);

        // bypass functions below, immediately return address bar value
        return $_SERVER["HTTP_HOST"];

        $clientIp = preg_split ("/\./", getUserIpAddr()); 
        if ($interface == '' || $interface == null || $interface == "192.168.50.100") {
            $interface = '10.0.254.1';
            // $interface = 'gembareporter.com';
        } else if ($clientIp[0] == '10') {
            $interface = 'gembareporter.com';
        }

        return $interface;
    }

    function getUserIpAddr() {
        if(!empty($_SERVER['HTTP_CLIENT_IP'])){
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        }elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        }else{
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }
?>
