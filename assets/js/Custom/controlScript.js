/** converted functions **/
function startRecord() {
    var val = flags.control.currSchedId;

    if($('.snsBtn').eq(0).text() == lang[flags.pref.lang].control.endjob) {
        if(flags.control.deviceOnbacklog) {
            showWarning(lang[flags.pref.lang].control.prompts.startEndBacklog, "endjob");
        } else {
            showWarning(lang[flags.pref.lang].control.prompts.startEndjob, "endjob");
        }
        return;
    }

    var temp = $('select.mobJob').eq(0).val();
    if(temp === "" || temp === null) {
        showPrompt(lang[flags.pref.lang].control.prompts.startSelect, 'Error');
        return;
    }

    flags.control.addNewSchedOnStart = false;
    if($('select.mobJob').eq(0).val() == lang[flags.pref.lang].control.new || $('select.mobJob').eq(0).val() == 'None' || flags.control.addNewBypass) {
        // Au: do not clear this to re-enable errors
        flags.control.addNewBypass = false;
        addSchedInfo();
    } else {
        executeSchedStart(val, 'No');
    }
}

function executeSchedStart(val, manual) {
    console.log('executeSchedStart()');
    query_stop();

    if(flags.ajaxRequestStatus != null) {
        flags.ajaxRequestStatus.abort();
        flags.ajaxRequestStatus = null;
    }

    flags.ajaxRequestStatus = $.ajax({
        type: 'POST',
        url: 'php/control/startandstop.php',
        data: { 
            cmd: 'start',
            id: $('select.mobMachine').eq(0).val(), 
            schedid: val,
            addSched: manual, 
            autoend: $('.mobEndTgt').eq(0).prop("checked") ? "1" : "0",
            wdtenabled: $('.control-wdt-input').eq(0).prop('checked') && $('.mobCycle').val() ? '1' : '0'
        },
        dataType:'json',
        async: true,
        success: function(retData) {
            console.log('startandstop.php');
            console.log(retData);
            if(retData == 'success') {
                /** LSJ: change button disable to enabling end job **/
                // $('.snsBtn').attr('disabled', true);
                flags.control.currSchedId = parseInt(val);
                /* TLS */
                // getBlacklist('user');
                /* LSJ */
                startStopModal('start');
            } else if(retData == 'deleted') {
                showPrompt(lang[flags.pref.lang].control.prompts.startDeleted, 'Failed');
            } else if(retData == 'failed') {
                showPrompt(lang[flags.pref.lang].control.prompts.startRunning, 'Failed');
            } else {
                showPrompt(lang[flags.pref.lang].control.prompts.startAgain, 'Failed');
            }
            flags.ajaxRequestStatus = null;
            query_start();
        },
        fail: function(e) {
            showPrompt(lang[flags.pref.lang].control.prompts.startAgain, 'Failed');

            if(flags.ajaxRequestStatus != null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }

            query_start();
        }
    });
}

