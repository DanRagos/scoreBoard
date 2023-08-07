function openQRCamera(node) {
    var reader = new FileReader();
////-->
    // var outputContainer = document.getElementById("output");
    // var outputMessage = document.getElementById("outputMessage");
    // var outputData = document.getElementById("outputData");
/////<--
    reader.onload = function() {
        node.value = "";
        qrcode.callback = function(res) {
            if(res instanceof Error) {
                showPrompt(lang[flags.pref.lang].qr.notfound, "Error");
            } else {
                handleQRInputs(res);
            }
        };
        qrcode.decode(reader.result);
////-->
        // var img = document.createElement('img');

        // img.onload = function () {
        //     var canvas = document.createElement("canvas");
        //     var ctx = canvas.getContext("2d");
        //     var imageData;

        //     ctx.drawImage(img, 0, 0);
        //     imageData = ctx.getImageData(0, 0, img.width, img.height);

        //     var code = jsQR(imageData.data, imageData.width, imageData.height, {
        //         inversionAttempts: "dontInvert",
        //     });

        //     outputMessage.hidden = false;
        //     outputData.parentElement.hidden = true;
        //     outputData.innerText = code.data;
        // };
        // img.src = reader.result;
////<--
    };
    reader.readAsDataURL(node.files[0]);
}

