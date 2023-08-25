var lang = {
    'en': {
        'general': {
            'displaylbl': 'Display',
            'recordlbl': 'Records',
            'configlbl': 'Configuration',
            'aboutlbl': 'About',
            'lastUpdate': 'Last Update',
            'preflbl': 'Preferences',
            'logoutlbl': 'Logout',
            'cancellbl': 'Cancel',
            'proceedlbl': 'Proceed',
            'closelbl': 'Close',
            'exportlbl': 'Export',
            'showdatalbl': 'Show Data',
            'showchartlbl': 'Show Chart',
            'todaylbl': 'Today',
            'viewlbl': 'View',
            'filterlbl': 'Filter',
            'refreshlbl': 'Refresh',
            'deletedblbl': 'Delete from DB',
            'editlbl': 'Edit',
            'savelbl': 'Save',
            'clearlbl': 'Clear',
            'showAllJobs': 'Show All Jobs',
            'showOngJobs': 'Show Ongoing Jobs',
            'newschedlbl': 'New Schedule',
            'addlbl': 'Add',
            'updatelbl': 'Update',
            'denylbl': 'Deny',
            'allowlbl': 'Allow',
            'resetlbl': 'Reset',
            'companyname': 'Line Seiki Co., Ltd.',
            'reglbl': 'Save', /* Register */
            'permissionlbl': 'Permission',
            'graphlbl': 'Graph',
            'tablelbl': 'Table',
            'successlbl': 'Success',
            'exportreclbl': 'Export Records',
            'infolbl': 'Information',
            'removelbl': 'Remove',
            'JO': 'JOB',
            'INH': 'INHIBIT',
            'WDT': 'WATCHDOG',
            'ST1': 'STATE 1',
            'ST2': 'STATE 2',
            'ST3': 'STATE 3',
            'ST4': 'STATE 4',
            'model': 'Model',
            'material': 'Material',
            'targetqty': 'Target Qty',
            'operator': 'Operator',
            'jobstart': 'Start',
            'jobend': 'End',
            'nodevlbl': 'No Device Selected',
            'nojoblbl': 'No Job Selected',
            'durationlbl': 'Duration',
            'datatable': {
                'prev': 'Previous',
                'next': 'Next',
                'info': "Showing _START_ to _END_ of _TOTAL_ entries",
                'infoempty': "Showing 0 to _END_ of _TOTAL_ entries",
                'empty': "No data available in table",
                'search': 'Search',
            },
            'datepicker': {
                'now': 'Now',
                'done': 'Close',
                'monthNames': [ 
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ],
                'monthNamesShort': [ 
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                ],
                'dayNames': [ 
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday" 
                ],
                'dayNamesShort': [ 
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat" 
                ],
                'dayNamesMin': [ 
                    "Su",
                    "Mo",
                    "Tu",
                    "We",
                    "Th",
                    "Fr",
                    "Sa" 
                ],
                'weekHeader': "",
                'yearSuffix': "",
                'timeText': 'Time',
                'hourText': 'Hour',
                'minuteText': 'Minute',
                'secondText': 'Second',
                'invalid': "Invalid date range.  Please try again.",
            },
            'loadexport': "Loading Data to export. Please wait...",
            'required': "Required Field",
            'nojobsel': "No Job Selected",
            'nothing': "Nothing selected",
            'loading': "Loading",
            'yes': 'Yes',
            'no': 'No',
            'warning': 'Warning',
            'newip': 'Note: Please type the new IP address on the URL address bar.',
            'lgdisplay': "Large Display mode requires minimum screen resolution of 1024x760. Lower than this resolution may cause improper text rendering.",
            'continue': "Would you like to continue?",
            'enable': "Enable",
            'contbutton': "Continue",
            'error': "Error",
            'fail': "Failed",
            'result': "Result",
            'option': "Show Options",
            'hideoption': "Hide Options",
        },
        'devicetype': {
            'INPUTDEVICE': 'SMART COUNTER',
        },
        'jobdetails': {
            'achievement': 'Achievement Ratio (%)', 
            'count': 'CNTA',
            'cycle': 'Cycle Time', 
            'downcause': 'Downtime Cause',
            'downduration': 'Total Downtime (minutes)', 
            'downend': 'Unproductive End', 
            'downinput': 'Remarks',
            'downsource': 'Unproductive Source', 
            'downstart': 'Unproductive Start',
            'duration': 'Duration', 
            'event': 'Event',
            'eventduration': 'Duration',
            'eventend': 'Event End',
            'eventstart': 'Event Start',
            'good': 'Good Quantity',
            'job': 'Job',
            'jobcap': 'JOB',
            'jobduration': 'Job Duration (minutes)', 
            'joborder': 'Job Order', 
            'machine': 'Machine', 
            'material': 'Material',
            'model': 'Model',
            'nextjob': 'Next Item', 
            'prescale': 'Prescale', 
            'prewarn': 'Prewarn Quantity', 
            'prodduration': 'Productive Duration (minutes)',
            'prodend': 'Production End',  
            'prodstart': 'Production Start',
            'prodstatus': 'Status', 
            'operator': 'Operator',
            'outputqty': 'Output Quantity', 
            'reject': 'CNTB',
            'rejectqty': 'Reject Quantity', 
            'rejinput': 'Reject Remarks',
            'schedend': 'Scheduled End', 
            'status': 'Status',
            'takt': 'Cycletime',
            'target': 'Target Qty',
            'targetlong': 'Target Quantity', 
            'yield': 'Yield (%)', 
        },
        'chart': {
            'day': 'day',
            'duration': 'Duration',
            'end': 'End',
            'from': 'From',
            'hour': 'hour',
            'jostart': 'Job Start',
            'joend': 'Job End',
            'min': 'minute',
            'sec': 'second',
            'start': 'Start',
            'to': 'To',
        },
        'status': {
            'COMPLETED': 'COMPLETED',
            'COMPLETED*': 'COMPLETED*',
            'CONTINUED': 'CONTINUED',
            'down': 'Down',
            'idle': 'Idle',
            'OFFLINE': 'OFFLINE',
            'PRODUCTIVE': 'RUNNING',
            'run': 'Running',
            'UNPRODUCTIVE': 'DOWN',
            '--': 'NO DATA',
        },
        'export': {
            'summary': 'Production Records', 
            'downtime': 'Downtime Records',
            'event': 'Detailed Event Records',
            'prompts': {
                'expTooLarge': "Data too large to export.",
                'errTooLarge': "Failed to export record, data too large. Please try again.",
                'errRequestFailed': "Failed to export record, request to server failed. Please try again.",
            },
        },
        'errorprompt': {
            'internal': 'Internal Error. Please try again.',
            'network': 'Network Error. Please try again.',
            'unknown': 'Unknown state',
            'datatoolarge': 'Failed to communicate with server, data maybe too large.',
        },
        'control': {
            'tabtitle': 'Control',
            'devInfo': "Device Information",
            'jobInfo': "Job Information",
            'new': "New",
            'outvsrej': "Yield %",
            'actvstgt': "Progress %",
            'endjobswitch': 'Recording Ends at Target Quantity',
            'wdtswitch': 'Watchdog Timer',
            'progress': 'Progress',
            'endjob': 'END JOB',
            'startjob': 'START JOB',
            'lgscreen': [ 
                'Machine',
                'Job Order',
                'Model',
                'Material',
                'Schedule',
                'Operator',
                'Cycle Time',
                'Prescale',
                'Target',
                'Prewarn',
                'Status',
                'Output',
                'Reject' 
            ],
            'smscreen': [ 
                'Machine',
                'Job Order',
                'Model',
                'Material',
                'Schedule',
                'Operator',
                'Cycle Time',
                'Prescale',
                'Target',
                'Prewarn',
                'Reject',
                'Status' 
            ],
            'cameranostream': 'Unable to access video stream (please make sure you have a webcam enabled)',
            'selectcamera': 'Select Camera Device',
            'camerapref': 'Camera Preference',
            'camera': 'Camera',
            'noqrcode': 'No QR code detected',
            'prompts': {
                'startDeleted': "Failed to start the Job. The Job order is already deleted.<br>Please select the job order again.",
                'startRunning': "Failed to start the Job. The device might have a running job / queued start.<br>Please select the job order again.",
                'startAgain': "Failed to start the Job order. Please try again.",
                'startSelect': "Please select a Job and try again.",
                'startEndTgt': "Recording Ends at Target Quantity cannot be set when Target Quantity is 0. Please try again.",
                'startEndjob': "Are you sure you want to End the running job?",
                'startEndBacklog': "The device is on backlog. Are you sure you want to End the running job?<br><br>Note: Some data will be lost when ending a job on backlog.",
                'startEndFailed': "Failed to stop the running job. Please try again.",
                'startSchedAdd': "Failed to add new schedule. Please try again.",
                'startLoading': "Server is trying to start the Job. Please wait...",
                'stopLoading': "Server is trying to stop the Job. Please wait...",
                'startTimeout': "Request Timedout. Please try again.",
                'startAnother': "Failed to Start Job. A different Job order has been started by another user.",
                'failedJobList': "Failed to update job order list. Please check network connection.",
                'failedDevInfo': "Failed to get device information. Please check network connection.",
                'failedIdNo': "Failed to get a valid machine ID.",
                'failedJobEnded': "Job Schedule was already ended by another user.",
            }
        },
        'overview': {
            'pagetitle': 'Production Overview',
            'tabtitle': 'Overview',
            'prompts': {
                'noList': "No downtime cause list available.",
                'saveFail': "Failed to save the downtime cause. Please try again.",
                'saveSuccess': "Downtime cause set successfully.",
                'noCause': "Please select a downtime cause and try again.",
            },
            'machineid': 'Machine ID',
            'entercause': 'Please enter downtime cause',
        },
        'dashboard': {
            'pagetitle': 'Dashboard',
            'tabtitle': 'Count Dashboard',
            'machine': 'Line ID',
            'status': 'Target Qty.',
            'prewarn': 'Actual Qty.',
            'progress': 'Difference',
            'page': 'Page ',
        },
        'duration': {
            'pagetitle': 'Duration',
            'tabtitle': 'Duration Dashboard',
            'machine': 'Machine ID',
            'status': 'Status',
            'duration': 'Job Duration',
            'downtime': 'Downtime'
        },
        'summary': {
            'pagetitle': 'Summary',
            'tabtitle': 'Summary',
            'columns': [ 
                'Line No.',  
                'Production Start', 
                'Production End', 
                'Target Quantity', 
                'Actual Quantity', 
                'Difference',
                'Productive Time',
                'Down Time',
                'Status',
                // 'Line No.', 
                // 'Job Order', 
                // 'Production Start', 
                // 'Production End', 
                // 'Model', 
                // 'Material', 
                // 'Target Quantity', 
                // 'Prewarn Quantity', 
                // 'Output Quantity', 
                // 'Reject Quantity', 
                // 'Job Duration\n(minutes)', 
                // 'Productive Duration\n(minutes)', 
                // 'Total Downtime\n(minutes)', 
                // 'Scheduled End', 
                // 'Operator', 
                // 'Next Item', 
                // 'Status' 
            ],
            'filters': [
                'Machine',
                'Job Order',
                'Model',
                'Material',
                'Operator',
                'Status'
            ],
            // 'nodatatodisplay': 'No data to display',
        },
        'unproductive': {   //jo timechart table 
            'pagetitle': 'Downtime',
            'tabtitle': 'Downtime',
            'columns': [ 
                'Machine', 
                'Job Order', 
                'Production Start', 
                'Model', 
                'Material', 
                'Operator', 
                'Event Start', 
                'Event End', 
                'Duration', 
                'Event', 
                'Remarks' 
            ],
            'prompts': {
                'remFailed': "Failed to update remarks! Please try again.",
                'remSuccess': "Remarks has been updated successfully!",
            },
            'modal': {
                'title': "Log Information",
                'labels': [ 
                    'Machine', 
                    'Job Order', 
                    'Operator', 
                    'Event Start', 
                    'Event End', 
                    'Event',
                    'Downtime Cause',
                    'Remarks', 
                    '', 
                    '' 
                ], //do not remove the 2 empty string at the end
            },
            'filters': [
                'Machine',
                'Job Order',
                'Model',
                'Material',
                'Operator',
                'Event'
            ],
            'chars': "Characters",
        },
        'reject': {
            'pagetitle': 'Rejects',
            'tabtitle': 'Rejects',
            'columns': [ 
                'Machine', 
                'Job Order', 
                'Production Start', 
                'Production End', 
                'Model', 
                'Material', 
                'Output Quantity', 
                'Reject Quantity', 
                'Reject Remarks' 
            ],
            'prompts': {
                'rejInvalid': "Input value is invalid.",
                'rejPosVal': "Input must be a positive value.",
                'rejTooLarge': "Input value too large. Max value is 1000000000.",
                'rejFailed': "Failed to update. Please try again.",
                'rejSuccess': "Reject remarks has been updated successfully.",
            },
            'filters': [
                'Machine',
                'Job Order',
                'Model',
                'Material',
                'Output Qty',
                'Reject Qty'
            ],
        },
        'schedule': {
            'pagetitle': 'Schedule',
            'tabtitle': 'Schedule',
            'columns': [ 
                'Machine', 
                'Job Order', 
                'Scheduled Start', 
                'Scheduled End', 
                'Model', 
                'Material', 
                'Target Quantity', 
                'Prewarn Quantity', 
                'Cycle Time (seconds)', 
                'Prescale', 
                'Operator', 
                '<i class="fa fa-info-circle text-primary"></i>&nbsp;Action' 
            ],
            'schedInfoTitle': "Schedule Information",
            'schedinfo-col': [ 
                'Machine',
                'Job Order',
                'Model',
                'Material',
                'Target Quantity',
                'Prewarn',
                'Operator',
                'Scheduled Start',
                'Scheduled End',
                'Cycle Time (seconds)',
                'Prescale' 
            ],
            'prompts': {
                'schedFillReq': "Please fill in all the required fields.",
                'schedNegVal': "Input invalid, allowed minimum value for Prescale is 0.1. Please try again.",
                'schedZeroVal': "Zero or Negative values are not allowed for Target and Prewarn Quantity. Please try again.",
                'schedTgtMaxVal': "Target and Prewarn Quantity maximum value is 1,000,000,000. Please use a lower value.",
                'schedCycleMaxVal': "Cycle Time maximum value is 999,999 seconds (11.5 days). Please use a lower value.",
                'schedPrescaleMaxVal': "Prescale maximum value is 100. Please use a lower value.",
                'schedPrewarnExceed': "Prewarn should not exceed the Target value. Please change the prewarn value.",
                'schedInvalidJob': "Job order name contains invalid word. Please refrain from using NEW or NONE.",
                'schedInvalidDate': "Invalid schedule range.",
                // 'schedAddFailed': "Failed to add Schedule! Please check the Job Order.",
                'schedAddFailed': "Failed to add Schedule! Please check the Job Schedule details. </br> </br> Note: Scheduled Start should be unique.",
                'schedAddSuccess': "Schedule was added successfully.",
                'schedUpdFailed': "Schedule Update Failed. Please try again.",
                'schedUpdInc': "Schedule has been Updated. However, the device was not updated successfully.",
                'schedUpdSuccess': "Schedule was updated successfully.",
                'schedTgtLower': "New Target value is less than the original value of the Schedule. Do you want to proceed?<br/><br/>Note: Setting a lower Target value than the present count of a Running Job schedule could end the log recording.",
                'schedAlreadyDel': "Job Schedule was already deleted.",
                'schedDelFailed': "Failed to delete the Schedule.",
                'schedDelSuccess': "Schedule was deleted successfully.",
                'schedDelWarn': "Deleted items cannot be restored. Are you sure you want to delete this schedule?",
                'statuschanged': "Schedule status has been changed. Please reload the Schedule list.",
                'scheduleDataFail': "Cannot fetch the information of the schedule.",
            },
            'tooltip': {
                'locked': "Schedule is locked by",
                'idle': "Schedule is idle",
                'complete': "Schedule is completed",
                'running': "Schedule is running",
            },
            'filters': [
                'Machine',
                'Job Order',
                'Model',
                'Material',
                'Target Qty',
                'Operator'
            ],
        },
        'timechart': {
            'pagetitle': 'TimeChart',
            'return': 'Return',
            'legends': {
                'Productive': 'Running',
                'Unproductive': 'Down',
            },
            'tooltip': {
                'Productive': 'Running',
                'Unproductive': 'Down',
                'idle': 'Idle',
                'job': 'Job',
                'status': 'Status',
                'duration': 'Duration',
                'day': 'days',
                'hour': 'hours',
                'min': 'minutes',
                'sec': 'seconds',
            },
            'prev': 'Prev',
            'next': 'Next',
            'prompts': {
                'nodev': "No device available",
                'nojob': "No job available for the device",
                'nosrv': "Failed to reach server",
            },
        },
        'productivity': {
            'pagetitle': 'Productivity',
            'tabtitle': 'Productivity',
            'switchjo': 'JO TimeChart',
            'view': [
                'Overview', 
                'Good Qty. per Unit time', 
                'Cycletime'
            ],
            'inthour': 'Hour',
            'intmin': 'Minute',
            'HOUR': 'hour',
            'MINUTE': 'minute',
            'interval': 'Interval',
            'columns': [
                'Start Time', 
                'Good Quantity', 
                'CNTA', 
                'CNTB', 
                'Time Per Piece, sec'
            ],
            'legends': {
                'st1': 'STATE1',
                'st2': 'STATE2',
                'st3': 'STATE3',
                'st4': 'STATE4',
                'wdt': 'WDT',
                'inh': 'INH',
                'good': 'Good Quantity',
                'cnt': 'CNTA',
                'rej': 'CNTB',
                'cyc': 'Cycletime',
            },
            'ytitle': [
                'Quantity (Accumulated)', 
                'Good Qty', 
                'Cycletime, seconds'
            ],
            'xtitle': '`JO Time, ${intervalType}s   ( JO Start Time: ${firstTimestamp},   JO End Time: ${lastTimestamp} )`',
            'jotime': 'JO Time',
            'joStartTime': 'JO Start Time',
            'joEndTime': 'JO End Time',
            'ongoing': 'On-going',
            'start': 'Start',
            'end': 'End',
            'duration': 'Duration',
            'chart': 'Chart',
            'sec': 'sec',
        },
        'jotimechart': {
            'showchart': 'Show Chart',
            'jotimeminutes': 'JO Time, minutes',
            'minplural': 'mins',
            'excelexportname': 'Event Records',
            'norecord': 'No Record',
        },
        'standaloneModal': {
            'helper': {
                'title': 'Notice',
                'body': [ 
                    "View Mode does not display ongoing logs", 
                    "Running", 
                    "Down", 
                    "Note: Automatic page update disabled" 
                ],
                'footer': "Do not show this message again.",
            },
            'logout': {
                'title': "Logout",
                'body': "Are you sure you want to logout?",
                'footer': "",
            },
            'pref': {
                'title': "Preferences",
                'body': [ 
                    "General",
                    "Theme",
                    "Language",
                    "Alarm Sound",
                    "Show Helper Prompts",
                    "Fullscreen",
                    "Dashboard",
                    "Scroll Interval (seconds)",
                    "Autoscroll",
                    "Large Display Mode",
                    "Tabular View",
                    "Wrap Columns",
                    "Timechart",
                    "Items Per Page" 
                ],
                'footer': "",
            },
            'audio': {
                'title': "Permission",
                'body': "Allow Gemba App to play audio?",
                'footer': "",
            },
            'filter': {
                'title': "Filter Options",
                'selected': "Items Selected",
                'apply': "Apply Filter",
                'checkboxes': [ 
                    "Show Scheduled End", 
                    "Show Actual Production End", 
                    "Consolidate Jobs from the same Job Schedule" 
                ],
            },
            'oviewhelp': {
                'title': "Notice",
                'body': "Loading of Overview page may take sometime.<br>Please click the box of the respective device to update its status immediately.",
                'footer': "Do not show this message again.",
            },
        },
        'system': {
            'pagetitle': 'System Management',
            'tabtitle': 'System',
            'routename': [
                'Date & Time Settings',
                'Network Configuration',
                'Users Management',
                'Cause Registration',
                'Smart Counter Registration',
                'Data Management',
            ],
            'datetime': [ 
                'Server Date and Time', 
                'Set Server Timezone', 
                'Set Server Date and Time' 
            ],
            'network': [ 
                'IP Setting', 
                'IP Address', 
                'Gateway IP' 
            ],
            'usermngmt': {
                'columns': [ 
                    'Username', 
                    'Password', 
                    'Permission' 
                ],
                'permission': [ 
                    "JO Dashboard", 
                    "Schedule", 
                    "Reject Remarks", 
                    "Data Amendment", 
                    "Admin Access" 
                ],
                'adduser': [ 
                    'Full Name', 
                    'Username', 
                    'Password', 
                    'Confirm Password', 
                    'JO Dashboard', 
                    'Schedule', 
                    'Reject Remarks', 
                    'Data Amendment', 
                    'Admin Access' 
                ],
                'prompts': {
                    'delete': "Account was deleted successfully.",
                    'addsuccess': "New user was added successfully.",
                    'addfail': "Failed to add new user. Please try again.",
                    'invaliduser': "Invalid Username!",
                    'invalidpass': "Invalid Password!",
                    'addinvalid': "Username and Password are invalid",
                    'adduserinvalid': "Username is invalid",
                    // 'addpassinvalid': "Password is invalid ,
                    'addpassinvalid': "Password is invalid [accepts: @#$%^&+-!_= ]",
                    'addnotmatch': "Password does not match",
                    'donotdeleteall': "Deleting all user accounts is not allowed.<br><br>There should be at least 1 admin account.",
                    'donotdeletealladmin': "Deleting all admin accounts is not allowed.<br><br>There should be at least 1 admin account.",
                },
                'modal': {
                    'title': "Add New User",
                },
                'adduserph': [ 
                    'Account name', 
                    'Must have 5-16 characters', 
                    'Must have 8-16 char, atleast 1 special char, atleast 1 capital letter, atleast 1 lower case letter, atleast 1 number', 
                    'Retype Password' 
                ],
            },
            'causereg': {
                'columns': [ 
                    'No.', 
                    'Cause' 
                ],
                'prompts': {
                    'regsuccess': 'Cause list was updated successfully!',
                    'regfail': 'Failed to update cause list. Please try again.',
                    'delete': 'Cause Registration items were deleted successfully.',
                    'seldelete': 'Failed to delete downtime cause.  Please select an item to delete.',
                },
                'alarm': 'Alarm',
                'alarmpulse': 'Pulse',
            },
            'inputdevreg': {},
            'datamgmnt': {
                'dbmem': 'Database Memory',
                'diskmem': 'Available Disk',
                'dboption': 'Select Database Option',
                'date': 'Select Date Range',
                'options': [
                    // 'Optimize Database',
                    'Partial DB Delete',
                    'Full DB Delete',
                ],
                'prompt': {
                    'success': {
                        'dbdeleted': "Successfully deleted the data.<br><br><br>Total No. of Deleted Job Records:  ",
                        'dbdeletedall': "Successfully deleted all data.<br><br>Total No. of Deleted Records:  ",
                    },
                    'failed': {
                        'dbdeleted': "Failed to delete the data.",
                    },
                }
            },
            'buttons': {
                'applysave': 'Apply and Save',
                'sync': 'Sync',
                'save': 'Save',
                'addusr': 'Add User',
                'delusr': 'Delete User',
                'register': 'Register',
                'delete': 'Delete',
                'num': 'No.',
                'cause': 'Cause',
                'activedev': 'Active Devices',
                'removeddev': 'Removed Devices',
                'apply': 'Apply',
                'cancel': 'Cancel',
            },
            'devicelist': {
                'activedevtitle': "Active Smart Counter Devices",
                'removeddevtitle': "Removed Smart Counter Devices",
                'devicesub': "Select Smart Counter Device to delete data",
                'activedevfooter': "Number of Active Devices",
                'removeddevfooter': "Number of Removed Devices",
                'deleteddatafooter': "Number of Deleted Job Records",
                'delete': "Delete from DB",
                'prompt': {
                    'none': "No devices found.",
                }
            },
            'dtprompt': { 
                'success': 'Date and Time was changed successfully.',
                'failed': 'Changing Date and Time was unsuccessful.',
            },
            'netprompt': 'System will reboot. Please refresh the page after 2 minutes.',
            'ipfail': 'Options are disabled. Server currently provides the routing for the network.',
        },
        'detailedlogs': {
            'pagetitle': 'JO Time Chart',
            'tabtitle': 'JO Time Chart',
            'switchprod': 'Productivity',
            'columns': [ 
                'Machine', 
                'Job Order', 
                'Production Start', 
                'Model', 
                'Material', 
                'Operator', 
                'Downtime Source', 
                'Downtime Cause', 
                'Downtime Start', 
                'Downtime End', 
                'Duration (minutes)' 
            ],
            'ylable': [
                'JOB', 
                'WATCHDOG', 
                'INHIBIT', 
                'STATE 1', 
                'STATE 2', 
                'STATE 3', 
                'STATE 4'
            ],
            'xtitle': '`JO Time, minutes   ( JO Start Time: ${firstTimestamp},   JO End Time: ${lastTimestamp} )`',
        },
        'cluster': {
            'pagetitle': 'Cluster Configuration',
            'tabtitle': 'Clusters',
            'viewCluster': {
                'title': "View Clusters",
                'header': "View Available clusters",
                'cards': {
                    'bssid': "Broadcast SSID",
                    'ipaddr': "IP Address",
                    'devnum': "No. of Devices",
                },
                'scan': "Scan",
                'scanloading': "Scanning for Available Basestations...",
                'noscan': "No new basestations found",
                'remove': "Remove Cluster",
                'view': "View Devices",
                'tooltip': 'Edit Information',
                'info': [
                    "Displays the basic information of all the available clusters",
                    "Broadcast SSID - SSID of the Cluster is visible to all devices",
                    "IP Address - Address of the Cluster on the network",
                    "No. of devices - number of devices associated with the respective Cluster",
                    "View Devices - shows the device list associated with the Cluster",
                ],
                'apModal': {
                    'title': "Enable Scanning Access Point",
                    'body': [
                        "Scanning access point for device scanning will be enabled.",
                        "Would you like to continue?",
                    ],
                    'prompt': {
                        'start': `Base Station acccess point has been reset.<br><br>
                            Please just click Close button and start device scanning.`,
                        'end': `Device scanning has been completed.<br>
                            Base Station acccess point has been reset.<br><br>
                            Please just refresh the page.`,
                        'wait': "Please wait",
                    }
                },
                'cluster': {
                    'addok': "Cluster has been successfully added.",
                    'addfail': "Failed to add Cluster. Please check the name and the MAC address.",
                    'delok': "Cluster has been successfully deleted.",
                    'delfail': "Failed to delete the Cluster.",
                    'remove': "Remove Cluster",
                    'detailfail': "Cannot find Cluster Configuration.",
                },
            },
            'viewDevices': {
                'title': "View Devices",
                'header': "View Device per Cluster",
                'columns': [ 
                    "Device Name", 
                    "Device Type", 
                    "Node ID", 
                    "Device Status", 
                    "Rename Device",
                    // "Remove Device" 
                ],
                'rename': "Set New Device Name",
                'renameok': "Device name changed!",
                'renamefail': "Failed to change Device name! Please try again.",
                'active': 'Active',
                'inactive': 'Inactive',
                'info': [
                    "Displays the basic information of all the devices associated with the selected Cluster",
                    "Device Name - assigned device name on the network",
                    "Device Type - indicates device function",
                    "Status - Active state indicates the device is Connected while Inactive state indicates the device is Disconnected",
                ],
                'none': "No selected cluster",
            },
            'manageDevices': {
                'title': "Manage Devices",
                'header': "Manage Device Allocation",
                'subheader': "Reorder Mode",
                'info': [
                    "Allows the devices to be either assigned to display on specific pages or removed from its Cluster",
                    "Yellow Indicator- indicates the device that will be swapped from the current page",
                    "Note: Devices that are swapped from its current pages will always be positioned as the last item of the source page.",
                    "Note: To delete a device, drag the device to the trash icon."
                ],
                'prompt': {
                    'rename': "Set New Group Name",
                    'willremove': "will be removed. Do you want to continue",
                    'success': {
                        'devremoved': "Device successfully removed.",
                        'order': "New Devices order applied.",
                        'rename': "Dashboard group name changed!",
                        'cluster': "Device cluster update completed.",
                    },
                    'failed': {
                        'devremoved': "Failed to remove device! Please try again.",
                        'inused': "Failed to remove device! Check if device has active job.",
                        'offline': "Failed to remove device! Check if device is Online/Active.",
                        'order': "Failed to apply device order.",
                        'rename': "Failed to change Group name! Please try again.",
                        'cluster': "Device cluster update failed."
                    },
                    'dragOption': {
                        'title': "Choose an option for",
                        'switch1': "Switch: Assign",
                        'switch2': "previous cluster",
                        'remove': "Remove: Remove device",
                    },
                },
                'legend': "Cluster List",
                'reorder': {
                    'title': "Reorder Mode",
                    'options': [
                        "Dashboard Device Allocation", 
                        "Cluster Allocation"
                    ],
                    'apply': 'Apply',
                },
                'nodevice': 'No device',
                'updating': 'Updating Devices...',
                'deleting': 'Deleting Devices...',
            },
            'editModal': {
                'title': "Edit Cluster Information",
                'subtitle': "Access Point Configuration",
                'labels': [ 
                    'Cluster Name', 
                    'SSID', 
                    'Passphrase', 
                    'Broadcast SSID', 
                    'IP Address', 
                    'MAC Address', 
                    'Description' 
                ],
                'chars': "Characters",
                'tooltip': "This is not editable for Main Server",
                'prompt': {
                    'name': 'Cluster Name is invalid. Please try again.',
                    'ssid': 'SSID is invalid. Please try again.',
                    'pass': 'Passphrase is invalid. Please try again.',
                    'ip': 'IP Address is invalid. Please try again.',
                    'success': 'Basestation was configured successfully.',
                    'failed': 'Failed to configure basestation. Please try again.',
                    'gensucc': 'Configured successfully.',
                    'genfail': 'Failed to configure. Please try again.',
                    'mac': 'MAC Address format is invalid. Please try again.',
                    'editok': 'Changes were applied successfully.',
                    'editfail': 'Failed to modify Cluster. Please try again.',
                    'editLoading': "Server is trying to save the cluster information. <br>Please wait...",
                    'samessidpass': "Configuration was saved but SSID and Passphrase are same as existing. Device configuration are skipped."
                }
            },
            'scanbs': {
                'title': "Scanned Basestations",
                'subtitle': "Select Basestation to add",
                'rescan': "Rescan"
            },
            'scandev': {
                'title': "Scan Devices",
                'subtitle': "Select Smart Counters to add",
                'footer': "Number of Registered Devices",
                'start': "Start",
                'prompt': {
                    'none': "No devices found.",
                }
            },
            'removedev': {
                'title': "Remove Devices",
                'subtitle': "Select Smart Counter Device to remove",
                'footer': "Number of Registered Devices",
                'refresh': "Refresh",
                'prompt': {
                    'none': "No devices found.",
                },
                'removed': "Removed",
            }
        },
        'update': {
            'pagetitle': 'Software Update',
            'tabtitle': 'Software Update',
            'buttons': {
                'checkupdate': "Check for Software Update",
                'dlupdate': "Download Update",
            },
            'update': "Last Updated" 
        },
        'qr': {
            'notfound': "No QR code found. Please make sure the QR code is within the camera's frame and try again.",
            'errformat': "QR Format error.",
            'errchar': "Invalid characters detected. Please refrain from using special characters. Thank you.",
            'nodevice': "Device set on schedule does not exist.",
            'schedexistrun': "Schedule exists and is currently running. Please use a different Job Order.",
            'schedexistcomp': "Schedule exists and was already completed.  Please use a different Job Order. ",
            'schedfound': "Schedule found and loaded.",
            'faildb': "Failed to get response from the database.",
            'failrx': "Failed to receive updated job order list. Please check network connection.",
            'errlack': "Insufficient data provided.",
            'errnumformat': "Parameter that expects a number has invalid input.",
            'schedstartexist': "Schedule already exists.  Please use a different Scheduled Start.",
            'runexist': "An ongoing job is found.  Please end the ongoing job to start a new job.",
        },
        'signin': {
            'uname': "Username",
            'passw': "Password",
            'login': "LOGIN",
            'prompt': {
                'usererr': "Invalid Username. Please try again.",
                'passerr': "Invalid Password. Please try again.",
                'userpasserr' : "Invalid Username and Password. Please try again.",
                'invalid': "Invalid ",
                'desu': ". ",
                'tryagain': "Please try again.",
                'and': ' and ',
                'signout': "You have been signed out.",
            }
        },
        'about': {
            'title': "About",
            'ip': "IP Address",
        }
    },
    'jp': {
        'general': {
            'displaylbl': "生産状況",
            'recordlbl': "生産記録",
            'configlbl': "詳細設定",
            'aboutlbl': "Gemba Reporterについて",
            'lastUpdate': "前回更新",
            'preflbl': '画面設定',
            'logoutlbl': 'ログアウト',
            'cancellbl': 'キャンセル',
            'proceedlbl': '進む',
            'closelbl': '閉じる',
            'exportlbl': 'エクスポート',
            'showdatalbl': 'データ表示',
            'showchartlbl': 'チャート表示',
            'todaylbl': '今日',
            'viewlbl': '表示',
            'filterlbl': 'フィルター',
            'refreshlbl': '更新',
            'deletedblbl': 'データ削除',
            'editlbl': '編集',
            'savelbl': '保存',
            'clearlbl': 'クリア',
            'showAllJobs': '全ての生産を表示',
            'showOngJobs': '進行中の生産を表示',
            'newschedlbl': "新しい計画",
            'addlbl': '追加',
            'updatelbl': '更新',
            'denylbl': '拒否',
            'allowlbl': '許可',
            'resetlbl': 'リセット',
            'companyname': 'ライン精機株式会社',
            'reglbl': '保存',     /* 登録 */
            'permissionlbl': '権限',
            'graphlbl': 'グラフ',
            'tablelbl': 'テーブル',
            'successlbl': '成功',
            'exportreclbl': "記録をエキスポート",
            'infolbl': 'お知らせ',
            'removelbl': '解除',
            'JO': '生産',
            'INH': '入力禁止',
            'WDT': 'ウォッチドッグ',
            'ST1': 'ステート1',
            'ST2': 'ステート2',
            'ST3': 'ステート3',
            'ST4': 'ステート4',
            'model': '品目',
            'material': '材料',
            'targetqty': '目標数',
            'operator': '作業者',
            'jobstart': '開始',
            'jobend': '終了',
            'nodevlbl': '設備未選択',
            'nojoblbl': '生産指示未選択',
            'durationlbl': 'イベント時間',
            'datatable': {
                'prev': '前',
                'next': '次',
                'info': "_TOTAL_エントリの_START_から_END_を表示",
                'infoempty': "_TOTAL_エントリの0から_END_を表示",
                'empty': '有効なデータ無し',
                'search': '検索',
            },
            'datepicker': {
                'now': '現在',
                'done': '閉じる',
                'monthNames': [ 
                    "1月",
                    "2月",
                    "3月",
                    "4月",
                    "5月",
                    "6月",
                    "7月",
                    "8月",
                    "9月",
                    "10月",
                    "11月",
                    "12月" 
                ],
                'monthNamesShort': [ 
                    "1月",
                    "2月",
                    "3月",
                    "4月",
                    "5月",
                    "6月",
                    "7月",
                    "8月",
                    "9月",
                    "10月",
                    "11月",
                    "12月" 
                ],
                'dayNames': [ 
                    "日曜日",
                    "月曜日",
                    "火曜日",
                    "水曜日",
                    "木曜日",
                    "金曜日",
                    "土曜日" 
                ],
                'dayNamesShort': [ 
                    "日",
                    "月",
                    "火",
                    "水",
                    "木",
                    "金",
                    "土" 
                ],
                'dayNamesMin': [ 
                    "日",
                    "月",
                    "火",
                    "水",
                    "木",
                    "金",
                    "土" 
                ],
                'weekHeader': "週",
                'yearSuffix': "年",
                'timeText': '時刻',
                'hourText': '時',
                'minuteText': '分',
                'secondText': '秒',
                'invalid': "期間が正しくありません。再度入力してください。",
            },
            'loadexport': "エキスポートするデータを読み込み中。ばらくお待ちください。",
            'required': "必須",
            'nojobsel': "未選択",
            'nothing': "選択されていません。",
            'loading': "読み込み",
            'yes': "はい",
            'no': "いいえ",
            'warning': "警告",
            'newip': '注釈：URLアドレスバーに新たなIPアドレスを入力ください。',
            'lgdisplay': "大型ディスプレイモードにて必要となる最小解像度は1024x760です。条件を満たさない場合には適切に表示がされない場合があります。",
            'continue': "続行しますか？",
            'enable': "許可",
            'contbutton': "続行",
            'error': "エラー",
            'fail': "エラー",
            'result': "結果",
            'option': "選択肢を表示",
            'hideoption': "選択肢を非表示",
        },
        'devicetype': {
            'INPUTDEVICE': 'スマートカウンタ',
        },
        'jobdetails': {
            'achievement': '達成率 (%)', 
            'cycle': 'サイクルタイム', 
            'count': '生産数',
            'downcause': '停止入力',
            'downduration': '停止時間 (分)', 
            'downend': '停止終了', 
            'downinput': '備考',
            'downsource': '停止入力', 
            'downstart': '停止開始',
            'duration': '停止時間', 
            'event': 'イベント名',
            'eventduration': 'イベント時間',
            'eventend': 'イベント終了時刻',
            'eventstart': 'イベント開始時刻',
            'good': '良品数',
            'job': '生産',
            'jobcap': '生産',
            'jobduration': '合計時間 (分)', 
            'joborder': '生産指示', 
            'machine': '設備', 
            'material': '材料',
            'model': '品目',
            'nextjob': '次生産指示', 
            'prescale': 'プリスケール', 
            'prewarn': '予報設定', 
            'prodduration': '稼働時間 (分)',
            'prodend': '生産終了時刻',  
            'prodstart': '生産開始時刻', 
            'prodstatus': '生産状況',
            'operator': '作業者',
            'outputqty': '生産数', 
            'reject': '不適合数',
            'rejectqty': '不適合数', 
            'rejinput': '摘要',
            'schedend': '終了予定時刻', 
            'status': '状況',
            'takt': 'サイクルタイム',
            'target': '目標数',
            'targetlong': '目標数', 
            'yield': '歩留率 (%)', 
        },
        'chart': {
            'day': '日',
            'duration': 'イベント時間',
            'end': '終了',
            'from': '開始',
            'hour': '時間',
            'jostart': '生産開始',
            'joend': '生産終了',
            'min': '分',
            'sec': '秒',
            'start': '開始',
            'to': '終了',
        },
        'status': {
            'COMPLETED': '完了',
            'COMPLETED*': '完了*',
            'CONTINUED': '継続',
            'down': '停止中',
            'idle': 'データ無し',
            'OFFLINE': 'オフライン',
            'PRODUCTIVE': '稼働中',
            'run': '稼働中',
            'UNPRODUCTIVE': '停止中',
            '--': 'データ無し',
        },
        'export': {
            'summary': '生産記録', 
            'downtime': '停止記録',
            'event': 'イベント情報',
            'prompts': {
                'expTooLarge': "出力データの容量が大きすぎます。",
                'errTooLarge': "データ容量が大きすぎるため出力できませんでした。やり直してください。",
                'errRequestFailed': "サーバーへデータ出力の要求ができませんでした。やり直してください。",
            },
        },
        'errorprompt': {
            'internal': 'Internal Error. Please try again.',
            'network': 'Network Error. Please try again.',
            'unknown': 'Unknown state',
            'datatoolarge': 'Failed to communicate with server, data maybe too large.',
        },
        'control': {
            'tabtitle': '生産指示',
            'devInfo': "生産情報",
            'jobInfo': "生産指示情報",
            'new': "新規",
            'outvsrej': "歩留率 %",
            'actvstgt': "進捗 %",
            'endjobswitch': '目標数で記録を終了',
            'wdtswitch': 'ウォッチドッグタイマー',
            'progress': '進捗',
            'endjob': '生産終了',
            'startjob': '生産開始',
            'lgscreen': [ 
                '設備',
                '生産指示',
                '品目',
                '材料',
                '生産計画',
                '作業者',
                'サイクルタイム',
                'プリスケール',
                '目標数',
                '予報設定',
                '生産状況',
                '生産数',
                '不適合数'
            ],
            'smscreen': [ 
                '設備',
                '生産指示',
                '品目',
                '材料',
                '生産計画',
                '作業者',
                'サイクルタイム',
                'プリスケール',
                '目標数',
                '予報設定',
                '不適合数',
                '生産状況' 
            ],
            'cameranostream': 'Webカメラが起動しているかご確認ください',
            'selectcamera': 'カメラを選択してください',
            'camerapref': 'カメラ設定',
            'camera': 'カメラ',
            'noqrcode': 'QRコードが検出できません',
            'prompts': {
                'startDeleted': "生産を開始出来ませんでした。生産指示がすでに削除されています。<br>生産指示を再度選択してください。",
                'startRunning': "生産を開始出来ませんでした。稼働中/待機中の生産があるかもしれません。<br>生産指示を再度選択してください。",
                'startAgain': "生産を開始出来ませんでした。やり直してください。",
                'startSelect': "生産指示を再度選択して、やり直してください。",
                'startEndTgt': "目標数が0の場合は、「目標数で記録を終了」の設定は出来ません。<br>再度やり直してください。",
                'startEndjob': "本当に稼働中の生産を終了させますか？",
                'startEndBacklog': "デバイスが処理中です。本当に稼働中の生産を終了させますか？<br>注意: 処理中に生産を終了させると、いくつかのデータが失われます。",
                'startEndFailed': "生産を終了出来ませんでした。やり直してください。",
                'startSchedAdd': "新しい計画を追加出来ませんでした。やり直してください。",
                'startLoading': "サーバーが生産を開始しようとしています。しばらくお待ちください。",
                'stopLoading': "サーバーが生産を終了しようとしています。しばらくお待ちください。",
                'startTimeout': "要求がタイムアウトになりました。やり直してください。",
                'startAnother': "生産を開始出来ませんでした。他のユーザーが別の生産指示を開始しました。",
                'failedJobList': "更新された生産指示リストを受け取れませんでした。ネットワークの接続を確認してください。",
                'failedDevInfo': "デバイス情報を更新できませんでした。ネットワークの接続を確認してください。",
                'failedIdNo': "正しいＩＤ番号を取得できませんでした。",
                'failedJobEnded': "他のユーザーにより、生産計画は既に終了しました。",
            }
        },
        'overview': {
            'pagetitle': '設備一覧',
            'tabtitle': '設備一覧',
            'prompts': {
                'noList': "停止理由リストがありません。",
                'saveFail': "停止理由を保存出来ませんでした。やり直してください。",
                'saveSuccess': "停止理由が登録されました。",
                'noCause': "停止理由を再度選んでください。",
            },
            'machineid': '設備ID',
            'entercause': '停止理由を入力してください',
        },
        'dashboard': {
            'pagetitle': '生産数',
            'tabtitle': '生産数',
            'machine': '設備ID',
            'status': '生産状況',
            'prewarn': '予報設定',
            'progress': '進捗',
            'page': 'ページ ',
        },
        'duration': {
            'pagetitle': '生産時間',
            'tabtitle': '生産時間',
            'machine': '設備ID',
            'status': '生産状況',
            'duration': '経過時間',
            'downtime': '停止時間'
        },
        'summary': {
            'pagetitle': '生産情報',
            'tabtitle': '生産情報',
            'columns': [  
                '設備',
                '生産指示',
                '生産開始時刻',
                '生産終了時刻',
                '品目',
                '材料',
                '目標数',
                '予報設定',
                '生産数',
                '不適合数',
                '合計時間 (分)',
                '稼働時間 (分)',
                '停止時間 (分)',
                '終了予定時刻',
                '作業者',
                '次生産指示',
                '状況'
            ],
            'filters': [
                '設備',
                '生産指示',
                '品目',
                '材料',
                '作業者',
                '状況'
            ],
            // 'nodatatodisplay': 'データ無し',
        },
        'unproductive': {   //jo timechart table 
            'pagetitle': '停止情報',
            'tabtitle': '停止情報',
            'columns': [ 
                '設備',
                '生産指示',
                '生産開始時刻',
                '品目',
                '材料',
                '作業者',
                'イベント開始時刻',
                'イベント終了時刻',
                'イベント時間',
                'イベント名',
                '備考' 
            ],
            'prompts': {
                'remFailed': "備考の更新が出来ませんでした。やり直してください。",
                'remSuccess': "備考が更新されました。",
            },
            'modal': {
                'title': "ログ情報",
                'labels': [  
                    '設備',
                    '生産指示',
                    '作業者',
                    'イベント開始時刻',
                    'イベント終了時刻',
                    'イベント名',
                    '停止理由   ',
                    '備考',
                    '',
                    ''
                ], //do not remove the 2 empty string at the end
            },
            'filters': [
                '設備',
                '生産指示',
                '品目',
                '材料',
                '作業者',
                'イベント名'
            ],
            'chars': "文字数",
        },
        'reject': {
            'pagetitle': '不適合品',
            'tabtitle': '不適合品',
            'columns': [ 
                '設備', 
                '生産指示', 
                '生産開始時刻', 
                '生産終了時刻', 
                '品目', 
                '材料', 
                '生産数', 
                '不適合数', 
                '摘要' 
            ],
            'prompts': {
                'rejInvalid': "入力値は無効です。",
                'rejPosVal': "マイナスの値は入力出来ません。",
                'rejTooLarge': "入力値が大き過ぎます。1000000000以下にしてください。",
                'rejFailed': "Failed to update. やり直してください。",
                'rejSuccess': "正しくアップデート完了しました",
            },
            'filters': [
                '設備',
                '生産指示',
                '品目',
                '材料',
                '生産数',
                '不適合数'
            ],
        },
        'schedule': {
            'pagetitle': '生産計画',
            'tabtitle': '生産計画',
            'columns': [  
                '設備',
                '生産指示',
                '開始予定時刻',
                '終了予定時刻',
                '品目',
                '材料',
                '目標数',
                '予報設定',
                'サイクルタイム、秒',
                'プリスケール',
                '作業者',
                '<i class="fa fa-info-circle text-primary"></i>&nbsp;実行'
            ],
            'schedInfoTitle': "計画情報",
            'schedinfo-col': [  
                '設備',
                '生産指示',
                '品目',
                '材料',
                '目標数',
                '予報数',
                '作業者',
                '開始予定時刻',
                '終了予定時刻',
                'サイクルタイム、秒',
                'プリスケール'
            ],
            'prompts': {
                'schedFillReq': "必須項目の全てを入力してください。",
                'schedNegVal': "プリスケールは0.1以上の値を入力ください。",
                'schedZeroVal': "目標数と予報数にゼロ又はマイナス値は入力出来ません。",
                'schedTgtMaxVal': "目標数と予報数の最大値は1,000,000,000です。適切な数値を入力してください。",
                'schedCycleMaxVal': "サイクルタイムの最大値は999,999秒 (11.5日)です。適切な数値を入力してください。",
                'schedPrescaleMaxVal': "プリスケール値の最大値は100です。適切な数値を入力してください。",
                'schedPrewarnExceed': "予報数は目標値より小さい値にしてください。予報数を変更してください。",
                'schedInvalidJob': "生産指示名に無効な単語が含まれています。NEW及びNONEは使用しないでください。",
                'schedInvalidDate': "計画の範囲が有効ではありません。",
                // 'schedAddFailed': "計画の追加が出来ませんでした。開始予定時刻を確認してください/生産指示。",
                'schedAddFailed': "計画を追加できませんでした。生産計画の内容を確認してください。 </br> </br> 注意: 同じ設備で同じ開始時間の設定はできません。",
                'schedAddSuccess': "計画が追加されました。",
                'schedUpdFailed': "計画を更新出来ませんでした。やり直してください。",
                'schedUpdInc': "計画が更新されました。しかしデバイスの更新に失敗しました。",
                'schedUpdSuccess': "予定は更新されました。",
                'schedTgtLower': "新しい目標数は計画の元々の数量より少ないです。続けますか？<br><br>注意: 稼働中の生産計画の現在値より少ない目標値を設定するとログの記録が終了します。",
                'schedAlreadyDel': "生産計画は既に削除されています。",
                'schedDelFailed': "計画を削除出来ませんでした。",
                'schedDelSuccess': "計画は削除されました。",
                'schedDelWarn': "削除された項目は保存されません。本当に計画を削除しますか？",
                'statuschanged': "生産計画の編集中に生産が開始または終了したため、更新はできませんでした。新しい計画を作成してください。",
                'scheduleDataFail': "Cannot fetch the information of the schedule.",
            },
            'tooltip': {
                'locked': "によって計画はロックされました。",
                'idle': "計画は待機中です。",
                'complete': "計画は終了しました。",
                'running': "計画は稼働しています。",
            },
            'filters': [
                '設備',
                '生産指示',
                '品目',
                '材料',
                '目標数',
                '作業者'
            ],
        },
        'timechart': {
            'pagetitle': 'タイムチャート',
            'return': '戻る',
            'legends': {
                'Productive': '稼働中',
                'Unproductive': '停止中'
            },
            'tooltip': {
                'Productive': '稼働中',
                'Unproductive': '停止中',
                'idle': 'データ無し',
                'job': '生産指示',
                'status': 'ステータス',
                'duration': '期間',
                'day': '日',
                'hour': '時間',
                'min': '分',
                'sec': '秒',
            },
            'prev': '前',
            'next': '次',
            'prompts': {
                'nodev': "設備該当なし",
                'nojob': "対応する生産指示がありません",
                'nosrv': "サーバーに接続できませんでした",
            },
        },
        'productivity': {
            'pagetitle': '生産性情報',
            'tabtitle': '生産性情報',
            'switchjo': 'イベント情報',
            'view': [
                '一覧表示', 
                '良品数 / 単位時間', 
                'サイクルタイム'
            ],
            'inthour': '時間',
            'intmin': '分',
            'HOUR': '時間',
            'MINUTE': '分',
            'interval': '集計間隔',
            'columns': [
                '開始時刻', 
                '良品数', 
                '生産数', 
                '不適合数', 
                'サイクルタイム、秒'
            ],
            'legends': {
                'st1': 'ステート1',
                'st2': 'ステート2',
                'st3': 'ステート3',
                'st4': 'ステート4',
                'wdt': 'ウォッチドッグタイマー',
                'inh': '入力禁止',
                'good': '良品数',
                'cnt': '生産数',
                'rej': '不適合数',
                'cyc': 'サイクルタイム',
            },
            'ytitle': [
                '生産数（累計）', 
                '良品数', 
                'サイクルタイム、秒'
            ],
            'xtitle': '`時間, ${intervalType}s   ( 生産開始時刻: ${firstTimestamp},   生産終了時刻: ${lastTimestamp} )`',
            'jotime': '時間',
            'joStartTime': '生産開始時刻',
            'joEndTime': '生産終了時刻',
            'ongoing': '進行中',
            'start': '開始',
            'end': '終了',
            'duration': '継続時間',
            'chart': 'チャート',
            'sec': '秒',
        },
        'jotimechart': {
            'showchart': 'グラフ表示',
            'jotimeminutes': '時間、分',
            'minplural': '分',
            'excelexportname': 'イベント情報',
            'norecord': '記録なし',
        },
        'standaloneModal': {
            'helper': {
                'title': "注意",
                'body': [ 
                    "進行中のログは表示されません。", 
                    "稼働", 
                    "停止", 
                    "注意: 自動ページ更新は無効です。" 
                ],
                'footer': "このメッセージは今後表示しない。",
            },
            'logout': {
                'title': "ログアウト",
                'body': "本当にログアウトしますか？",
                'footer': "",
            },
            'pref': {
                'title': "画面設定",
                'body': [  
                    "一般",
                    "テーマ",
                    "言語",
                    "アラーム音",
                    "通知画面の表示",
                    "フルスクリーン",
                    "管理画面",
                    "スクロール間隔 (秒)",
                    "オートスクロール",
                    "拡大表示モード"/*"全画面表示"*/,
                    "表形式表示",
                    "項目を折り返して表示",
                    "タイムチャート",
                    "ページ毎の項目数"
                ],
                'footer': "",
            },
            'audio': {
                'title': "権限",
                'body': "GEMBAアプリがオーディオ機能を使用する事を許可しますか？",
                'footer': "",
            },
            'filter': {
                'title': "フィルターオプション",
                'selected': "選択した項目",
                'apply': "フィルターを適用",
                'checkboxes': [ 
                    "終了予定時刻を表示", 
                    "実終了時刻を表示", 
                    "同じ生産計画を統合" 
                ],
            },
            'oviewhelp': {
                'title': "通知",
                'body': "「設備一覧」ページの読み込みに時間が掛かる場合があります。<br>特定の設備の情報をすぐに確認したい場合には該当する設備をクリックして下さい。",
                'footer': "今後このメッセージを表示しない ",
            },
        },
        'system': {
            'pagetitle': 'システム管理',
            'tabtitle': 'システム',
            'routename': [
                '日時設定',
                'ネットワーク設定',
                'ユーザー管理',
                '理由登録',
                '入力デバイス登録',
                'データ管理',
            ],
            'datetime': [ 
                'サーバー日時', 
                'サーバータイムゾーン', 
                'サーバー日時を設定' 
            ],
            'network': [ 
                'IP設定', 
                'IPアドレス', 
                'ゲートウェイIP' 
            ],
            'usermngmt': {
                'columns': [ 
                    'ユーザー名', 
                    'パスワード', 
                    '権限' 
                ],
                'permission': [ 
                    "生産指示", 
                    "計画", 
                    "不良入力", 
                    "データ修正", 
                    "管理者アクセス" 
                ],
                'adduser': [ 
                    '氏名', 
                    'ユーザー名', 
                    'パスワード', 
                    'パスワード確認', 
                    '生産指示', 
                    '計画', 
                    '不良入力', 
                    'データ修正', 
                    '管理者アクセス' 
                ],
                'prompts': {
                    'delete': "アカウントは削除されました",
                    'addsuccess': "新しいユーザーが追加されました。",
                    'addfail': "新しいユーザーを追加出来ませんでした。やり直してください。",
                    'invaliduser': "無効なユーザー名",
                    'invalidpass': "無効なパスワード",
                    'addinvalid': "ユーザー名とパスワードは無効です",
                    'adduserinvalid': "無効なユーザー名",
                    'addpassinvalid': "無効なパスワード",
                    'addnotmatch': "パスワードが一致しません",
                    'donotdeleteall': "全てのユーザーを削除することは出来ません。<br><br>管理者アクセスが有効なユーザーを一つ残してください。",
                    'donotdeletealladmin': "管理者アクセスが有効なユーザーを全て削除することは出来ません。<br><br>管理者アクセスが有効なユーザーを一つ残してください。",
                },
                'modal': {
                    'title': "新しいユーザーを追加",
                },
                'adduserph': [ 
                    'アカウント名', 
                    '5から16文字まで', 
                    '8から16文字まで、特殊記号、大文字、小文字、数字を各１つ以上加える', 
                    'パスワードを再入力' 
                ]
            },
            'causereg': {
                'columns': [ 
                    '番号', 
                    '理由' 
                ],
                'prompts': {
                    'regsuccess': '停止理由のリストは更新されました。',
                    'regfail': '停止理由のリストを更新出来ませんでした。やり直してください。',
                    'delete': '停止理由は削除されました。',
                    'seldelete': '停止理由を削除できませんでした。停止理由を選択してからやり直してください。',
                },
                'alarm': 'アラーム',
                'alarmpulse': '振動',
            },
            'inputdevreg': {},
            'datamgmnt': {
                'dbmem': 'データベース使用量',
                'diskmem': '使用可能量',
                'dboption': 'データ削除選択',
                'date': '日付範囲選択',
                'options': [
                    // 'Optimize Database',
                    'データの部分削除',
                    'データの完全削除',
                ],
                'prompt': {
                    'success': {
                        'dbdeleted': "データが削除されました。<br><br><br>削除された総生産指示数:  ",
                        'dbdeletedall': "データが削除されました。<br><br>削除された総記録数:  ",
                    },
                    'failed': {
                        'dbdeleted': "データを削除できませんでした。",
                    },
                }
            },
            'buttons': {
                'applysave': '適用/保存',
                'sync': '同期',
                'save': '保存',
                'addusr': 'ユーザー追加',
                'delusr': 'ユーザー削除',
                'register': '登録',
                'delete': '削除',
                'num': '番号',
                'cause': '理由',
                'activedev': '登録されているデバイス',
                'removeddev': '登録解除されたデバイス',
                'apply': '適用',
                'cancel': 'キャンセル',
            },
            'devicelist': {
                'activedevtitle': "登録されているスマートカウンタ",
                'removeddevtitle': "登録解除されたスマートカウンタ",
                'devicesub': "データを削除するスマートカウンタの選択",
                'activedevfooter': "Number of Active Devices",
                'removeddevfooter': "Number of Removed Devices",
                'deleteddatafooter': "削除された生産指示数",
                'delete': "データ削除",
                'prompt': {
                    'none': "デバイスが見つかりません。",
                }
            },
            'dtprompt': { 
                'success': '日時が正常に変更されました。',
                'failed': '日付及び時刻を更新できませんでした。',
            },
            'netprompt': 'システムを再起動しています。 <br><br>２分後にページの再読み込みを行って下さい。',
            'ipfail': '現在サーバーはネットワーク構築中のため、設定の変更はできません。',
        },
        'detailedlogs': { //JO Timechart
            'pagetitle': 'イベント情報',
            'tabtitle': 'イベント情報',
            'switchprod': '生産性情報',
            'columns': [ 
                '設備', 
                '生産指示', 
                '生産開始時刻', 
                '品目', 
                '材料', 
                '作業者', 
                '停止入力', 
                '停止原因', 
                '停止開始', 
                '停止終了', 
                '停止時間 (分)' 
            ],
            'ylable': [
                '生産', 
                'ウォッチドッグ', 
                '入力禁止', 
                'ステート1', 
                'ステート2', 
                'ステート3', 
                'ステート4'
            ],
            'xtitle': '`時間、分   ( 生産開始時刻: ${firstTimestamp},   生産終了時刻: ${lastTimestamp} )`',
        },
        'cluster': {
            'pagetitle': 'クラスター詳細設定',
            'tabtitle': 'クラスター',
            'viewCluster': {
                'title': "クラスタ表示",
                'header': "有効なクラスタ",
                'cards': {
                    'bssid': "SSIDブロードキャスト",
                    'ipaddr': "IPアドレス",
                    'devnum': "デバイス数",
                },
                'scan': "読み込み",
                'scanloading': "有効なベースステーションを読み取り中...",
                'noscan': "新たなベースステーション無し",
                'remove': "クラスタ削除",
                'view': "デバイス表示",
                'tooltip': '編集',
                'info': [
                    "有効なクラスタの基本情報を表示",
                    "SSIDブロードキャスト - クラスタのSSIDで登録された全てのデバイスと接続が可能",
                    "IPアドレス - ネットワーク上のクラスタのアドレス",
                    "デバイス数 - クラスタ毎の登録されたデバイス数",
                    "デバイス表示 - クラスタに登録されたデバイスの一覧表示",
                ],
                'apModal': {
                    'title': "アクセスポイントの更新許可",
                    'body': [
                        "デバイス読み込みのためのアクセスポイントを許可します。",
                        "続行しますか？",
                    ],
                    'prompt': {
                        'start': `ブラウザ用のアクセスポイントはリセットされました。<br><br>
                            閉じるボタンを押した後に、デバイス読み込みを実施してください。`,
                        'end': `デバイス読み込みが完了し、アクセスポイントはリセットされました。<br><br>
                            ブラウザの更新のみを行って下さい。`,
                        'wait': "少々お待ちください",
                    }
                },
                'cluster': {
                    'addok': "クラスタが追加されました。",
                    'addfail': "クラスタを追加できませんでした。クラスタ名とMACアドレスをご確認してください。",
                    'delok': "Cluster has been successfully deleted.",
                    'delfail': "Failed to delete the Cluster.",
                    'remove': "Remove Cluster",
                    'detailfail': "Cannot find Cluster Configuration.",
                }
            },
            'viewDevices': {
                'title': "デバイス表示",
                'header': "クラスタ毎のデバイス",
                'columns': [ 
                    "デバイス名", 
                    "デバイスタイプ", 
                    "ノードID", 
                    "デバイス状態", 
                    "デバイス名の変更",
                    // "Remove Device"  
                ],
                'rename': "新たなデバイス名を設定",
                'renameok': "デバイス名は更新されました。",
                'renamefail': "デバイス名を更新できませんでした。やり直してください。",
                'active': 'アクティブ',
                'inactive': '非アクティブ',
                'info': [
                    "デバイスに関する用語説明",
                    "デバイス名 - ネットワーク上の登録されたデバイスの名称",
                    "デバイスタイプ - デバイス機能の表示",
                    "デバイス状態 - アクティブは接続中、非アクティブはオフラインを表す",
                ],
                'none': "No selected cluster",
            },
            'manageDevices': {
                'title': "デバイス管理",
                'header': "デバイス割り当て",
                'subheader': "並び替え",
                'info': [
                    "デバイスを特定のページに表示もしくはクラスタから削除",
                    "Yellow Indicator- indicates the device that will be swapped from the current page",
                    "注釈：デバイスを現在のページから移動させると、移動先のページの最後に表示されます。",
                    "注釈：デバイスを削除する場合は、デバイスをゴミ箱にドラッグしてください。"
                ],
                'prompt': {
                    'rename': "Set New Group Name",
                    'willremove': "は削除されます。続行しますか？",
                    'success': {
                        'devremoved': "デバイスは正しく削除されました。",
                        'order': "デバイスを新たな並び替えにしました。",
                        'rename': "Dashboard group name changed!",
                        'cluster': "Device cluster update completed.",
                    },
                    'failed': {
                        'devremoved': "デバイスの登録を解除ができませんでした。再度ご確認ください。",
                        'inused': "デバイスの登録を解除できませんでした。稼働中かご確認ください。",
                        'offline': "デバイスの登録を解除できませんでした。デバイスがオンラインかご確認ください。",
                        'order': "デバイスの並び替えに失敗しました。",
                        'rename': "Failed to change Group name! Please try again.",
                        'cluster': "Device cluster update failed."
                    },
                    'dragOption': {
                        'title': "Choose an option for",
                        'switch1': "Switch: Assign",
                        'switch2': "previous cluster",
                        'remove': "Remove: Remove device",
                    },
                },
                'legend': "クラスタリスト",
                'reorder': {
                    'title': "並び替え",
                    'options': [
                        "ダッシュボードデバイス割り当て", 
                        "クラスタ割り当て"
                    ],
                    'apply': '適用',
                },
                'nodevice': 'No device',
                'updating': 'Updating Devices...',
                'deleting': 'Deleting Devices...',
            },
            'editModal': {
                'title': "クラスタ情報の編集",
                'subtitle': "アクセスポイント設定",
                'labels': [ 
                    'クラスタ名', 
                    'SSID', 
                    'パスワード', 
                    'SSIDブロードキャスト', 
                    'IPアドレス', 
                    'MACアドレス', 
                    '説明' 
                ],
                'chars': "文字数",
                'tooltip': "ここは編集が出来ません。",
                'prompt': {
                    'name': 'クラスタ名が有効ではありません。再度ご確認ください。',
                    'ssid': 'SSIDが有効ではありません。再度ご確認ください。',
                    'pass': 'パスワードが有効ではありません。再度ご確認ください。',
                    'ip': 'IPが有効ではありません。再度ご確認ください。',
                    'success': 'ベースステーションが正しく設定されました。',
                    'failed': 'ベースステーションの設定が完了できませんでした。やり直してください。',
                    'gensucc': '設定が完了しました。',
                    'genfail': '設定が完了できませんでした。やり直してください。',
                    'mac': 'MACアドレスフォーマットが無効です。再度ご確認ください。',
                    'editok': '変更が完了しました。',
                    'editfail': 'クラスター詳細設定を更新できませんでした。やり直してください。',
                    'editLoading': "クラスタのSSIDとパスワードの更新を行っています。 <br>少々お待ちください。",
                }
            },
            'scanbs': {
                'title': "読み込まれたベースステーション",
                'subtitle': "追加するベースステーションを選択",
                'rescan': "再読み込み"
            },
            'scandev': {
                'title': "デバイス読み込み",
                'subtitle': "登録するデバイスを選択してください",
                'footer': "登録されているデバイス数",
                'start': "開始",
                'prompt': {
                    'none': "デバイス無し",
                }
            },
            'removedev': {
                'title': "デバイスの登録解除",
                'subtitle': "登録解除するデバイスを選択してください",
                'footer': "登録済デバイス数",
                'refresh': "更新",
                'prompt': {
                    'none': "デバイスが見つかりません。",
                },
                'removed': "解除されました",
            }
        },
        'update': {
            'pagetitle': 'ソフトウェア アップデート',
            'tabtitle': 'ソフトウェア アップデート',
            'buttons': {
                'checkupdate': "ソフトウェアの更新を確認",
                'dlupdate': "更新ファイルをダウンロード",
            },
            'update': "前回更新" 
        },
        'qr': {
            'notfound': "QRコードが見つかりません。QRコードをカメラのフレームに入れて、やり直してください。",
            'errformat': "QRフォーマットエラー",
            'errchar': "無効な文字を検知しました。特殊文字を使用しないでください。",
            'nodevice': "指定したデバイスが存在しません。",
            'schedexistrun': "計画は稼働しています。別の生産指示を選択してください。",
            'schedexistcomp': "計画は終了しています。別の生産指示を選択してください。",
            'schedfound': "計画を読み込みました。",
            'faildb': "データベースからの返答がありません。",
            'failrx': "更新された生産指示リストを受け取れませんでした。ネットワークの接続を確認してください。",
            'errlack': "情報が不足しています。",
            'errnumformat': "数値入力箇所に不適切な入力があります。",
            'schedstartexist': "計画は既に存在しています。別の計画で生産を開始してください。",
            'runexist': "稼働中の生産指示を終了してから、新しい生産指示を開始してください。",
        },
        'signin': {
            'uname': "ユーザー名",
            'passw': "パスワード",
            'login': "ログイン",
            'prompt': {
                'usererr': "無効なユーザー名です。やり直してください。",
                'passerr': "無効なパスワードです。やり直してください。",
                'userpasserr' : "無効なユーザー名とパスワードです。やり直してください。",
                'invalid': "無効な",
                'desu': "です。",
                'tryagain': "やり直してください。",
                'and': 'と',
                'signout': "サインアウトしました。",
            }
        },
        'about': {
            'title': "バージョン情報",
            'ip': "IPアドレス",
        }
    },
    'cn': {
        'general': {
            'displaylbl': '顯示板',
            'recordlbl': '紀錄',
            'configlbl': '系統詳細資訊',
            'aboutlbl': '關於',
            'lastUpdate': '最後更新',
            'preflbl': '介面設定',
            'logoutlbl': '登出',
            'cancellbl': '取消',
            'proceedlbl': '確定',
            'closelbl': '關閉',
            'exportlbl': '輸出',
            'showdatalbl': '顯示數據',
            'showchartlbl': '顯示圖表',
            'todaylbl': '今日', 
            'viewlbl': '搜尋',
            'filterlbl': '篩選',
            'refreshlbl': '刷新',
            'deletedblbl': '從數據庫中刪除',
            'editlbl': '編輯',
            'savelbl': '存檔',
            'clearlbl': '清除',
            'showAllJobs': '顯示全部工單',
            'showOngJobs': '執行中工單',
            'newschedlbl': '新增計畫',
            'addlbl': '新增',
            'updatelbl': '修改',
            'denylbl': '否定',
            'allowlbl': '允許',
            'resetlbl': '重置',
            'companyname': 'Line Seiki Co., Ltd.',
            'reglbl': '存檔', /* Register */
            'permissionlbl': '權限',
            'graphlbl': 'Graph',
            'tablelbl': 'Table',
            'successlbl': '成功',
            'exportreclbl': "輸出記錄",
            'infolbl': 'Information',
            'removelbl': '移除',
            'JO': '生產情報',
            'INH': '入力禁止',
            'WDT': 'WATCHDOG',
            'ST1': 'STATE 1',
            'ST2': 'STATE 2',
            'ST3': 'STATE 3',
            'ST4': 'STATE 4',
            'model': '型號',
            'material': '材料名稱',
            'targetqty': '目標數量',
            'operator': '操作員',
            'jobstart': '開始',
            'jobend': '結束',
            'nodevlbl': '機器編號',
            'nojoblbl': '工單編號',
            'durationlbl': '期間',
            'datatable': {
                'prev': '上',
                'next': '下',
                'info': "顯示 _START_ 到 _END_ , 有 _TOTAL_ 項",
                'infoempty': "顯示 0 到 _END_ , 有 _TOTAL_ 項",
                'empty': "無任何數據",
                'search': '搜索',
            },
            'datepicker': {
                'now': 'Now',
                'done': 'Close',
                'monthNames': [ 
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December" 
                ],
                'monthNamesShort': [ 
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec" 
                ],
                'dayNames': [ 
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday" 
                ],
                'dayNamesShort': [ 
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat" 
                ],
                'dayNamesMin': [ 
                    "Su",
                    "Mo",
                    "Tu",
                    "We",
                    "Th",
                    "Fr",
                    "Sa" 
                ],
                'weekHeader': "",
                'yearSuffix': "",
                'timeText': 'Time',
                'hourText': 'Hour',
                'minuteText': 'Minute',
                'secondText': 'Second',
                'invalid': "日期範圍無效。 請再試一次",
            },
            'loadexport': "正在導出的數據。請稍候...",
            'required': "必填項目",
            'nojobsel': "選擇工單",
            'nothing': "未選擇項目",
            'loading': "Loading",
            'yes': 'Yes',
            'no': 'No',
            'warning': "警告",
            'newip': 'Note: Please type the new IP address on the URL address bar.',
            'lgdisplay': "Large Display mode requires minimum screen resolution of 1024x760. Lower than this resolution may cause improper text rendering.",
            'continue': "Would you like to continue?",
            'enable': "許可",
            'contbutton': "Continue",
            'error': "錯誤",
            'fail': "失敗",
            'result': "結果",
            'option': "顯示選項",
            'hideoption': "隱藏選項",
        },
        'devicetype': {
            'INPUTDEVICE': 'SMART COUNTER',
        },
        'jobdetails': {
            'achievement': '達成率 (%)', 
            'count': '生產數',
            'cycle': '周期', 
            'downcause': '停機原因',
            'downduration': '停機時間(分)', 
            'downend': '停機結束', 
            'downinput': '備註',
            'downsource': '停機原因', 
            'downstart': '停機開始',
            'duration': '期間', 
            'event': '來源',
            'eventduration': '期間',
            'eventend': '事件結束',
            'eventstart': '事件開始',
            'good': '良品數',
            'jobcap': '生產情報',
            'job': 'Job',
            'jobduration': '總工時(分)', 
            'joborder': '工單編號', 
            'machine': '機器編號', 
            'material': '材料名稱',
            'model': '型號',
            'nextjob': '下個生產工單', 
            'prescale': '預設比例', 
            'prewarn': '預報值', 
            'prodduration': '生產時間(分)',
            'prodend': '結束生產時間',  
            'prodstart': '實際生產開始', 
            'prodstatus': '狀態',
            'operator': '操作員',
            'outputqty': '總生產值', 
            'reject': '不良數',
            'rejectqty': '不良數', 
            'rejinput': '不良品備註',
            'schedend': '預定結束時間', 
            'status': '生產狀態',
            'takt': '周期、秒',
            'target': '目標數量',
            'targetlong': '目標值', 
            'yield': '良品率 (%)', 
        },
        'chart': {
            'day': '日',
            'duration': '停機',
            'end': '停止',
            'from': '開始',
            'hour': '時',
            'jostart': 'Job Start',
            'joend': 'Job End',
            'min': '分',
            'sec': '秒',
            'start': '開始',
            'to': '結束',
        },
        'status': {
            'COMPLETED': '結束',
            'COMPLETED*': '結束*',
            'CONTINUED': '繼續',
            'down': '停機中',
            'idle': '無數據',
            'OFFLINE': '離線',
            'PRODUCTIVE': '生產中',
            'run': '生產中',
            'UNPRODUCTIVE': '停機中',
            '--': '沒有數據',
        },
        'export': {
            'summary': '生產紀錄', 
            'downtime': '停機記錄',
            'event': '詳細生產情報記錄',
            'prompts': {
                'expTooLarge': '資料數據龐大無法導出。',
                'errTooLarge': '導出資料失敗，數據龐大。 請再試一遍。',
                'errRequestFailed': '導出數據到伺服器失敗。 請再試一遍。',
            },
        },
        'errorprompt': {
            'internal': 'Internal Error. Please try again.',
            'network': 'Network Error. Please try again.',
            'unknown': 'Unknown state',
            'datatoolarge': '無法與伺服器通信，數據可能太龐大。',
        },
        'control': {
            'tabtitle': '管理控制',
            'devInfo': "設備資訊",
            'jobInfo': "工作資訊",
            'new': "New",
            'outvsrej': "良 品 率 %",
            'actvstgt': "達 成 率 %",
            'endjobswitch': '達成率到達100%時，完成工作',
            'wdtswitch': '周期定時',
            'progress': '生產進度',
            'endjob': '工作結束',
            'startjob': '工作開始',
            'lgscreen': [ 
                '機器編號',
                '工單編號',
                '型    號',
                '材料名稱',
                '計畫執行時間',
                '操 作 員',
                '周期(秒)',
                '預設比例',
                '目標數量',
                '預報數量',
                '生產狀態',
                '生產數',
                '不良數' 
            ],
            'smscreen': [ 
                '機器編號',
                '工單編號',
                '型    號',
                '材料名稱',
                '計畫執行時間',
                '操 作 員',
                '周期(秒)',
                '預設比例',
                '目標數量',
                '預報數量',
                '不良數',
                '生產狀態' 
            ],
            'cameranostream': '無法開啟鏡頭 (請確保您已啟用網路攝像鏡頭)',
            'selectcamera': '選擇鏡頭設備',
            'camerapref': '鏡頭喜好',
            'camera': '鏡頭',
            'noqrcode': '未檢測到二維碼(QR code)',
            'prompts': {
                'startDeleted': "無法啟動工單。工單已被刪除。<br>請重新選擇工單編號。 ",
                'startRunning': "無法啟動工單。機器可能正在執行/排隊啟動。<br>請重新選擇工單編號。 ",
                'startAgain': "無法啟動工單。 請再試一次。",
                'startSelect': "請選擇工單並重試。",
                'startEndTgt': '"目標數量"為 0或未設定，無法勾選"達成率到達100%時，完成工作 "，請重新定義。',
                'startEndjob': "你確定要結束正在執行的工單嗎?",
                'startEndBacklog': "機器正在計數回傳中。 您真的要結束正在執行的工單嗎？<br><br>注意：如果在處理過程中終止計數，一些數據將被遺失。",
                'startEndFailed': "無法停止正在執行的工單。 請再試一次。",
                'startSchedAdd': "未能添加新計畫。 請再試一次。",
                'startLoading': "正在嘗試啟動工單作業。 請稍等…",
                'stopLoading': "正在嘗試關閉執行中的工單。 請稍等…",
                'startTimeout': "超時，請再試一次。",
                'startAnother': "無法開始工作。 某一個用戶已開始另一個工單作業。",
                'failedJobList': '無法接收更新的工單。 請檢查網路連接。',
                'failedDevInfo': '更新設備信息失敗。 請檢查網路連接。',
                'failedIdNo': '無法獲取有效ID  number。',
                'failedJobEnded': '計畫表已被另一用戶結束。',
            }
        },
        'overview': {
            'pagetitle': '全機監視',
            'tabtitle': '全機監視',
            'prompts': {
                'noList': "尚未輸入停機原因。",
                'saveFail': "無法登入停機原因。 請再試一次。",
                'saveSuccess': "停機原因登入成功。",
                'noCause': "請選擇停機原因並重試。",
            },
            'machineid': '機器編號',
            'entercause': '請輸入停機原因',
        },
        'dashboard': {
            'pagetitle': '生產顯示',
            'tabtitle': '生產顯示',
            'machine': '機器編號',
            'status': '生產狀態',
            'prewarn': '預報數量',
            'progress': '進度',
            'page': 'Page ',
        },
        'duration': {
            'pagetitle': '稼動顯示',
            'tabtitle': '稼動顯示',
            'machine': '機器編號',
            'status': '生產狀態',
            'duration': '工作時間',
            'downtime': '停機時間'
        },
        'summary': {
            'pagetitle': '綜合報表',
            'tabtitle': '綜合報表',
            'columns': [ 
                '機器編號',
                '工單編號',
                '實際生產開始 ',
                '實際生產結束',
                '型號',
                '材料名稱',
                '目標值',
                '預報值',
                '總生產數',
                '不良數',
                '總工時\n(分)',
                '生產時間\n(分)',
                '停機時間合計\n(分)',
                '計畫結束時間',
                '操作員',
                '下個生產工單',
                '生產狀態'
            ],
            'filters': [
                '機器編號',
                '工單編號',
                '型號',
                '材料名稱',
                '操作員',
                '生產狀況'
            ],
            // 'nodatatodisplay': 'No data to display',
        },
        'unproductive': {   //jo timechart table
            'pagetitle': 'Downtime',
            'tabtitle': 'Downtime',
            'columns': [ 
                '機器編號', 
                '工單編號', 
                '開始時間', 
                '型號', 
                '材料名稱', 
                '操作員', 
                '事件開始', 
                '事件結束', 
                '期間', 
                '事件', 
                '備註' 
            ],
            'prompts': {
                'remFailed': "備註更新失敗！ 請再試一次。",
                'remSuccess': "備註已更新成功",
            },
            'modal': {
                'title': "資訊",
                'labels': [ 
                    '機器編號', 
                    '工單編號', 
                    '操作員', 
                    '事件開始', 
                    '事件結束', 
                    '事件',
                    '停機原因',
                    '備註', 
                    '', 
                    '' 
                ], //do not remove the 2 empty string at the end
            },
            'filters': [
                '機器編號',
                '工單編號',
                '型號',
                '材料名稱',
                '操作員',
                '事件'
            ],
            'chars': "文字數",
        },
        'reject': {
            'pagetitle': '不良品報表',
            'tabtitle': '不良品報表',
            'columns': [ 
                '機器編號', 
                '工單編號', 
                '開始時間', 
                '結束時間', 
                '型號', 
                '材料名稱', 
                '生產數', 
                '不良數 ', 
                '備註' 
            ],
            'prompts': {
                'rejInvalid': "Input value is invalid.",
                'rejPosVal': "Input must be a positive value.",
                'rejTooLarge': "Input value too large. Max value is 1000000000.",
                'rejFailed': "Failed to update. Please try again.",
                'rejSuccess': "備註已成功更新。",
            },
            'filters': [
                '機器編號',
                '工單編號',
                '型號',
                '材料名稱',
                '生產數',
                '不良數'
            ],
        },
        'schedule': {
            'pagetitle': '計畫表',
            'tabtitle': '計畫表',
            'columns': [ 
                '機器編號', 
                '工單編號', 
                '預定開始時間', 
                '預定結束時間 ', 
                '型號', 
                '材料名稱', 
                '目標數量', 
                '預報數量', 
                '周期(秒)', 
                '預設比例', 
                '操作員', 
                '<i class="fa fa-info-circle text-primary"></i>&nbsp;編輯' 
            ],
            'schedInfoTitle': "計畫表情報",
            'schedinfo-col': [ 
                '機器編號',
                '工單編號',
                '型號',
                '材料名稱',
                '目標數量',
                '預報數量',
                '操作員',
                '預定開始時間',
                '預定結束時間 ',
                '周期(秒)',
                '預設比例' 
            ],
            'prompts': {
                'schedFillReq': "請填寫必要欄位.",
                'schedNegVal': '輸入無效，"預設比例"允許最小值為 0.1。 請再試一次。',
                'schedZeroVal': '"目標數量"和"預報數量"不允許輸入為零值或負值。 請再試一次。',
                'schedTgtMaxVal': '"目標數值"和"預報數值"最大值為 1,000,000,000。 請使用較低的值。',
                'schedCycleMaxVal': '"週期時間"最大值為 999,999 秒（11.5 天）。 請使用較低的值。',
                'schedPrescaleMaxVal': '"預設比例"最大值為 100。請使用較低的值。',
                'schedPrewarnExceed': '"預報數量"不得超過"目標數量"，請更改預報數量。',
                'schedInvalidJob': '"工單編號"包含無效字詞。 請不要使用 NEW 或 NONE。',
                'schedInvalidDate': "預定開始與結束時間無效",
                // 'schedAddFailed': '新增失敗，請確認工單編號是否重覆。',
                'schedAddFailed': '添加計畫失敗！ 請檢查"計畫表情報"之內容。</br> </br> 注意：預定開始時間已重覆。',
                'schedAddSuccess': "計畫添加成功.",
                'schedUpdFailed': "計畫更新失敗，請再試一次。",
                'schedUpdInc': "計畫表已更新。 但是，機台設備未成功更新。",
                'schedUpdSuccess': "計畫已成功更新",
                'schedTgtLower': '新修改的"目標數量"小於附表的原始數量。 你想繼續嗎？',
                'schedAlreadyDel': "計畫表已被刪除。",
                'schedDelFailed': "計畫表無法刪除。",
                'schedDelSuccess': "已成功刪除計畫.",
                'schedDelWarn': '刪除的計畫無法恢復，請確認是否要刪除此計畫呢？',
                'statuschanged': '無法更新，請重新添加新的計畫。',
                'scheduleDataFail': '無法獲取計畫表資訊',
            },
            'tooltip': {
                'locked': "計畫表已被鎖住",
                'idle': "計畫表空閒",
                'complete': "計畫表完成",
                'running': "計畫表正在運行",
            },
            'filters': [
                '機器編號',
                '工單編號',
                '型號',
                '材料名稱',
                '目標數量',
                '操作員'
            ],
        },
        'timechart': {
            'pagetitle': 'TimeChart',
            'return': 'Return',
            'legends': {
                'Productive': '生產中',    /*'工作總工時',*/
                'Unproductive': '停機中',  /*'停機',*/
            },
            'tooltip': {
                'Productive': '生產中',
                'Unproductive': '停機中',
                'idle': '無數據',
                'job': '工單號碼',
                'status': '生產狀態',
                'duration': '期間',
                'day': '日',
                'hour': '時',
                'min': '分',
                'sec': '秒',
            },
            'prev': 'Prev',
            'next': 'Next',
            'prompts': {
                'nodev': "沒有可用的機台編號",
                'nojob': "沒有可用的工單",
                'nosrv': "無法連接到服務器",
            },
        },
        'productivity': {
            'pagetitle': '生產率報表',
            'tabtitle': '生產率',
            'switchjo': 'JO TimeChart',
            'view': [
                '總覽', 
                '時間/良品數', 
                '周期'
            ],
            'inthour': '時',
            'intmin': '分',
            'HOUR': '時',
            'MINUTE': '分',
            'interval': '間隔',
            'columns': [
                '開始時間', 
                '良品數 ', 
                '生產數', 
                '不良數', 
                '每件時間 (秒)'
            ],
            'legends': {
                'st1': 'STATE1',
                'st2': 'STATE2',
                'st3': 'STATE3',
                'st4': 'STATE4',
                'wdt': '周期定時',
                'inh': '入力禁止',
                'good': '良品數',
                'cnt': '生產數',
                'rej': '不良數',
                'cyc': '周期、秒',
            },
            'ytitle': [
                '生產數 (累計)', 
                '良品數', 
                '周期、秒'
            ],
            'xtitle': '`時間, ${intervalType}s   ( 生產開始: ${firstTimestamp},   生產結束: ${lastTimestamp} )`',
            'jotime': '時間',
            'joStartTime': '生產開始',
            'joEndTime': '生產結束',
            'ongoing': '進行中',
            'start': '開始',
            'end': 'E停止',
            'duration': '期間(秒)',
            'chart': 'Chart',
            'sec': '秒',
        },
        'jotimechart': {
            'showchart': '顯示圖表',
            'jotimeminutes': '時間, 分',
            'minplural': '分',
            'excelexportname': '詳細生產情報記錄',
            'norecord': '沒有記錄',
        },
        'standaloneModal': {
            'helper': {
                'title': "注意",
                'body': [ 
                    "無法在工作進行中顯示", 
                    "工作總工時", 
                    "停機", 
                    "注意:禁用自動頁面更新" 
                ],
                'footer': '不要顯示此訊息，請打勾',
            },
            'logout': {
                'title': "登出",
                'body': "您確定要登出嗎?",
                'footer': "",
            },
            'pref': {
                'title': "介面設定",
                'body': [ 
                    "一般",
                    "背景",
                    "語系",
                    "警報",
                    "提示訊息",
                    "全螢幕",
                    "生產顯示",
                    "畫面更新時間(秒)",
                    "自動更新畫面",
                    "大螢幕模式",
                    "螢幕模式",
                    "自動排版",
                    "Timechart",
                    "Items Per Page" 
                ],
                'footer': "",
            },
            'audio': {
                'title': "權限",
                'body': "允許Gemba APP 播放音頻?",
                'footer': "",
            },
            'filter': {
                'title': "篩選功能",
                'selected': "選擇項目",
                'apply': "篩選",
                'checkboxes': [ 
                    "預定結束時間", 
                    "實際生產結束時間", 
                    "同工單合併統計" 
                ],
            },
            'oviewhelp': {
                'title': "Notice",
                'body': "全機監視頁面可能需要一些時間。<br>請點擊相對應設備的框，以更新狀態。",
                'footer': "不要再顯示此訊息",
            },
        },
        'system': {
            'pagetitle': 'System Management',
            'tabtitle': '系統二',
            'routename': [
                '日期和時間設置',
                '網路設置',
                '用戶管理',
                '停機原因登錄',
                'Smart Counter Registration',
                '數據庫管理',
            ],
            'datetime': [ 
                '系統時間和日期', 
                '系統時區', 
                '日期和時間格式' 
            ],
            'network': [ 
                'IP 設置', 
                'IP Address', 
                '網間連接器 IP' 
            ],
            'usermngmt': {
                'columns': [ 
                    '用戶名稱', 
                    '密碼', 
                    '權限' 
                ],
                'permission': [ 
                    "管理控制", 
                    "計畫表", 
                    "不良品備註", 
                    "數據修改", 
                    "系統詳細資訊" 
                ],
                'adduser': [ 
                    '全名', 
                    '用戶名稱', 
                    '密碼', 
                    '確認密碼', 
                    '管理控制', 
                    '計畫表', 
                    '不良品備註', 
                    '數據修改', 
                    '管理員權限' 
                ],
                'prompts': {
                    'delete': "帳戶已成功刪除。",
                    'addsuccess': "新用戶添加成功。",
                    'addfail': "添加新用戶失敗。 請再試一次。",
                    'invaliduser': "無效的用戶名！",
                    'invalidpass': "無效的密碼！",
                    'addinvalid': "用戶名稱和密碼無效",
                    'adduserinvalid': '無效的用戶名稱',
                    'addpassinvalid': '密碼無效',
                    'addnotmatch': '密碼不匹配',
                    'donotdeleteall': "Deleting all user accounts is not allowed.<br><br>There should be at least 1 admin account.",
                    'donotdeletealladmin': "Deleting all admin accounts is not allowed.<br><br>There should be at least 1 admin account.",
                },
                'modal': {
                    'title': "添加新用戶",
                },
                'adduserph': [ 
                    '帳戶名稱', 
                    '必須有 5-16 個字符', 
                    '必須有 8-16 個字符，至少 1 個特殊符號、至少 1 個大寫字母', 
                    '重新輸入密碼' 
                ],
            },
            'causereg': {
                'columns': [ 
                    'No.', 
                    '停機原因' 
                ],
                'prompts': {
                    'regsuccess': '停機原因功能登錄',
                    'regfail': '無法更新停機原因。 請再試一次。',
                    'delete': '停機原因項目已成功刪除。',
                    'seldelete': '無法刪除停機原因。 請選擇要刪除的項目。',
                },
                'alarm': '警報',
                'alarmpulse': '振動',
            },
            'inputdevreg': {},
            'datamgmnt': {
                'dbmem': '數據庫已使用',
                'diskmem': '剩餘用量',
                'dboption': '選擇數據庫',
                'date': '選擇日期區間',
                'options': [
                    // 'Optimize Database',
                    '部分數據庫刪除',
                    '全部數據庫刪除',
                ],
                'prompt': {
                    'success': {
                        'dbdeleted': "數據已刪除。 已刪除的生產訂單總數",
                        'dbdeletedall': "數據已刪除。 刪除記錄總數",
                    },
                    'failed': {
                        'dbdeleted': "無法刪除數據",
                    },
                }
            },
            'buttons': {
                'applysave': '應用及保存',
                'sync': '同步',
                'save': '存檔',
                'addusr': '添加新用戶',
                'delusr': '刪除用戶',
                'register': '登入',
                'delete': '刪除',
                'num': 'No.',
                'cause': '停機原因',
                'activedev': '選擇移除設備',
                'removeddev': '刪除',
                'apply': '刪除',
                'cancel': '取消',
            },
            'devicelist': {
                'activedevtitle': '選擇移除設備',
                'removeddevtitle': '移除設備',
                'devicesub': '勾選設備名稱，以利設備數據刪除',
                'activedevfooter': 'Number of Active Devices',
                'removeddevfooter': 'Number of Removed Devices',
                'deleteddatafooter': '已刪除作業記錄數',
                'delete': '從數據庫中刪除',
                'prompt': {
                    'none': '未找到設備',
                }
            },
            'dtprompt': { 
                'success': '日期和時間更改成功。',
                'failed': '日期和時間更改失敗。',
            },
            'netprompt': '系統將重新啟動。 請2分鐘後刷新頁面',
            'ipfail': '當前系統正在構建中，因此無法更改網路設置。',
        },
        'detailedlogs': {  //JO Timechart
            'pagetitle': '生產情報',
            'tabtitle': '生產情報',
            'switchprod': 'Productivity',
            'columns': [ 
                '機器編號', 
                '工單編號', 
                '開始時間', 
                '型號', 
                '材料名稱', 
                '操作員', 
                'Downtime Source', 
                'Downtime Cause', 
                'Downtime Start', 
                'Downtime End', 
                'Duration (minutes)' 
            ],
            'ylable': [
                '生產情報', 
                'WATCHDOG', 
                '入力禁止', 
                'STATE 1', 
                'STATE 2', 
                'STATE 3', 
                'STATE 4'
            ],
            'xtitle': '`時間、分   ( 生產開始: ${firstTimestamp},   生產結束: ${lastTimestamp} )`',
        },
        'cluster': {
            'pagetitle': '系統配置',
            'tabtitle': '系統一',
            'viewCluster': {
                'title': "資訊一",
                'header': "資訊一",
                'cards': {
                    'bssid': "Broadcast SSID",
                    'ipaddr': "IP Address",
                    'devnum': "No. of Devices",
                },
                'scan': "掃描",
                'scanloading': "Scanning for Available Basestations...",
                'noscan': "No new basestations found",
                'remove': "Remove Cluster",
                'view': "View Devices",
                'tooltip': 'Edit Information',
                'info': [
                    "Displays the basic information of all the available clusters",
                    "Broadcast SSID - SSID of the Cluster is visible to all devices",
                    "IP Address - Address of the Cluster on the network",
                    "No. of devices - number of devices associated with the respective Cluster",
                    "View Devices - shows the device list associated with the Cluster",
                ],
                'apModal': {
                    'title': '訪問點更新權限',
                    'body': [
                        '將啟用用於設備掃描的掃描接入點。',
                        '你想繼續嗎 ？',
                    ],
                    'prompt': {
                        'start': `基站已重置。<br><br>
                            請點擊按鈕並開始掃描。`,
                        'end': `已完成掃描、已重置基站。<br><br>
                            請刷新頁面。 `,
                        'wait': "Please wait",
                    }
                },
                'cluster': {
                    'addok': "添加了聚集。",
                    'addfail': "添加聚集失敗。 檢查聚集名稱和 MAC 地址。",
                    'delok': "Cluster has been successfully deleted.",
                    'delfail': "Failed to delete the Cluster.",
                    'remove': "Remove Cluster",
                    'detailfail': "Cannot find Cluster Configuration.",
                }
            },
            'viewDevices': {
                'title': "機器編號資訊",
                'header': "機器編號",
                'columns': [ 
                    "機器編號名稱", 
                    "機器編號類型", 
                    "ID", 
                    "機器狀態", 
                    "重新命名",
                    // "Remove Device"  
                ],
                'rename': "設置新的機器編號",
                'renameok': "機器編號已更名",
                'renamefail': "更改機器編號失敗！ 請再試一次。",
                'active': 'Active',
                'inactive': 'Inactive',
                'info': [
                    "Displays the basic information of all the devices associated with the selected Cluster",
                    "Device Name - assigned device name on the network",
                    "Device Type - indicates device function",
                    "Status - Active state indicates the device is Connected while Inactive state indicates the device is Disconnected",
                ],
                'none': "No selected cluster",
            },
            'manageDevices': {
                'title': "Manage Devices",
                'header': "Manage Device Allocation",
                'subheader': "Reorder Mode",
                'info': [
                    "Allows the devices to be either assigned to display on specific pages or removed from its Cluster",
                    "Yellow Indicator- indicates the device that will be swapped from the current page",
                    "Note: Devices that are swapped from its current pages will always be positioned as the last item of the source page.",
                    "Note: To delete a device, drag the device to the trash icon."
                ],
                'prompt': {
                    'rename': "Set New Group Name",
                    'willremove': "will be removed. Do you want to continue",
                    'success': {
                        'devremoved': "Device successfully removed.",
                        'order': "New Devices order applied.",
                        'rename': "Dashboard group name changed!",
                        'cluster': "Device cluster update completed.",
                    },
                    'failed': {
                        'devremoved': "刪除機器失敗！ 請再試一次。",
                        'inused': "無法取消機器。 請檢查它是否正常工作。",
                        'offline': "無法取消機器。 請確保機器是否在線。",
                        'order': "Failed to apply device order.",
                        'rename': "Failed to change Group name! Please try again.",
                        'cluster': "Device cluster update failed."
                    },
                    'dragOption': {
                        'title': "Choose an option for",
                        'switch1': "Switch: Assign",
                        'switch2': "previous cluster",
                        'remove': "Remove: Remove device",
                    },
                },
                'legend': "Cluster List",
                'reorder': {
                    'title': "Reorder Mode",
                    'options': [
                        "Dashboard Device Allocation", 
                        "Cluster Allocation"
                    ],
                    'apply': 'Apply',
                },
                'nodevice': 'No device',
                'updating': 'Updating Devices...',
                'deleting': 'Deleting Devices...',
            },
            'editModal': {
                'title': "編輯聚集資訊",
                'subtitle': "配置",
                'labels': [ 
                    '聚集名稱', 
                    'SSID', 
                    '密碼', 
                    'Broadcast SSID', 
                    'IP Address', 
                    'MAC Address', 
                    '說明' 
                ],
                'chars': "文字數",
                'tooltip': "This is not editable for Main Server",
                'prompt': {
                    'name': '聚集名稱無效。 請再檢查一次。',
                    'ssid': 'SSID 無效。 請再檢查一次。',
                    'pass': '密碼無效。 請再檢查一次。',
                    'ip': 'IP 無效。 請再檢查一次。',
                    'success': '基站已正確設置。',
                    'failed': '配置基站失敗。 請再試一次。',
                    'gensucc': '設置完成。',
                    'genfail': '無法完成安裝。 請再試一次。',
                    'mac': '格式無效。 請再檢查一次。',
                    'editok': '更改已完成。',
                    'editfail': '未能更新設置。 請再試一次。',
                    'editLoading': "Server is trying to save the cluster information. <br>Please wait...",
                }
            },
            'scanbs': {
                'title': "Scanned Basestations",
                'subtitle': "Select Basestation to add",
                'rescan': "Rescan"
            },
            'scandev': {
                'title': "讀取設備",
                'subtitle': "請選擇要註冊的設備",
                'footer': "註冊設備數量",
                'start': "開始",
                'prompt': {
                    'none': "無設備",
                }
            },
            'removedev': {
                'title': "移除機器設備",
                'subtitle': "選擇要刪除的機器編號",
                'footer': "註冊機器數量",
                'refresh': "更新",
                'prompt': {
                    'none': "無設備",
                },
                'removed': "已移除",
            }
        },
        'update': {
            'pagetitle': '軟體更新',
            'tabtitle': '軟體更新',
            'buttons': {
                'checkupdate': "檢查軟體更新",
                'dlupdate': "下載更新",
            },
            'update': "最後更新日期" 
        },
        'qr': {
            'notfound': "未找到二維碼(QR code)。 請確保二維碼(QR Code)在鏡頭的框架內，然後重試。",
            'errformat': "二維碼(QR code)格式錯誤。",
            'errchar': "檢測到無效字符。 請不要使用特殊字符。",
            'nodevice': "指定的機器編號不存在。",
            'schedexistrun': "計畫已存在且當前正在運行。 請使用不同的工單編號。",
            'schedexistcomp': "工單已完成。 請選擇另一個工單執行。",
            'schedfound': "找到並載入計畫。",
            'faildb': "數據庫沒有回應。",
            'failrx': "無法接收更新的工單列表。 請檢查網絡連接。",
            'errlack': "提供的數據不足。",
            'errnumformat': "需要數字參數輸入無效。",
            'schedstartexist': "添加計畫失敗！ 預定開始時間已重覆。",
            'runexist': "在開始新的工單作業之前，請終止正在執行的工單。",
        },
        'signin': {
            'uname': "使用者名稱",
            'passw': "密碼",
            'login': "登入",
            'prompt': {
                'usererr': "無效使用者名稱，請再試一次",
                'passerr': "無效密碼，請再試一次",
                'userpasserr' : "無效使用者名稱及密碼，請再試一次",
                'invalid': "Invalid ",
                'desu': ". ",
                'tryagain': "Please try again.",
                'and': ' and ',
                'signout': "即將登出",
            }
        },
        'about': {
            'title': "版本資訊",
            'ip': "IP Address",
        }
    }
}

