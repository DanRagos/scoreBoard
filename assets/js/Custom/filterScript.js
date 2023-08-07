/** Guidelines 
 *	1. Get data from db
 *	2. Get items per key
 * 	3. Combine previous selected items and 
 *		recent received data
 *	4. Removed redundant data
 *	5. Filter data based on selected items
 *	6. Update filter selection
**/
function updateFilterSelection(rawDataset, refDataset, selectedDataset, isFiltered) {
	var newDataset = [], tempDataset = [], filterDataset = [];
	console.log(refDataset);

	var selectedItemsCnt = $('#filterModal .modal-body h6 .value').html();
	// selectedItemsCnt = selectedItemsCnt.split(' ');

	if(isFiltered && !$.isEmptyObject(selectedDataset) && parseInt(selectedItemsCnt) > 0) {
		/** original set of data **/
		for(var i = 0; i < rawDataset.length; i++) {
			var indexedData = rawDataset[i], isPresent = true;
			/** find if the indexed data is present on the seleted array **/
			for(var j = 0; j < refDataset.length; j++) {
				if(!$.isEmptyObject(selectedDataset[j])) {
					 console.log('Is ' + indexedData[ filterKeys[ refDataset[j] ] ] + ' present on ' + selectedDataset[j]);
					if(selectedDataset[j].indexOf(indexedData[ filterKeys[ refDataset[j] ] ]) < 0) {
						isPresent = false;
						break;
					}
				}
			}
			if(isPresent) {
				filterDataset.push(indexedData);
			
			}
		}
	} else {
		filterDataset = rawDataset;
	}
	
	/** Get value by key using reference array **/
	if(!$.isEmptyObject(filterDataset)) {
		console.log('not empty');
		for(var i = 0; i < refDataset.length; i++) {
			tempDataset[i] = [];
			for(var j = 0; j < filterDataset.length; j++) {
				tempDataset[i].push( filterDataset[j][ filterKeys[ refDataset[i] ] ] );
			}
		}
	} else {
		for(var i = 0; i < refDataset.length; i++) {
			tempDataset[i] = [];
		}
	}
	console.log(tempDataset);
	/** add the previously selected items **/
	if(!$.isEmptyObject(selectedDataset)) {
		for(var i = 0; i < refDataset.length; i++) {
			$.merge( tempDataset[i], selectedDataset[i] );
		}
	}

	/** sort then remove redundant **/
	for(var i = 0; i < tempDataset.length; i++) {
		var collator = new Intl.Collator('en', {numeric: true, sensitivity: 'base'});
		var dataset = tempDataset[i].sort((a, b) => collator.compare(a, b));
		var unq = new Set(dataset);
		newDataset.push( [...unq] );
	}
	
	var selectiveTranslation = [ 'PRODUCTIVE', 'UNPRODUCTIVE', 'COMPLETED*', 'COMPLETED', 'CONTINUED' ];
	var elem = $('#filterModal .modal-body').find('select.selectpicker');
	/** update filter selection content **/
	for(var i = 0; i < elem.length; i++) {
		var options = '';
		for(var j = 0; j < newDataset[i].length; j++) {
			options += '<option value="' + newDataset[i][j] + '">';
			if (selectiveTranslation.indexOf(newDataset[i][j]) > -1) {
				options += lang[flags.pref.lang].status[ newDataset[i][j] ];
			} else {
				options += newDataset[i][j];
			}
			options += '</option>';
		}
		$(elem[i]).html(options);
	}
	
	/** set selected items **/
	for(var i = 0; i < elem.length; i++) {
		if(!$.isEmptyObject(selectedDataset)) {
			$(elem[i]).selectpicker('val', selectedDataset[i]);
		}
	}

	/** update filter selection UI **/
	$('#filterModal .selectpicker').selectpicker("refresh");
	
	return filterDataset;
}

