<div id="detail-tab" class="tab-pane fade" role="tabpanel">
                <div id="detail-subheader">
                    <span id="detail-title">JO Time Chart</span>
                    <button id="detail-refresh-btn" type="button" type="button" class="btn dark btn-sm"><i class="fas fa-sync"></i> <span>Refresh</span></button>
                    <button id="detail-show-data-btn" type="button" class="btn dark btn-sm"><i class="fas fa-table text-success"></i> <span>Show Data</span></button>
                    <button id="detail-export-btn" type="button" type="button" class="btn dark btn-sm"><i class="fa fa-download text-success"></i> <span>Export</span></button>
                    <div id="detail-fr" class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text dark" id="inputGroup-sizing-sm"><i class="fa fa-calendar"></i>&nbsp;Fr</span>
                        </div>
                        <input type="text" class="form-control dateFr" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readonly="" placeholder="-- / -- / --">
                    </div>
                    <div id="detail-to" class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text dark" id="inputGroup-sizing-sm"><i class="fa fa-calendar"></i>&nbsp;To</span>
                        </div>
                        <input type="text" class="form-control dateTo" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readonly="" placeholder="-- / -- / --">
                    </div>
                    <button id="detail-view-btn" type="button" type="button" class="btn dark btn-sm"><i class="fas fa-calendar-check"></i> <span>View</span></button>
                    <select id="detail-detailDevice" class="form-control form-control-sm dark" style="text-overflow: ellipsis;">
                        <option value='0' hidden selected class="no-dev-lbl">No Device Selected</option>
                    </select>
                    <select id="detail-detailJobs" class="form-control form-control-sm dark" style="text-overflow: ellipsis;">
                        <option value='0' hidden selected class="no-job-lbl">No Job Selected</option>
                    </select>
                    <button id="toggle-detail" type="button" class="btn dark btn-sm table-opt"><span>Show Options</span>&nbsp;<i class="fas fa-caret-down"></i></button>
                </div>
                <!-- Start: header
                <div class="page-subheader-tbl">
                    <div>
                        <div class="row">
                            <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"><label id="pgeDetailtitle" class="col-form-label px-3 w-100">Detailed Logs</label></div>
                            <div class="col-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
                                <div class="float-right header-btn-grp w-100 h-100">
                                    <select class="form-control-sm btn-dark text-truncate" id="detailJobs" disabled>
                                        <option class='no-job-lbl'>No Job Selected</option>
                                    </select>
                                    <select class="form-control-sm btn-dark text-truncate" id="detailDevice">
                                        <option class="no-dev-lbl">No Device Selected</option>
                                    </select>
                                    <button class="btn btn-dark btn-sm table-header-btn view-btn" type="button">
                                        <i class="fas fa-calendar-check"></i><span>&nbsp;View</span>
                                    </button>
                                    Start: To
                                    <div class="table-header-btn date-container date-realign-2">
                                        <div class="input-group input-group-sm">
                                            <div class="input-group-prepend">
                                                <span class="bg-dark border-dark input-group-text" style="color: rgb(255,255,255);">
                                                    <i class="fa fa-calendar"></i>&nbsp;To
                                                </span>
                                            </div>
                                            <input class="border-dark form-control dateTo" type="text" style="background-color: transparent;"
                                                readonly="" placeholder="-- / -- / --"/>
                                        </div>
                                    </div>
                                    End: To
                                    Start: From
                                    <div class="table-header-btn date-container date-realign-1">
                                        <div class="input-group input-group-sm">
                                            <div class="input-group-prepend">
                                                <span class="bg-dark border-dark input-group-text" style="color: rgb(255,255,255);">
                                                    <i class="fa fa-calendar"></i>&nbsp;Fr
                                                </span>
                                            </div>
                                            <input class="border-dark form-control dateFr" type="text" style="background-color: transparent;"
                                                readonly="" placeholder="-- / -- / --"/>
                                        </div>
                                    </div>
                                    End: From
                                    <button class="btn btn-dark active btn-sm table-header-btn today-btn" type="button">
                                        <i class="fas fa-cloud-sun kulayng-araw"></i><span>&nbsp;Today</span>
                                    </button>
                                    <button class="btn btn-dark btn-sm table-header-btn" id="detail-export-btn"
                                        type="button">
                                        <i class="fa fa-download text-success"></i>
                                        <label class="m-0">&nbsp;<span class="exportlbl">Export</span></label>
                                    </button>
                                    <button class="btn btn-dark btn-sm table-header-btn" id="detail-show-data-btn"
                                        type="button">
                                        <i class="fas fa-table text-success"></i>
                                        <label class="m-0">&nbsp;<span class="showdatalbl">Show data</span></label>
                                    </button>
                                    <button class="btn btn-dark btn-sm table-header-btn refresh-btn" id="detail-refresh-btn" disabled
                                        type="button">
                                        <i class="fas fa-undo"></i>
                                        <label class="m-0">&nbsp;<span>Refresh</span></label>
                                    </button>
                                    
                                    <button class="btn btn-dark btn-sm table-header-btn" id="switch-productivity-data-btn" style="visibility: hidden"
                                        type="button">
                                        <i class="fas fa-sync text-success"></i>
                                        <label class="m-0">&nbsp;<span class="showlbl">Productivity</span></label>
                                    </button>
                                    <button class="btn btn-dark btn-sm table-header-btn" id="graph-btn" type="button">
                                        <i class="fa fa-chart-area"></i>
                                        <label class="m-0">&nbsp;<span class="graphlbl">Graph</span></label>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                End: header -->

                <!-- Start: table -->

                <div id="detail-table-content" style="display: none">
                    <div class="inner-sidepanel sidepanel">
                        <div class="inner-content">
                            <!-- Start: header -->
                            <div class="inner-header">
                                <div class="row no-gutters mb-2">
                                    <div class="col loginfo-header"><label class="col-form-label pl-3">Log Information</label></div>
                                </div>
                            </div>
                            <!-- End: header --><button class="btn btn-danger btn-sm sidepanel-close" type="button"><i class="fa fa-times fa-md"></i></button>
                            <!-- Start: body -->
                            <div class="inner-body">
                                <div class="row no-gutters mb-2 mr-3">
                                    <div class="col-5"><label class="col-form-label px-3">Machine</label></div>
                                    <div class="col"><span class="form-control-plaintext text-right" type="text" id="unprodMch">--</span></div>
                                </div>
                                <div class="row no-gutters mb-2 mr-3">
                                    <div class="col-5"><label class="col-form-label px-3">Job Order</label></div>
                                    <div class="col"><span class="form-control-plaintext text-right" type="text" id="unprodJob">--</span></div>
                                </div>
                                <div class="row no-gutters mb-2 mr-3">
                                    <div class="col-5"><label class="col-form-label px-3">Operator</label></div>
                                    <div class="col"><span class="form-control-plaintext text-right" type="text" id="unprodOpr">--</span></div>
                                </div>
                                <div class="row no-gutters mb-2 mr-3">
                                    <div class="col-5"><label class="col-form-label px-3">Start</label></div>
                                    <div class="col"><span class="form-control-plaintext text-right" type="text" id="unprodStr">--</span></div>
                                </div>
                                <div class="row no-gutters mb-2 mr-3">
                                    <div class="col-5"><label class="col-form-label px-3">End</label></div>
                                    <div class="col"><span class="form-control-plaintext text-right" type="text" id="unprodEnd"></span></div>
                                </div>
                                <div class="row no-gutters mb-2 mr-3">
                                    <div class="col-5"><label class="col-form-label px-3">Event</label></div>
                                    <div class="col"><span class="form-control-plaintext text-right" type="text" id="unprodEvt">--</span></div>
                                </div>
                                <div class="row no-gutters mb-2 mr-3">
                                    <div class="col-5"><label class="col-form-label px-3">Downtime Cause</label></div>
                                    <div class="col"><span class="form-control-plaintext text-right" type="text" id="unprodDcs">--</span></div>
                                </div>
                                <div class="row no-gutters mb-2 mr-3">
                                    <div class="col-12"><label class="col-form-label px-3">Remarks</label></div>
                                </div>
                                <div class="row no-gutters mb-2 mx-3">
                                    <div class="col-12">
                                        <form><textarea class="form-control form-control-sm" id="unprodRem" placeholder="--" rows="6" maxlength="200" style="resize: none;"></textarea>
                                        <!-- <input class="form-control-plaintext font-italic" type="text" id="unprodChr" value="Characters 0/200" readonly=""> -->
                                        <label class="font-italic" for="unprodRem" id="unprodChr">Characters 0/200"</label>
                                    </form>
                                    </div>
                                </div>
                                <div class="row no-gutters mb-3 mr-3">
                                    <div class="col-5"><label class="col-form-label px-3"></label></div>
                                    <div class="col">
                                        <form><input class="form-control form-control-sm" type="text" id="unprodRid" placeholder="Required Field" hidden=""></form>
                                    </div>
                                </div>
                                <div class="row no-gutters mb-3 mr-3">
                                    <div class="col-5"><label class="col-form-label px-3"></label></div>
                                    <div class="col">
                                        <form><input class="form-control form-control-sm" type="text" placeholder="Required Field" hidden=""></form>
                                    </div>
                                </div>
                            </div>
                            <!-- End: body -->
                            <!-- Start: header -->
                            <div class="inner-footer px-3 pb-3">
                                <hr style="margin-top: 5px; margin-bottom: 5px;">
                                <div class="row no-gutters">
                                    <div class="col"><button class="btn btn-dark clearlbl" id="unprodClr" type="button"><i class="fas fa-eraser"></i><label class="mb-0">&nbsp;<span>Clear</span></label></button><button class="btn btn-dark float-right" id="unprodSave" type="button"><i class="fas fa-save"></i>&nbsp;<span>Save</span></button></div>
                                </div>
                            </div>
                            <!-- End: header -->
                        </div>
                    </div>
                    <div class="tbl-container unprodTable sidepanel" style="display: none">
                        <div class="table-responsive text-center">
                            <table class="table table-sm pageResize nowrap" id="unproductiveTbl" collspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>Machine</th>
                                        <th>Job Order</th>
                                        <th>Production Start</th>
                                        <th>Model</th>
                                        <th>Material</th>
                                        <th>Operator</th>
                                        <th>Downtime Source</th>
                                        <th>Downtime Start</th>
                                        <th>Downtime End</th>
                                        <th>Duration</th>
                                        <th>Event</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="tbl-container detailTable" id="timegraph-container">
                
                    <!-- <div id="timegraph-page" style="height: calc(100% - 45px);"> -->
                    <div id="timegraph-page" style="height: 100%;">
                        <!-- <svg id="detailGraph" width="100%" height="100%"></svg> -->
                        <div id="timegraph" style="flex-grow: 1; height: 95%; align-self: center;"></div>
                    </div>
                    <!-- <div id="visual-page" style="position: fixed; height: calc(100% - 85px); width: 100%; padding-top: 6px;"> -->
                        <!-- <div id="visual-container" style="flex-grow: 1; height: 100%; align-self: center;"></div> -->
                    <!-- </div> -->
                    <!-- <div class="text-center text-sm-center text-md-left text-lg-left text-xl-left py-1 pr-1"
                        style="padding-left: 15px;">
                        <button class="btn btn-secondary btn-sm mr-2 refresh-btn" type="button">
                            <i class="fa fa-undo"></i>&nbsp;<span>Refresh</span>
                        </button>
                        <label class="last-update table-update">Last Update: 0000-00-00 00:00:00</label>
                    </div> -->
                </div>
                <!-- End: table -->
            </div>