function translatePages() {
    console.log('translatePages()');
    if(flags.ajaxRequestStatus !== null) {
        flags.ajaxRequestStatus.abort();
        flags.ajaxRequestStatus = null;
    }
    /** New updates **/
    newTranslations();
    /* Modals */
    translateModals();
    /** General **/
    translateGeneral();
    /** Overview **/
    translateOverview();
    /** Dashboard **/
    translateDashboard();
    /** Summary **/
    translateSummary();
    /** Unproductive **/
    // translateUnproductive();
    /** Reject **/
    translateReject();
    /** Schedule **/
    translateSchedule();
    /** Timechart **/
    translateTimechart();
    /* System Tab */
    translateSystem();
    /* Detailed Logs tab */
    translateDetailedLog();
    /* Cluster tab */
    translateCluster();
    /* Update tab */
    translateUpdate();
    /* Productivity */
    translateProductivity();
    /* About */
    translateAbout();
    
    /* Additional adjustments */
    if (flags.pref.lang == 'en' || flags.pref.lang == 'cn') {
        $('#chart-btn label, #export-btn label').css({ 'font-size': '0.875rem' });
    } else {
        $('#chart-btn label, #export-btn label').css({ 'font-size': '0.55rem' });
    }

    initDates();
    datatableExtension();

    flags.summary.table = {};
    flags.reject.table = {};
    flags.unproductive.table = {};
    flags.schedule.table = {};
    flags.system.table = {};
    flags.config.table = {};
    flags.detailedlog.table = {};
    showTableLoading();
    switch(flags.currPage) {
        case 'summary-tab':
            initSummary(flags.summary.showProdEnd, flags.summary.showSchedEnd);
            setTimeout(function() {
                if (!flags.summary.isChartMode) {
                    summaryUpdate();
                }
            }, 250);
            break;

        case 'reject-tab':
            initReject();
            setTimeout(function() {
                rejectUpdate();
            }, 250);
            break;

        case 'unproductive-tab':
            // initUnproductive();
            // setTimeout(function() {
            //  unproductiveUpdate();
            // }, 250);
            break;

        case 'schedule-tab':
            initSchedule();
            setTimeout(function() {
                scheduleUpdate();
            }, 250);
            break;

        case 'date-tab':
            if (flags.system.pageIndex == 3) {
                initUsers();
                setTimeout(function() {
                    getUsers();
                }, 250);
            }
            break;

        case 'cluster-tab':
            switch(flags.config.pageIndex) {
                case 1:
                    viewClusterHandler();
                    break;

                case 2:
                    initClusterTbl();
                    setTimeout(function() {
                        devClusterViewQuery($('#viewDevicesTab select'), null);
                    }, 250);
                    break;

                case 3:
                    createDraggableDashboard();
                    break;

                default:
                    flags.config.pageIndex = 1;
                    break;
            }
            break;

        case 'detail-tab':
            // initDetail();
            setTimeout(function() {
                // handleDetailedLogUpdate();
                console.log('jotimechart selected');
                console.log($('#detail-detailJobs').find(':selected').val());
                const currentJob = $('#detail-detailJobs').find(':selected').val();
                if (currentJob !== "0") {
                    $('#detail-detailJobs').trigger('change');
                }
            }, 250);
            break;

        case 'visual-tab':
            initVisualization({ theme: `${flags.pref.theme}2` });
            break;

        default:
            break;
    }
}