function getSelectedItems(elem) {
	var selItemsAttr = {
		'categoryIndex': '',
		'categoryOptions': [],
		'categoryRef': {},
		'categoryElem': {},
		'totalSelected': 0
	}

	selItemsAttr.categoryOptions = $(elem).val();
	selItemsAttr.categoryElem = $('#filterModal .bootstrap-select');

	for(var i = 0; i < selItemsAttr.categoryElem.length; i++) {
		if($(selItemsAttr.categoryElem[i]).hasClass('show')) {
			selItemsAttr.categoryIndex = i;
			break;
		}
	}

	switch(flags.currPage) {
		case 'summary-tab':
			selItemsAttr.categoryRef = flags.summary.selectedFilter;
			flags.summary.selectedFilter = initSelectedFilterArray(selItemsAttr);
			selItemsAttr.totalSelected = getSelectedItemsCount(flags.summary.selectedFilter);
			break;

		case 'reject-tab':
			selItemsAttr.categoryRef = flags.reject.selectedFilter;
			flags.reject.selectedFilter = initSelectedFilterArray(selItemsAttr);
			selItemsAttr.totalSelected = getSelectedItemsCount(flags.reject.selectedFilter);
			break;

		case 'unproductive-tab':
			selItemsAttr.categoryRef = flags.unproductive.selectedFilter;
			flags.unproductive.selectedFilter = initSelectedFilterArray(selItemsAttr);
			selItemsAttr.totalSelected = getSelectedItemsCount(flags.unproductive.selectedFilter);
			break;

		case 'schedule-tab':
			selItemsAttr.categoryRef = flags.schedule.selectedFilter;
			flags.schedule.selectedFilter = initSelectedFilterArray(selItemsAttr);
			selItemsAttr.totalSelected = getSelectedItemsCount(flags.schedule.selectedFilter);
			break;

		default:
			break
	}

	$('#filterModal .modal-body .itemSel > .value').html(selItemsAttr.totalSelected);

	var applyBtn = $('#apply-filter-btn');
	if(!$(applyBtn).find('input').attr('checked')) {
		$(applyBtn).click();
	}
}

function initSelectedFilterArray(data) {
	var newArray = data.categoryRef;
	if($.isEmptyObject(newArray)) {
		for(var i = 0; i < data.categoryElem.length; i++) {
			newArray[i] = [];
		}
	}
	newArray[data.categoryIndex] = data.categoryOptions;

	return newArray;
}

function getSelectedItemsCount(dataset) {
	var cnt = 0;
	for(var i = 0; i < dataset.length; i++) {
		cnt += dataset[i].length;
	}
	return cnt;
}

const disableFilterLight = () => {
	$('#' + flags.currPage + ' .filter-btn').removeClass('icon-active');
};

const enableFilterLight = () => {
	$('#' + flags.currPage + ' .filter-btn').addClass('icon-active');
}

function setFilterAttributes() {
	var itemCnt = 0, arrElem = [];

	switch(flags.currPage) {
		case 'summary-tab':
			arrElem = flags.summary.selectedFilter;
			$('#apply-filter-btn').find('input').attr('checked', flags.summary.isFiltered);
			break;

		case 'reject-tab':
			arrElem = flags.reject.selectedFilter;
			$('#apply-filter-btn').find('input').attr('checked', flags.reject.isFiltered);
			break;

		case 'unproductive-tab':
			arrElem = flags.unproductive.selectedFilter;
			$('#apply-filter-btn').find('input').attr('checked', flags.unproductive.isFiltered);
			break;

		case 'schedule-tab':
			arrElem = flags.schedule.selectedFilter;
			$('#apply-filter-btn').find('input').attr('checked', flags.schedule.isFiltered);
			break;

		default:
			break
	}

	for(var i = 0; i < arrElem.length; i++) {
		itemCnt += arrElem[i].length;
	}

	$('#filterModal .modal-body .itemSel > .value').html(itemCnt);
}

function getAllScheduleId(refDataset) {
	var newSet = [], filteredSet = [];

	for(var i = 0; i < refDataset.length; i++) {
		newSet.push(refDataset[i].devsid);
	}

	if(!$.isEmptyObject(newSet)) {
		var collator = new Intl.Collator('en', {numeric: true, sensitivity: 'base'});
		var dataset = newSet.sort((a, b) => collator.compare(a, b));
		var unq = new Set(dataset);
		filteredSet = [...unq];
	}

	return filteredSet;
}

function relateSummaryAndUnproductiveData(schedId, unprodData) {
	var newDataSet = [];

	for(var i = 0; i < unprodData.length; i++) {
		if(schedId.indexOf(unprodData[i].devsid) != -1) {
			newDataSet.push(unprodData[i]);
		}
	}

	return newDataSet;
}