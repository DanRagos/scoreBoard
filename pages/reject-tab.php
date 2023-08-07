<div id="reject-tab" class="tab-pane fade" role="tabpanel">
                <!-- Start: header -->
                <div id="reject-subheader">
                    <span id="reject-title">Reject</span>
                    <button id="reject-today-btn" type="button" class="btn dark btn-sm today-btn"><i class="fas fa-cloud-sun kulayng-araw"></i><span>&nbsp;Today</span></button>
                    <div id="reject-fr" class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text dark" id="inputGroup-sizing-sm" style="width: 49px !important;"><i class="fa fa-calendar"></i>&nbsp;Fr</span>
                        </div>
                        <input type="text" class="form-control dateFr" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readonly="" placeholder="-- / -- / --">
                    </div>
                    <div id="reject-to" class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text dark" id="inputGroup-sizing-sm"><i class="fa fa-calendar"></i>&nbsp;To</span>
                        </div>
                        <input type="text" class="form-control dateTo" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readonly="" placeholder="-- / -- / --">
                    </div>
                    
                    <button id="reject-view-btn" type="button" class="btn dark btn-sm view-btn"><i class="fas fa-calendar-check"></i><span>&nbsp;View</span></button>
                    <button id="reject-filter-btn" type="button" class="btn dark btn-sm filter-btn"><i class="fa fa-filter"></i><span>&nbsp;Filter</span></button>
                    <button id="toggle-reject" type="button" class="btn dark btn-sm table-opt"><span>Show Options</span>&nbsp;<i class="fas fa-caret-down"></i></button>
                </div>
                <!-- <div class="page-subheader-tbl">
                    <div>
                        <div class="row">
                            <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                                <label id="pgeRejecttitle" class="col-form-label px-3 w-100">Rejects</label>
                            </div>
                            <div class="col-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
                                <div class="float-right header-btn-grp w-100 h-100">
                                    <button class="btn btn-dark btn-sm table-header-btn filter-btn" id="reject-filter" type="button">
                                        <i class="fa fa-filter"></i>&nbsp;
                                        <span>Filter</span>
                                    </button>
                                    <button class="btn btn-dark btn-sm table-header-btn view-btn" type="button">
                                        <i class="fas fa-calendar-check"></i>
                                        <span>&nbsp;View</span>
                                    </button>
                                    Start: To
                                    <div class="table-header-btn date-container date-realign-2">
                                        <div class="input-group input-group-sm">
                                            <div class="input-group-prepend">
                                                <span class="bg-dark border-dark input-group-text" style="color: rgb(255,255,255);">
                                                <i class="fa fa-calendar"></i>
                                                    &nbsp;To
                                                </span>
                                            </div>
                                            <input class="border-dark form-control dateTo" type="text" style="background-color: transparent;" readonly="" placeholder="-- / -- / --">
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
                                            <input class="border-dark form-control dateFr" type="text" style="background-color: transparent;" readonly="" placeholder="-- / -- / --">
                                        </div>
                                    </div>
                                    End: From
                                    <button class="btn btn-dark active btn-sm table-header-btn today-btn" type="button"><i class="fas fa-cloud-sun kulayng-araw"></i><span>&nbsp;Today</span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> -->
                <!-- End: header -->
                <!-- Start: table -->
                <div id="reject-content" class="tbl-container">
                    <div class="table-responsive text-center">
                        <table class="table table-sm nowrap" id="rejectTbl" collspacing="0" width="100%">
                            <thead>
                                <tr>
                                    <th>Machine</th>
                                    <th>Job Order</th>
                                    <th>Production Start</th>
                                    <th>Production End</th>
                                    <th>Model</th>
                                    <th>Material</th>
                                    <th>Output Quantity</th>
                                    <th>Reject Quantity</th>
                                    <th>Reject Remarks</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
                <!-- End: table -->
            </div>