function translateModals() {
    // helper
    $('#helpModal .modal-title > label').html(lang[flags.pref.lang].standaloneModal.helper.title);
    $('#helpModal .items').each(function(index) {
        $(this).html(lang[flags.pref.lang].standaloneModal.helper.body[index]);
    });
    $('#donotshow').parent().find('label').html(lang[flags.pref.lang].standaloneModal.helper.footer);
    //logout
    $('#logoutModal .modal-title > label').html(lang[flags.pref.lang].standaloneModal.logout.title);
    $('#logoutModal .logoutPrompt').html(lang[flags.pref.lang].standaloneModal.logout.body);
    // preferences
    $('#prefModal .modal-title > label').html(lang[flags.pref.lang].standaloneModal.pref.title);
    $('#prefModal .modal-body .items').each(function(index) {
        $(this).html(lang[flags.pref.lang].standaloneModal.pref.body[index]);
    });
    // audio
    $('#audioModal .modal-title > label').html(lang[flags.pref.lang].standaloneModal.audio.title);
    $('#audioModal .modal-body > p').html(lang[flags.pref.lang].standaloneModal.audio.body);
    // filter
    $('#filterModal .modal-title > span').html(lang[flags.pref.lang].standaloneModal.filter.title);
    $('#filterModal .modal-body .itemSel > .label').html(lang[flags.pref.lang].standaloneModal.filter.selected);
    $('#filterModal .modal-footer > label').html(lang[flags.pref.lang].standaloneModal.filter.apply);
    $('#filterModal .modal-body > .summary-checkbox .items').each(function(index) {
        $(this).html(lang[flags.pref.lang].standaloneModal.filter.checkboxes[index]);
    });
    $('#filterModal .modal-body select').each(function(index) {
        $(this).selectpicker({ 'title': lang[flags.pref.lang].general.nothing });
        $(this).selectpicker('render');
    });
    /* Warning */
    $('#warningModal .modal-header .modal-title > label').html(lang[flags.pref.lang].general.warning);
    $('.yeslbl').html(lang[flags.pref.lang].general.yes);
    $('.nolbl').html(lang[flags.pref.lang].general.no);
    // Large display
    $('#lgDispModal p.note').html(lang[flags.pref.lang].general.lgdisplay);
    $('#lgDispModal p.continue').html(lang[flags.pref.lang].general.continue);
    // overview help
    $('#overviewHelp .modal-title > label').html(lang[flags.pref.lang].standaloneModal.oviewhelp.title);
    $('#overviewHelp .modal-body').html(lang[flags.pref.lang].standaloneModal.oviewhelp.body);
    // $('#overviewHelp .modal-footer > label').html(lang[flags.pref.lang].standaloneModal.oviewhelp.footer);
    $('#donotshow-1').parent().find('label').html(lang[flags.pref.lang].standaloneModal.oviewhelp.footer);
}