function handleQRInputs(data) {
    $('#switch-camera-btn').hide();
    if (data === "") {
        showPrompt(lang[flags.pref.lang].qr.notfound, "Error");  
        return;
    }
    /** Machine, Job, Model, Material, Target, Cycle, Prescale, Operator, Prewarn, Start(not used), End(not used) **/
    var temp = data.split(/(?:,|;)+/);
    for (var i = 0; i < temp.length; i++) {
        if(temp[i] != '') {
            temp[i] = temp[i].trim();
        } 
    }

    /* Check QR input for errors */
    // Required parameters
    // if (temp.length < 9) {
    //     showPrompt(lang[flags.pref.lang].qr.errlack, "Error"); 
    //     return;
    // }
    /* must also check the format of the Sched Start if valid date */
    if (
        ((flags.currPage == 'control-tab') && (temp.length < 9)) || 
        ((flags.currPage == 'schedule-tab') && (temp.length < 10))) {
            showPrompt(lang[flags.pref.lang].qr.errlack, "Error"); 
            return;
    }

    //Au: Convert Cycle Time to sec if in time format, MM:SS or HH:MM:SS
    if (temp[5].includes(':')) {
        var a = temp[5].split(':');
        // temp[5] = (a[0]*3600) + (a[1]*60) + a[2];
        temp[5] = parseInt(a[0]);
        for (var i = 1; i < a.length; i++){
            temp[5] *= 60;
            temp[5] += parseInt(a[i]);
        }
//         temp[5] = a[0];
//         for (var i = 1; i < a.length; i++) {
//             temp[5] *= 60;
//             temp[5] += a[i];
//         }
    }

    //Au: Job, Model, Material, Operator
    const strToTest = [ temp[1], temp[2], temp[3] ];
    if (temp.length >= 8) {
        strToTest.push(temp[7]);
    }
    const r = /([!@#$%^&*+=`"':;<>?\\{}\[\]]+)/gm;
    var hasInvalidVal = false;
    for (var i = 0; i < strToTest.length; i++) {
        if (r.test(strToTest[i])) {
            hasInvalidVal = true;
            break;
        }
    }
    if (hasInvalidVal) {
        showPrompt(lang[flags.pref.lang].qr.errchar, "Error");
        return;
    }

    // target, prescale, prewarn //to debug error does not show
    const strToTest2 = [ temp[4], temp[6] ];
    if (temp.length >= 9) {
        strToTest2.push(temp[8]);
    }
    const r2 = /^\d+(\.)*(\d)*$/gm;
    var wrongNumFormat = false;
    for (var i = 0; i < strToTest2.length; i++) {
        if (strToTest2[i].match(r2) == null) {
            wrongNumFormat = true;
            break;
        }
    }
    if (wrongNumFormat) {
        showPrompt(lang[flags.pref.lang].qr.errnumformat, "Error");
        return;
    }

    // prescale value min. 0.1
    if (parseFloat(temp[6]) < 0.1 ){
        showPrompt(lang[flags.pref.lang].schedule.prompts.schedNegVal, "Error");
        return;
    }

    //Au: operator, prewarn, scheduled start and end are optional.
    var dataStruct = {
        'machine':  temp[0],
        'job':      temp[1],
        'model':    temp[2],
        'material': temp[3],
        'target':   parseFloat(temp[4]).toFixed(1),
        'cycle':    temp[5],
        'prescale': parseFloat(temp[6]).toFixed(1),
        'operator': temp[7] == undefined ? '' : temp[7],
        'prewarn':  temp[8] == undefined ? '' : parseFloat(temp[8]).toFixed(1),
        // 'start':    temp[9],
        'start':    temp[9] == undefined ? getDateTimeNow('-').dnt : temp[9],
        'end':      temp[10] == undefined ? '': temp[10],
    }

    if(flags.ajaxRequestStatus != null) {
        flags.ajaxRequestStatus.abort();
        flags.ajaxRequestStatus = null;
    }

    //** Check if this record exist **//
    flags.ajaxRequestStatus = $.ajax({
        type: 'POST', 
        url: 'php/control/qrControlPage.php',
        data: {
            devid: dataStruct.machine,
            devjb: dataStruct.job,
            devst: dataStruct.start,
        },
        dataType:'json',
        async: true,
        success: function(data) {
            /** Check if data is empty **/
            if(!$.isEmptyObject(data)) {
                switch(flags.currPage) {
                    case 'control-tab':
                        qrProcessControlPage(data, dataStruct);
                        break;

                    case 'schedule-tab':
                        qrProcessSchedulePage(data, dataStruct);
                        break;

                    default:
                        break;
                }
            } else {
                showPrompt(lang[flags.pref.lang].qr.errformat, "Error");
            }
            flags.ajaxRequestStatus = null;
        },
        fail: function() {
            if(flags.ajaxRequestStatus != null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }
            showPrompt(lang[flags.pref.lang].qr.faildb, "Failed");
        }
    });
}
/* this function is only used for addnew */
function uiInputMapping(ref) {
    $('select.mobJob option:selected').each(function(e) {
        $(this).val(ref.job);
        $(this).text(ref.job);
        $(this).parent().eq(0).parent().eq(0).find('.filter-option-inner-inner').html(ref.job);
    });
    $('.mobModel').val(ref.model);
    $('.mobMaterial').val(ref.material);
    $('.mobTarget').val(ref.target);
    $('.mobPrewarn').val(ref.prewarn);
    $('.mobPrescale').val(ref.prescale);
    $('.mobCycle').val(ref.cycle);
    $('.mobOperator').val(ref.operator);
    // $('.mobSchedule').val(ref.start);
    $('.mobSchedule').val('N/A');
    $('.mobEndTgt').attr('disabled', false);
    $('.mobEndTgt').prop('checked', false);
    $('.mobReject').val('N/A');
    $('.mobOutput').val('N/A');
    flags.control.addNewBypass = true;
    if (parseInt(ref.cycle) == 0 ){
        $('.control-wdt-input').prop('checked', false);
    } else {
        $('.control-wdt-input').prop('checked', true);
    }
    
}

function qrUpdateJobSelection(devId, schedId, callback) {
    flags.ajaxRequestStatus = $.ajax({
        type: 'POST',
        url: 'php/control/jogetdevicejobs.php',
        data: { 'id': devId },
        dataType:'json',
        async: true,
        success: function(data) {
            /** Check if data is empty **/
            var str = '';
            if(!(data === null)) {
                var selectedSchedId = '';
                var hasSelected = false;
                var prologue = '<option value="New">New</option>';
                for(var x = 0; x < data.length; x++) {
                    str += '<option value="' + data[x].devdid + '"';
                    if(data[x].devjob != '' && data[x].devjob != null) {
                        if(data[x].devscd == '1') {     //used job
                            hasSelected = true;
                            $("select.mobJob option[value='']").remove();
                            str += " data-autoend='" + data[x].devflg + "'";
                            str += " data-wdtenabled='" + data[x].devwdt + "'";
                            str += ">" + data[x].devjob + " (" + 'RUNNING' + ")";
                        } else {
                            str += " data-autoend='" + data[x].devflg + "'";
                            str += " data-wdtenabled='" + data[x].devwdt + "'";
                            str += ">" + data[x].devjob;
                        }
                    } else {
                        str += "--";
                    }
                    str += '</option>';
                    console.log(str); //Au
                }
                if(!hasSelected || schedId == 'New') {
                    str = prologue + str;
                }
                if(hasSelected && schedId == 'New') {
                    // showPrompt('Machine has already a running Job. Cannot input "New" Schedule.<br/><br/>Note: Please go to Schedule tab to add new job for devices with running jobs.', "Error");
                    showPrompt(lang[flags.pref.lang].control.prompts.startAnother, 'Failed');
                    return;
                }
            } else {
                str = '<option value="New">New</option>';
            }

            $('select.mobJob').html(str);
            $('select.mobJob').selectpicker('refresh');
            $('select.mobJob').selectpicker('val', schedId);

            flags.ajaxRequestStatus = null;
            
            //updateDashboardDisplay();
            if (callback && typeof callback === "function") {
                callback();
            }
        },
        fail: function() {
            console.log('Failed updateJobOptions: ' + errThrown);
            if(ajaxRequestStatus !== null) {
                ajaxRequestStatus.abort();
                ajaxRequestStatus = null;
            }
            showPrompt(lang[flags.pref.lang].qr.failrx, 'Failed');
        }
    });
}

function qrProcessControlPage(data, dataStruct) {
    var mode = '';

    if (data.devid === null || data.devid == "null") {
        showPrompt(lang[flags.pref.lang].qr.nodevice, "Error");
        return;
    }

    /*
     * data.assign  : 1 - exists and started / used 
     *              : 0 - exists and could not exist at the same time (tristate)
     * data.ongoing : 1 - currently running
     *              : 0 - not running
     */

    // if (data.assign == '1') {
    //     /* options: either return error or load data */
    //     if (data.scdid == data.runid && parseInt(data.scdid) > 0) {
    //         mode = 'load';
    //     } else {
    //         if (data.ongoing == '1') {
    //             showPrompt(lang[flags.pref.lang].qr.schedexistrun, "Error");
    //         } else {
    //             showPrompt(lang[flags.pref.lang].qr.schedexistcomp, "Error");
    //         }
    //     }
    // } else {
    //     if (parseInt(data.scdid) > 0) {
    //         /* exists */
    //         mode = 'load';
    //     } else {
    //         /* does not exists */
    //         mode = 'addNew';
    //     }
    // }

    /* Cases:
     * With Ongoing Job: prompt error and load ongoing job
     * Else: proceed but check conflict later during START JOB */
    if (parseInt(data.runid) > 0) {
        /* with running job: prompt and load */
        mode = 'load';
        showPrompt(lang[flags.pref.lang].qr.runexist, "Error");
        console.log ('with running job');
    } else {
        // /* no running job: prompt if existing or add if not */ 
        // if (parseInt(data.scdid) > 0) {
        //     /* schedule with same Sched Start exists */
        //     console.log ('sched start exist na.. ', data.scdid);
        //     showPrompt(lang[flags.pref.lang].qr.schedstartexist, "Error");
        //     return;
        // } else {
        //     /* add schedule */
        //     mode = 'addNew';
        //     console.log('add new sched');
        // }
        // no need to check Sched Start here, wait for START JOB for actual time
        mode = 'addNew';
        console.log('ok to add new sched');
    }

    switch(mode) {
        case 'addNew':
            /** disable event handlers **/
            $('.mobMachine').on('change', false);
           
            flags.control.currSchedId = '';
            $('select.mobMachine').selectpicker('val', data.devid);
            qrUpdateJobSelection(data.devid, 'New', function() {
                clearMobileDashboard();
                enableDashboardEdit();
                // clearMobileDashboard();
                unsetRealtimeInfo('0');
                uiInputMapping(dataStruct);
                getBlacklist('qr');
            });
            // setTimeout(function() {
            //     clearMobileDashboard();
            //     unsetRealtimeInfo('0');
            //     uiInputMapping(dataStruct);
            // }, 150);

            /** enable event handlers **/
            $('.mobMachine').off('change', false);
            break;

        case 'load':
            /** disable event handlers **/
            $('.mobMachine').on('change', false);

            // flags.control.currSchedId = data.scdid;
            flags.control.currSchedId = data.runid;
            $('select.mobMachine').selectpicker('val', data.devid);
            getBlacklist('qr', function() {
                qrUpdateJobSelection(data.devid, flags.control.currSchedId, function() {
                    updateDashboardDisplay();
                });
            });

            /** enable event handlers **/
            $('.mobMachine').off('change', false);
            break;

        default:
            console.log('hmm... must not have gone here.');
            break;
    }
}

function qrProcessSchedulePage(data, ref) {
    console.log ('this is the qrProcessSchedulePage function call')
    if (data.devid === null || data.devid == "null") {
        showPrompt(lang[flags.pref.lang].qr.nodevice, "Error");
        return;
    }

    var mode = '';
    if (parseInt(data.scdid) > 0) {
        /* schedule exists */
        console.log ('sched exist na daw eh.. ', data.scdid);
        // mode = 'load';
        showPrompt(lang[flags.pref.lang].qr.schedstartexist, "Error");
    } else {
        /* add schedule */
        mode = 'addNew';
        console.log('add new sched');
    }
    
    /*
     * data.assign  : 1 - exists and started / used 
     *              : 0 - exists and could not exist at the same time (tristate)
     * data.ongoing : 1 - currently running
     *              : 0 - not running
     */

    // var mode = '';
    // if (data.assign == '1') {
    //     /* exists */
    //     mode = 'load';
    // } else {
    //     if (parseInt(data.scdid) > 0) {
    //         /* exists */
    //         mode = 'load';
    //     } else {
    //         /* does not exist */
    //         mode = 'addNew';
    //     }
    // }

   $.ajax({
        type: 'POST',
        url: 'php/jogetdevices.php',
        data: '',
        dataType:'json',
        async: true,
        success: function(retData) {
            /** Check if data is empty **/
            if(!(retData === null)) {
                var str = '';
                for(var x = 0; x < retData.length; x++) {
                    str += '<option value="' + retData[x].devdid + '">';
                    if(retData[x].devnme != '' && retData[x].devnme != null) {
                        str += retData[x].devnme;
                    } else {
                        str += retData[x].devdid;
                    }
                }
                $('#schedID').html(str);

                if (mode == 'addNew') {
                    /** Add new schedule **/
                    $('#schedID').val(data.devid);
                    $('#schedJOB').val(ref.job);
                    $('#schedMOD').val(ref.model);
                    $('#schedMAT').val(ref.material);
                    $('#schedTGT').val(ref.target);
                    $('#schedPWN').val(ref.prewarn);
                    $('#schedPRE').val(ref.prescale);
                    $('#schedCYC').val(ref.cycle);
                    $('#schedfr').val(ref.start);
                    $('#schedto').val(ref.end);
                    $('#schedOPR').val(ref.operator);
                    addNewSchedule(function() {
                        reportScheduleSummary('#promptModal', ref)
                    });
                    
                    if(!$('#schedule-tab .tbl-container.schedTable').hasClass('sidepanel')) {
                        $('#schedule-tab .tbl-container.schedTable').addClass('sidepanel');
                    }
                    $('#schedule-tab .sidepanel').css('z-index', 0);

                } else {
                    /** Load Schedule **/
                    flags.schedule.recentAddedId = '';
                    // updateMachineOptions();
                    setScheduleLockState(null, null, localStorage.getItem('schedlockedId'), 0, function() {
                        $.ajax({
                            type: 'POST',
                            url: 'php/joschedlock.php',
                            data: { 
                                cmd: 'write', 
                                sid: data.scdid, 
                                val: 1, 
                                pid: $('#accntInfoHolder').data('aid')
                            },
                            dataType:'json',
                            async: true,
                            success: function() {
                                getScheduleInfo(data.scdid, function(ret) {
                                    if(!$('#schedule-tab .tbl-container.schedTable').hasClass('sidepanel')) {
                                        $('#schedule-tab .tbl-container.schedTable').addClass('sidepanel');
                                    }
                                        $('#schedule-tab .sidepanel').css('z-index', 0);
                                    // // added to enable side panel after qr scan
                                    // setTimeout(() => {
                                    //     $('#schedule-tab .sidepanel').css('z-index', 0);
                                    // }, 1000);
                                    $('#add-sched-btn').attr('disabled', true);

                                    localStorage.setItem('schedlockedId', data.scdid);

                                    flags.schedule.loadedDeviId = ret.devdid;
                                    flags.schedule.loadedTgt = ret.devtgt;
                                    $('#schedID').val(data.devid);
                                    $('#schedJOB').val(ret.devjob);
                                    $('#schedMOD').val(ret.devmod);
                                    $('#schedPRE').val(ret.devpre);
                                    $('#schedPWN').val(ret.devpwn);
                                    $('#schedCYC').val(ret.devcyc);
                                    $('#schedOPR').val(ret.devopr);
                                    $('#schedTGT').val(ret.devtgt);
                                    $('#schedMAT').val(ret.devmat);
                                    $('#schedfr').val(ret.devstt);
                                    var testBlank = ret.devend == "--" ? '' : ret.devend;
                                    $('#schedto').val(testBlank);
                                    $('#schedLogID').val(data.scdid);
                                    $('#schedLogID').data('state', ret.devong);
                                    $('#schedLogID').data('flg', ret.devjst);
                                    var userId = $('#accntInfoHolder').html();

                                    $('#upd-sidepanel-btn').removeAttr('disabled');
                                    // Au: sched is locked by other user
                                    if(ret.devlck == '1' && ret.devusr != userId) {
                                        $('#del-sidepanel-btn').attr('disabled', true);
                                        $('#upd-sidepanel-btn').attr('disabled', true);
                                        $('#lockIcon').show();
                                    //Au: job sched is used, either ongoing or completed - don't allow delete
                                    } else if(ret.devjst == '1') {
                                        $('#lockIcon').hide();
                                        $('#del-sidepanel-btn').attr('disabled', true);
                                        if(ret.devong == 'completed') {
                                            $('#schedPRE').attr('disabled', true);
                                            $('#schedPWN').attr('disabled', true);
                                            $('#schedCYC').attr('disabled', true);
                                            $('#schedTGT').attr('disabled', true);
                                        } else {
                                            $('#schedPRE').attr('disabled', true);
                                            $('#schedPWN').attr('disabled', false);
                                            $('#schedCYC').attr('disabled', true);
                                            $('#schedTGT').attr('disabled', false);
                                        }
                                    } else {    //Au: unused job or locked by this user - allow all edit
                                        $('#lockIcon').hide();
                                        $('#del-sidepanel-btn').attr('disabled', false);
                                        $('#schedPRE').attr('disabled', false);
                                        $('#schedPWN').attr('disabled', false);
                                        $('#schedCYC').attr('disabled', false);
                                        $('#schedTGT').attr('disabled', false);
                                    }

                                    if(flags.displayMode.schedule == 'view') {
                                        scheduleUpdate();
                                    }

                                    // showPrompt(lang[flags.pref.lang].qr.schedfound, 'Success');
                                    // setTimeout(function() {
                                    //     $('#promptModal').modal('hide');
                                    // }, 1000);
                                    // showPrompt(lang[flags.pref.lang].qr.schedstartexist, "Error");
                                });
                            },
                            fail: function() {
                                console.log("Transaction failed on setting schedule lock");
                            }
                        });
                    });
                }
            } else {
                showPrompt("Failed to get a valid ID number!", "Error");
            }
        }
    });
}

function reportScheduleSummary(modal, ref) {
    setTimeout(function() {
        $(modal).modal('hide');
        var parent = $('#qrSchedModal');
        var children = parent.find('input');
        var temp = [];
        temp.push(ref.machine);
        temp.push(ref.job);
        temp.push(ref.model);
        temp.push(ref.material);
        temp.push(ref.target);
        temp.push(ref.prewarn);
        temp.push(ref.operator);
        temp.push(ref.start);
        temp.push(ref.end == '' || ref.end === undefined ? '--' : ref.end);
        temp.push(ref.cycle);
        temp.push(ref.prescale);
        for(var i = 0; i < children.length; i++) {
            $(children[i]).val(temp[i]);
        }
        parent.modal('show');
    }, 1000);
}