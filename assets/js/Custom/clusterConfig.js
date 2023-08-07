var draggableFields = { 
	'fromAnotherList': false, 
	'sourceUL': null, 
	'isCancelled': false 
};

var bsTempList = [], clusterTempList = [], deviceTempList = [];
var currCluster = [];
var currClusterId = 0;

var sortables, draggedItem, dragDeleteItem, dragOptions;

var autoScan = false, doneESPconfig = false;

var clusterToDelete = '';

var clusterArray = {};

function initClusterTbl() {
	if(!$.isEmptyObject(flags.config.table)) {
		return;
	}

	flags.config.table = $('#devPerClusterTbl').DataTable({
  		// "dom": 'tip',
  		"dom": 't',
  		"language": {
		    "paginate": {
		      "previous": lang[flags.pref.lang].general.datatable.prev,
		      "next": lang[flags.pref.lang].general.datatable.next,
		    },
		    "info": lang[flags.pref.lang].general.datatable.info,
		    "emptyTable": lang[flags.pref.lang].general.datatable.empty,
		    "infoEmpty": lang[flags.pref.lang].general.datatable.infoempty,
		},
		"columnDefs": [
	    	{ type: 'natural', targets: [0, 1, 2] },
	    	{ targets: 1, orderData: [0, 1] },
	    	{ targets: 2, orderData: [0, 2] }
	  	],
	  	columns: [
	  		{ data: 'name' },
	  		{ data: 'type',
				 render: function(data) {
					 return typeof lang[flags.pref.lang].devicetype[data] !== 'undefined' ? lang[flags.pref.lang].devicetype[data] : data;
				 }
			},
	  		{ data: 'node' },
	  		{ data: 'stat',
				 render: function(data) {
					 return data == 'Active' ? lang[flags.pref.lang].cluster.viewDevices.active : lang[flags.pref.lang].cluster.viewDevices.inactive;
				 }
			},
	  		{ data: null,
	  			render: function(data, type, row) {
	  				form = "<button type='btn' class='btn btn-sm btn-dark edit-btn' ";
					form += `onclick='showRenameModal("${data.id}","${data.name}","device")'`;
					form += "><i class='fa fa-edit'></i>&nbsp;" + lang[flags.pref.lang].general.editlbl + "</button>";
					return form;
	  			}
	  		}
	  	],
	  	"destroy": true,
	  	"scrollY": "50vh",
		"scrollX": true,
		"scrollCollapse": true,
	});
}

function showClusterEditModal(dataIndex) {
	// flags.config.clusterOnEdit = clusterId;
	/**get device list */
	var clusterId = clusterTempList[dataIndex].id;
	deviceClusterQuery(clusterId).then(function(value) {
		console.log(value);	
		currClusterId = dataIndex;
		currCluster.push(clusterTempList[dataIndex]);
		/**set form modal values */
		var name = '', ssid = '';
		$('#editCluster').find('.editCluster-input .form-control').each(function(idx) {
			switch(idx) {
				case 0:
					name = clusterTempList[dataIndex].cluster;
					$(this).val(name).attr('readonly', name == 'DEFAULT' ? true : false).attr('title', name == 'DEFAULT' ? lang[flags.pref.lang].cluster.editModal.tooltip : '').attr('data-id', clusterTempList[dataIndex].id);
					break;

				case 1:
					ssid = clusterTempList[dataIndex].ssid == '' ? '--' : clusterTempList[dataIndex].ssid;
					if (name == 'DEFAULT') {
						$(this).val(ssid).attr('readonly', true).attr('title', lang[flags.pref.lang].cluster.editModal.tooltip);
					} else {
						$(this).val(ssid).attr('readonly', ssid == '--' ? true : false).attr('title', '');
					}
					break;

				case 2:
					var pass = clusterTempList[dataIndex].pass == '--' ? '' : clusterTempList[dataIndex].pass;
					if (name == 'DEFAULT') {
						$(this).val(pass).attr('readonly', true).attr('title', lang[flags.pref.lang].cluster.editModal.tooltip);
					} else {
						$(this).val(pass).attr('readonly', ssid == '--' ? true : false).attr('title', ssid == '--' ? "No available Access point" : "Must have 8-45 characters, cannot start and end with special character");
					}
					break;

				case 3:
					var ip = clusterTempList[dataIndex].ip;
					subnet = ip.split('.');
					$(this).val(ip + " (" + (subnet[0] == '10' ? 'WIFI' : 'LAN') + ")");
					$(this).attr('readonly', true).attr('title', "This is not editable for now");

					// if (name == 'DEFAULT') {
					// 	$(this).attr('readonly', true).attr('title', "This is not editable for Main Server");
					// } else {
					// 	$(this).attr('readonly', false).attr('title', '');
					// }
					break;

				case 4:
					var mac = clusterTempList[dataIndex].mac.replace(/(.{2})/g, '$1:');
					$(this).val(mac.substring(0, mac.length - 1));
					break;

				case 5:
					var desc = clusterTempList[dataIndex].desc == '--' ? '' : clusterTempList[dataIndex].desc;
					$(this).val(desc);
					$('#clusDescChar').html(desc.length);
					break;
			}
			$('#bssidBtn').prop('checked', clusterTempList[dataIndex].bsid == "0" ? false : true).attr('disabled', name == 'DEFAULT' ? true : false);
		});
		/**disable save button when there's a connected device */
		if (deviceTempList.length > 0) {
			$('#editCluster .savelbl').prop('disabled',true);
		} else {
			$('#editCluster .savelbl').prop('disabled',false);
		}
		$('#editCluster').modal('show');
	});
	/**check for inactive device 
	inactive_exist = false;
	for (item in deviceTempList) {
		if (deviceTempList[item].stat == 'Inactive') {
			inactive_exist = true;
			break;
		}
	}*/
	/**disable save when there's an inactive device 
	if (inactive_exist) {
		// disable save button
		$('#editCluster .savelbl').prop('disabled',true);
	} else {
		// enable save button
		$('#editCluster .savelbl').prop('disabled',false);
	}*/
}