function translateGeneral() {
    // $('#overviewPage').html(lang[flags.pref.lang].dashboard.page + '1 of 1');
    $('#tabDisplaytitle').html(lang[flags.pref.lang].general.displaylbl);
    $('#tabRecordtitle').html(lang[flags.pref.lang].general.recordlbl);
    $('#tabConfigtitle').html(lang[flags.pref.lang].general.configlbl);
    $('#tabAbouttitle').html(lang[flags.pref.lang].general.aboutlbl);
    $('#clear-filter-btn > span').html(lang[flags.pref.lang].general.resetlbl);
    $('#pref-btn > label > span, .preflbl').html(lang[flags.pref.lang].general.preflbl);
    $('#logout-btn > label > span, .logoutlbl').html(lang[flags.pref.lang].general.logoutlbl);
    $('.last-update > span').html(lang[flags.pref.lang].general.lastUpdate);
    $('#detail-tab label.last-update').html(
        lang[flags.pref.lang].general.lastUpdate +
            ': ' +
            getDateTimeNow('-').dnt
    );
    $('#summary-tab label.last-update').html(
        lang[flags.pref.lang].general.lastUpdate +
            ': ' +
            getDateTimeNow('-').dnt
    );
    $('.edit-btn').html(lang[flags.pref.lang].general.editlbl);
    $('.clearlbl span').html(lang[flags.pref.lang].general.clearlbl);
    $('.savelbl, #unprodSave > span').html(lang[flags.pref.lang].general.savelbl);
    $('.cancelbl').html(lang[flags.pref.lang].general.cancellbl);
    $('.proceedlbl').html(lang[flags.pref.lang].general.proceedlbl);
    $('.closelbl').html(lang[flags.pref.lang].general.closelbl);
    $('.allowlbl').html(lang[flags.pref.lang].general.allowlbl);
    $('.denylbl').html(lang[flags.pref.lang].general.denylbl);
    $('#upd-sidepanel-btn > label').html('&nbsp;' + lang[flags.pref.lang].general.updatelbl);
    $('#add-sidepanel-btn > label').html('&nbsp;' + lang[flags.pref.lang].general.addlbl);
    $('.today-btn > span, .schedToday > span').html(' ' + lang[flags.pref.lang].general.todaylbl);
    $('#reject-today-btn > span').html(' ' + lang[flags.pref.lang].general.todaylbl);
    $('.view-btn > span, .schedView > span').html(' ' + lang[flags.pref.lang].general.viewlbl);
    $('#productivity-view-btn > span, #summary-view-btn > span, #reject-view-btn > span, #detail-view-btn > span').html(' ' + lang[flags.pref.lang].general.viewlbl);
    $('.refresh-btn > span, #refreshDevicesOrderBtn, .refresh-btn span').html(lang[flags.pref.lang].general.refreshlbl);
    $('#productivity-refresh-btn > span').html(lang[flags.pref.lang].general.refreshlbl);
    $('#detail-refresh-btn > span').html(lang[flags.pref.lang].general.refreshlbl);
    $('.showJob-btn').each(function() {
        var elem = $(this).parent().find('.refresh-btn');
        if(elem.attr('hidden')) {
            $(this).html('<i class="fa fa-caret-down"></i> <span>' + lang[flags.pref.lang].general.showAllJobs + '</span>');
        } else {
            $(this).html('<i class="fa fa-caret-up"></i> <span>' + lang[flags.pref.lang].general.showOngJobs + '</span>');
        }
    });
    $('.permlbl').html(lang[flags.pref.lang].general.permissionlbl);
    $('.exportlbl').html(lang[flags.pref.lang].general.exportlbl);
    $('#productivity-export-btn span').html(lang[flags.pref.lang].general.exportlbl);
    $('#summary-export-btn span').html(`&nbsp;${lang[flags.pref.lang].general.exportlbl}`);
    $('#detail-export-btn span').html(lang[flags.pref.lang].general.exportlbl);
    $('#productivity-export-btn > span, #summary-export-btn > span, #detail-export-btn > span').removeClass().addClass(`${flags.pref.lang}`);
    $('.showdatalbl').html(lang[flags.pref.lang].general.showdatalbl);
    $('#summary-show-data-btn span').html(`&nbsp;${lang[flags.pref.lang].general.showchartlbl}`);
    $('#summary-today-btn span').html(`&nbsp;${lang[flags.pref.lang].general.todaylbl}`);
    $('#productivity-show-data-btn span, #summary-show-data-btn span, #detail-show-data-btn span').removeClass().addClass(`${flags.pref.lang}`);
    $('.filter-btn > span, #schedule-filter > span').html(lang[flags.pref.lang].general.filterlbl);
    $('#summary-filter-btn > span').html(`&nbsp;${lang[flags.pref.lang].general.filterlbl}`);
    $('#summary-filter-btn > span, #schedule-filter > span').removeClass().addClass(flags.pref.lang);
    $('#reject-filter-btn > span').html(`&nbsp;${lang[flags.pref.lang].general.filterlbl}`);
    $('#reject-filter-btn > span').removeClass().addClass(flags.pref.lang);
    $('#add-sched-btn > label').html('&nbsp;' + lang[flags.pref.lang].general.newschedlbl);
    $('#schedJOB, #schedfr, #schedCYC, #schedPRE, input.mobCycle, input.mobPrescale').attr('placeholder', lang[flags.pref.lang].general.required);
    /** Control **/
    $('#tabControltitle').html(lang[flags.pref.lang].control.tabtitle);
    $('.jobInfolbl').html(lang[flags.pref.lang].control.jobInfo);
    $('.devInfolbl').html(lang[flags.pref.lang].control.devInfo);
    $('.outvsrejlbl > label').html(lang[flags.pref.lang].control.outvsrej);
    $('.actvstgtlbl > label').html(lang[flags.pref.lang].control.actvstgt);
    $('#control-rec-label, #mobEnd').html(lang[flags.pref.lang].control.endjobswitch);
    $('#control-wdt-label, #mobWdt').html(lang[flags.pref.lang].control.wdtswitch);
    // $('.control-panel-items-sm:nth-child(14) > div span').html(lang[flags.pref.lang].control.progress);
     $('.progress_count > div > span').html(lang[flags.pref.lang].control.progress);
    $('#loadingMessage').html(lang[flags.pref.lang].control.cameranostream);
    $('.cameralbl').html(lang[flags.pref.lang].control.selectcamera);
    $('#camera-pref-lbl').html(lang[flags.pref.lang].control.camerapref);
    $('#camera-title').html(lang[flags.pref.lang].control.camera);
    $('#outputMessage').html(lang[flags.pref.lang].control.noqrcode);
    refreshJobValue();
    /** small screen **/
    var elem = $('.control-panel-label.pane-sm');
    for(var i = 0 ; i < elem.length; i++) {
        $(elem[i]).html(lang[flags.pref.lang].control.smscreen[i]);
    }
    /** large screen **/
    var elem = $('.control-panel-items > div:nth-child(1) > label');
    for(var i = 0 ; i < elem.length; i++) {
        $(elem[i]).html(lang[flags.pref.lang].control.lgscreen[i]);
    }
    /** current active button **/
    if(flags.currPage == 'control-tab') {
        if(flags.control.currSchedId != '') {
            $('.snsBtn').html(lang[flags.pref.lang].control.endjob);
        } else {
            $('.snsBtn').html(lang[flags.pref.lang].control.startjob);
        }
    }

    $('.no-dev-lbl').html(lang[flags.pref.lang].general.nodevlbl);
    $('.no-job-lbl').html(lang[flags.pref.lang].general.nojoblbl);
    $('.table-opt > span').html(lang[flags.pref.lang].general.option)
}

