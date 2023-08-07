  
            <div id="schedule-tab" class="tab-pane fade" role="tabpanel">
                <!-- Start: header -->
                <div class="page-subheader-tbl" id="schedule-subheader-table">
                    <div id="schedule-grp">
                        <span id="pgeSchedtitle">Schedule</span>

                            <?php echo setSchedQRTrigger(); ?>
                            <button class="btn btn-dark btn-sm" id="sched-show-data-btn" type="button">
                                <i class="fas fa-chart-bar text-success"></i>
                                <label class="m-0">&nbsp;
                                    <span class="showdatalbl">Show chart</span>
                                </label>
                            </button>

                            <button class="btn btn-dark btn-sm " id="add-sched-btn"type="button">
                                <i class="fa fa-plus-circle"></i>
                                <label class="m-0">&nbsp;New Schedule</label>
                            </button>
                            <button class="btn btn-dark active btn-sm schedToday" type="button">
                                <i class="fas fa-cloud-sun kulayng-araw"></i>
                                <span>&nbsp;Today</span>
                            </button>                            
                            
                            <!-- Start: From -->
                            <div class="date-container" id="sched-from">
                                <div class="input-group input-group-sm">
                                    <div class="input-group-prepend">
                                        <span class="bg-dark border-dark input-group-text" style="color: rgb(255,255,255);width: 49px !important;">
                                            <i class="fa fa-calendar"></i>&nbsp;Fr
                                        </span>
                                    </div>
                                    <input class="border-dark form-control dateFr schedDate" type="text" style="background-color: transparent;" readonly="" placeholder="-- / -- / --">
                                </div>
                            </div>
                            <!-- End: From -->

                            <!-- Start: To -->
                            <div class="date-container" id="sched-to">
                                <div class="input-group input-group-sm">
                                    <div class="input-group-prepend">
                                        <span class="bg-dark border-dark input-group-text" style="color: rgb(255,255,255);">
                                            <i class="fa fa-calendar"></i>&nbsp;To
                                        </span>
                                    </div>
                                    <input class="border-dark form-control dateTo schedDate" type="text" style="background-color: transparent;" readonly="" placeholder="-- / -- / --">
                                </div>
                            </div>
                            <!-- End: To -->

                            <button class="btn btn-dark btn-sm schedView" type="button">
                                <i class="fas fa-calendar-check"></i>
                                <span>&nbsp;View</span>
                            </button>
                            <!-- temporarily disable QR file upload 221124  -->
                            <!-- <input id="schedQR-input" type="file" accept="image/*" capture="environment" tabindex="-1" onchange="openQRCamera(this)" style="display: none;"> -->
                            <button class="btn btn-dark btn-sm filter-btn" id="schedule-filter" type="button">
                                <i class="fa fa-filter"></i>&nbsp;
                                <span>Filter</span>
                            </button>
                            <button class="btn btn-dark btn-sm table-opt" type="button" id="toggle-sched">
                                <span>Show Options</span>&nbsp;
                                <i class="fas fa-caret-down"></i>
                            </button>
                    </div>
                </div>
                <!-- End: header -->
                <!-- Start: sidepanel -->
                <div id="schedule-content">
                <div class="inner-sidepanel sidepanel">
                    <div class="inner-content">
                        <!-- Start: header -->
                        <div class="inner-header">
                            <div class="row no-gutters mb-3">
                                <div id="schedule-modal-header" class="col"><label class="col-form-label pl-3 schedInfolbl">Schedule Information</label>&nbsp;<i id="lockIcon" class="fa fa-lock text-warning"></i></div>
                            </div><button class="btn btn-danger btn-sm sidepanel-close" type="button"><i class="fa fa-times fa-md"></i></button></div>
                        <!-- End: header -->
                        <!-- Start: body -->
                        <div class="inner-body">
                            <div class="row no-gutters mb-2 mr-3">
                                <div class="col-5"><label class="col-form-label px-3">Machine</label></div>
                                <div class="col"><select class="custom-select custom-select-sm" id="schedID"><option value="">Select Machine</option></select></div>
                            </div>
                            <div class="row no-gutters mb-2 mr-3">
                                <div class="col-5"><label class="col-form-label px-3">Job Order</label></div>
                                <div class="col">
                                    <form><input class="form-control form-control-sm" type="text" maxlength="45" id="schedJOB" placeholder="Required Field"></form>
                                </div>
                            </div>
                            <div class="row no-gutters mb-2 mr-3">
                                <div class="col-5"><label class="col-form-label px-3">Model</label></div>
                                <div class="col">
                                    <form><input class="form-control form-control-sm" type="text" maxlength="45" id="schedMOD"></form>
                                </div>
                            </div>
                            <div class="row no-gutters mb-2 mr-3">
                                <div class="col-5"><label class="col-form-label px-3">Material</label></div>
                                <div class="col">
                                    <form><input class="form-control form-control-sm" type="text" maxlength="45" id="schedMAT"></form>
                                </div>
                            </div>
                            <div class="row no-gutters mb-2 mr-3">
                                <div class="col-5"><label class="col-form-label px-3">Target Quantity</label></div>
                                <div class="col">
                                    <!-- <form><input class="form-control form-control-sm decimal1 num-input" type="number" id="schedTGT" min="0" step="0.1" oninput="this.value=(parseFloat(this.value) < 0 ? 0 : parseFloat(this.value))"></form> -->
                                    <form autocomplete="off"><input class="form-control form-control-sm decimal1" inputmode="numeric" pattern="[0-9]*" type="text" id="schedTGT" onchange="Number.isNaN(parseFloat(this.value)) ? this.value = '' : this.value = parseFloat(this.value)"></form>
                                </div>
                            </div>
                            <div class="row no-gutters mb-2 mr-3">
                                <div class="col-5"><label class="col-form-label px-3">Prewarn</label></div>
                                <div class="col">
                                    <!-- <form><input class="form-control form-control-sm decimal1 num-input" type="number" id="schedPWN" min="0" step="0.1" oninput="this.value=(parseFloat(this.value) < 0 ? 0 : parseFloat(this.value))"></form> -->
                                    <form autocomplete="off"><input class="form-control form-control-sm decimal1" inputmode="numeric" pattern="[0-9]*" type="text" id="schedPWN" onchange="Number.isNaN(parseFloat(this.value)) ? this.value = '' : this.value = parseFloat(this.value)"></form>
                                </div>
                            </div>
                            <div class="row no-gutters mb-2 mr-3">
                                <div class="col-5"><label class="col-form-label px-3">Operator</label></div>
                                <div class="col">
                                    <form><input class="form-control form-control-sm" type="text" maxlength="45" id="schedOPR"></form>
                                </div>
                            </div>
                            <div class="row no-gutters mb-2 mr-3">
                                <div class="col-5"><label class="col-form-label px-3">Scheduled Start</label></div>
                                <div class="col">
                                    <form><input class="form-control form-control-sm" type="text" id="schedfr" readonly="" placeholder="Required Field"></form>
                                </div>
                            </div>
                            <div class="row no-gutters mb-2 mr-3">
                                <div class="col-5"><label class="col-form-label px-3">Scheduled End</label></div>
                                <div class="col">
                                    <form><input class="form-control form-control-sm" type="text" id="schedto" readonly=""></form>
                                </div>
                            </div>
                            <div class="row no-gutters mb-2 mr-3">
                                <div class="col-5"><label class="col-form-label px-3">Cycle Time (seconds)</label></div>
                                <div class="col">
                                    <!-- <form><input class="form-control form-control-sm decimal0 num-input" type="number" min="1" step="1" id="schedCYC" placeholder="Required Field" onchange="this.value=(parseInt(this.value) < 0 ? 0 : parseInt(this.value))"></form> -->
                                    <form autocomplete="off"><input class="form-control form-control-sm decimal0" inputmode="numeric" pattern="[0-9]*" type="text" id="schedCYC" placeholder="Required Field" onchange="Number.isNaN(parseFloat(this.value)) ? this.value = '' : this.value = parseFloat(this.value)"></form>
                                </div>
                            </div>
                            <div class="row no-gutters mb-3 mr-3">
                                <div class="col-5"><label class="col-form-label px-3">Prescale</label></div>
                                <div class="col">
                                    <!-- <form><input class="form-control form-control-sm decimal1 num-input" type="number" min="0.1" step="0.1" id="schedPRE" placeholder="Required Field" oninput="this.value=(parseFloat(this.value) < 0 ? 0.1 : parseFloat(this.value))"></form> -->
                                    <form autocomplete="off"><input class="form-control form-control-sm decimal1" inputmode="numeric" pattern="[0-9]*" type="text" id="schedPRE" placeholder="Required Field" onchange="Number.isNaN(parseFloat(this.value)) ? this.value = '' : this.value = parseFloat(this.value)"></form>
                                </div>
                            </div>
                            <div class="row no-gutters mb-3 mr-3">
                                <div class="col-5"><label class="col-form-label px-3"></label></div>
                                <div class="col">
                                    <form><input class="form-control form-control-sm" type="text" id="schedLogID" placeholder="Required Field" hidden=""></form>
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
                                <div class="col"><button class="btn btn-dark clearlbl" id="clr-sidepanel-btn" type="button"><i class="fas fa-eraser"></i><label class="mb-0">&nbsp;<span>Clear</span></label></button><button class="btn btn-dark float-right" id="del-sidepanel-btn" type="button"><i class="fas fa-trash-alt"></i></button>
                                    <button
                                        class="btn btn-dark float-right mr-1" id="upd-sidepanel-btn" type="button" data-toggle="tooltip" title="Ctrl + e"><i class="fas fa-save"></i><label class="mb-0">&nbsp;Update</label></button><button class="btn btn-dark float-right mr-1" id="add-sidepanel-btn" type="button" data-toggle="tooltip" title="Ctrl + s"><i class="fas fa-plus"></i><label class="mb-0">&nbsp;Add</label></button></div>
                            </div>
                        </div>
                        <!-- End: header -->
                    </div>
                </div>
                <!-- End: sidepanel -->
                <!-- Start: table -->
                <div class="tbl-container schedTable">
                    <div class="table-responsive text-center">
                        <table class="table table-sm nowrap" id="scheduleTbl" collspacing="0" width="100%">
                            <thead>
                                <tr>
                                    <th>Machine</th>
                                    <th>Job Order</th>
                                    <th>Scheduled Start</th>
                                    <th>Scheduled End</th>
                                    <th>Model</th>
                                    <th>Material</th>
                                    <th>Target Quantity</th>
                                    <th>Prewarn Quantity</th>
                                    <th>Cycle Time (seconds)</th>
                                    <th>Prescale</th>
                                    <th>Operator</th>
                                    <th><i class="fa fa-info-circle text-primary"></i>&nbsp;Action</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
                </div>

                <div id="schedchart-container" style="display: none;">
                    <div id="schedchart">
                    </div>
                    <div id="schedchart-footer">
                        <span id="schedchart-nav">
                            <button class="btn btn-dark btn-sm ml-auto mr-2" id="sched-prev-btn" type="button">
                                <i class="fa fa-arrow-left"></i>&nbsp;<span>Previous</span>
                            </button>
                            <div id="schedchart-pagination-container"></div>
                            <button class="btn btn-dark btn-sm ml-2 mr-2" id="sched-next-btn" type="button">
                                <i class="fa fa-arrow-right"></i>&nbsp;<span>Next</span>
                            </button>
                        </span>
                    </div>

                </div>
                <!-- End: table -->
            </div>