function clusterViewOnly() {
	var str = "";
	console.log ("Clusterview is called");
	$.ajax({
		type: 'POST',
		url: 'php/config/clusterViewOnly.php',
		data: "",
		dataType:'json',
		async: true,
		success: function(retData) {
			// * Check if data is empty * //
			var cardHtml = '';

			if(!$.isEmptyObject(retData)) {
				for(var i = 0; i < retData.length; i++) {
					cardHtml += `<div class="cardio" id="cardIO-${i}'_">`;
	                // <!-- Start: card-head -->
	                cardHtml += '<div class="cardio-header">';
	                // <!-- Start: card-title -->
                    cardHtml += `<div class="cardio-title"><div class="row no-gutters">
                            <div class="col"><label class="col-form-label text-truncate">${retData[i].cluster}</label>
                        </div>
                        <div class="col text-right">
                        <button class="btn btn-outline-primary btn-sm border rounded editCluster-btn" type="button" style="padding: 0px;" onclick="showClusterEditModal(${i})">
                            <i class="fa fa-edit fa-sm" style="padding: 0px;" data-toggle="tooltip" data-placement="left" title="${lang[flags.pref.lang].cluster.viewCluster.tooltip}"></i>
                        </button>
                        <button class="btn btn-outline-primary btn-sm border rounded editCluster-btn" type="button" style="padding: 0px;" onclick="deleteCluster(${i},'${retData[i].cluster}')" ${i == 0 ? 'disabled' : ''}>
                            <i class="fa fa-trash fa-sm" style="padding: 0px;" data-toggle="tooltip" data-placement="left" title="${lang[flags.pref.lang].cluster.viewCluster.remove}"></i>
                        </button>
	                	</div></div></div>`;
	                // <!-- End: card-title -->
	                // <!-- Start: card-name -->
	                cardHtml += `<div class="cardio-details"><label class="text-truncate">${retData[i].ssid} (SSID)</label>`;
	                cardHtml += `<p class="text-left">${lang[flags.pref.lang].cluster.viewCluster.cards.bssid}:&nbsp;<i class="fa `;
	                if(retData[i].bsid == "1") {
				    	cardHtml += 'fa-check text-success';
				    } else {
				    	cardHtml += 'fa-times text-danger';
				    }
	                cardHtml += '"></i></p>';
	                cardHtml += `<p class="text-left">${lang[flags.pref.lang].cluster.viewCluster.cards.ipaddr}: ${retData[i].ip}</p>`;
	                cardHtml += `<p class="text-left">${lang[flags.pref.lang].cluster.viewCluster.cards.devnum}: ${retData[i].devices}</p>`;
	                cardHtml += '</div>';
	                // <!-- End: card-name -->
	                cardHtml += '</div>';
	                // <!-- End: card-head -->
	                // <!-- Start: card-body -->
	                // cardHtml += `<div class="cardio-body"><button class="btn btn-dark btn-sm" style="left: 15px;" type="button" ${i == 0 ? 'disabled' : '' } onclick="devClusterViewQuery(null, '${retData[i].id}')">${lang[flags.pref.lang].cluster.viewDevices.title}</button><button class="btn btn-dark btn-sm" style="right: 15px;" type="button" ${i == 0 ? 'disabled' : ''} onclick="findInputDevices('show', ${retData[i].id}, '${retData[i].cluster}', '${retData[i].mac}')"><i class="fa fa-search-plus"></i></button></div>`;
                    cardHtml += `<div class="cardio-body">
                        <button class="btn btn-dark btn-sm" style="left: 15px;" type="button" onclick="devClusterViewQuery(null, '${retData[i].id}')">
                            ${lang[flags.pref.lang].cluster.viewDevices.title}
                        </button>
                        <button class="btn btn-dark btn-sm" style="right: 15px;" type="button" onclick="addDeviceModal('show', ${retData[i].id}, '${retData[i].cluster}', '${retData[i].mac}')">
                            <i class="fa fa-search-plus"></i>
                        </button>
                    </div>`;
					// <!-- End: card-body -->
	                cardHtml += '</div>';
				}
			}
			clusterTempList = retData;
			$('#viewClusterTab .content').html(cardHtml);
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

function addCluster() {
	var ip = parseInt($('#addClusterIp1').val()) + "." + parseInt($('#addClusterIp2').val());
		ip += "." + parseInt($('#addClusterIp3').val()) + "." + parseInt($('#addClusterIp4').val());
	var nm = $('#addClusterNm').val();
	var mc = $('#addClusterMc').val();
	var ssid = $('#addClusterSSID').val();
	var pass = $('#addClusterPW').val();
	var bssid = $('#addClusterBssid').prop('checked') ? 1 : 0;
	var dsc = $('#addClusterDesc').val();

	result = mc.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
	if(result == null || result == '') {
        showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.mac, "Error");
		return;
	}

	$.ajax({
		type: 'POST',
		url: 'php/config/addCluster.php',
		data: { 
			ipaddr: ip, 
			macaddr: mc, 
			name: nm,
			ssid: ssid,
			pass: pass,
			bsid: bssid,
			desc: dsc 
		},
		dataType:'json',
		async: true,
		success: function(retData) {
			// * Check if data is empty * //
			if(retData == 'success') {
                showPrompt(lang[flags.pref.lang].cluster.viewCluster.cluster.addok, "Success");
				$('#tab-1-btn-2').click();
			} else {
                showPrompt(lang[flags.pref.lang].cluster.viewCluster.cluster.addfail, "Failed");
			}
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

function updateClusterInfo() {
	var ip = parseInt($('#editClusterIp1').val()) + "." + parseInt($('#editClusterIp2').val());
		ip += "." + parseInt($('#editClusterIp3').val()) + "." + parseInt($('#editClusterIp4').val());
	var id = $('#selClusterNm').val();
	var nm = $('#renameCluster').prop('hidden') ? $('#selClusterNm option:selected').text() : $('#renameCl').val();
	var mc = $('#editClusterMc').val();
	var ssid = $('#editClusterSSID').val();
	var pass = $('#editClusterPW').val();
	var bssid = $('#editClusterBssid').prop('checked') ? "1" : "0";
	var dsc = $('#editClusterDesc').val();

	if(nm == null || nm == undefined || nm == "") {
        showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.name, "Error");
		return;
	}

	if(ssid == "--" || ssid == "" || ssid == null) {
        showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.ssid, "Error");
		return;
	}

	if(pass == "--" || pass == "" || pass == null) {
        showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.pass, "Error");
		return;
	}

	if(ip.indexOf('NaN') >= 0) {
        showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.ip, "Error");
		return;
	}

	result = mc.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
	if(result == null || result == '') {
        showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.mac, "Error");
		return;
	}

	$.ajax({
		type: 'POST',
		url: 'php/config/updateCluster.php',
		data: { 
			ipaddr: ip, 
			macaddr: mc,
			id: id,
			name: nm,
			ssid: ssid,
			pass: pass,
			bsid: bssid,
			desc: dsc 
		},
		dataType:'json',
		async: true,
		success: function(retData) {
			// * Check if data is empty * //
			if(retData == 'success') {
                showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.editok, "Success");
				$('#tab-1-btn-2').click();
			} else {
                showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.editfail, "Failed");
			}
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

function loadClusters(elemId) {
	// var val = $('#viewDevicesTab select').val();
	var val = '1';
	$.ajax({
		type: 'POST',
		url: 'php/config/loadCluster.php',
		data: {},
		dataType:'json',
		async: true,
		success: function(retData) {
			// * Check if data is empty * //
			if(retData.length != 0) {
                var selection = `<option disabled selected hidden value=''>${lang[flags.pref.lang].cluster.viewDevices.none}</option>`;

				for(var i = 0; i < retData.length; i++) {
                    // if (retData[i].cluster == 'DEFAULT CLUSTER') continue;
					selection += '<option value="' + retData[i].id + '">';
					selection += retData[i].cluster; 
					selection += '</option>';
				}

				$(elemId).html(selection);

				if (!(val == null || val == '')) {
					$('#deleteDeviceBtn').attr('disabled', false);
					$(elemId).val(val);
					devClusterViewQuery(elemId, null);
				}
			}
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

function loadClusterInformation() {
	var selected = $('#selClusterNm').val();
	if(selected == null) {
		return;
	}

	$.ajax({
		type: 'POST',
		url: 'php/config/loadClusterInfo.php',
		data: { id: selected },
		dataType:'json',
		async: true,
		success: function(retData) {
			// * Check if data is empty * //
			if(!(retData === null)) {
				if(retData.ip != '--') {
					var ip = retData.ip.split(".");
					$('#editClusterIp1').val(ip[0]);
					$('#editClusterIp2').val(ip[1]);
					$('#editClusterIp3').val(ip[2]);
					$('#editClusterIp4').val(ip[3]);
				} else {
					$('#editClusterIp1').val("");
					$('#editClusterIp2').val("");
					$('#editClusterIp3').val("");
					$('#editClusterIp4').val("");
				}
				$('#editClusterSSID').val(retData.ssid);
				$('#editClusterPW').val(retData.pass == '--' ? "" : retData.pass);
				$('#editClusterBssid').prop('checked', (retData.bsid == "1" ? true : false));
				$('#editClusterMc').val(retData.mac);
				$('#editClusterDesc').val(retData.desc);

				// if($('#selClusterNm option:selected').text() == "DEFAULT CLUSTER") {
				// 	$('#editClusterBtn').attr('disabled', 'disabled');
				// } else {
				$('#editClusterBtn').removeAttr('disabled');
				// }
			}
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

function loadDeviceInfo(id) {
	$.ajax({
		type: 'POST',
		url: 'php/config/loadDeviceInfo.php',
		data: { id: id },
		dataType:'json',
		async: true,
		success: function(retData) {
			// * Check if data is empty * //
			if(retData.length != 0) {
				$('#devdetail1').val(retData.cluster);
				$('#devdetail2').val(retData.type);
				$('#devdetail3').val(retData.status);
				$('#remMngDevice').prop('disabled', false);
			}
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

function clearClusterInfo() {
	$('#editClusterIp1').val("");
	$('#editClusterIp2').val("");
	$('#editClusterIp3').val("");
	$('#editClusterIp4').val("");
	$('#editClusterSSID').val("");
	$('#editClusterPW').val("");
	$('#editClusterBssid').prop('checked', false);
	$('#editClusterMc').val("");
	$('#editClusterDesc').val("");
	$('#editClusterBtn').attr('disabled', 'disabled');
}

function clearAddCluster() {
	$('#addClusterNm').val("");
	$('#addClusterSSID').val("");
	$('#addClusterPW').val("");
	$('#addClusterBssid').prop('checked', false);
	$('#addClusterIp1').val("");
	$('#addClusterIp2').val("");
	$('#addClusterIp3').val("");
	$('#addClusterIp4').val("");
	$('#addClusterMc').val("");
	$('#addClusterDesc').val("");
}

function devClusterViewQuery(elemId, overrideId) {
	var clusterId = $(elemId).val();
	var redirect = false;
	deviceTempList = [];

	if($.isEmptyObject(flags.config.table)) {
		initClusterTbl();
	}

	if(overrideId != null) {
		clusterId = overrideId;
		redirect = true;
		$('#viewDevicesTab select').val(clusterId);
	}

	if(clusterId == null) {
		return;
	}

	$.ajax({
		type: 'POST',
		url: 'php/config/deviceClusters.php',
		data: { id: clusterId },
		dataType:'json',
		async: true,
		success: function(retData) {
			// * Check if data is empty * //
			if(!$.isEmptyObject(retData)) {
				$('#deleteDeviceBtn').attr('disabled', false);
				if(redirect) {
					$('#viewDevicesBtn').click();
					setTimeout(function() {
						flags.config.table.clear().rows.add(retData).columns.adjust().draw(false);
					}, 500);
				} else {
					flags.config.table.clear().rows.add(retData).columns.adjust().draw(false);
				}
			} else {
				if(redirect) {
					$('#viewDevicesBtn').click();
					setTimeout(function() {
						flags.config.table.clear().draw(false);
					}, 500);
				} else {
					flags.config.table.clear().draw(false);
				}
			}
			deviceTempList = retData;
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

function deviceClusterQuery(clusterId) {
	deviceTempList = [];
	return new Promise(function(resolve) {
		$.ajax({
			type: 'POST',
			url: 'php/config/deviceClusters.php',
			data: { id: clusterId },
			dataType:'json',
			async: true,
			success: function(retData) {
				deviceTempList = retData;
				resolve('success');
			},
			fail: function(errThrown) {
				console.log('Failed: ' + errThrown);
				deviceTempList = [];
				resolve('failed');
			}
		});
	});
}

function loadDevices() {
	$.ajax({
		type: 'POST',
		url: 'php/jogetdevices.php',
		data: {},
		dataType:'json',
		async: true,
		success: function(retData) {
			// * Check if data is empty * //
			if(retData.length != 0) {
				var selection = "";
				for(var i = 0; i < retData.length; i++) {
                    if (retData[i].devnme == 'DEFAULT CLUSTER') continue;
					selection += '<option value="' + retData[i].devdid + '">';
					selection += (retData[i].devnme == null ? "Device " + retData[i].devdid : retData[i].devnme); 
					selection += '</option>';
				}
				$('#selDevName').html(selection).val(-1);
			}
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

function deleteCluster(id, name) {
	clusterToDelete = id + 1;
    showWarning(`${lang[flags.pref.lang].cluster.viewCluster.cluster.remove} ${name}?`, 'remCluster');
}

function executeDeleteCluster () {
	$.ajax({
		type: 'POST',
		url: 'php/config/deleteCluster.php',
		data: { cid: clusterToDelete },
		dataType:'json',
		async: true,
		success: function(retData) {
			// * Check if data is empty * //
			if(retData == 'success') {
                showPrompt(lang[flags.pref.lang].cluster.viewCluster.cluster.delok, "Success");
				clusterViewOnly();
			} else {
                showPrompt(lang[flags.pref.lang].cluster.viewCluster.cluster.delfail, "Failed");
			}
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

function generateDeviceOrder() {
	dragDeleteItem = '';

	$.ajax({
		type: 'POST',
		url: 'php/config/getDeviceOrder.php',
		dataType: 'json',
		data: '',
		async: true,
		success: function(data) {
			/** create the framework first **/
			var id = '', str = '', legend = '', clusterData = [], deviceData = [], group = []; 
			var logStr = '';
			var defaultCluster = [
				{ name: '--', bg: '#E45146'},
				{ name: '--', bg: '#cd3b6c'},
				{ name: '--', bg: '#90389f'},
				{ name: '--', bg: '#6c4da4'},
				{ name: '--', bg: '#3F51B5'},
				{ name: '--', bg: '#3394e1'},
				{ name: '--', bg: '#009688'},
				{ name: '--', bg: '#9E9D24'},
				{ name: '--', bg: '#FF9800'},
				{ name: '--', bg: '#FF7043'},
				{ name: '--', bg: '#795548'},
				{ name: '--', bg: '#9E9E9E'},
			];
			// console.log('generateDeviceOrder');
			// console.log(data);
			/** Devices per cluster **/
			for(var i = 1; i <= 10; i++) {
				/** Create pages per 10 device **/
				if((i - 1) % 10 == 0) {
					id = i < 10 ? i : parseInt(i / 10) + 1;
					if((i - 1) == 0) {
						str += "<ul id='page-" + id + "-xg' class='connectedSortable sortable'>";
					} else {
						str += "</ul><ul id='page-" + id + "-xg' class='connectedSortable sortable'>";
					}
					const defaultGroupName = `${lang[flags.pref.lang].dashboard.pagetitle} ${lang[flags.pref.lang].dashboard.page}${id}`;
                    str += `<div style="text-align: left; padding-left: 3px;">
                        <span id="dgroup-${id}_">${defaultGroupName}</span>
                        <button class="btn btn-sm ${flags.pref.theme == 'dark' ? 'text-light' : ''} text-center" type="button" style="box-shadow: none !important; margin-left: 3px;" onclick="getGroup(${id})">
                            <i class="fa fa-edit"></i>
                        </button>
                    </div>`;
					//cluster legend
					// legend += `<li id="clusterName-${id}_"><div style="display: inline-block; width: 10px; height: 10px; border-radius: 1px; margin-right: 3px; background-color: ${defaultCluster[id - 1]['bg']};"></div><span>${defaultCluster[id - 1]['name']}</span></li>`;
				}
				// device id: item-<cluster>-<device>
                str += `<li id='item-${(id) + '-' + i}' class='ui-state-default ui-state-disabled font-weight-bold' data-toggle='tooltip' title=${lang[flags.pref.lang].cluster.manageDevices.nodevice} data-did=''>--</li>`;
			}
			// console.log('STR: ' + str);
			// console.log('legend: ' + legend);
			$('.draggable-wrapper-x').html(str);
			$('.clusterLegend').html(`<ul style="column-count: 3;">${legend}</ul>`);
			$('.clusterlbl').html(lang[flags.pref.lang].cluster.tabtitle + ' List');

			/** upload the data **/
			if(!$.isEmptyObject(data)) {
				deviceData = data['clusterDevices'];
				clusterData = data['clusterInfo'];
				group = data['group'];
				for (var i = 0; i < group.length; i++) {
					$(`#dgroup-${group[i]['id']}_`).html(group[i]['name']);
				}

				/** UNCOMMENT FOR LARGE SYSTEM: multiple pages */
				// for(var i = 0; i < clusterData.length - 1; i++) {
				// 	$(`#clusterName-${clusterData[i+1]['clusterNum']}_ > span`).html(clusterData[i+1]['clusterNme']);
				// 	$('#page-' + (parseInt(clusterData[i+1]['clusterNum']) - 1) + '-xg li').each(function() {
				// 		$(this).removeClass('ui-state-disabled');
				// 		$(this).css("background-color", defaultCluster[ parseInt(clusterData[i]['clusterNum']) - 1 ]['bg']);
				// 	});
				// }

				/** UNCOMMENT FOR SMALL SYSTEM: 10 devices */
				logStr += `#clusterName-${clusterData[0]['clusterNum']}_ > span` + `${clusterData[0]['clusterNme']}`;
				// console.log('LOGSTR: ' + logStr);
				$(`#clusterName-${clusterData[0]['clusterNum']}_ > span`).html(clusterData[0]['clusterNme']);
				$('#page-' + (parseInt(clusterData[0]['clusterNum'])) + '-xg li').each(function() {
					$(this).removeClass('ui-state-disabled');
					$(this).css("background-color", defaultCluster[ parseInt(clusterData[0]['clusterNum']) ]['bg']);
					// console.log('remove ui-state-disabled');
				});
				
				// device id: item-<cluster>-<device>
				for(var i = 0; i < deviceData.length; i++) {
					$('[id ^= item-][id $= -' + deviceData[i]['devord'] + ']').html(deviceData[i]['devnme']);
					$('[id ^= item-][id $= -' + deviceData[i]['devord'] + ']').attr('data-node', deviceData[i]['devnod']);
					$('[id ^= item-][id $= -' + deviceData[i]['devord'] + ']').attr('data-mac', deviceData[i]['devmac']);
					$('[id ^= item-][id $= -' + deviceData[i]['devord'] + ']').attr('title', deviceData[i]['devnme']);
					$('[id ^= item-][id $= -' + deviceData[i]['devord'] + ']').attr('data-did', deviceData[i]['devdid']);
					// $('[id ^= item-][id $= -' + deviceData[i]['devord'] + ']').css("background-color", defaultCluster[ parseInt(deviceData[i]['devcli']) - 2 ]['bg']); //LARGE SYSTEM
					$('[id ^= item-][id $= -' + deviceData[i]['devord'] + ']').css("background-color", defaultCluster[ parseInt(deviceData[i]['devcli']) - 1 ]['bg']); //SMALL SYSTEM
					$('[id ^= item-][id $= -' + deviceData[i]['devord'] + ']').css("color", '#FFF');
				}
			}

			$( ".sortable" ).sortable({
		    	connectWith: ".connectedSortable",
		    	items: "li:not(.ui-state-disabled)",
		    	helper: "clone",
		    	// revert: true,
		    	placeholder:  "placeholder",
		    	receive: function(event, ui) {
		    		var srcul = $(ui.sender).attr("id");
		    		var tgtitm = $(ui.item).attr("id");
		    		var tgtno = parseInt(tgtitm.split("-")[1]);
		    		var itemno = parseInt(tgtitm.split("-")[2]);

		    		if(!draggableFields['isCancelled']) {
		    			/** push the next item of the dropped item on the tgtul, to the last item of the srcul **/
			    		var tgtnextitem = $("#" + tgtitm).next();
			    		/** if no item available to push, push the first item of the tgtul **/
			    		if(!tgtnextitem.is('li')) {
			    			var previtem = $("#" + tgtitm).prev().parent().attr("id");
			    			var firstItem = $("#" + previtem + " > li").first();
			    			firstItem.appendTo("#" + srcul);
			    		} else {
			    			tgtnextitem.appendTo("#" + srcul);
			    		}
		    		}
		    		draggableFields['fromAnotherList'] = false;
		    		draggableFields['sourceUL'] = null;
		   			draggableFields['isCancelled'] = false;

		    		$("li").removeClass('glow');
		    	},
		    	change: function(event, ui) {
		    		/** if sorting is done on itself, do not show **/
		    		var srcul = $(ui.sender).attr("id");
		    		if(srcul == undefined) {
		    			/** changes are done to itself **/
		    			if(draggableFields['fromAnotherList'] == true) {
		    				$("li").removeClass('glow');
		    				srcul = draggableFields['sourceUL'];
		    			} else {
		    				return;
		    			}
		    		} else {
		    			/** first insrtance of dragged item **/
		    			draggableFields['fromAnotherList'] = true;
		    			draggableFields['sourceUL'] = srcul;
		    		}

		    		var destitem = $('.placeholder').parent().attr("id");
		    		if(srcul == destitem) {
		    			return;
		    		}

					if(!$('.placeholder').next().is('li')) {
						$('#' + destitem + ' > li').first().addClass('glow');
					} else {
						$('.placeholder').next().addClass('glow');
					}
		    	},
		    	start: function(event, ui) {
		    		dragDeleteItem = ui.item;
		    		sortables = $("#deleteDeviceBtn");
		    		draggedItem = ui.helper;
        			$(window).mousemove(moved);
		    	},
		    	stop: function(event, ui) {
		    		$(window).unbind("mousemove", moved);
		    		draggableFields['fromAnotherList'] = false;
		    		draggableFields['sourceUL'] = null;
		    		draggableFields['isCancelled'] = false;
		    		$("li").removeClass('glow');
		    	}
		    }).disableSelection();

		    $( ".sortable" ).on( "sortreceive", function(event, ui) {
		        if($(this).find("li").length > 11 || $(this).find("li").first().hasClass('ui-state-disabled')){
		        	draggableFields['isCancelled'] = true;
		            $(ui.sender).sortable('cancel');
		        }
		    });
		},
		fail: function(err) {
			console.log("create draggable failed: " + err);
		}
	});
}

/**REORDER DEVICE POSITION ON DASHBOARD */
function updateNewDeviceOrder() {
	/** Stringify data **/
	var devIndex = 1, deviceOrder = [];
	for(var i = 1; i <= 12; i++) {
		var child = $('#page-' + i + '-xg li');
		for(var j = 0; j < 10; j++) {
			if($(child).eq(j).data('did') != '' && $(child).eq(j).data('did') !== undefined) {
				var struct = {};
				struct['did'] = $(child).eq(j).data('did');
				struct['nme'] = $(child).eq(j).attr('title');
				struct['ord'] = devIndex;
				deviceOrder.push(struct);
			}
			devIndex++;
		}
	}

	var deviceOrderStr = JSON.stringify(deviceOrder);

	$.ajax({
		type: 'POST',
		url: 'php/config/setDeviceOrder.php',
		dataType: 'json',
		data: { devorder: deviceOrderStr },
		async: true,
		success: function(data) {
			if(data == 'success') {
				showPrompt(lang[flags.pref.lang].cluster.manageDevices.prompt.success.order, 'Success');
				createDraggableDashboard();
			}
		},
		fail: function() {
			showPrompt(lang[flags.pref.lang].cluster.manageDevices.prompt.failed.order, 'Failed');
		}
	});
}

function generateClusterOrder() {
	$.ajax({
		type: 'POST',
		url: 'php/config/getDeviceOrder.php',
		dataType: 'json',
		data: '',
		async: true,
		success: function(data) {
			/** create the framework first **/
			var id = '', str = '', legend = '', clusterData = [], deviceData = []; 
			var defaultCluster = [
				{ name: '--', bg: '#E45146'},
				{ name: '--', bg: '#cd3b6c'},
				{ name: '--', bg: '#90389f'},
				{ name: '--', bg: '#6c4da4'},
				{ name: '--', bg: '#3F51B5'},
				{ name: '--', bg: '#3394e1'},
				{ name: '--', bg: '#009688'},
				{ name: '--', bg: '#CDDC39'},
				{ name: '--', bg: '#ecb71a'},
				{ name: '--', bg: '#FF9800'},
				{ name: '--', bg: '#795548'},
				{ name: '--', bg: '#9E9E9E'},
			];
			// console.log('generateClusterOrder');
			// console.log(data);
			/** Devices per cluster **/
			for(var i = 1; i <= 10; i++) {
				if((i - 1) % 10 == 0) {
					id = i < 10 ? i : parseInt(i / 10) + 1;
					if((i - 1) == 0) {
						str += "<ul id='page-" + id + "-xg' class='connectedSortable sortable'>";
					} else {
						str += "</ul><ul id='page-" + id + "-xg' class='connectedSortable sortable'>";
					}
					str += `<div id='clusterName-${id + 1}_' style="text-align: left; padding-left: 3px;">${defaultCluster[id-1]['name']}</div>`;
				}
				// device id: item-<cluster>-<device>
				str += `<li id='item-${(id + 1) + '-' + i}' class='ui-state-default ui-state-disabled font-weight-bold' data-toggle='tooltip' title='No device' data-did=''>--</li>`;
			}
			$('.draggable-wrapper-x').html(str);
			$('.clusterLegend').html('');
			$('.clusterlbl').html('');

			/** upload the data **/
			if(!$.isEmptyObject(data)) {
				deviceData = data['clusterDevices'];
				clusterData = data['clusterInfo'];
				for (var i = 0; i < clusterData.length - 1; i++) {
					$(`#clusterName-${clusterData[i+1]['clusterNum']}_`).html(clusterData[i+1]['clusterNme']);
					$('#page-' + (parseInt(clusterData[i+1]['clusterNum']) - 1) + '-xg li').each(function() {
						$(this).removeClass('ui-state-disabled');
					});
				}

				// assign each device to specific array for parsing
				clusterArray = {};
				for (var i = 0; i < deviceData.length; i++) {
					if (clusterArray[ deviceData[i]['devcli'] ] === undefined) {
						clusterArray[ deviceData[i]['devcli'] ] = [];
					}
					clusterArray[ deviceData[i]['devcli'] ].push(deviceData[i]);
				}

				for (idx in clusterArray) {
					var clusterLot = (parseInt(idx) - 2) * 10;
					for (var i = 0; i < 10; i++) {
						if (clusterArray[idx][i] === undefined) continue;

						var isLocked = false, bg = '#4CAF50', clr = 'black';
						if (clusterArray[idx][i]['devsta'] == '0' || clusterArray[idx][i]['devuse'] == '1') {
							$('[id ^= item-' + idx + '][id $= -' + (clusterLot+1) + ']').removeClass('ui-state-default').addClass('ui-state-disabled');
						}

						$('[id ^= item-' + idx + '][id $= -' + (clusterLot+1) + ']').html(clusterArray[idx][i]['devnme']).css({ 'background-color': bg, 'color': clr });
						$('[id ^= item-' + idx + '][id $= -' + (clusterLot+1) + ']').attr('data-node', clusterArray[idx][i]['devnod']);
						$('[id ^= item-' + idx + '][id $= -' + (clusterLot+1) + ']').attr('data-mac', clusterArray[idx][i]['devmac']);
						$('[id ^= item-' + idx + '][id $= -' + (clusterLot+1) + ']').attr('title', clusterArray[idx][i]['devnme']);
						$('[id ^= item-' + idx + '][id $= -' + (clusterLot+1) + ']').attr('data-did', clusterArray[idx][i]['devdid']);
						$('[id ^= item-' + idx + '][id $= -' + (clusterLot+1) + ']').attr('data-ord', clusterArray[idx][i]['devord']);
						clusterLot++;
					}
					
				}
			}

			$( ".sortable" ).sortable({
		    	connectWith: ".connectedSortable",
		    	items: "li:not(.ui-state-disabled)",
		    	helper: "clone",
		    	// revert: true,
		    	placeholder:  "placeholder",
		    	receive: function(event, ui) {
		    		var srcul = $(ui.sender).attr("id");
		    		var tgtitm = $(ui.item).attr("id");
		    		var tgtno = parseInt(tgtitm.split("-")[1]);
		    		var itemno = parseInt(tgtitm.split("-")[2]);

		    		if(!draggableFields['isCancelled']) {
		    			/** push the next item of the dropped item on the tgtul, to the last item of the srcul **/
			    		var tgtnextitem = $("#" + tgtitm).next();
			    		/** if no item available to push, push the first item of the tgtul **/
			    		if(!tgtnextitem.is('li')) {
			    			var previtem = $("#" + tgtitm).prev().parent().attr("id");
			    			var firstItem = $("#" + previtem + " > li").first();
			    			// firstItem.appendTo("#" + srcul);
			    			delOrSwitch(srcul, firstItem, event.target.id, ui.sender);
			    		} else {
			    			delOrSwitch(srcul, tgtnextitem, event.target.id, ui.sender);
			    			// tgtnextitem.appendTo("#" + srcul);
			    		}
		    		}
		    		draggableFields['fromAnotherList'] = false;
		    		draggableFields['sourceUL'] = null;
		   			draggableFields['isCancelled'] = false;

		    		$("li").removeClass('glow');
		    	},
		    	change: function(event, ui) {
		    		/** if sorting is done on itself, do not show **/
		    		var srcul = $(ui.sender).attr("id");
		    		if(srcul == undefined) {
		    			/** changes are done to itself **/
		    			if(draggableFields['fromAnotherList'] == true) {
		    				$("li").removeClass('glow');
		    				srcul = draggableFields['sourceUL'];
		    			} else {
		    				return;
		    			}
		    		} else {
		    			/** first insrtance of dragged item **/
		    			draggableFields['fromAnotherList'] = true;
		    			draggableFields['sourceUL'] = srcul;
		    		}

		    		var destitem = $('.placeholder').parent().attr("id");
		    		if(srcul == destitem) {
		    			return;
		    		}

		    		var destBlock = '';
					if(!$('.placeholder').next().is('li')) {
						destBlock = $('#' + destitem + ' > li').first();
						// $('#' + destitem + ' > li').first().addClass('glow');
					} else {
						destBlock = $('.placeholder').next();
						// $('.placeholder').next().addClass('glow');
					}
					destBlock.addClass('glow');
		    	},
		    	start: function(event, ui) {
		    		dragDeleteItem = ui.item;
		    		sortables = $("#deleteDeviceBtn");
		    		draggedItem = ui.helper;
        			$(window).mousemove(moved);
		    	},
		    	stop: function(event, ui) {
		    		if (dragOptions !== "") return;
		    		$(window).unbind("mousemove", moved);
		    		draggableFields['fromAnotherList'] = false;
		    		draggableFields['sourceUL'] = null;
		    		draggableFields['isCancelled'] = false;
		    		$("li").removeClass('glow');
		    	}
		    }).disableSelection();

		    $( ".sortable" ).on( "sortreceive", function(event, ui) {
		    	var dest = $('.placeholder').parent().attr("id");
		        if($(this).find("li").length > 11 || $(this).find('li.glow').hasClass('ui-state-disabled')) {
		        	draggableFields['isCancelled'] = true;
		            $(ui.sender).sortable('cancel');
		        }
		    });
		},
		fail: function(err) {
			console.log("create draggable failed: " + err);
		}
	});
}

function updateNewClusterOrder() {
	/** Stringify data **/
	var devIndex = 1, deviceOrder = {}, noDevList = [];
	for(var i = 1; i <= 12; i++) {
		var child = $('#page-' + i + '-xg li');
		if (deviceOrder[i + 1] === undefined) {
			deviceOrder[i + 1] = [];
		}
		for(var j = 0; j < 10; j++) {
			if($(child).eq(j).attr('title') != '' && $(child).eq(j).attr('title') !== undefined && $(child).eq(j).attr('title') != "No device") {
				var struct = {};
				struct['devdid'] = $(child).eq(j).data('did').toString();
				struct['devnme'] = $(child).eq(j).attr('title');
				struct['devord'] = $(child).eq(j).data('ord').toString();
				struct['devnod'] = $(child).eq(j).data('node');
				struct['devmac'] = $(child).eq(j).data('mac');
				struct['devcli'] = (i + 1).toString();
				deviceOrder[i + 1].push(struct);
			} else {
				noDevList.push($(child).eq(j).data('did').toString());
			}
			devIndex++;
		}
	}

	var deviceOrderStr = JSON.stringify(deviceOrder);
	var sorted = [];
	for (i in deviceOrder) {
		if ($.isEmptyObject(deviceOrder[i])) continue;
		sorted[i] = deviceOrder[i].sort(customSort('devord'));
	}

	var limit = 0;
	if (clusterArray.length > sorted.length) {
		limit = clusterArray.length;
	} else {
		limit = sorted.length;
	}
	var result = [];
	for (var x = 0; x < limit; x++) {
		var refState = clusterArray[x];
		var valState = sorted[x];

		if (refState === undefined && valState !== undefined) {
			result.push(valState);
			continue;
		} else if (refState !== undefined && valState === undefined) {
			result.push(refState);
			continue;
		} else if (refState === undefined && valState === undefined) {
			continue;
		}

		const ref = clusterArray[x];
		const val = sorted[x];
		const sideA = objectExists(ref, val, 'devdid');
		const sideB = objectExists(val, ref, 'devdid');
		var temp = sideA.concat(sideB);
		temp = [...new Set([...sideA, ...sideB])];
		// console.log(`filtered result: ${JSON.stringify(temp)}`);

		if (!$.isEmptyObject(temp)) {
			var oldData = result;
			var ids = new Set(result.map(i => i.devdid));
			result = [...oldData, ...temp.filter(i => !ids.has(i.devdid))];
		}
	}

	var changedId = [], removedId = [];
	for (i in result) {
		if (noDevList.indexOf(result[i]['devdid']) > -1) {
			removedId.push(result[i]);
		} else {
			changedId.push(result[i]['devdid']);
			removedId.push(result[i]);
		}
	}

	// Create 2 sections, 1 section is for updating all changed cluster devices and the other for removed devices
	// Section 1: Delete devices
	if (!$.isEmptyObject(removedId)) {
        $('#snsModal .snsPrompt').html(lang[flags.pref.lang].cluster.manageDevices.deleting);
		$('#snsModal').modal('show');

		removeDeviceSync(removedId, 0, function () {
			// Section 2: Update cluster
			var devArr = [];
			if (!$.isEmptyObject(changedId)) {
				var toUpdate = [];
				sorted.map((items) => {
					items.map((val) => {
						if (changedId.indexOf(val['devdid']) >= 0) {
							clusterTempList.map((i) => {
								if (i['id'] == val['devcli']) {
									devArr.push({
										node: val['devnod'],
										cluster: val['devmac'],
										newcluster: i['mac'],
										ssid: i['ssid'],
										pass: i['pass'],
									});
								}
							});
						}
					});
				});

                $('#snsModal .snsPrompt').html(lang[flags.pref.lang].cluster.manageDevices.updating);
				updateDeviceConfigSync(devArr);
			}
		});
	}
}

function updateDeviceConfigSync(dataInput, callback) {
	// console.log(dataInput);

	if ($.isEmptyObject(dataInput)) return;

	$.ajax({
		type: 'POST',
		url: 'php/config/regMultiDevHandler.php',
		dataType: 'json',
		data: { data: JSON.stringify(dataInput) },
		async: true,
		success: function(data) {
			$('#snsModal').modal('hide');
            showPrompt(lang[flags.pref.lang].cluster.manageDevices.prompt.success.cluster, 'Success');
			createDraggableDashboard();
		},
		fail: function() {
			$('#snsModal').modal('hide');
            showPrompt(lang[flags.pref.lang].cluster.manageDevices.prompt.failed.cluster, 'Success');
		}
	});
}

function removeDeviceSync(dataInput, idx, callback) {
	var limit = dataInput.length;

	$.ajax({
		type: 'POST',
		url: 'php/config/setDeviceArchive.php',
		dataType: 'json',
		data: { id: dataInput[idx]['devdid'], archived: '1' },
		async: true,
		success: function(data) {
			if(data == 'success') {
				var newIdx = idx + 1;
				if (newIdx < limit) {
					removeRegisterDev(idx, dataInput[idx]['devmac'], dataInput[idx]['devnod'], function () { removeDeviceSync(dataInput, newIdx, callback) });
				} else {
					removeRegisterDev(idx, dataInput[idx]['devmac'], dataInput[idx]['devnod'], function () {
						callback();
					});
				}
			} else {
				$('#snsModal').modal('hide');
                showPrompt(lang[flags.pref.lang].cluster.manageDevices.prompt.failed.devremoved, 'Failed');
			}
		},
		fail: function() {
			
		}
	});
}

function objectExists(ref, val, key) {
	var changed = [];

	for (i in val) {
		// console.log(`Val: ${val[i][key]}`);
		if (val[i][key] === undefined) {
			console.log("Key does not exists on ref object");
			break;
		} else {
			var exists = false;
			for (j in ref) {
				// console.log(`Val: ${val[i][key]} vs Ref: ${ref[j][key]}`);
				if (ref[j][key] === undefined) {
					console.log("Key does not exists on new object");
					break;
				} else if (val[i][key] === ref[j][key]) {
					exists = true;
					break;
				}
			}

			if (!exists) {
				console.log(`Changed: ${val[i][key]}`);
				changed.push(val[i]);
			}
		}
	}

	return changed;
}

function createDraggableDashboard() {
	$('#reorderMode').off().on('change', function() {
		createDraggableDashboard();
	});

	if ($('#reorderMode').val() == 'device') {
		generateDeviceOrder();
	} else {
		generateClusterOrder();
	}
}

function updateDraggableDashboardOrder() {
	if ($('#reorderMode').val() == 'device') {
		updateNewDeviceOrder();
	} else {
		updateNewClusterOrder();
	}
}

function moved(e) {
    //Dragged item's position++
    var d = {
        top: draggedItem.position().top,
        bottom: draggedItem.position().top + draggedItem.height(),
        left: draggedItem.position().left,
        right: draggedItem.position().left + draggedItem.width()
    };

    /** note: original position + element on the left + column padding **/
    var p = {
        top: sortables.position().top - 15,
        bottom: sortables.position().top + sortables.height() - 15,
        left: sortables.position().left - 5,
        right: sortables.position().left + sortables.width() - 5
    };

    var itcTop      = d.top <= p.top;
    var itcBtm      = d.bottom >= p.bottom;
    var itcRight    = d.right >= p.right;
    var itcLeft     = d.left <= p.left;

    if(itcTop && itcBtm && itcLeft && itcRight) {
    	// console.log("top: " + d.top + " vs " + p.top);
    	// console.log("bottom: " + d.bottom + " vs " + p.bottom);
    	// console.log("right: " + d.right + " vs " + p.right);
    	// console.log("left: " + d.left + " vs " + p.left);
    	// console.log(draggedItem.html() + " hovers over " + sortables.html());
    	/** delete/remove device **/
    	showWarning(`${draggedItem.html()} (${$(dragDeleteItem).attr('data-node')}) ${lang[flags.pref.lang].cluster.manageDevices.prompt.willremove}?`, 'remDevFrCluster');
    }
};

/** APPLICABLE FOR SMALL SYSTEM ONLY */
// function listInputDevices(clusterId, clusterName) {
function listInputDevices() {
	// console.log ("listInputDevices");
	// var clustId = $('#viewDevicesTab .select-cluster').val();
	var select = document.getElementById('select-cluster');
	var clusterId = select.options[select.selectedIndex].value;
	// console.log (clusterId);
	// var clusterId = 1;
	var clusterName = '';
	$.ajax({
		type: 'POST',
		url: 'php/config/loadClusterBasicInfo.php',
		data: { id: clusterId },
		dataType:'json',
		async: true,
		success: function(retData) {
			// * Check if data is empty * //
			if(!(retData === null)) {
				clusterName = retData.name;
			}
		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});

	$.ajax({
		type: 'POST',
		url: 'php/config/deviceClusters.php',
		data: { id: clusterId },
		dataType:'json',
		async: true,
		success: function(retData) {
			if(!(retData === null)) {
				$('#removeDevModal .removeStatus > span').html(`${retData.length}`);
				$('#removeDevModal .removeDevList').html(`<p class="text-center mb-0 px-3 pt-2 pb-3">${lang[flags.pref.lang].cluster.scandev.prompt.none}</p>`);
				// var parsedData = JSON.parse(data);
				var ui = '';
				for(var i = 0; i < retData.length; i++) {
					ui += '<div class="row no-gutters mb-2">';
			        ui += '<div class="col-8 col-sm-9 col-md-9 col-lg-9 col-xl-9 pr-2">';
			        ui += `<form><input class="form-control form-control-sm" type="text" value="${retData[i].name}" readonly></form>`;
			        ui += '</div><div class="col-4 col-sm-3 col-md-3 col-lg-3 col-xl-3">';
                    ui += `<button id="devRemoveBtn${retData[i].id}" class="btn btn-dark btn-sm btn-block devdelbtn" ${(retData[i].stat == 'Inactive' || retData[i].usag == 1) ? 'disabled' : ''} onclick='removeDevice("${retData[i].id}", "${retData[i].node}", "${retData[i].bsmac}", "${clusterId}")'>
                        ${lang[flags.pref.lang].general.removelbl}
                    </button></div></div>`;
				}
			    $('#removeDevModal .removeDevList').html(ui);
			} else {
				$('#removeDevModal .removeDevList').html(`<p class="text-center mb-0 px-3 pt-2 pb-3">${lang[flags.pref.lang].cluster.scandev.prompt.none}</p>`);
			}
			$('#removeDevModal .modal-title > .clusName').html(` (${clusterName})`);
            $('#removeDevModal').modal('show');

			$('#refreshDevRemove').off().on('click', function () {
				listInputDevices();
			});

		},
		fail: function(errThrown) {
			console.log('Failed: ' + errThrown);
		}
	});
}

function removeDevice(devid, nodeid, bsmac, clusterid) {
	/** check if device is active */
	var devcnt = flags.config.table.data().count();
	// console.log (devcnt);
	$.ajax({
		type: 'POST',
		url: 'php/control/getDeviceStateOnOff.php',
		dataType: 'json',
		// data: { id: $(dragDeleteItem).data('did') },
		data: { id: devid },
		async: true,
		success: function(retData) {
			if(!(retData === null)) {
				if (retData.devsta == "1") {	//online
					if(retData.devuse == "0") {	//not used
						// send default AP0 config
						sendESPConfigDef(devid, bsmac, nodeid, clusterid);
					}
					else { //used
						$(`#devRemoveBtn${devid}`).html('<i class="fas fa-times-circle text-danger"></i>');
						$('#removeDevModal').modal('hide');
						showPrompt(lang[flags.pref.lang].cluster.manageDevices.prompt.failed.inused, 'Failed');
					}
				}
				else { //offline
					$(`#devRemoveBtn${devid}`).html('<i class="fas fa-times-circle text-danger"></i>');
					$('#removeDevModal').modal('hide');
					showPrompt(lang[flags.pref.lang].cluster.manageDevices.prompt.failed.offline, 'Failed');
				}
			}
			else {
                // device id not on DB
				console.log("FAILED: Device is not on the database.")
			}
		},
		fail: function() {
			dragDeleteItem = '';
		}
	});

}

function bsScanHandler() {
	$('#scanBSBtn, #refreshBSBtn').on('click', function() {
		$('#snsModal .snsPrompt').html(lang[flags.pref.lang].cluster.viewCluster.scanloading);
		$('#snsModal').modal('show');
		triggerScanBS();
	});

	$('#saveBSBtn').on('click', function() {
		executeAddBS();
	});

	$('.passwBtn').on('click', function() {
		const passInput = this;
		$(passInput).find('i').each(function() {
			const state = $(this).hasClass('fa-eye-slash');
			if (state) {
				$(this).removeClass('fa-eye-slash').addClass('fa-eye');
				$(passInput).parent().parent().find('input').eq(0).attr('type', 'text');
			} else {
				$(this).removeClass('fa-eye').addClass('fa-eye-slash');
				$(passInput).parent().parent().find('input').eq(0).attr('type', 'password');
			}
		});
	});

	$('.editCluster-input textarea').on('input', function() {
		$('#clusDescChar').html($(this).val().length);
	});

	$('#editCluster .savelbl').on('click', function() {
		handleBSNetconfig();
	});

	$('#scanBSModal .close, #scanBSModal .cancelbl').on('click', function() {
		clusterViewOnly();
	});

	$('#scanDevModal .close, #scanDevModal .closelbl').on('click', function() {
		clusterViewOnly();
	});

	$('#removeDevModal .close, #removeDevModal .closelbl').on('click', function() {
		clusterViewOnly();
	});


	$('.ssidInput').off('input').on('input', function() {
		/** does not allow special characters other than  **/
		// var c = this.selectionStart, r = /([!@#$%^&*+=`"':;<>?\s\\{}\[\]]+)/gm, v = $(this).val();
		var c = this.selectionStart, r = /([~!@#$%^&*()+=`"':;<>|,./?\s\\{}\[\]]+)/gm, v = $(this).val();
		if(r.test(v)) {
			$(this).val(v.replace(r, ''));
		    c--;
		}
		this.setSelectionRange(c, c);
	});

	$('.passInput').off('input').on('input', function() {
		/** allows everything other than space **/
		// var c = this.selectionStart, r = /([\s]+)/gm, v = $(this).val();
		var c = this.selectionStart, r = /([~!\_\-$%^&*()+=`"':;<>|,./?\s\\{}\[\]]+)/gm, v = $(this).val();
		if(r.test(v)) {
			$(this).val(v.replace(r, ''));
		    c--;
		}
		this.setSelectionRange(c, c);
	});

	$('.ipInput').on('input', function() {
		/** allows everything other than space **/
		var c = this.selectionStart, r = /([^.\d]+)/gm, v = $(this).val();
		if(r.test(v)) {
			$(this).val(v.replace(r, ''));
		    c--;
		}
		this.setSelectionRange(c, c);
	});
}

function triggerScanBS() {
	$.ajax({
		type: 'POST',
		url: 'php/config/findBS.php',
		dataType: 'json',
		async: true,
		success: function(data) {
			readScannedBS();
		},
		fail: function() {
			$('#snsModal').modal('hide');
			showPrompt(lang[flags.pref.lang].errorprompt.internal, 'Failed');
		}
	});
}

function readScannedBS() {
	bsTempList = [];

	$.ajax({
		type: 'POST',
		url: 'php/config/getBS.php',
		dataType: 'json',
		async: true,
		success: function(data) {
			setTimeout(function () {
				$('#snsModal').modal('hide');
			}, 500);
			
			if (data[0] != "[]") {
				var existingClusters = [];
				// commented out for BS details update D
				// for (var i = 1; i < data[1].length; i++) {
				// 	existingClusters.push(data[1][i]['ip']);
				// }
				// Create a UI for all available basestations
				var bsList = "";
				(JSON.parse(data[0])).map((items, index) => {
					// check if it was already registered
					if (existingClusters.indexOf(items['ip']) < 0) {
						bsList += '<div class="row no-gutters mb-2">';
						bsList += '<div class="col-8 col-sm-9 col-md-9 col-lg-9 col-xl-9 pr-2">';
						bsList += `<form><input id="${'bsInput' + index + '_'}" class="form-control form-control-sm" type="text" data-mac="${items['mac']}" value="${items['ssid']} : ${items['ip']}" readonly></form>`;
						bsList += '</div><div class="col-4 col-sm-3 col-md-3 col-lg-3 col-xl-3">';
	                    bsList += `<button id="${'btn' + items['mac']}" class="btn btn-dark btn-sm btn-block bsBtn" onclick='addToTempBSList(${JSON.stringify(items)}, this, ${'bsInput' + index + '_'})' ${bsExists(data[1], items['mac'], items['ip'])}>${lang[flags.pref.lang].general.addlbl}</button></div></div>`;
					}
				});
				$('#scanBSModal .bsList').html(bsList == '' ? `<div class="text-center">-- ${lang[flags.pref.lang].cluster.viewCluster.noscan} --</div>` : bsList);
				$('#saveBSBtn').attr('disabled', false);
			} else {
				$('#scanBSModal .bsList').html(`<div class="text-center">-- ${lang[flags.pref.lang].cluster.viewCluster.noscan} --</div>`);
				$('#saveBSBtn').attr('disabled', true);
			}
			$('#scanBSModal').modal('show');
		},
		fail: function() {
			$('#snsModal').modal('hide');
			showPrompt(lang[flags.pref.lang].errorprompt.network, 'Failed');
		}
	});
}

function bsExists(refList, mac, ip) {
	var retval = '';
	// // Get all available clusters, check if it already exists
	// refList.map((items) => {
	// 	if (items['mac'] == mac && items['ip'] == ip) {
	// 		retval = 'disabled';
	// 		return;
	// 	}
	// });

	return retval;
}

function addToTempBSList(jsonData, btnDom, inputDom) {
	if ($(btnDom).html() == lang[flags.pref.lang].general.addlbl) {
		bsTempList.push(jsonData);
		$(btnDom).html(lang[flags.pref.lang].general.removelbl);
		$(inputDom).addClass('bg-secondary text-light');
	} else if ($(btnDom).html() == lang[flags.pref.lang].general.removelbl) {
		$(btnDom).html(lang[flags.pref.lang].general.addlbl);
		$(inputDom).removeClass('bg-secondary text-light');
		var val = $(inputDom).attr('data-mac');
		var valIndx = bsTempList.map((items, index) => {
			if (items['mac'] == val) {
				return index; 
			}
		}) || -1;
		if (valIndx > -1) {
			bsTempList.splice(valIndx, 1);
		}
	}
	// console.log('newval: ' + JSON.stringify(bsTempList));
}

function executeAddBS() {
	// put a spinner for added basestation
	$('.bsBtn').each(function() {
		var btnText = $(this).html();
		if (btnText == lang[flags.pref.lang].general.removelbl) {
			$(this).html('<span role="status" class="spinner-border spinner-border-sm text-primary"></span>');
		}
	});

	bsTempList.map((items) => {
		$.ajax({
			type: 'POST',
			url: 'php/config/addBS.php',
			dataType: 'json',
			data: items,
			async: true,
			success: function(data) {
				if (data == "success") {
					$('#btn' + items["mac"]).html('<i class="fas fa-check-circle text-success"></i>');
				} else {
					$('#btn' + items["mac"]).html('<i class="fas fa-times-circle text-danger"></i>');
				}
				clusterViewOnly();
			},
			fail: function() {
				showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.failed, 'Failed');
			}
		});
	});
}

function setBSInfo(val) {
    return new Promise(function(resolve) {
        $.ajax({
            type: 'POST',
            url: 'php/config/setBSInfo.php',
            dataType: 'json',
            data: val,
            success: function(data) {
				console.log(data);
                if (val.id == '1') {
                    showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.samessidpass, 'Info');
                } else {
                    if (data == 'success') {
                        showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.samessidpass, 'Info');
                    } else {
                        showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.failed, 'Failed');    
                    }
                }
                resolve('success');
            },
            fail: function() {
                // if (val.id == '1') {
                //     showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.gensucc, 'Success');
                // } else {
                //     showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.failed, 'Failed');
                // }
                resolve('fail');
            }
        });
    });
}

function setBS(val) {
    return new Promise(function(resolve) {
        $.ajax({
            type: 'POST',
            url: 'php/config/setBS.php',
            dataType: 'json',
            data: val,
            success: function(data) {
				console.log(data);
                if (val.id == '1') {
                    showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.gensucc, 'Success');
                } else {
                    if (data == 'success') {
                        showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.success, 'Success');
                    } else {
                        showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.failed, 'Failed');    
                    }
                }
                resolve('success');
            },
            fail: function() {
                if (val.id == '1') {
                    showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.gensucc, 'Success');  // GOLD: WHAT IS THE MEANING OF THIS??
                } else {
                    showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.failed, 'Failed');
                }
                resolve('fail');
            }
        });
    });
}

function handleBSNetconfig() {
	var toSave = {
		id: '',
		name: '',
		ssid: '',
		pass: '',
		bssid: $('#bssidBtn').prop('checked'),
		ip: '',
		mac: '',
		desc: '',
		isReadOnly: '',
		user: $('#accntInfoHolder').attr('data-aid'),
		isValid: true,
	};

	$('#editCluster').find('.editCluster-input .form-control').each(function(idx) {
		switch(idx) {
			case 0:
				toSave.id = $(this).attr('data-id');
				toSave.name = $(this).val();
				toSave.isReadOnly = $(this).attr('readonly') == "readonly" ? true : false;
				if ((!toSave.isReadOnly && toSave.name.toLowerCase() == 'default') || (toSave.name == '')) {
					showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.name, 'Error');
					return (toSave.isValid = false);
				}
				break;

			case 1:
				// GOLD: accept only _ and - as special char but cannot exist on start or end, cannot have consecutive _ and/or -, 5 to 32 chars
				var rgx = /^(?![_ -])(?!.*?[^\na-z0-9]{2})(?=.[\w -]{4,31}$).*?[a-z0-9]$/gmi;
				toSave.ssid = $(this).val();
				if ((toSave.ssid == '' && !toSave.isReadOnly) || !rgx.test(toSave.ssid)) {
					showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.ssid, 'Error');
					return (toSave.isValid = false);
				}
				break;

			case 2:
				//GOLD: accepts all alphanumeric and special characters, but the 'input' event blocks all spec chars except @ and #
				var rgx = /^[a-z0-9](?!.*?[^\na-z0-9]{2})(?=.{7,31}$).*?[a-z0-9]$/gmi;
				toSave.pass = $(this).val();
				if ((toSave.pass == '' && !toSave.isReadOnly) || !rgx.test(toSave.pass)) {
					showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.pass, 'Error');
					return (toSave.isValid = false);
				}
				break;

			case 3:
				var rgx = /(^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$)/gm;
				toSave.ip = ($(this).val().split(' '))[0];
				if (toSave.ip == '' || !rgx.test(toSave.ip)) {
					showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.ip, 'Error');
					return (toSave.isValid = false);
				}
				break;

			case 4:
				var mac = $(this).val().split(':');
				toSave.mac = mac.join('');
				break;

			case 5:
				toSave.desc = $(this).val();
				break;

			default:
				break;
		}
	});
	if (toSave.isValid) {
		/** save the new configs on db and hostapd.conf, restart hostapd */
        setBS(toSave).then(function(value) {
			console.log(value);	
			clusterViewOnly();	
		});
	}
}
/**GOLD: FUNCTION FOR SENDING NETWORK CONFIG TO DEVICES, W/ FAILURE HANDLING COMMENTED */	
	// if (toSave.isValid) {
	// 	/** check if same as current SSID/PASS, don't proceed */
	// 	if ((toSave.ssid === currCluster[currClusterId].ssid) && (toSave.pass === currCluster[currClusterId].pass)) {
	// 		/** save the new configs on db ONLY, no need to restart hostapd */
	// 		// showPrompt(lang[flags.pref.lang].cluster.editModal.prompt.samessidpass, 'Info');
	// 		setBSInfo(toSave).then(function(value) {
	// 			console.log(value);	
	// 			currCluster = [];
	// 			currCluster.push(toSave);
	// 			clusterViewOnly();	
	// 		});
	// 	} else {
	// 		/** send new configs to devices before saving on dB and hostapd.conf */
	// 		sendUpdatedESPConfig(toSave, deviceTempList).then(function(value) {
	// 			console.log(value);
	// 			// if (value == 'success') {	
	// 			// 	// setBS(toSave).then(function(value) {
	// 			// 	// 	console.log(value);	
	// 			// 	// 	clusterViewOnly();	
	// 			// 	// });
	// 			// 	console.log("success yarn!");
	// 			// } else {
	// 			// 	//Gold: prompt to inform user that some commands failed
	// 			// 	console.log ("SSID update failed for some devices.  Try again!")
	// 			// 	// $('#retryNwkSaveModal').modal('show');
	// 			// 	showNwkSaveRetryModal(toSave, devUpdateFailedList);
	// 			// }
	// 			setBS(toSave).then(function(value) {
	// 				console.log(value);	
	// 				currCluster = [];
	// 				currCluster.push(toSave);
	// 				clusterViewOnly();	
	// 			});
	// 		});
	// 	}
	// }


function viewClusterHandler() {
	if (autoScan) {
		autoScan = false;
		if($('#sidebar').hasClass('active')) {
			$('#sidebar').removeClass('active').addClass('inactive');
			sidebarTimerStop();
		}
		$('#snsModal .snsPrompt').html(lang[flags.pref.lang].cluster.viewCluster.scanloading);
		$('#snsModal').modal('show');
		triggerScanBS();
	} else {
		clusterViewOnly();
	}
}

function showRenameModal(id, name, type) {
	$('#renameModal .savelbl').off().on('click', function() {
		var elem = $('#renameModal .renameInput');
		if (elem.attr('data-type') == 'device') {
			renameDevices(elem.attr('data-devid'), elem.val());
		} else {
			renameGroup(elem.attr('data-devid'), elem.val());
		}
	});

	var elem = $('#renameModal .renameInput');
	if (type == 'group') {
		elem.attr('placeholder', "New Group Name");
        $('#renameModal .renamelbl').html(lang[flags.pref.lang].cluster.manageDevices.rename);
	} else {
		elem.attr('placeholder', "New Device Name");
        $('#renameModal .renamelbl').html(lang[flags.pref.lang].cluster.viewDevices.rename);
	}

	elem.val(name);
	elem.attr('data-devid', id);
	elem.attr('data-type', type);
	$('#renameModal').modal('show');
}

function getGroup(id) {
	var groupName = $(`#dgroup-${id}_`).html();
	showRenameModal(id, groupName, 'group');
}

function renameDevices(id, name) {
	$.ajax({
		type: 'POST',
		url: 'php/config/renameDevice.php',
		dataType: 'json',
		data: { id: id , name: `'${name}'` },
		async: true,
		success: function(data) {
			if(data == 'success') {
                showPrompt(lang[flags.pref.lang].cluster.viewDevices.renameok, 'Success');
				devClusterViewQuery($('#viewDevicesTab select'), null);
			} else {
                showPrompt(lang[flags.pref.lang].cluster.viewDevices.renamefail, 'Failed');
			}
		},
		fail: function() {

		}
	});
}

function renameGroup(id, name) {
	$.ajax({
		type: 'POST',
		url: 'php/config/renameGroup.php',
		dataType: 'json',
		data: { id: id , name: `'${name}'` },
		async: true,
		success: function(data) {
			if(data == 'success') {
                showPrompt(lang[flags.pref.lang].cluster.manageDevices.prompt.success.rename, 'Success');
				createDraggableDashboard();
			} else {
                showPrompt(lang[flags.pref.lang].cluster.manageDevices.prompt.failed.rename, 'Failed');
			}
		},
		fail: function() {

		}
	});
}

function findInputDevices(state, clusterId, clusterName, clusterMac, apEnabled) {
	if (state == 'show') {
        $.ajax({
            type: 'POST',
            url: 'php/config/deviceClusters.php',
            data: { id: clusterId },
            dataType:'json',
            async: true,
            success: function(retData) {
                $('#scanDevModal .scanStatus > span').html(`${retData.length} ${retData.length >= 10 ? '<span class="text-danger">(MAX)</span>' : ''}`);
                $('#scanDevModal .scanDevList').html(`<p class="text-center mb-0 px-3 pt-2 pb-3">${lang[flags.pref.lang].cluster.scandev.prompt.none}</p>`);
                // Enable AP0 button handler
                $('#defHostEn').off().on('click', function () {
                    enableAPModal($('#scanDevModal').attr('data-mac'));
                });
                $('#defHostEn').attr('disabled', apEnabled);
                // Start Scan button handler
                $('#startDevScan').off().on('click', function () {
                    startDeviceScan($('#scanDevModal').attr('data-clu'), $('#scanDevModal').attr('data-mac'), $('#scanDevModal').attr('data-dev'));
                });
                $('#startDevScan').attr('disabled', !(apEnabled));
                // Handler for closing Dual AP mode on the BS
                $('#scanDevModal').off('hidden.bs.modal').on('hidden.bs.modal', function () {
                	endDeviceScan($('#scanDevModal').attr('data-mac'));
                });
                $('#scanDevModal').attr('data-clu', clusterId);
                $('#scanDevModal').attr('data-mac', clusterMac);
                $('#scanDevModal').attr('data-dev', retData.length);
                $('#scanDevModal .modal-title .clusName').html(` (${clusterName})`);
                $('#scanDevModal').modal('show');
            },
            fail: function(errThrown) {
                console.log('Failed: ' + errThrown);
            }
        });
	}
}

function setDefaultAP (mac) {
	$('#networkModal .snsPrompt').html(lang[flags.pref.lang].cluster.viewCluster.apModal.prompt.wait);
	$('#networkModal').modal('show');

	$.ajax({
		type: 'POST',
		url: 'php/config/registerDeviceHandler.php',
		dataType: 'json',
		data: { 
			cmd: 'start', 
			mac: mac,
			dev: '',
			cnf: '',
		},
		async: true,
		success: function(data) {
			$('#networkModal').modal('hide');
			showPrompt(lang[flags.pref.lang].cluster.viewCluster.apModal.prompt.start, 'Info');
		},
		fail: function() {

		}
	});
}

function getDefaultAPStatus () {
    return new Promise(function(resolve) {
        $.ajax({
            type: 'POST',
            url: 'php/config/defaultAPChecker.php',
            dataType: 'json',
            success: function(data) {
            	// resolve sets the disabled value for the Scan button
            	if (data == "0") {
            		resolve(false);
            	}
            	else {
            		resolve(true);
            	}
            },
            fail: function() {
                resolve(false);
            }
        });
    });
}

function addDeviceModal (state, cId, cName, cMac) {
	getDefaultAPStatus().then(function(value) {findInputDevices(state, cId, cName, cMac, value)});
}

function enableAPModal(mac) {
	$('#enAP0Modal label.title').html(lang[flags.pref.lang].cluster.viewCluster.apModal.title);
	$('#startApMsg .items').each(function(index) {
		$(this).html(lang[flags.pref.lang].cluster.viewCluster.apModal.body[index]);
	});
	$('#enAP0Modal button.contlbl').off().on('click', function () {
		setDefaultAP(mac);
	});
	$('#enAP0Modal').off('hidden.bs.modal').on('hidden.bs.modal', function () {
		if (!$('#networkModal').hasClass('show')) {
			$('#scanDevModal').modal('show');
		}
	});

	$('#scanDevModal').modal('hide');
	$('#enAP0Modal').modal('show');
}

function disableAPModal(mac, apEnabled) {
	if (apEnabled) {
		$('#networkModal .snsPrompt').html(lang[flags.pref.lang].cluster.viewCluster.apModal.prompt.wait);
		$('#networkModal').modal('show');

	$.ajax({
		type: 'POST',
		url: 'php/config/registerDeviceHandler.php',
		dataType: 'json',
		data: { 
			cmd: 'stop', 
			mac: mac,
			dev: '',
			cnf: '',
		},
		async: true,
		success: function(data) {
				$('#networkModal').modal('hide');
				showPrompt(lang[flags.pref.lang].cluster.viewCluster.apModal.prompt.end, 'Info');
		},
		fail: function() {

		}
	});
}
	clusterViewOnly();
}

function endDeviceScan(mac) {
	getDefaultAPStatus().then(function(value) {disableAPModal(mac, value)});
	// $.ajax({
	// 	type: 'POST',
	// 	url: 'php/config/registerDeviceHandler.php',
	// 	dataType: 'json',
	// 	data: { 
	// 		cmd: 'stop', 
	// 		mac: mac,
	// 		dev: '',
	// 		cnf: '',
	// 	},
	// 	async: true,
	// 	success: function(data) {
	// 		clusterViewOnly();
	// 	},
	// 	fail: function() {

	// 	}
	// });
}

function startDeviceScan(id, mac, devCnt) {
    // 1. Create a script that sends an MQTT to initiate dual AP mode on the BS
    // 2. Create an expirable MQTT receiver to receive the reply of the exectued script on BS 

    // loading
    $('#scanDevModal .scanDevList').html(`<p class="text-center mb-0 px-3 pt-2 pb-3"><span role="status" class="spinner-border spinner-border text-primary"></span></p>`);
    $.ajax({
		type: 'POST',
		url: 'php/config/registerDeviceHandler.php',
		dataType: 'json',
		data: { 
			cmd: 'scan',// 'start', 
			mac: mac,
			dev: '',
			cnf: '',
		},
		async: true,
		success: function(data) {
			if (data !== '[]') {
				var parsedData = JSON.parse(data);
				var ui = '';
				parsedData.map((items, index) => {
			        ui += '<div class="row no-gutters mb-2">';
			        ui += '<div class="col-8 col-sm-9 col-md-9 col-lg-9 col-xl-9 pr-2">';
			        ui += `<form><input class="form-control form-control-sm" type="text" value="${items}" readonly></form>`;
			        ui += '</div><div class="col-4 col-sm-3 col-md-3 col-lg-3 col-xl-3">';
			        ui += `<button id="devSaveBtn${items}" class="btn btn-dark btn-sm btn-block devregbtn" ${devCnt >= 10 ? 'disabled' : ''} onclick='registerDev("${mac}", "${items}", "${id}")'>${lang[flags.pref.lang].general.addlbl}</button></div></div>`;
			    });
			    $('#scanDevModal .scanDevList').html(ui);
			} else {
				$('#scanDevModal .scanDevList').html(`<p class="text-center mb-0 px-3 pt-2 pb-3">${lang[flags.pref.lang].cluster.scandev.prompt.none}</p>`);
			}
		},
		fail: function() {

		}
	});

    // temporary event
    // use case w/ data
    // var testData = [
    //     {
    //         'id': 1,
    //         'name': 'dummy1',
    //     }, 
    //     {
    //         'id': 2,
    //         'name': 'dummy2'
    //     }
    // ];
    // var test = '';
    // testData.map((items, index) => {
    //     test += '<div class="row no-gutters mb-2">';
    //     test += '<div class="col-8 col-sm-9 col-md-9 col-lg-9 col-xl-9 pr-2">';
    //     test += `<form><input id="${'devInput' + index + '_'}" class="form-control form-control-sm" type="text" data-did="${items['id']}" value="${items['name']}" readonly></form>`;
    //     test += '</div><div class="col-4 col-sm-3 col-md-3 col-lg-3 col-xl-3">';
    //     test += `<button id="${'btn' + items['id']}" class="btn btn-dark btn-sm btn-block" onclick=''}>${lang[flags.pref.lang].general.addlbl}</button></div></div>`;
    // });
    // $('#scanDevModal .scanDevList').html(test);
    // use case w/o data
    // $('#scanDevModal .scanDevList').html(`<p class="text-center mb-0 px-3 pt-2 pb-3"><span role="status" class="spinner-border spinner-border text-primary"></span></p>`);
    // setTimeout(() => {
    //    $('#scanDevModal .scanDevList').html(`<p class="text-center mb-0 px-3 pt-2 pb-3">${lang[flags.pref.lang].cluster.scandev.prompt.none}</p>`);
    // }, 1000);
}

/* Disable add/delete button(s) when a device is processing
 * Reenable after routine is done
 */
function disableButtons(btntype) {
	// Get all existing save btns
	const saveBtnIdsToDisable = [];
	const saveBtnElements = document.querySelectorAll(`[id^="${btntype}"]`);
	for (var i = 0; i < saveBtnElements.length; i++) {
		const elemId = saveBtnElements[i].id;
		!$(`#${elemId}`).attr('disabled') && saveBtnIdsToDisable.push(elemId); 
	}
	// Disable all
	saveBtnIdsToDisable.map(id => {
		$(`#${id}`).attr('disabled', true);
		$(`#${id}`).addClass('wait-routine');
	});
}

function reenableButtons(btntype) {
	$('button.wait-routine .fa-check-circle').parent().removeClass('wait-routine');
	$('button.wait-routine').attr('disabled', false);
	$('button.wait-routine').removeClass('wait-routine');
}

function registerDev(mac, nodeid, clusterid) {
	var defmac = "DEFAULT";
	$.ajax({
		type: 'POST',
		url: 'php/config/countRegDev.php',
		dataType: 'json',
		data: { mac: defmac },
		async: true,
		success: function(data) {
			const devCnt = parseInt(data);
			if (devCnt >= 10) {
				$('.devregbtn').attr('disabled', true);
			} else {
				// execRegisterDev(mac, nodeid, devCnt);
				sendESPConfig(mac, nodeid, devCnt, clusterid);
			}
			$('#scanDevModal .scanStatus > span').html(`${devCnt} ${devCnt >= 10 ? '<span class="text-danger">(MAX)</span>' : ''}`);
		},
		fail: function() {

		}
	});
}

// before : execute device registration -> prompt success
function execRegisterDev(mac, nodeid, devcnt, clusterid) {
	var deviceCnt = devcnt;
	// $(`#devSaveBtn${nodeid}`).html('<span role="status" class="spinner-border spinner-border-sm text-primary"></span>');
	$.ajax({
		type: 'POST',
		url: 'php/config/registerDeviceHandler.php',
		dataType: 'json',
		data: { 
			cmd: 'add', 
			mac: mac,
			dev: nodeid,
			cnf: '',
		},
		async: true,
		success: function(data) {
			var parsedData = JSON.parse(data);
			var ret;
			if (parsedData.length >= 2) {
				ret = (parsedData[1]).split(' ');
			} else {
				ret = (parsedData[0]).split(' ');
			}

			if (ret[0] == "Success") {
				$(`#devSaveBtn${nodeid}`).html('<i class="fas fa-check-circle text-success"></i>');
				$(`#devSaveBtn${nodeid}`).attr('disabled');
				deviceCnt++;
			} else {
				$(`#devSaveBtn${nodeid}`).html('<i class="fas fa-times-circle text-danger"></i>');
			}
			reenableButtons("devSaveBtn");
			$('#scanDevModal .closelbl').prop('disabled',false);
			$('#scanDevModal .close').prop('disabled',false);
			$('#scanDevModal .startlbl').prop('disabled',false);

			var clusterSize = 0;
			$.ajax({
				type: 'POST',
				url: 'php/config/loadClusterBasicInfo.php',
				data: { id: clusterid },
				dataType:'json',
				async: true,
				success: function(retData) {
					// * Check if data is empty * //
					if(!(retData === null)) {
						clusterSize = parseInt(retData.size);
						// $('#removeDevModal .removeStatus > span').html(`${clusterSize <= 0 ? 0 : clusterSize}`);
						$('#scanDevModal .scanStatus > span').html(`${clusterSize} ${clusterSize >= 10 ? '<span class="text-danger">(MAX)</span>' : ''}`);
					}
				},
				fail: function(errThrown) {
					console.log('Failed: ' + errThrown);
				}
			});

			// $('#scanDevModal .scanStatus > span').html(`${deviceCnt} ${deviceCnt >= 10 ? '<span class="text-danger">(MAX)</span>' : ''}`);
		},
		fail: function() {

		}
	});
}

// after : send SSID & pass to ESP -> wait ACK -> execute device registration -> prompt success
function sendESPConfig(mac, nodeid, devcnt, clusterid) {
	var param = "";

	// disable CANCEL and close buton
	// $('#scanDevModal .closelbl').prop('disabled',true);
	// $('#scanDevModal .close').prop('disabled',true);

	for (item in clusterTempList) {
		if (clusterTempList[item]['mac'] == mac) {
			param = `${clusterTempList[item]['ssid']},${clusterTempList[item]['pass']}`;
			break;
		}
	}

	if (param === "") {
		showPrompt(lang[flags.pref.lang].cluster.viewCluster.cluster.detailfail, "Error");
		return;
	}

	// disable CANCEL and close buton
	$('#scanDevModal .closelbl').prop('disabled',true);
	$('#scanDevModal .close').prop('disabled',true);
	$('#scanDevModal .startlbl').prop('disabled',true);
	disableButtons("devSaveBtn");

	$(`#devSaveBtn${nodeid}`).html('<span role="status" class="spinner-border spinner-border-sm text-primary"></span>');

	$.ajax({
		type: 'POST',
		url: 'php/config/registerDeviceHandler.php',
		dataType: 'json',
		data: { 
			cmd: 'espconfig', 
			mac: mac,
			dev: nodeid,
			cnf: param,
		},
		async: true,
		success: function(data) {
			var ret = false;
			var parsedData = JSON.parse(data);
			for(var i = 0; i < parsedData.length; i++) {
				if ((parsedData[i]).indexOf('ACK') >= 0) {
					execRegisterDev(mac, nodeid, devcnt, clusterid)
				} else {
					$(`#devSaveBtn${nodeid}`).html('<i class="fas fa-times-circle text-danger"></i>');
					reenableButtons("devSaveBtn");
					$('#scanDevModal .closelbl').prop('disabled',false);
					$('#scanDevModal .close').prop('disabled',false);
					$('#scanDevModal .startlbl').prop('disabled',false);
				}
			}
		},
		fail: function() {

		}
	});
}

/**SMALL SYSTEM:
 * Add devid on function params
 * Removed draggable functions for Manage Device, transferred delete on View Devices
 */
function removeRegisterDev(devid, mac, nodeid, clusterid, callback) {
	$.ajax({
		type: 'POST',
		url: 'php/config/registerDeviceHandler.php',
		dataType: 'json',
		data: { 
			cmd: 'remove', 
			mac: mac,
			dev: nodeid,
		},
		async: true,
		success: function(data) { /**must add checking SUCCESS here */
			// console.log("Removal status: " + data);
			var parsedData = JSON.parse(data);
			var ret;
			if (parsedData.length >= 2) {
				ret = (parsedData[1]).split(' ');
			} else {
				ret = (parsedData[0]).split(' ');
			}

			if (ret[0] == "Success") {
				// console.log("SUCCESS: REMDEV");
				$.ajax({
					type: 'POST',
					url: 'php/config/setDeviceArchive.php',
					dataType: 'json',
					data: { id: devid , archived: '1' },
					async: true,
					success: function(data) {
						$('#removeDevModal .cancellbl').prop('disabled',false);
						$('#removeDevModal .close').prop('disabled',false);
						$('#removeDevModal .refreshlbl').prop('disabled',false);
						if(data == 'success') {
							// $('#removeDevModal .cancellbl').prop('disabled',false);
							// $('#removeDevModal .close').prop('disabled',false);
                            $(`#devRemoveBtn${devid}`).html(lang[flags.pref.lang].cluster.removedev.removed + ' <i class="fas fa-check-circle text-success"></i>');
							reenableButtons('devRemoveBtn');

							var clusterSize = 0;
							$.ajax({
								type: 'POST',
								url: 'php/config/loadClusterBasicInfo.php',
								data: { id: clusterid },
								dataType:'json',
								async: true,
								success: function(retData) {
									// * Check if data is empty * //
									if(!(retData === null)) {
										clusterSize = parseInt(retData.size);
										$('#removeDevModal .removeStatus > span').html(`${clusterSize <= 0 ? 0 : clusterSize}`);
									}
								},
								fail: function(errThrown) {
									console.log('Failed: ' + errThrown);
								}
							});
							// console.log("SUCCESS: Set to archive");
							// showPrompt(lang[flags.pref.lang].cluster.manageDevices.prompt.success.devremoved, 'Success');
						} else {
							// console.log("FAILED: Set to archive");
							$(`#devRemoveBtn${devid}`).html('<i class="fas fa-times-circle text-danger"></i>');
							reenableButtons('devRemoveBtn');
							$('#removeDevModal').modal('hide');
							showPrompt(lang[flags.pref.lang].cluster.manageDevices.prompt.failed.devremoved, 'Failed');
							// $(`#devDeleteBtn${devid}`).html('<i class="fa fa-trash"></i>');
						}
					},
					fail: function() {
						// dragDeleteItem = '';
					}
				});
			}
			else {
				// console.log("FAILED: REMDEV");
				$('#removeDevModal').modal('hide');
				showPrompt(lang[flags.pref.lang].cluster.manageDevices.prompt.failed.devremoved, 'Failed');
				// error prompt here!
			}
			$('#viewDevicesBtn').click();
			if (typeof callback === 'function') {
				callback();
			}
		},
		fail: function() {

		}
	});
}

function sendESPConfigDef(devid, mac, nodeid, clusterid) {
	var param = "LS_GEMBA_AP0,LINESEIKI";

	// disable CANCEL and close buton
	$('#removeDevModal .cancellbl').prop('disabled',true);
	$('#removeDevModal .close').prop('disabled',true);
	$('#removeDevModal .refreshlbl').prop('disabled',true);
	disableButtons('devRemoveBtn');

	// $('#removeDevModal .removeDevList').html(`<p class="text-center mb-0 px-3 pt-2 pb-3"><span role="status" class="spinner-border spinner-border text-primary"></span></p>`);
	$(`#devRemoveBtn${devid}`).html('<span role="status" class="spinner-border spinner-border-sm text-primary"></span>');

	$.ajax({
		type: 'POST',
		url: 'php/config/registerDeviceHandler.php',
		dataType: 'json',
		data: { 
			cmd: 'espconfig', 
			mac: mac,
			dev: nodeid,
			cnf: param,
		},
		async: true,
		success: function(data) {
			var ret = false;
			var parsedData = JSON.parse(data);
			for(var i = 0; i < parsedData.length; i++) {
				if ((parsedData[i]).indexOf('ACK') >= 0) {
					// console.log("Sent default ESP config");
					removeRegisterDev(devid, mac, nodeid, clusterid);
				} else {
					$('#removeDevModal .cancellbl').prop('disabled',false);
					$('#removeDevModal .close').prop('disabled',false);
					$('#removeDevModal .refreshlbl').prop('disabled',false);
					$(`#devRemoveBtn${devid}`).html('<i class="fas fa-times-circle text-danger"></i>');
					reenableButtons('devRemoveBtn');

					$('#removeDevModal').modal('hide');
					showPrompt(lang[flags.pref.lang].cluster.manageDevices.prompt.failed.devremoved, 'Failed');
				}
			}
		},
		fail: function() {

		}
	});
}

var devUpdateFailedList = [];
function sendUpdatedESPConfig(newconfig, devlist) {
	devUpdateFailedList = [];
	return new Promise(function(resolve) {
		var param = "";
		param = param.concat(newconfig.ssid, ",", newconfig.pass);
		if (param === "") {
			showPrompt(lang[flags.pref.lang].cluster.viewCluster.cluster.detailfail, "Error");
			resolve ('fail');
			return;
		}

		var items = [];

		if (devlist.length == 0) {
			resolve ('fail');
			return;
		}

		for (var i = 0; i < devlist.length; i++) {
			var devid = devlist[i].id;
			var nodeid = devlist[i].node;
			items.push({
				cmd: 'espconfig', 
				mac: newconfig.mac,
				dev: nodeid,
				cnf: param,
			});
		}
		console.log(items);

		$('#snsModal .snsPrompt').html(lang[flags.pref.lang].cluster.editModal.prompt.editLoading);
		$('#snsModal').modal('show');

		var ajax_request = function(item) {
			var deferred = $.Deferred();

			$.ajax({
				type: 'POST',
				url: 'php/config/registerDeviceHandler.php',
				dataType: 'json',
				data: item,
				success: function(data) {
					console.log(data);
					var dataArr = data.split(" ");
					if (dataArr.indexOf('Failed') >= 0) {
						devUpdateFailedList.push(dataArr[1]);
					}
					deferred.resolve(data);
				},
				error: function(error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		}

		var looper = $.Deferred().resolve();

		// go through each item and call the ajax function
		$.when.apply($, $.map(items, function(item, i) {
			looper = looper.then(function() {
			// trigger ajax call with item data
				return ajax_request(item);
			});
			console.log("looper: " + looper);
			return looper;
		})).then(function() {
			// run this after all ajax calls have completed
			$('#snsModal').modal('hide');
			console.log("devUpdateFailed: " + devUpdateFailedList);
			console.log('Done ESP config sending');
			if (devUpdateFailedList.length > 0) {
				//Gold: prompt to inform user that some commands failed
				resolve ('failed');
			} else {
				resolve ('success');
			}
			// resolve ('success');
		});
	});
}

function showNwkSaveRetryModal(newconfig, deviceList) {
	/**get device list */
	var devFailedList = [];
	var ui = '';
	for (i in deviceTempList) {
		if (deviceList.includes(deviceTempList[i].node)) {
			devFailedList.push(deviceTempList[i]);
		}
	}
	console.log("Failed update: " + devFailedList);

	devFailedList.map((items, index) => {
		ui += '<div class="row no-gutters mb-2">';
		ui += '<div class="col-8 col-sm-9 col-md-9 col-lg-9 col-xl-9 pr-2">';
		ui += `<form><input class="form-control form-control-sm" type="text" value="${items['name']}" readonly></form>`;
		ui += '</div></div>';
	});
	$('#retryNwkSaveModal .devFailedList').html(ui);

	$('#retryNwkSaveModal').modal('show');

	$('#retryNwkSaveBtn').off().on('click', function () {
		// send updated config to failed devices..
		$('#retryNwkSaveModal').modal('hide');
		$('#editCluster').modal('show');
		// sendUpdatedESPConfig(newconfig, devFailedList).then(function(value) {
		// 	console.log(value);
		// 	if (value == 'success') {	
		// 		// setBS(toSave).then(function(value) {
		// 		// 	console.log(value);	
		// 		// 	clusterViewOnly();	
		// 		// 	doneESPconfig = false;
		// 		// });
		// 		console.log("success yarn!");
		// 	} else {
		// 		//Gold: prompt to inform user that some commands failed
		// 		console.log ("SSID update failed for some devices.  Try again!")
		// 		showNwkSaveRetryModal(newconfig, devUpdateFailedList);
		// 	}
		// });
	});

	$('#nwkSaveYes').off().on('click', function () {
		// save config to server hostapd
		$('#retryNwkSaveModal').modal('hide');
		setBS(newconfig).then(function(value) {
			console.log(value);	
			clusterViewOnly();	
		});
	});

	$('#nwkSaveNo').off().on('click', function () {
		// do not save new config to hostapd
		$('#retryNwkSaveModal').modal('hide');
	});

}


/**
 * TODO: collect the following data for apply execution later
 * 1. All deleted devices
 * 2. All Moved devices
 **/
function delOrSwitch(src, dest, destul, sender) {
	if (dest.html() == "--") {
		dest.appendTo("#" + src);
		return;
	}

	var tmp = dest;
	var t1 = tmp.eq(0).attr('id');
	var t2 = tmp.prevObject.eq(0).attr('id');

	if (t1 == t2) {
		tmp = $("#" + destul + " > li").last();
		t2 = tmp.eq(0).attr('id');
	} else {
		tmp = dest.prevObject;
	}

	dragOptions = {
		dest: dest,
		destul: destul,
		src: tmp,
		srcul: src,
		sender: sender,
	};

	$('#dragOptionModal').on('hide.bs.modal', function() {
		$(dragOptions.sender).sortable('cancel');
	});

	$('#dragOptionModal .swtlbl').off().on('click', function () {
		dragOptions.src.appendTo("#" + dragOptions.destul);
		dragOptions.dest.appendTo("#" + dragOptions.srcul);
		dragOptions = "";

		// var [destTtle, srcNewClu, destId] = t1.split('-');
		// var [srcTtle, dstNewClu, srcId] = t2.split('-');

		// $(`#${destTtle}-${srcNewClu}-${destId}`).attr('data-nmac', dstNewClu);
		// $(`#${srcTtle}-${dstNewClu}-${srcId}`).attr('data-nmac', srcNewClu);
	});

	$('#dragOptionModal .remlbl').off().on('click', function () {
		var elem = dragOptions.dest.eq(0);

		// remove from array first
		// const remObj = elem.attr('data-did');
		// for (i in clusterArray) {
		// 	for (j in clusterArray[i]) {
		// 		if (clusterArray[i][j]['devdid'] == remObj) {
		// 			clusterArray[i].splice(j, 1);
		// 		}
		// 	}
		// }

		elem.html('--');
		elem.attr('data-node', '');
		elem.attr('data-mac', '');
		elem.attr('title', "No device");
		// elem.attr('data-did', '');
		elem.attr('data-ord', '');
		elem.attr('style', '');
		dragOptions.src.appendTo("#" + dragOptions.destul);
		dragOptions.dest.appendTo("#" + dragOptions.srcul);
		dragOptions = "";
	});

    $('#dragOptionModal .modal-body').html(`${lang[flags.pref.lang].cluster.manageDevices.prompt.dragOption.title} ${dragOptions.dest.html()}.
        <ul style="padding-left: 18px;">
            <li style="list-style: revert !important;">
                ${lang[flags.pref.lang].cluster.manageDevices.prompt.dragOption.switch1} ${dragOptions.dest.html()} -> ${dragOptions.src.html()} ${lang[flags.pref.lang].cluster.manageDevices.prompt.dragOption.switch2}
            </li>
            <li style="list-style: revert !important;">
                ${lang[flags.pref.lang].cluster.manageDevices.prompt.dragOption.remove} ${dragOptions.dest.html()}
            </li>
        </ul>`);
	$('#dragOptionModal').modal('show');
}

function customSort(property) {
    var sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if(sortOrder == -1){
            // return b[property].toString().localeCompare(a[property].toString());
            return b[property] - a[property];
        }else{
            // return a[property].toString().localeCompare(b[property].toString());
            return a[property] - b[property];
        }        
    }
}