function translateOverview() {
    $('#tabOverviewtitle').html(lang[flags.pref.lang].overview.tabtitle);
    $('#pgeOverviewtitle').html(lang[flags.pref.lang].overview.pagetitle);
    $('#machinelbl').html(lang[flags.pref.lang].overview.machineid + ':');
    $('#registerBtn').html(lang[flags.pref.lang].general.savelbl);
    $('#stop-label').val(lang[flags.pref.lang].overview.entercause);
}

function translateDashboard() {
    $('#tabDashboardtitle').html(lang[flags.pref.lang].dashboard.tabtitle);
    $('#pgeDashboardtitle').html(lang[flags.pref.lang].dashboard.pagetitle);
    /** Dashboard pane titles **/
    $('#dashboard-tab .dashboard-pane-frame .dashboard-pane-subframe:nth-child(1) > div:nth-child(1) span').html(lang[flags.pref.lang].dashboard.machine);
    $('#dashboard-tab .dashboard-pane-frame .dashboard-pane-subframe:nth-child(2) > div:nth-child(1) span').html(lang[flags.pref.lang].dashboard.status);
    $('#dashboard-tab .dashboard-pane-frame .dashboard-pane-subframe:nth-child(3) > div:nth-child(1) span').html(lang[flags.pref.lang].dashboard.prewarn);
    $('#dashboard-tab .dashboard-pane-frame .dashboard-pane-subframe:last-child:not(.duration) > div:nth-child(1) span').html(lang[flags.pref.lang].dashboard.progress);
    /** Duration **/
    $('#tabDurationtitle').html(lang[flags.pref.lang].duration.tabtitle);
    $('#pgeDurationtitle').html(lang[flags.pref.lang].duration.pagetitle);
    /** Duration pane titles **/
    $('#duration-tab .dashboard-pane-frame .dashboard-pane-subframe:nth-child(1) > div:nth-child(1) span').html(lang[flags.pref.lang].duration.machine);
    $('#duration-tab .dashboard-pane-frame .dashboard-pane-subframe:nth-child(2) > div:nth-child(1) span').html(lang[flags.pref.lang].duration.status);
    $('#duration-tab .dashboard-pane-frame .dashboard-pane-subframe:nth-child(3) > div:nth-child(1) span').html(lang[flags.pref.lang].duration.duration);
    $('#duration-tab .dashboard-pane-frame .dashboard-pane-subframe:last-child > div:nth-child(1) span').html(lang[flags.pref.lang].duration.downtime);
}

