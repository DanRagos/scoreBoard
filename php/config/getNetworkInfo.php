<?php
    $interface = array();
    $data = shell_exec("ip addr show enp2s0 | grep 'inet\b' | awk '{print $2}' | awk -F/ '{print $1}'");
    $interface += [ 'ip' => str_replace(array("\n", "\r"), '', $data) ];
    // $data = shell_exec("/usr/bin/ifconfig enp2s0 | grep 'inet\b' | awk '{print $4}'");
    $cidr_str = shell_exec("ip addr show enp2s0 | grep 'inet\b' | awk '{print $2}' | awk -F/ '{print $2}'");
    $cidr = (int)$cidr_str;
    // convert decimal to ip address
    $temp_nm = array();
    for ($index = 0; $index < 4; $index++) {
        if ($cidr > 8) {
            array_push($temp_nm, 255);
            $cidr -= 8;
        } else {
            array_push($temp_nm, (2 ** $cidr) - 1);
            $cidr = 0;
        }
    }
    $data = (string)$temp_nm[0] . "." . (string)$temp_nm[1] . "." . (string)$temp_nm[2] . "." . (string)$temp_nm[3];
    $interface += [ 'msk' => str_replace(array("\n", "\r"), '', $data) ];
    $data = shell_exec("ip link show enp2s0 | grep link | awk '{print $2}'");
    $interface += [ 'mac' => str_replace(array("\n", "\r"), '', $data) ];

    echo json_encode($interface);
?>