function addSchedInfo() {
    console.log('addSchedInfo()');
    query_stop();

    $('.dash-input').attr('disabled', true);

    if(flags.ajaxRequestStatus != null) {
        flags.ajaxRequestStatus.abort();
        flags.ajaxRequestStatus = null;
    }

    var a = $('select.mobMachine').eq(0).val();
    // D 0806 'New' -> lang[flags.pref.lang].control.new 
    var b = $('select.mobJob').eq(0).val() == lang[flags.pref.lang].control.new ? "None" : $('select.mobJob').eq(0).val();
    var c = $('.mobModel').eq(0).val() == '' ? "--" : $('.mobModel').eq(0).val();
    var d = $('.mobMaterial').eq(0).val() == '' ? "--" : $('.mobMaterial').eq(0).val();
    var e = $('.mobTarget').eq(0).val() == '' ? 0 : $('.mobTarget').eq(0).val();
    var f = $('.mobPrewarn').eq(0).val() == '' ? 0 : $('.mobPrewarn').eq(0).val();
    var g = $('.mobPrescale').eq(0).val();
    var h = $('.mobCycle').eq(0).val();
    var i = $('.mobSchedule').eq(0).val();
    var k = $('.mobOperator').eq(0).val();
    var flg = $('.mobEndTgt').eq(0).prop("checked") ? "1" : "0";
    var wdtEnabled = $('.control-wdt-input').eq(0).prop('checked') ? '1' : '0';

    if (i == 'N/A'){
        i = getDateTimeNow('-').dnt;
        flags.ajaxRequestStatus = $.ajax({
            type: 'POST', 
            url: 'php/control/qrControlPageStart.php',
            data: {
                devid: a,
                devst: i,
            },
            dataType:'json',
            async: true,
            success: function(data) {
                console.log ('qrControlPageStart.php');
                /** Check if data is empty **/
                if(!$.isEmptyObject(data)) {
                    if (parseInt(data.scdid) > 0) {
                        /* schedule with same Sched Start exists */
                        console.log ('sched start exist duh ', data.scdid);
                        showPrompt(lang[flags.pref.lang].qr.schedstartexist, "Error");
                        return;
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

    if(b == '' || h == '' || g == '') {
        showPrompt(lang[flags.pref.lang].schedule.prompts.schedFillReq, "Error");
        $('.dash-input').attr('disabled', false);
        return;
    }

    if(parseFloat(g) < 0.1 || parseInt(h) < 0) { //allow 0 on CT as advised by Eiji-san, 10/26
    // if(parseFloat(g) < 0.1 || parseInt(h) <= 0) {
        showPrompt(lang[flags.pref.lang].schedule.prompts.schedNegVal, "Error");
        $('.dash-input').attr('disabled', false);
        return;
    }

    if(parseFloat(f) < 0 || parseFloat(e) < 0) {
        showPrompt(lang[flags.pref.lang].schedule.prompts.schedZeroVal, "Error");
        $('.dash-input').attr('disabled', false);
        return;
    }

    if((parseFloat(e) > 1000000000) || (parseFloat(f) > 1000000000)) {
        showPrompt(lang[flags.pref.lang].schedule.prompts.schedTgtMaxVal, "Error");
        $('.dash-input').attr('disabled', false);
        return;
    }

    if(parseInt(h) > 999999) {
        showPrompt(lang[flags.pref.lang].schedule.prompts.schedCycleMaxVal, "Error");
        $('.dash-input').attr('disabled', false);
        return;
    }

    if(parseFloat(g) > 100) {
        showPrompt(lang[flags.pref.lang].schedule.prompts.schedPrescaleMaxVal, "Error");
        $('.dash-input').attr('disabled', false);
        return;
    }

    if(parseFloat(f) > parseFloat(e)) {
        showPrompt(lang[flags.pref.lang].schedule.prompts.schedPrewarnExceed, "Error");
        $('.dash-input').attr('disabled', false);
        return;
    }

    if(parseFloat(e) <= 0 && flg == "1") {
        showPrompt(lang[flags.pref.lang].control.prompts.startEndTgt, "Error");
        $('.dash-input').attr('disabled', false);
        return;
    }
   
    // Au: clear this flag here after checking limits
    // flags.control.addNewBypass = false;

    flags.ajaxRequestStatus = $.ajax({
        type: 'POST',
        url: 'php/control/joaddnewschedulemobile.php',
        data: {
            devid: a,
            devjb: b,
            devmd: c,
            devmt: d,
            devtg: parseFloat(e).toFixed(1),
            devpw: parseFloat(f).toFixed(1),
            devps: parseFloat(g).toFixed(1),
            devcc: h,
            devst: i,
            devop: k,
            devfg: flg,
            devwd: wdtEnabled
        },
        dataType:'json',
        async: true,
        success: function(data) {
            console.log('joaddnewschedulemobile.php')
            console.log(data);
            /** Check if data is empty **/
            if(data == 'failed') {
                showPrompt(lang[flags.pref.lang].control.prompts.startRunning, 'Failed');
                getBlacklist('user');
            } else if(data == 'error') {
                showPrompt(lang[flags.pref.lang].control.prompts.startSchedAdd, 'Failed');
                getBlacklist('user');
            } else {
                flags.control.addNewSchedOnStart = true;
                flags.control.currSchedId = parseInt(data);
                startStopModal('start');
            }
            flags.ajaxRequestStatus = null;
            query_start();
            /* TLS */
            // getBlacklist('user');
            /* LSJ */
        },
        fail: function() {
            showPrompt(lang[flags.pref.lang].control.prompts.startAgain, 'Failed');
            $('.dash-input').attr('disabled', false);

            if(flags.ajaxRequestStatus != null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }

            query_start();
            getBlacklist('user');
        }
    });
    return;
}

function updateMachineOptionsControlOnclick() {
    flags.ajaxRequestStatus = $.ajax({
        type: 'POST',
        url: 'php/jogetdevices.php',
        data: '',
        dataType:'json',
        async: true,
        success: function(data) {
            /** Check if data is empty **/
            var val = $('select.mobMachine').eq(0).val();
            var str = '';
            if(!(data === null)) {
                for(var x = 0; x < data.length; x++) {
                    str += '<option value="' + data[x].devdid;
                    if(val == data[x].devdid) {
                        str += '" selected>';
                    } else {
                        str += '">';
                    }
                    if(data[x].devnme != '' && data[x].devnme != null) {
                        str += data[x].devnme;
                    } else {
                        str += data[x].devdid;
                    }
                    str += '</option>';
                }   
            }
            $('select.mobMachine').html(str);
            $('select.mobMachine').selectpicker('refresh');

            if(val == '') {
                $('select.mobMachine').selectpicker('val', 1);
            }

            ajaxRequestStatus = null;

            getBlacklist('special');
        },
        fail: function() {
            if(flags.ajaxRequestStatus !== null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }
        }
    });
}

function enableDashboardEdit() {
    $('.mobModel').val('').attr('disabled', false);
    $('.mobMaterial').val('').attr('disabled', false);
    $('.mobSchedule').val('N/A');
    $('.mobOperator').val('').attr('disabled', false);
    $('.mobCycle').val('').attr('disabled', false);
    $('.mobPrescale').val('').attr('disabled', false);
    $('.mobTarget').val('').attr('disabled', false);
    $('.mobReject').val('N/A');
    $('.mobOutput').val('N/A');
    $('.mobPrewarn').val('').attr('disabled', false);
    $('.mobEndTgt').attr('disabled', false);
    $('.mobEndTgt').prop('checked', false);
    $('.control-wdt-input').attr('disabled', false);
    $('.control-wdt-input').prop('checked', true);

    $('.backlogJobIcon').hide();

    flags.control.currSchedId = '';
}

function getDevicePowerState() {
    var devid = $('select.mobMachine').eq(0).val();
    if(devid === null || devid === undefined || devid == '') {
        return;
    }

    flags.ajaxRequestStatus = $.ajax({
        type: 'POST',
        url: 'php/control/jogetblacklist.php',
        data: { id: devid },
        dataType:'json',
        async: true,
        success: function(data) {
            /** Check if data is empty **/
            if(!(data === null)) {
                flags.control.blacklist = data.devuse; //has job or not
                flags.control.blacklistJob = data.devjob;
                flags.control.blacklistSched = data.devsid;
                flags.control.blacklistState = data.devsta; //on or off

                if(data.devsta == "0") {
                    // display offline
                    $('.mobStatus').val(lang[flags.pref.lang].status["OFFLINE"]);
                    $('.mobStatus').css({
                        'background-color': 'var(--secondary)',
                        'color': 'white'
                    });
                } else {
                    $('.mobStatus').val("--");
                    $('.mobStatus').css({
                        'background-color': 'white', 
                        'color': '#495057',
                        'border-color': '#ced4da'
                    });
                }
                /* TLS */
                // if(data.devuse == "1" || data.devsta == "0") {
                //  // Disable the start button
                //  $('.snsBtn').attr('disabled', true);
                // } else if(data.devuse == "0" && data.devsta == "1" && !flags.viewModeOnly) {
                //  // Enable the start button
                //  $('.snsBtn').attr('disabled', false);
                // }
                /* LSJ */
                if(data.devsta == "0") {
                    // Disable the start button
                    $('.snsBtn').attr('disabled', true);
                } else {
                    $('.snsBtn').attr('disabled', false);
                }
                /* Data amendment disables start/end job before */
                //else if(!flags.viewModeOnly) {
                    // Enable the start button
                //  $('.snsBtn').attr('disabled', false);
                //}
                if(!isNaN(parseInt(flags.control.blacklistSched))) {
                    flags.control.currSchedId = flags.control.blacklistSched;
                    updateJobOptions();
                }
            }
            flags.ajaxRequestStatus = null;
        },
        fail: function(errThrown) {
            console.log('Failed device state query: ' + errThrown);
            if(flags.ajaxRequestStatus !== null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }
        }
    });
}

function unsetRealtimeInfo(isOff) {
    var elem = $('#control-container');

    $(elem).find('.progress-bar').width(0 + '%');
    $(elem).find('.progress-bar-title').html(0 + '%');
    $('.progress-text').html("-- / --");
    $('.mobOutput').val("--");
    $('.mobReject').val("--");

    circleProgressBars.count.setProgress(0, 1, "-- / --");
    circleProgressBars.reject.setProgress(0, 1, "-- / --");

    $('.mobPrewarn').css({
        'background-color': 'white', 
        'color': '#495057',
        'border-color': '#ced4da'
    });

    if(isOff == "0") {
        $('.mobStatus').val(lang[flags.pref.lang].status["OFFLINE"]);
        $('.mobStatus').css({
            'background-color': 'var(--secondary)',
            'color': 'white'
        });
    } else {
        $('.mobStatus').css({
            'background-color': 'white',
            'color': '#495057',
            'border-color': '#ced4da'
        });
    }

    $('.snsBtn').removeClass('btn-danger').addClass('btn-success').html(lang[flags.pref.lang].control.startjob);
    $('.snsBtn').attr('disabled', true);

    flags.control.deviceOnbacklog = false;
}

function setRealtimeInfo(prescale, count, reject, target, prewarn, isRunning, isOff, status) {
    // var prs = 1;
    var elem = $('#control-container');

    // if(parseFloat(prescale) >= 0) {
    //  prs = parseFloat(prescale);
    // }

    $('.progress-text').html((parseFloat(count) - reject).toFixed(1) + " / " + target);
    $('.mobOutput').val((parseFloat(count)).toFixed(1));

    var progress = ((parseFloat(count) - reject).toFixed(1) / target)* 100;
    if(progress === Infinity || progress === undefined) {
        progress = 100;
    } else if(isNaN(progress)) {
        progress = 0;
    }

    if(((parseFloat(count) - reject).toFixed(1) >= parseFloat(prewarn)) && prewarn != 0){
        $('.mobPrewarn').css({
            'background-color': 'rgba(245,122,44,0.9)', //'rgba(221,89,0,1)', 
            'color': 'black',
            'border-color': '#6c757d'
        });
    } else {
        $('.mobPrewarn').css({
            'background-color': 'white', 
            'color': '#495057',
            'border-color': '#ced4da'
        });
    }

    if(!isNaN(progress)) {
        $(elem).find('.progress-bar').width(progress.toFixed(1) + '%');
        $(elem).find('.progress-bar-title').html(progress.toFixed(1) + '%');
    } else {
        $(elem).find('.progress-bar').width(0 + '%');
        $(elem).find('.progress-bar-title').html(0 + '%');
    }

    $('.mobReject').val(reject);
    let eff = reject > 0 && parseFloat(count) != 0 ? (((parseFloat(count)) - reject) / (parseFloat(count))) * 100 : 100;
    circleProgressBars.reject.setProgress(
        reject > 0 && eff.toFixed(1) == 100 ? 99.9 : eff.toFixed(1), 
        1, 
        ((parseFloat(count)) - reject).toFixed(1) + " / " + (parseFloat(count)).toFixed(1)
    );
    circleProgressBars.count.setProgress(
        progress.toFixed(1),
        1,
        ((parseFloat(count)) - reject).toFixed(1) + " / " + target
    );

    var temp = $('.snsBtn').eq(0);
    if(isRunning == "0") {
        // for debounce like purpose
        if(temp == lang[flags.pref.lang].control.endjob) {
            $('.snsBtn').removeClass('btn-danger').addClass('btn-success').html(lang[flags.pref.lang].control.startjob);
        }
    } else {
        // for debounce like purpose
        if(temp == lang[flags.pref.lang].control.startjob) {
            $('.snsBtn').removeClass('btn-success').addClass('btn-danger').html(lang[flags.pref.lang].control.endjob);
            /* TLS */
            // $('.snsBtn').attr('disabled', true);
        }
    }

    if(isOff == "0") {
        $('.mobStatus').val(lang[flags.pref.lang].status['OFFLINE']);
        $('.mobStatus').css({
            'background-color': 'var(--secondary)',
            'color': 'white'
        });
    } else {
        switch(status) {
            case 'PRODUCTIVE':
                $('.mobStatus').css({
                    'background-color': '#00b760',
                    'color': 'white',
                    'border-color': '#6c757d'
                });
                $('.mobStatus').val(lang[flags.pref.lang].status['PRODUCTIVE']);
                break;

            case 'CONTINUED':
                $('.mobStatus').css({
                    'background-color': '#99badd',
                    'color': 'black'
                });
                $('.mobStatus').val(lang[flags.pref.lang].status['CONTINUED']);
                clearMobileDashboard();
                unsetRealtimeInfo(isOff);
                getBlacklist('user');
                break;

            case 'COMPLETED*':
                $('.mobStatus').css({
                    'background-color': '#99badd',
                    'color': 'black'
                });
                $('.mobStatus').val(lang[flags.pref.lang].status['COMPLETED' + '*']);
                clearMobileDashboard();
                unsetRealtimeInfo(isOff);
                getBlacklist('user');
                break;

            case 'COMPLETED':
                $('.mobStatus').css({
                    'background-color': '#51b5e0',
                    'color': 'white',
                    'border-color': '#6c757d'
                });
                $('.mobStatus').val(lang[flags.pref.lang].status['COMPLETED']);
                clearMobileDashboard();
                unsetRealtimeInfo(isOff);
                getBlacklist('user');
                break;

            case 'UNPRODUCTIVE':
                $('.mobStatus').css({
                    'background-color': '#dc3545',
                    'color': 'white',
                    'border-color': '#6c757d'
                });
                $('.mobStatus').val(lang[flags.pref.lang].status['UNPRODUCTIVE']);
                break;

            default:
                $('.mobStatus').css({
                    'background-color': 'white',
                    'color': '#495057',
                    'border-color': '#ced4da'
                });
                $('.mobStatus').val("--");
                break;
        }
    }
}

function controlDashboardUpdate() {
    if(flags.control.currSchedId == '' || flags.control.currSchedId == '--') {
        $('.backlogJobIcon').hide();
        getDevicePowerState();
        return;
    } else if(flags.control.currSchedId == lang[flags.pref.lang].control.new) {
        enableDashboardEdit();
        return;
    }

    flags.ajaxRequestStatus = $.ajax({
        type: 'POST',
        url: 'php/control/jodevicedashboard.php',
        data: { 'sid': flags.control.currSchedId },
        dataType:'json',
        async: true,
        success: function(data) {
            /** Check if data is empty **/
            if(data.devvld == "true") {
                $('.mobModel').val(data.devmod);
                $('.mobMaterial').val(data.devmat);
                $('.mobPrescale').val(data.devpre);
                $('.mobSchedule').val(data.devstt);
                $('.mobPrewarn').val(data.devpwn);
                $('.mobCycle').val(data.devcyc);
                $('.mobOperator').val(data.devopr);
                $('.mobTarget').val(data.devtgt);

                flags.control.deviceOnbacklog = data.devbck == '0' ? false : true;
                if(flags.control.deviceOnbacklog) {
                    $('.backlogJobIcon').show();
                } else {
                    $('.backlogJobIcon').hide();
                }

                var currJobNow = $('select.mobJob option:selected').eq(0).text();
                var newJobText = data.devjob;
                var extractedJob = '';
                if(currJobNow.indexOf(" (" +  'RUNNING' + ")") > 0) {
                    extractedJob = currJobNow.substring(0, currJobNow.indexOf(" (" + 'RUNNING' + ")"));
                    newJobText += ' (' +  'RUNNING' + ')';
                } else {
                    extractedJob = currJobNow;
                }

                if(extractedJob != data.devjob) {
                    $('select.mobJob option:selected').text(newJobText);
                    $('select.mobJob').selectpicker('render');
                }

                setRealtimeInfo(data.devpre, data.devcnt, data.devrej, data.devtgt, data.devpwn, data.devflg, data.devoff, data.devsta);

                /* TLS */
                // if(data.devoff == "0" || data.devuse == "1") {
                //  $('.snsBtn').attr('disabled', true);
                // } else {
                //  var temp = $('.snsBtn').eq(0).html();
                //  if($('.snsBtn').attr('disabled') && temp == lang[flags.pref.lang].control.startjob && !flags.viewModeOnly) {
                //      $('.snsBtn').attr('disabled', false);
                //  }
                // }
                /* LSJ */
                if (data.devsta == 'UNPRODUCTIVE' || data.devsta == 'PRODUCTIVE') {
                    $('.snsBtn').removeClass('btn-success').addClass('btn-danger').html(lang[flags.pref.lang].control.endjob);
                } else {
                    $('.snsBtn').removeClass('btn-danger').addClass('btn-success').html(lang[flags.pref.lang].control.startjob);
                }

                if(data.devoff == "0") {
                    $('.snsBtn').attr('disabled', true);
                } else {
                    if (flags.control.blacklistSched == flags.control.currSchedId || flags.control.blacklistSched == '--') {
                        $('.snsBtn').attr('disabled', false);
                    }
                }
                /* Data amendment disables start/stop job before */
                // else if (!flags.viewModeOnly) {
                //   if (flags.control.blacklistSched == flags.control.currSchedId || flags.control.blacklistSched == '--') {
                //      $('.snsBtn').attr('disabled', false);
                //   }
                // }
                // else if(!flags.viewModeOnly) {
                //  $('.snsBtn').attr('disabled', false);
                // }
            } else {
                clearMobileDashboard();
                unsetRealtimeInfo(data.devoff);
            }

            flags.ajaxRequestStatus = null;
        },
        fail: function(errThrown) {
            console.log('Failed dashboard query: ' + errThrown);
            if(flags.ajaxRequestStatus !== null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }
        }
    });
}

function updateDashboardDisplay() {
    var schedName =  $('select.mobJob').eq(0).val();

    refreshJobValue();

    if(schedName == lang[flags.pref.lang].control.new) {
        /** Allow editing **/
        $('.dash-input').attr('disabled', false);
        query_start();
    } else {
        /** Load info, Do not allow editing **/
        $('.dash-input').attr('disabled', true);

        if(schedName === null || schedName === undefined || schedName == '') {
            flags.control.currSchedId = '';
            unsetRealtimeInfo(flags.control.blacklistState);
            query_start();
            return;
        }

        flags.ajaxRequestStatus = $.ajax({
            type: 'POST',
            url: 'php/control/jodevicedashboard.php',
            data: { 'sid': schedName },
            dataType:'json',
            async: true,
            success: function(data) {
                /** Check if data is empty **/
                if(!(data === null)) {
                    $('.mobModel').val(data.devmod);
                    $('.mobMaterial').val(data.devmat);
                    $('.mobPrescale').val(data.devpre);
                    $('.mobSchedule').val(data.devstt);
                    $('.mobPrewarn').val(data.devpwn);
                    $('.mobCycle').val(data.devcyc);
                    $('.mobOperator').val(data.devopr);
                    $('.mobTarget').val(data.devtgt);
                    $('.mobStatus').val(data.devsta);

                    if(data.devsta == "--" || data.devsta == null) {
                        $('.mobEndTgt').attr('disabled', false);
                        $('.control-wdt-input').attr('disabled', false);
                    } else {
                        $('.mobEndTgt').attr('disabled', true);
                        $('.control-wdt-input').attr('disabled', true);
                    }

                    const optionElement = $('select.mobJob option[value="' + schedName + '"]');
                    console.log('%ccurrent data', 'color: blue; background-color: black');
                    console.log(optionElement);


                    var autoend = optionElement.eq(0).data('autoend');
                    if(autoend == "1") {
                        $('.mobEndTgt').prop('checked', true);
                    } else {
                        $('.mobEndTgt').prop('checked', false);
                    }

                    // const wdtEnabledValue = optionElement.eq(0).data('wdtenabled');
                    const wdtEnabledValue = data.devcyc;
                    if (wdtEnabledValue == 0) {
                        $('.control-wdt-input').prop('checked', false);
                    } else {
                        $('.control-wdt-input').prop('checked', true);
                    }

                    if(flags.control.blacklist == '1') {
                        if(schedName == flags.control.blacklistSched) {
                            $('.snsBtn').removeClass('btn-success').addClass('btn-danger').html(lang[flags.pref.lang].control.endjob);
                            setRealtimeInfo(data.devpre, data.devcnt, data.devrej, data.devtgt, data.devpwn, data.devflg, data.devoff, data.devsta);
                        } else {
                            unsetRealtimeInfo(data.devoff);
                        }
                        /* TLS */
                        // $('.snsBtn').attr('disabled', true);
                    } else {
                        unsetRealtimeInfo(data.devoff);
                    }

                    flags.control.currSchedId = schedName;
                    query_stop();
                    if(flags.ajaxRequestStatus !== null) {
                        flags.ajaxRequestStatus.abort();
                        flags.ajaxRequestStatus = null;
                    }
                    controlDashboardUpdate();
                    query_start();
                } else {
                    showPrompt(lang[flags.pref.lang].schedule.prompts.scheduleDeviceFail, "Error");
                    flags.ajaxRequestStatus = null;
                }
            },
            fail: function() {
                if(flags.ajaxRequestStatus !== null) {
                    flags.ajaxRequestStatus.abort();
                    flags.ajaxRequestStatus = null;
                }
                query_start();
            }
        });
    }
}

function updateJobOptionsOnclick() {
    var val = $('select.mobMachine').eq(0).val();

    flags.ajaxRequestStatus = $.ajax({
        type: 'POST',
        url: 'php/control/jogetdevicejobs.php',
        data: { 'id': val },
        dataType:'json',
        async: true,
        success: function(data) {
            console.log('jogetdevicejobs.php');
            console.log(data);
            var presentJobValue = $('select.mobJob').eq(0).val();

            if(!(data === null)) {
                var hasLongJobName = false;
                var selectedSchedId = '';
                var hasSelected = false;
                var str = '';
                str += `<option value='${lang[flags.pref.lang].control.new}'`;
                // if(disableAllEditableButton) {
                //  str += ' disabled';
                // }
                if(presentJobValue == lang[flags.pref.lang].control.new) {
                    str += ' selected';
                }
                str += `>${lang[flags.pref.lang].control.new}</option>`;
                for(var x = 0; x < data.length; x++) {
                    if(data[x].devscd == '1' && (data[x].devsta == 'COMPLETED*' || data[x].devsta == 'COMPLETED')) {
                        continue;
                    }
                    str += '<option value="' + data[x].devdid + '"'; //+ '">';
                    if(data[x].devjob != '' && data[x].devjob != null) {
                        if(data[x].devjob.length >= 32) {
                            hasLongJobName = true;
                        }
                        if(presentJobValue == '') {
                            /** load the default running job, no user selected **/
                            if(data[x].devdid == flags.control.blacklistSched) {
                                hasSelected = true;
                                str += " data-autoend='" + data[x].devflg + "'";
                                str += " data-wdtenabled='" + data[x].devwdt + "'";
                                str += " selected>" + data[x].devjob + " (" + 'RUNNING' + ")";
                                selectedSchedId = data[x].devdid;
                            } else {
                                str += " data-autoend='" + data[x].devflg + "'";
                                str += " data-wdtenabled='" + data[x].devwdt + "'";
                                str += ">" + data[x].devjob;
                            }
                        } else {
                            /** load the user selected job **/
                            if(data[x].devdid == flags.control.blacklistSched) {
                                hasSelected = true;
                                str += " data-autoend='" + data[x].devflg + "'";
                                str += " data-wdtenabled='" + data[x].devwdt + "'";
                                if(data[x].devdid == presentJobValue) {
                                    str += ' selected';
                                    selectedSchedId = data[x].devdid;
                                }
                                str += ">" + data[x].devjob + " (" + 'RUNNING' + ")";
                            } else if(data[x].devdid == presentJobValue) {
                                str += " data-autoend='" + data[x].devflg + "'";
                                str += " data-wdtenabled='" + data[x].devwdt + "'";
                                str += " selected>" + data[x].devjob;
                                selectedSchedId = data[x].devdid;
                            } else {
                                str += " data-autoend='" + data[x].devflg + "'";
                                str += " data-wdtenabled='" + data[x].devwdt + "'";
                                str += ">" + data[x].devjob;
                            }
                        }
                    } else {
                        str += "--";
                    }
                    str += '</option>';
                }
                $('select.mobJob').html(str);
                if(hasSelected) {
                    $(`select.mobJob option[value='${lang[flags.pref.lang].control.new}']`).remove();
                }
                $('select.mobJob').selectpicker('refresh');
                if(presentJobValue == '') {
                    flags.control.currSchedId = selectedSchedId;
                    $('select.mobJob').selectpicker('val', flags.control.currSchedId);
                } else {
                    flags.control.currSchedId = presentJobValue;
                }
                refreshJobValue();

                // if(hasLongJobName) {
                //     $('#control-container .dropdown-menu .dropdown-item').css({
                //         'font-size': '0.7rem',
                //         'padding-left': '20px'
                //     });
                // }
            } else {
                var str = '';

                str += `<option value='${lang[flags.pref.lang].control.new}'`;
                // if(disableAllEditableButton) {
                //  str += ' disabled';
                // }
                str += `>${lang[flags.pref.lang].control.new}</option>`;
                flags.control.currSchedId = '';

                $('select.mobMachine').selectpicker('refresh');
            }
            flags.ajaxRequestStatus = null;
            query_start();
        },
        fail: function() {
            if(flags.ajaxRequestStatus !== null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }
        }
    });
}

function updateJobOptions() {
    var val = $('select.mobMachine').eq(0).val();

    flags.ajaxRequestStatus = $.ajax({
        type: 'POST',
        url: 'php/control/jogetdevicejobs.php',
        data: { 'id': val },
        dataType:'json',
        async: true,
        success: function(data) {
            console.log('jogetdevicejobs.php');
            console.log(data);
            /** Check if data is empty **/
            if(!(data === null)) {
                var selectedSchedId = '';
                var hasSelected = false;
                var str = '';
                str += `<option value='${lang[flags.pref.lang].control.new}'`;
                str += `>${lang[flags.pref.lang].control.new}</option>`;
                for(var x = 0; x < data.length; x++) {
                    if(data[x].devscd == '1' && (data[x].devsta == 'COMPLETED*' || data[x].devsta == 'COMPLETED')) {
                        continue;
                    }
                    str += '<option value="' + data[x].devdid + '"'; //+ '">';
                    if(data[x].devjob != '' && data[x].devjob != null) {
                        if(data[x].devdid == flags.control.blacklistSched) {
                            hasSelected = true;
                            $("select.mobJob option[value='']").remove();
                            str += " data-autoend='" + data[x].devflg + "'";
                            str += " data-wdtenabled='" + data[x].devwdt + "'";
                            str += " selected>" + data[x].devjob + " (" + 'RUNNING' + ")";
                            selectedSchedId = data[x].devdid;
                        } else {
                            str += " data-autoend='" + data[x].devflg + "'";
                            str += " data-wdtenabled='" + data[x].devwdt + "'";
                            str += ">" + data[x].devjob;
                        }
                    } else {
                        str += "--";
                    }
                    str += '</option>';
                }
                $('select.mobJob').html(str);

                if(hasSelected) {
                    $(`select.mobJob option[value='${lang[flags.pref.lang].control.new}']`).remove();
                    $('select.mobJob').selectpicker('refresh');
                    $('select.mobJob').selectpicker('val', selectedSchedId);
                } else {
                    $('select.mobJob').selectpicker('refresh');
                    flags.control.currSchedId = '';
                }
            } else {
                var str = '';
                str += `<option value='${lang[flags.pref.lang].control.new}'`;
                str += `>${lang[flags.pref.lang].control.new}</option>`;
                flags.control.currSchedId = '';

                $('select.mobJob').selectpicker('refresh');
            }

            flags.ajaxRequestStatus = null;
            updateDashboardDisplay();
        },
        fail: function() {
            console.log('Failed updateJobOptions: ' + errThrown);
            if(ajaxRequestStatus !== null) {
                ajaxRequestStatus.abort();
                ajaxRequestStatus = null;
            }
            showPrompt(lang[flags.pref.lang].control.prompts.jobupdatefail, "Failed");
        }
    });
}

function getBlacklist(caller,  callback) {
    var val = $('select.mobMachine').eq(0).val();

    flags.ajaxRequestStatus = $.ajax({
        type: 'POST',
        url: 'php/control/jogetblacklist.php',
        data: { id: val },
        dataType:'json',
        async: true,
        success: function(retData) {
            if(!(retData === null)) {
                flags.control.blacklist = retData.devuse; //has job or not
                flags.control.blacklistJob = retData.devjob;
                flags.control.blacklistSched = retData.devsid;
                flags.control.blacklistState = retData.devsta; //on or off

                if(flags.control.blacklistState == "0") {
                    // display offline
                    $('.mobStatus').val(lang[flags.pref.lang].status["OFFLINE"]);
                    $('.mobStatus').css({
                        'background-color': 'var(--secondary)',
                        'color': 'white'
                    });
                }
                /* TLS */
                // if(flags.control.blacklist == "1" || flags.control.blacklistState == "0") {
                //  // Disable the start button
                //  $('.snsBtn').attr('disabled', true);
                // }
                /* LSJ */
                if(flags.control.blacklistState == "0") {
                    // Disable the start button
                    $('.snsBtn').attr('disabled', true);
                } 
            } else {
                flags.control.blacklist = false;
                flags.control.blacklistJob = "";
                flags.control.blacklistState = "";
                flags.control.blacklistSched = "";
            }
            flags.ajaxRequestStatus = null;

            if (caller == 'qr') {

            } else {
                if (caller == 'special') {
                    updateJobOptionsOnclick();
                } else 
                if (caller != 'dashboard') {
                    updateJobOptions();
                }
            }

            if (callback && typeof callback === "function") {
                callback();
            }
        },
        fail: function(errThrown) {
            console.log('Failed getblacklist: ' + errThrown);
            if(flags.ajaxRequestStatus !== null) {
                flags.ajaxRequestStatus.abort();
                flags.ajaxRequestStatus = null;
            }
            showPrompt(lang[flags.pref.lang].control.prompts.devupdatefail, "Failed");
            if (callback && typeof callback === "function") {
                callback();
            }
        }
    });
}

function updateMachineOptionsControl(btnId) {
    $.ajax({
        type: 'POST',
        url: 'php/jogetdevices.php',
        data: '',
        dataType:'json',
        async: true,
        success: function(data) {
            /** Check if data is empty **/
            var str = '';
            if(!(data === null)) {
                for(var x = 0; x < data.length; x++) {
                    str += '<option value="' + data[x].devdid + '">';
                    if(data[x].devnme != '' && data[x].devnme != null) {
                        str += data[x].devnme;
                    } else {
                        str += data[x].devdid;
                    }
                    str += '</option>';
                }
                $('select.mobMachine').html(str);
                $('select.mobMachine').selectpicker('refresh');

                if($('select.mobMachine').eq(0).val() == '') {
                    // $('select.mobMachine').selectpicker('val', 1);
                    const test = $('select.mobMachine');
                    const defaultOpt = test[0].options[1].value;
                    $('select.mobMachine').selectpicker('val', defaultOpt);
                }

                getBlacklist('user');           
            } else {
                $('select.mobMachine').html('');
                $('select.mobMachine').selectpicker('refresh');
            }
        }
    });
}

function clearMobileDashboard() {
    $('.mobModel').val('');
    $('.mobMaterial').val('');
    $('.mobSchedule').val('');
    $('.mobOperator').val('');
    $('.mobCycle').val('');
    $('.mobPrescale').val('');
    $('.mobTarget').val('');
    $('.mobReject').val('');
    $('.mobOutput').val('');
    $('.mobPrewarn').val('');
    $('.mobStatus').val('');
    $('.mobEndTgt').attr('disabled', true);
    $('.mobEndTgt').prop('checked', false);
    $('.control-wdt-input').attr('disabled', true);
    $('.control-wdt-input').prop('checked', false);
    $('.progress-text').html('-- / --');
    var elem = $('#control-container');
    $(elem).find('.progress-bar').css('width', '0%');
    $(elem).find('.progress-bar-title').html('0%');
}

function endJob() {
    query_stop();

    if(flags.ajaxRequestStatus != null) {
        flags.ajaxRequestStatus.abort();
        flags.ajaxRequestStatus = null;
    }

    $.ajax({
        type: 'POST',
        url: 'php/control/startandstop.php',
        data: { 
            cmd: 'end',
            id: $('select.mobMachine').eq(0).val(), 
            schedid: 'any',
        },
        dataType:'json',
        async: true,
        success: function(retData) {
            if(retData == 'success') {
                /* TLS */
                // getBlacklist('user');
                /* LSJ */
                startStopModal('end');
            } else if (retData == 'ended') {
                showPrompt(lang[flags.pref.lang].control.prompts.endAnother, 'Failed');
            } else {
                flags.control.pendingBtnCmd = '';
                showPrompt(lang[flags.pref.lang].control.prompts.startEndFailed, 'Failed');
            }
            query_start();
        },
        fail: function(e) {
            flags.control.pendingBtnCmd = '';
            showPrompt(lang[flags.pref.lang].control.prompts.startEndFailed, 'Failed');
            query_start();
        }
    });
}

function startStopModal(cmd) {
    timer.buttonTimer.enabled = true;
    timer.buttonTimer.ticks = 0;
    flags.control.pendingBtnCmd = cmd;

    var msg;
    if(cmd == 'start') {
        msg = lang[flags.pref.lang].control.prompts.startLoading;
    } else {
        msg = lang[flags.pref.lang].control.prompts.stopLoading;
        $('.backlogJobIcon').hide();
    }
    $('#snsModal .snsPrompt').html(msg);
    $('#snsModal').modal('show');
}

function closesnsModal(msg) {
    timer.buttonTimer.enabled = false;
    timer.buttonTimer.ticks = 0;
    timer.buttonTimer.retries = 0;
    flags.control.pendingBtnCmd = '';

    $('#snsModal').modal('hide');

    if(msg !== undefined && msg != '') {
        showPrompt(msg, 'Failed');
    }
}

function checkJobState() {
    flags.control.startStopRequest = $.ajax({
        type: 'POST',
        url: 'php/control/startandstop.php',
        data: { 
            cmd: 'check',
            id: $('select.mobMachine').eq(0).val(), 
            schedid: 'any',
        },
        dataType:'json',
        async: true,
        success: function(retData) {
            if(flags.control.startStopRequest != null) {
                flags.control.startStopRequest.abort();
                flags.control.startStopRequest = null;
            }

            if(retData == 'true') {
                // has job
                if(flags.control.pendingBtnCmd == 'end') {
                    /* Unsuccessful End - What we dont want, unless you're a sadist */
                    if(timer.buttonTimer.retries >= startandstopTimeoutVal) {
                        closesnsModal(lang[flags.pref.lang].control.prompts.startEndFailed);
                    } else {
                        timer.buttonTimer.retries++;
                    }
                } else if(flags.control.pendingBtnCmd == 'start') {
                    /* Successful Start */
                    closesnsModal();
                    isJobMine();
                    getBlacklist('user');
                }
            } else if(retData == 'false') {
                // no job
                if(flags.control.pendingBtnCmd == 'end') {
                    /* Successful End - What we all want */
                    closesnsModal();
                    clearMobileDashboard();
                    getBlacklist('user');
                } else if(flags.control.pendingBtnCmd == 'start') {
                    /* Unsuccessful Start */
                    if(timer.buttonTimer.retries >= startandstopTimeoutVal) {
                        if(flags.control.addNewSchedOnStart) {
                            deleteAddedSchedule(flags.control.currSchedId);
                        }
                        flags.control.addNewSchedOnStart = false;
                        flags.control.currSchedId = '';
                        closesnsModal(lang[flags.pref.lang].control.prompts.startAgain);
                    } else {
                        timer.buttonTimer.retries++;
                    }
                }
            } else {
                closesnsModal(lang[flags.pref.lang].control.prompts.startEndFailed);
            }
        }
    });
}

function isJobMine() {
    $.ajax({
        type: 'POST',
        url: 'php/control/startandstop.php',
        data: { 
            cmd: 'compare',
            id: $('select.mobMachine').eq(0).val(), 
            schedid: flags.control.currSchedId,
        },
        dataType:'json',
        async: true,
        success: function(retData) {
            if(retData == 'true') {
                // do nothing, just chill bruh!
            } else if(retData == 'false') {
                if(flags.control.addNewSchedOnStart) {
                    deleteAddedSchedule(flags.control.currSchedId);
                }
                showPrompt(lang[flags.pref.lang].control.prompts.startAnother, 'Failed');
            } else {
                showPrompt(lang[flags.pref.lang].errorprompt.unknown, 'Failed');
            }
            flags.control.addNewSchedOnStart = false;
        }
    });
}

function deleteAddedSchedule(schedId) {
    $.ajax({
        type: 'POST',
        url: 'php/jodeleteschedule.php',
        data: { scdid: schedId },
        dataType:'json',
        async: true,
        success: function(data) {
            if(data == 'failed') {
                console.log('Failed to delete previously added schedule.');
            } else {
                console.log('Previously added schedule has been deleted successfully.');
                /* fix for schedule being deleted but active job_info */
                $.ajax({
                    type: 'POST',
                    url: 'php/control/startandstop.php',
                    data: { 
                        cmd: 'end',
                        id: $('select.mobMachine').eq(0).val(), 
                        schedid: 'any',
                    },
                    dataType:'json',
                    async: true,
                    success: function(retData) {
                        if(retData == 'success') {
                            console.log("Fallback: Force end job successful");
                        } else {
                            console.log("Fallback: Force end job failed");
                        }
                    },
                    fail: function(e) {
                        console.log("Fallback: Force end job failed");
                    }
                });
            }
        }
    });
}

function refreshJobValue() {
    var currJob = $('select.mobJob :selected').eq(0).text();
    var currJobVal = $('select.mobJob').val();
    // 1) Change dropdown box title 
    $('select.mobJob').attr('title', lang[flags.pref.lang].general.nojobsel);
    if(currJobVal === "") {
        // if value is No Job Selected 
        // 2) Change placeholder value
        $('div.mobJob > button div div div').html(lang[flags.pref.lang].general.nojobsel);
    }
}