function translateSummary() {
    $('#tabSummarytitle').html(lang[flags.pref.lang].summary.tabtitle);
    // $('#pgeSummarytitle').html(lang[flags.pref.lang].summary.pagetitle);
    $('#summary-title').html(lang[flags.pref.lang].summary.pagetitle);
    /* Destroy and create, equivalent exchange niggs */
    var newTbl = '<table class="table table-sm pageResize nowrap" id="summaryTbl" collspacing="0" width="100%">';
    newTbl += '<thead><tr>';
    newTbl += lang[flags.pref.lang].summary.columns.map(item => '<th>' + item + '</th>').join('');
    newTbl += '</tr></thead><tbody></tbody></table>';
    $('#summary-tab > div.tbl-container > div.table-responsive').html(newTbl);
    // flags.summary.showSchedEnd = false;
    // flags.summary.showProdEnd = true;

    $('#timechart-prev-btn span').html(lang[flags.pref.lang].general.datatable.prev);
    $('#timechart-next-btn span').html(lang[flags.pref.lang].general.datatable.next);

    //  check if there is no data
    if (flags.summary.chart !== undefined && flags.summary.chart.title !== undefined && flags.summary.chart.title.text !== '') {
        // console.log('summary chart');
        // console.log(flags.summary.chart);
        flags.summary.chart.title.set('text', lang[flags.pref.lang].summary.nodatatodisplay);
    }

    const showDataBtn = $('#summary-show-data-btn > span');

    if (flags.summary.isChartMode) {
        showDataBtn.html(`&nbsp;${lang[flags.pref.lang].general.showdatalbl}`);
    } else {
        showDataBtn.html(`&nbsp;${lang[flags.pref.lang].general.showchartlbl}`);
    }

}

