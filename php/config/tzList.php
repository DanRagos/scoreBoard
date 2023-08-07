<?php
    function select_Timezone($selected = '') {
        $OptionsArray = timezone_identifiers_list();
        $select = '<select name="SelectContacts"><option hidden disabled selected value> -- select an option -- </option>';
        foreach ($OptionsArray as $key => $row) {
            $select .='<option value="'.$row.'"';
            $select .= '>'.$row.'</option>';
        }
        $select .= '</select>';
        return $select;
    }

    echo json_encode(select_Timezone());
?>