function translateUnproductive() {
    $('#tabUnprodtitle').html(lang[flags.pref.lang].unproductive.tabtitle);
    $('#pgeUnprodtitle').html(lang[flags.pref.lang].unproductive.pagetitle);
    $('.loginfo-header > label').html(lang[flags.pref.lang].unproductive.modal.title);
    $('#unproductive-tab .inner-body .row').each(function(index) {
        $(this).find('label').html(lang[flags.pref.lang].unproductive.modal.labels[index]);
    });
    var newTbl = '<table class="table table-sm pageResize nowrap" id="unproductiveTbl" collspacing="0" width="100%">';
    newTbl += '<thead><tr>';
    newTbl += lang[flags.pref.lang].unproductive.columns.map(item => '<th>' + item + '</th>').join('');
    newTbl += '</tr></thead><tbody></tbody></table>';
    $('#unproductive-tab > div.tbl-container > div.table-responsive').html(newTbl);
    $('#unprodChr').html(lang[flags.pref.lang].unproductive.chars + ': ' + $('#unprodRem').val().length + '/200');
}


function translateReject() {
    $('#tabRejecttitle').html(lang[flags.pref.lang].reject.tabtitle);
    // $('#pgeRejecttitle').html(lang[flags.pref.lang].reject.pagetitle);
    $('#reject-title').html(lang[flags.pref.lang].reject.pagetitle);
    var newTbl = '<table class="table table-sm pageResize nowrap" id="rejectTbl" collspacing="0" width="100%">';
    newTbl += '<thead><tr>';
    newTbl += lang[flags.pref.lang].reject.columns.map(item => '<th>' + item + '</th>').join('');
    newTbl += '</tr></thead><tbody></tbody></table>';
    $('#reject-tab > div.tbl-container > div.table-responsive').html(newTbl);
}

function translateSchedule() {
    $('#tabSchedtitle').html(lang[flags.pref.lang].schedule.tabtitle);
    $('#pgeSchedtitle').html(lang[flags.pref.lang].schedule.pagetitle);
    $('.schedInfolbl').html(lang[flags.pref.lang].schedule.schedInfoTitle);
    var newTbl = '<table class="table table-sm pageResize nowrap" id="scheduleTbl" collspacing="0" width="100%">';
    newTbl += '<thead><tr>';
    newTbl += lang[flags.pref.lang].schedule.columns.map(item => '<th>' + item + '</th>').join('');
    newTbl += '</tr></thead><tbody></tbody></table>';
    // $('#schedule-tab > div.tbl-container > div.table-responsive').html(newTbl);
    $('#schedule-content .table-responsive').html(newTbl)

    $('#schedule-tab .inner-sidepanel > .inner-content > .inner-body').find('label').each(function(index) {
        $(this).html(lang[flags.pref.lang].schedule["schedinfo-col"][index]);
    });
    $('#qrSchedModal .modal-body').find('label').each(function(index) {
        $(this).html(lang[flags.pref.lang].schedule["schedinfo-col"][index]);
    });

    if (flags.schedule.isGraphMode) {
        $('#sched-show-data-btn .showdatalbl').html(lang[flags.pref.lang].general.showdatalbl);
    } else {
        $('#sched-show-data-btn .showdatalbl').html(lang[flags.pref.lang].general.showchartlbl);
    }
    $('#sched-prev-btn').html('<i class="fa fa-arrow-left"></i>&nbsp;' + lang[flags.pref.lang].timechart.prev);
    $('#sched-next-btn').html(lang[flags.pref.lang].timechart.next + '&nbsp;<i class="fa fa-arrow-right"></i>');
}

function translateTimechart() {
    if(!$.isEmptyObject(timechart)) {
        timechart.data[1].set("legendText", lang[flags.pref.lang].timechart.legends['Productive'], false);
        timechart.data[2].set("legendText", lang[flags.pref.lang].timechart.legends['Unproductive']);
    }
    if($('#chart-btn').hasClass('active')) {
        $('#chart-btn').html('<i class="fa fa-arrow-left text-light"></i><label class="m-0">&nbsp;' + lang[flags.pref.lang].timechart.return + '</label>');
    } else {
        $('#chart-btn').html('<i class="fa fa-bar-chart"></i><label class="m-0">&nbsp;' + lang[flags.pref.lang].timechart.pagetitle + '</label>');
    } 
}

function translateSystem() {
    $('#sideBtnContainer > div').find('button').each(function(i) {
        $(this.firstElementChild).text(lang[flags.pref.lang].system.routename[i]);
    });
    $('#tabSystemtitle').html(lang[flags.pref.lang].system.tabtitle);
    $('#date-tab .page-subheader > div > span > span').html(lang[flags.pref.lang].system.pagetitle);
    if (flags.currPage == 'date-tab') {
        var simulatedClick = $('#sideBtnContainer > div').find('button');
        $(simulatedClick[flags.system.pageIndex - 1]).click();
    } else {
        if (flags.system.pageIndex <= 1) {
            $('#systemBtn-1').html(lang[flags.pref.lang].system.buttons.sync);
            $('#systemBtn-2').html(lang[flags.pref.lang].system.buttons.save);
        }
    }
    $('#causeReg-1 > div:nth-child(1) > span:nth-child(2), #causeReg-2 > div:nth-child(1) > span:nth-child(2)').html(lang[flags.pref.lang].system.buttons.num);
    $('#causeReg-1 > div:nth-child(1) > span:nth-child(3), #causeReg-2 > div:nth-child(1) > span:nth-child(3)').html(lang[flags.pref.lang].system.buttons.cause);
    $('#alarmlbl').html(lang[flags.pref.lang].system.causereg.alarm)
    $('#alarmpulse').html(lang[flags.pref.lang].system.causereg.alarmpulse)
    $('#addUserMngmtModal .modal-body .row > div:first-child label').each(function (i) {
        $(this).html(lang[flags.pref.lang].system.usermngmt.adduser[i]);
    });
    $('#dnt-config-page').find('label').each(function(i) {
        $(this).html(lang[flags.pref.lang].system.datetime[i]);
    });
    $('#net-config-page').find('label').each(function(i) {
        $(this).html(lang[flags.pref.lang].system.network[i]);
    });
    var newTbl = '<table class="table table-sm dt-responsive wrap text-center" id="usrMngmt" collspacing="0" width="100%">';
    newTbl += '<thead><tr>';
    newTbl += '<th class="all"><input class="checkBtn-user-master" type="checkbox" hidden/></th>';
    newTbl += '<th class="all">' + lang[flags.pref.lang].system.usermngmt.columns[0] + '</th>';
    newTbl += '<th class="all">' + lang[flags.pref.lang].system.usermngmt.columns[1] + '</th>';
    newTbl += '<th width="40%" class="small-desktop">' + lang[flags.pref.lang].system.usermngmt.columns[2] + '</th>';
    newTbl += '</tr></thead><tbody></tbody></table>';
    $('#usr-config-page').html(newTbl);
    userPermissions = {
        'perm_1': lang[flags.pref.lang].system.usermngmt.permission[0],
        'perm_2': lang[flags.pref.lang].system.usermngmt.permission[1],
        'perm_3': lang[flags.pref.lang].system.usermngmt.permission[2],
        'perm_4': lang[flags.pref.lang].system.usermngmt.permission[3],
        'perm_5': lang[flags.pref.lang].system.usermngmt.permission[4],
    };
    $('#addUserMngmtModal .modal-title .addnewuser').html(lang[flags.pref.lang].system.usermngmt.modal.title);
    $('#causeReg-prev').html('<i class="fa fa-angle-left"></i>&nbsp;' + lang[flags.pref.lang].timechart.prev);
    $('#causeReg-next').html(lang[flags.pref.lang].timechart.next + '&nbsp;<i class="fa fa-angle-right"></i>');
    $('#activeDevModal label.title').html(lang[flags.pref.lang].system.devicelist.activedevtitle);
    $('#activeDevModal .modal-body > h6').html(lang[flags.pref.lang].system.devicelist.devicesub);
    $('#activeDevModal button.deletelbl').html(lang[flags.pref.lang].system.devicelist.delete);
    $('#activeDevModal button.cancellbl').html(lang[flags.pref.lang].system.buttons.cancel);
    $('#activeDevModal div.activeStatus > label').html(lang[flags.pref.lang].system.devicelist.activedevfooter);
    $('#dbmemlbl').html(lang[flags.pref.lang].system.datamgmnt.dbmem);
    $('#diskmemlbl').html(lang[flags.pref.lang].system.datamgmnt.diskmem);
    $('#selDBModelbl').html(lang[flags.pref.lang].system.datamgmnt.dboption);
    $('#dbmdatelbl').html(lang[flags.pref.lang].system.datamgmnt.date);
    $('#selDBMode').find('option').each(function (index) {
        $(this).html(lang[flags.pref.lang].system.datamgmnt.options[index]);
    });
}

function translateDetailedLog() {
    $('#tabDetailTitle').html(lang[flags.pref.lang].detailedlogs.tabtitle);
    $('#detail-title').html(lang[flags.pref.lang].detailedlogs.pagetitle);
    const detailShowDataBtnLabel = $('#detail-show-data-btn > span');
    const detailShowDataBtnIcon = $('#detail-show-data-btn > i');
    if (flags.detailedlog.isGraphMode) {
        detailShowDataBtnLabel.html(lang[flags.pref.lang].general.showdatalbl);
        detailShowDataBtnIcon.addClass('fa-table');
        detailShowDataBtnIcon.removeClass('fa-chart-bar');
    } else {
        detailShowDataBtnLabel.html(lang[flags.pref.lang].general.showchartlbl);
        detailShowDataBtnIcon.removeClass('fa-table');
        detailShowDataBtnIcon.addClass('fa-chart-bar');
    }
    // if($('#detail-show-data-btn').hasClass('active')) {
    //     $('#detail-show-data-btn > label').html('test-active');//'<i class="fas fa-table text-success"></i><label class="m-0">&nbsp;<span class="showdatalbl">&nbsp;' + lang[flags.pref.lang].timechart.return + '</span></label>');
    //     $('#detail-show-data-btn > i').addClass('fa-chart-bar');
    // } else {
    //     $('#detail-show-data-btn > label').html('test-inactive');//'<i class="fa fa-bar-chart"></i><label class="m-0">&nbsp;' + lang[flags.pref.lang].timechart.pagetitle + '</label>');
    //     $('#detail-show-data-btn > i').addClass('fa-table');
    // }
    // $('#chart-btn').html('<i class="fa fa-bar-chart"></i><label class="m-0">&nbsp;' + lang[flags.pref.lang].timechart.pagetitle + '</label>');
    $('#switch-productivity-data-btn').html('<i class="fas fa-sync text-success"></i><label class="m-0">&nbsp;<span class="showlbl">' + lang[flags.pref.lang].detailedlogs.switchprod +'</span></label>');
    $('.graphlbl').html(lang[flags.pref.lang].general.graphlbl);
    $('.loginfo-header > label').html(lang[flags.pref.lang].unproductive.modal.title);
    var newTbl = '<table class="table table-sm pageResize nowrap" id="unproductiveTbl" collspacing="0" width="100%">';
    newTbl += '<thead><tr>';
    newTbl += lang[flags.pref.lang].unproductive.columns.map(item => '<th>' + item + '</th>').join('');
    newTbl += '</tr></thead><tbody></tbody></table>';
    // $('#detail-tab > div.tbl-container > div.table-responsive').html(newTbl);
    // $('#unproductiveTbl').html(newTbl);
    $('#detail-table-content .table-responsive').html(newTbl);
    // $('#detail-tab .inner-sidepanel > .inner-content > .inner-body').find('label').each(function(index) {
    //     $(this).html(lang[flags.pref.lang].unproductive.modal.labels[index]);
    // });
    $('#detail-tab .inner-sidepanel > .inner-content > .inner-body').find('label').each(function(index) {
        $(this).html(lang[flags.pref.lang].unproductive.modal.labels[index]);
    });
   $('#unprodChr').html(lang[flags.pref.lang].unproductive.chars + ': ' + $('#unprodRem').val().length + '/200');
    // initDowntimeTable();
}

function translateCluster() {
    $('#tabClustertitle').html(lang[flags.pref.lang].cluster.tabtitle);
    $('#pgeClustertitle').html(lang[flags.pref.lang].cluster.pagetitle);
    // Page 1
    $('#viewClusterBtn').html(lang[flags.pref.lang].cluster.viewCluster.title);
    $('#viewClusterTab').find('.config-tab-header > label').eq(0).html(lang[flags.pref.lang].cluster.viewCluster.header);
    $('.infolbl').html(lang[flags.pref.lang].general.infolbl);
    $('#viewClusterTab .config-sub-pane > .config-tab-body').find('p').each(function(index) {
        $(this).html(lang[flags.pref.lang].cluster.viewCluster.info[index]);
    });
    $('#editCluster .modal-title > span').html(lang[flags.pref.lang].cluster.editModal.title);
    $('#editCluster .modal-body > h6').html(lang[flags.pref.lang].cluster.editModal.subtitle);
    $('#editCluster').find('.editCluster-label').each(function(index) {
        $(this).html(lang[flags.pref.lang].cluster.editModal.labels[index]);
    });
    $('#scanBSBtn > span').html(lang[flags.pref.lang].cluster.viewCluster.scan);
    $('#editCluster .charCnt').html(lang[flags.pref.lang].cluster.editModal.chars);
    $('#scanBSModal .scanlbl').html(lang[flags.pref.lang].cluster.scanbs.title);
    $('#scanBSModal .modal-body > h6').html(lang[flags.pref.lang].cluster.scanbs.subtitle);
    $('#scanBSModal .rescanlbl').html(lang[flags.pref.lang].cluster.scanbs.rescan);
    $('#scanDevModal label.title').html(lang[flags.pref.lang].cluster.scandev.title);
    $('#scanDevModal .modal-body > h6').html(lang[flags.pref.lang].cluster.scandev.subtitle);
    $('#defHostEn').html(lang[flags.pref.lang].general.enable);
    $('#scanDevModal button.startlbl').html(lang[flags.pref.lang].cluster.scandev.start);
    $('#scanDevModal div.scanStatus > label').html(lang[flags.pref.lang].cluster.scandev.footer);
    $('button.contlbl').html(lang[flags.pref.lang].general.contbutton);
    // Page 2
    $('#viewDevicesBtn').html(lang[flags.pref.lang].cluster.viewDevices.title);
    var newTbl = '<table class="table table-sm nowrap" id="devPerClusterTbl" collspacing="0" width="100%">';
    newTbl += '<thead><tr>';
    newTbl += lang[flags.pref.lang].cluster.viewDevices.columns.map(item => `<th>${item}</th>`).join('');
    newTbl += '</tr></thead><tbody></tbody></table>';
    $('#viewDevicesTab div.config-tab-body div.table-responsive').html(newTbl);
    $('#viewDevicesTab').find('.config-tab-header > label').eq(0).html(lang[flags.pref.lang].cluster.viewDevices.header);
    $('#viewDevicesTab .config-sub-pane > .config-tab-body').find('p').each(function(index) {
        $(this).html(lang[flags.pref.lang].cluster.viewDevices.info[index]);
    });
    $('#removeDevModal label.title').html(lang[flags.pref.lang].cluster.removedev.title);
    $('#removeDevModal .modal-body > h6').html(lang[flags.pref.lang].cluster.removedev.subtitle);
    $('#removeDevModal button.refreshlbl').html(lang[flags.pref.lang].cluster.removedev.refresh);
    $('#removeDevModal div.removeStatus > label').html(lang[flags.pref.lang].cluster.removedev.footer);
    // Page 3
    $('#mngDevicesBtn').html(lang[flags.pref.lang].cluster.manageDevices.title);
    $('#mngDevicesTab').find('.config-tab-header > label').eq(0).html(lang[flags.pref.lang].cluster.manageDevices.header);
    $('#mngDevicesTab').find('.config-tab-body > div > div > label').eq(0).html(lang[flags.pref.lang].cluster.manageDevices.subheader);
    $('#mngDevicesTab .config-sub-pane > .config-tab-body').find('p').each(function(index) {
        $(this).html(lang[flags.pref.lang].cluster.manageDevices.info[index]);
    });
    $('#reorderMode').find('option').each(function (index) {
        $(this).html(lang[flags.pref.lang].cluster.manageDevices.reorder.options[index]);
    });
}

function translateUpdate() {
    $('#tabUpdatetitle').html(lang[flags.pref.lang].update.tabtitle);
    $('#pgeUpdatetitle').html(lang[flags.pref.lang].update.pagetitle);
    $('#sofware-last-update').html(lang[flags.pref.lang].update.update + ": ");
}

function translateProductivity() {
    $('#tabVisualizationtitle').html(lang[flags.pref.lang].productivity.tabtitle);
    $('#productivity-title').html(lang[flags.pref.lang].productivity.pagetitle);
    let newTbl = '<table class="table table-sm pageResize nowrap" id="productivityTbl" collspacing="0" width="100%">'
    newTbl += '<thead><tr>';
    newTbl += lang[flags.pref.lang].productivity.columns.map(item => '<th>' + item + '</th>').join('');
    newTbl += '</tr></thead><tbody></tbody></table>';

    $('#visual-page .table-responsive').html(newTbl);
    
    initProductivityTable();

    $('#overviewlbl').html(lang[flags.pref.lang].productivity.view[0]);
    $('#goodqtylbl').html(lang[flags.pref.lang].productivity.view[1]);
    $('#cycletimelbl').html(lang[flags.pref.lang].productivity.view[2]);

    $('#hrlbl').html(lang[flags.pref.lang].productivity.inthour);
    $('#minutelbl').html(lang[flags.pref.lang].productivity.intmin);
    $('.interval-label').html(lang[flags.pref.lang].productivity.interval);
    if (flags.pref.lang === 'en') {
        $('.interval-label').removeClass('jp-md').addClass('en');
    } else {
        $('.interval-label').removeClass('en').addClass('jp-md');
    }

    if (flags.productivity.isGraphMode) {
        $('#productivity-show-data-btn span').html(lang[flags.pref.lang].general.showdatalbl);
    } else {
        $('#productivity-show-data-btn span').html(lang[flags.pref.lang].general.showchartlbl);
    }
    // console.log($('#visual-show-data-btn .showlbl'));

    if (visualObjects.chart !== '') {
        if (visualObjects.cachedData.productive[0] !== undefined) {
            const firstTimestamp = visualObjects.cachedData.productive[0].timestamp;
            const lastTimestamp = visualObjects.cachedData.joEnd;
            console.log(visualObjects.chart);
            //  console.log(visualObjects);
            visualObjects.chart.options.axisX[1].title = `${lang[flags.pref.lang].productivity.jotime}, ${lang[flags.pref.lang].productivity[visualObjects.intervalType]} ( ${lang[flags.pref.lang].productivity.joStartTime}: ${firstTimestamp}, ${lang[flags.pref.lang].productivity.joEndTime}:`;
            if (visualObjects.cachedData.onGoingJob) {
                visualObjects.chart.options.axisX[1].title += ` ${lang[flags.pref.lang].productivity.ongoing}, ${lang[flags.pref.lang].general.lastUpdate}: ${visualObjects.cachedData.lastUpdate} )`;
                $('#visual-refresh-btn').prop('disabled', false);
            } else {
                visualObjects.chart.options.axisX[1].title += ` ${lastTimestamp})`;
                $('#visual-refresh-btn').prop('disabled', true);
            }
            const legendsArray = Object.values(lang[flags.pref.lang].productivity.legends);
            visualObjects.chart.options.data.forEach((d) => {
                if (d.extraIndex !== undefined) {
                    const newLegendText = legendsArray[d.extraIndex];
                    d.legendText = newLegendText;
                }
            });

            const axisYTitleArray = lang[flags.pref.lang].productivity.ytitle;
            let newAxisYTitle = '';
            switch (visualObjects.graphType) {
                case 'Overview':
                    newAxisYTitle = axisYTitleArray[0];
                    break;
                case 'GoodQty':
                    newAxisYTitle = axisYTitleArray[1];
                    break;
                case 'CycleTime':
                    newAxisYTitle = axisYTitleArray[2];
                    break;
            }
            visualObjects.chart.options.axisY.title = newAxisYTitle;
        }
    }
}

function translateAbout() {
    $('#about-title').html(lang[flags.pref.lang].about.title);
    $('#companyName').html(lang[flags.pref.lang].general.companyname);
    $('#about-ip-label').html(lang[flags.pref.lang].about.ip + ': ');
}


function newTranslations() {
    $('.dash-paging label').html(`<label>${lang[flags.pref.lang].dashboard.page} ` + flags.dashboard.currPage + ' of ' + flags.dashboard.pageLimit + '</label>');
    $('.last-update label').html('<span>' + lang[flags.pref.lang].general.lastUpdate + '</span>: ' + getDateTimeNow('-').dnt);
    $('#software-update-btn').html(lang[flags.pref.lang].update.buttons.checkupdate);
    $('#dl-update-btn').html(lang[flags.pref.lang].update.buttons.dlupdate);
    $('#addUserMngmtModal .modal-body').find('input.accntInput').each(function(i) {
    $(this).attr('placeholder', lang[flags.pref.lang].system.usermngmt.adduserph[i]);
        if (i == 2) {
            $(this).attr('title', lang[flags.pref.lang].system.usermngmt.adduserph[i]);
        }
    });
    $('#addUserMngmtModal .modal-body').find('label.form-check-label').each(function(i) {
        $(this).html(lang[flags.pref.lang].general.enable);
    });

    if (joTimeChart !== undefined && joTimeChart.renderTimechart !== undefined) {
        joTimeChart.renderTimechart(joTimeChart.objlink, joTimeChart.divisor);
    }
}
