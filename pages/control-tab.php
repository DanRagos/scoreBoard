<div id="control-tab" class="tab-pane fade" role="tabpanel">
                <div id="control-container" style="position: fixed; height: calc(100% - 48px);">
                    <!-- Start: control-pane-lg -->
                    <div class="control-pane-lg">
                        <!-- Start: control-left -->
                        <div class="control-panel-frame">
                            <!-- Start: header -->
                            <div class="control-panel-header">
                                <label class="mx-3 jobInfolbl">Job Information</label>
                                <?php echo setQRTrigger(); ?>
                                <!-- label class="qr-container">
                                    <i class="fa fa-camera"></i>
                                    <input type="file" accept="image/*" capture="environment" tabindex="-1" onchange="openQRCamera(this)">
                                </label> -->
                            </div>
                            <!-- End: header -->
                            <!-- Start: body -->
                            <div class="control-panel-body">
                                <!-- Start: items -->
                                <div class="control-panel-items">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label">Machine</label></div>
                                    <div>
                                        <form><select class="form-control selectpicker form-control-sm mobMachine" data-size="14" title="No Device Selected" data-display="static"></select></form>
                                    </div>
                                </div>
                                <!-- End: items -->
                                <!-- Start: items -->
                                <div class="control-panel-items">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label">Job Order</label></div>
                                    <div>
                                        <form><select class="form-control selectpicker form-control-sm mobJob" data-size="14" data-display="static" title="No Job Selected"></select></form>
                                    </div>
                                </div>
                                <!-- End: items -->
                                <!-- Start: items -->
                                <div class="control-panel-items">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label">Model</label></div>
                                    <div><input class="border rounded dash-input mobModel" type="text" maxlength="45" placeholder="--" style="padding: 1px 15px;" disabled=""></div>
                                </div>
                                <!-- End: items -->
                                <!-- Start: items -->
                                <div class="control-panel-items">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label">Material</label></div>
                                    <div><input class="border rounded dash-input mobMaterial" type="text" maxlength="45" placeholder="--" style="padding: 1px 15px;" disabled=""></div>
                                </div>
                                <!-- End: items -->
                                <!-- Start: items -->
                                <div class="control-panel-items">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label">Schedule</label></div>
                                    <div><input class="border rounded mobSchedule" type="text" placeholder="--" style="padding: 1px 15px;" disabled=""></div>
                                </div>
                                <!-- End: items -->
                                <!-- Start: items -->
                                <div class="control-panel-items">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label">Operator</label></div>
                                    <div><input class="border rounded dash-input mobOperator" type="text" maxlength="45" placeholder="--" style="padding: 1px 15px;" disabled=""></div>
                                </div>
                                <!-- End: items -->
                                <!-- Start: items -->
                                <div class="control-panel-items">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label">Cycle Time</label></div>
                                    <!-- <div><input class="border rounded dash-input mobCycle decimal0" type="number" id="ctrlCYC" placeholder="Required Field" style="padding: 1px 15px;" disabled="" min="1" step="1" onchange="this.value=(parseInt(this.value) < 0 ? 0 : parseInt(this.value))"></div> -->
                                    <div><input class="border rounded dash-input mobCycle decimal0" inputmode="numeric" pattern="[0-9]*" type="text" id="ctrlCYC" placeholder="Required Field" style="padding: 1px 15px;" disabled="" onchange="Number.isNaN(parseFloat(this.value)) ? this.value = '' : this.value = parseFloat(this.value)"></div>
                                </div>
                                <!-- End: items -->
                                <!-- Start: items -->
                                <div class="control-panel-items">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label">Prescale</label></div>
                                    <!-- <div><input class="border rounded dash-input mobPrescale decimal1 num-input" type="number" id="ctrlPS" placeholder="Required Field" style="padding: 1px 15px;" disabled="" min="0" step="0.1" oninput="this.value=(parseFloat(this.value) < 0 ? 0 : parseFloat(this.value))"></div> -->
                                    <div><input class="border rounded dash-input mobPrescale decimal1" inputmode="numeric" pattern="[0-9]*" type="text" id="ctrlPS" placeholder="Required Field" style="padding: 1px 15px;" disabled="" onchange="Number.isNaN(parseFloat(this.value)) ? this.value = '' : this.value = parseFloat(this.value)"></div>
                                </div>
                                <!-- End: items -->
                                <!-- Start: items -->
                                <div class="control-panel-items">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label">Target</label></div>
                                    <!-- <div><input class="border rounded dash-input mobTarget decimal1 num-input" type="number" placeholder="--" style="padding: 1px 15px;" disabled="" min="0" step="0.1" oninput="this.value=(parseFloat(this.value) < 0 ? 0 : parseFloat(this.value))"></div> -->
                                    <div><input class="border rounded dash-input mobTarget decimal1" inputmode="numeric" pattern="[0-9]*" type="text" placeholder="--" style="padding: 1px 15px;" disabled="" onchange="Number.isNaN(parseFloat(this.value)) ? this.value = '' : this.value = parseFloat(this.value)"></div>
                                </div>
                                <!-- End: items -->
                                <!-- Start: items -->
                                <div class="control-panel-items">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label">Prewarn</label></div>
                                    <!-- <div><input class="border rounded dash-input mobPrewarn decimal1 num-input" type="number" placeholder="--" style="padding: 1px 15px;" disabled="" min="0" step="0.1" oninput="this.value=(parseFloat(this.value) < 0 ? 0 : parseFloat(this.value))"></div> -->
                                    <div><input class="border rounded dash-input mobPrewarn decimal1" inputmode="numeric" pattern="[0-9]*" type="text" placeholder="--" style="padding: 1px 15px;" disabled="" onchange="Number.isNaN(parseFloat(this.value)) ? this.value = '' : this.value = parseFloat(this.value)"></div>
                                </div>
                                <!-- End: items -->
                            </div>
                            <!-- End: body -->
                        </div>
                        <!-- End: control-left -->
                    </div>
                    <!-- End: control-pane-lg -->
                    <!-- Start: control-pane-lg -->
                    <div class="control-pane-lg">
                        <!-- Start: control-right -->
                        <div class="control-panel-frame">
                            <!-- Start: header -->
                            <div class="control-panel-header"><label class="mx-3"><span class="devInfolbl">Device Information</span>&nbsp;<span class="backlogJobIcon" data-toggle="tooltip" title="Device is on backlog"><i class="fas fa-exclamation-circle text-secondary"></i></span></label></div>
                            <!-- End: header -->
                            <!-- Start: placeholder-header -->
                            <div class="header-bgcolor border-bottom-0">
                                <div class="devinfo"></div>
                            </div>
                            <!-- End: placeholder-header -->
                            <!-- Start: body -->
                            <div class="control-panel-body">
                                <!-- Start: items -->
                                <div class="control-panel-items">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label">Status</label></div>
                                    <div><input class="border rounded mobStatus" type="text" placeholder="--" style="padding: 1px 15px;" readonly=""></div>
                                </div>
                                <!-- End: items -->
                                <!-- Start: items -->
                                <div class="control-panel-items">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label">Output</label></div>
                                    <div><input class="border rounded mobOutput" type="text" placeholder="--" style="padding: 1px 15px;" readonly=""></div>
                                </div>
                                <!-- End: items -->
                                <!-- Start: items -->
                                <div class="control-panel-items">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label">Reject</label></div>
                                    <div><input class="border rounded mobReject" type="text" placeholder="--" style="padding: 1px 15px;" readonly=""></div>
                                </div>
                                <!-- End: items -->
                                <!-- Start: progress-pane -->
                                <div class="progress-pane">
                                    <div class="circle-progress-bar outvsrejlbl"><label class="text-truncate">Output vs Reject</label>
                                        <div id="rejectProgress"></div>
                                    </div>
                                    <div class="circle-progress-bar actvstgtlbl"><label class="text-truncate">Actual vs Target</label>
                                        <div id="countProgress"></div>
                                    </div>
                                </div>
                                <!-- End: progress-pane -->
                                <div></div>
                                <!-- Start: Control button -->
                                <div class="control-button-pane"><button class="btn btn-success btn-lg snsBtn" type="button">START JOB</button></div>
                                <!-- End: Control button -->
                                <!-- <div class="custom-control shadow-none custom-switch endattgt-btn recBtn-state"><input class="custom-control-input mobEndTgt" type="checkbox" id="recBtnSwitch-1"><label class="custom-control-label" for="recBtnSwitch-1" id="control-rec-label">Recording Ends at Target Quantity</label></div>
                                <div class="custom-control shadow-none custom-switch recBtn-state" id="wdt-btn"><input class="custom-control-input control-wdt-input" type="checkbox" id="recBtnSwitch-2"><label class="custom-control-label" for="recBtnSwitch-2" id="control-wdt-label">Watchdog Timer</label></div> -->
                                <div class="ctrl_btn_container">
                                    <div>
                                        <div class="custom-control shadow-none custom-switch endattgt-btn recBtn-state">
                                            <input class="custom-control-input mobEndTgt" type="checkbox" id="recBtnSwitch-1">
                                            <label class="custom-control-label" for="recBtnSwitch-1" id="control-rec-label">Recording Ends at Target Quantity</label>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="custom-control shadow-none custom-switch recBtn-state" id="wdt-btn">
                                            <input class="custom-control-input control-wdt-input" type="checkbox" id="recBtnSwitch-2">
                                            <label class="custom-control-label" for="recBtnSwitch-2" id="control-wdt-label">Watchdog Timer</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- End: body -->
                            <!-- Start: placeholder-body -->
                            <div class="control-panel-body-dev border-top-0"></div>
                            <!-- End: placeholder-body -->
                        </div>
                        <!-- End: control-right -->
                    </div>
                    <!-- End: control-pane-lg -->
                    <!-- Start: control-pane-sm -->
                    <div class="control-pane-sm">
                        <div class="control-sm-frame">
                            <div class="control-panel-header">
                                <label class="mx-3"><span class="jobInfolbl">Job Information</span>&nbsp;<span class="backlogJobIcon" data-toggle="tooltip" title="Device is on backlog"><i class="fas fa-exclamation-circle text-secondary"></i></span></label>
                                <?php echo setQRTrigger(); ?>
                            </div>
                            <div class="control-panel-body pt-2 pb-2">
                                <div class="control-panel-items-sm">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label pane-sm">Machine</label></div>
                                    <div>
                                        <form><select class="form-control selectpicker form-control-sm mobMachine" data-size="14" data-display="static" title="No Devices Selected"></select></form>
                                    </div>
                                </div>
                                <div class="control-panel-items-sm">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label pane-sm">Job Order</label></div>
                                    <div>
                                        <form><select class="form-control selectpicker form-control-sm mobJob" data-size="14" data-display="static" title="No Job Selected"></select></form>
                                    </div>
                                </div>
                                <div class="control-panel-items-sm">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label pane-sm">Model</label></div>
                                    <div><input class="border rounded dash-input mobModel" type="text" maxlength="45" placeholder="--" style="padding: 1px 15px;" disabled=""></div>
                                </div>
                                <div class="control-panel-items-sm">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label pane-sm">Material</label></div>
                                    <div><input class="border rounded dash-input mobMaterial" type="text" maxlength="45" placeholder="--" style="padding: 1px 15px;" disabled=""></div>
                                </div>
                                <div class="control-panel-items-sm">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label pane-sm">Schedule</label></div>
                                    <div><input class="border rounded mobSchedule" type="text" placeholder="--" style="padding: 1px 15px;" disabled=""></div>
                                </div>
                                <div class="control-panel-items-sm">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label pane-sm">Operator</label></div>
                                    <div><input class="border rounded dash-input mobOperator" type="text" maxlength="45" placeholder="--" style="padding: 1px 15px;" disabled=""></div>
                                </div>
                                <div class="control-panel-items-sm">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label pane-sm">Cycle Time</label></div>
                                    <!-- <div><input class="border rounded dash-input mobCycle decimal0 num-input" type="number" placeholder="Required Field" style="padding: 1px 15px;" disabled="" min="1" step="1" onchange="this.value=(parseInt(this.value) < 0 ? 0 : parseInt(this.value))"></div> -->
                                    <div><input class="border rounded dash-input mobCycle decimal0" inputmode="numeric" pattern="[0-9]*" type="text" placeholder="Required Field" style="padding: 1px 15px;" disabled="" onchange="Number.isNaN(parseFloat(this.value)) ? this.value = '' : this.value = parseFloat(this.value)"></div>
                                </div>
                                <div class="control-panel-items-sm">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label pane-sm">Prescale</label></div>
                                    <!-- <div><input class="border rounded dash-input mobPrescale decimal1 num-input" type="number" placeholder="Required Field" style="padding: 1px 15px;" disabled="" min="0" step="0.1" oninput="this.value=(parseFloat(this.value) < 0 ? 0 : parseFloat(this.value))"></div> -->
                                    <div><input class="border rounded dash-input mobPrescale decimal1" inputmode="numeric" pattern="[0-9]*" type="text" placeholder="Required Field" style="padding: 1px 15px;" disabled="" onchange="Number.isNaN(parseFloat(this.value)) ? this.value = '' : this.value = parseFloat(this.value)"></div>
                                </div>
                                <div class="control-panel-items-sm">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label pane-sm">Target</label></div>
                                    <!-- <div><input class="border rounded dash-input mobTarget decimal1 num-input" type="number" placeholder="--" style="padding: 1px 15px;" disabled="" min="0" step="0.1" oninput="this.value=(parseFloat(this.value) < 0 ? 0 : parseFloat(this.value))"></div> -->
                                    <div><input class="border rounded dash-input mobTarget decimal1" inputmode="numeric" pattern="[0-9]*" type="text" placeholder="--" style="padding: 1px 15px;" disabled="" onchange="Number.isNaN(parseFloat(this.value)) ? this.value = '' : this.value = parseFloat(this.value)"></div>
                                </div>
                                <div class="control-panel-items-sm">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label pane-sm">Prewarn</label></div>
                                    <!-- <div><input class="border rounded dash-input mobPrewarn decimal1 num-input" type="number" placeholder="--" style="padding: 1px 15px;" disabled="" min="0" step="0.1" oninput="this.value=(parseFloat(this.value) < 0 ? 0 : parseFloat(this.value))"></div> -->
                                    <div><input class="border rounded dash-input mobPrewarn decimal1" inputmode="numeric" pattern="[0-9]*" type="text" placeholder="--" style="padding: 1px 15px;" disabled="" onchange="Number.isNaN(parseFloat(this.value)) ? this.value = '' : this.value = parseFloat(this.value)"></div>
                                </div>
                                <div class="control-panel-items-sm">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label pane-sm">Reject</label></div>
                                    <div><input class="border rounded mobReject" type="text" placeholder="--" style="padding: 1px 15px;" disabled=""></div>
                                </div>
                                <div class="control-panel-items-sm">
                                    <div class="text-truncate"><label class="text-truncate control-panel-label pane-sm">Status</label></div>
                                    <div><input class="border rounded mobStatus" type="text" placeholder="--" style="padding: 1px 15px;" readonly=""></div>
                                </div>
                                <!-- Button for "Recording Ends at Target Quantity -->
                                <!-- <div class="control-panel-items-sm">
                                    <div class="text-truncate" hidden=""><label class="text-truncate control-panel-label"></label></div>
                                    <div>
                                        <div class="custom-control custom-switch recBtn-state"><input class="custom-control-input mobEndTgt pane-sm" type="checkbox" id="recBtnSwitch"><label class="custom-control-label pane-sm" for="recBtnSwitch" style="font-weight: 300;" id="mobEnd">Recording Ends at Target Qty</label></div>
                                        <div class="custom-control custom-switch recBtn-state"><input class="custom-control-input control-wdt-input pane-sm" type="checkbox" id="recBtnSwitch-3"><label class="custom-control-label pane-sm" for="recBtnSwitch-3" style="font-weight: 300;" id="mobWdt">Watchdog Timer</label></div>
                                    </div>
                                </div> -->
                                <div class="control-panel-items-sm recording_outer_div">
                                    <div class="custom-control custom-switch recBtn-state recording_inner_div">
                                        <input class="custom-control-input mobEndTgt pane-sm" type="checkbox" id="recBtnSwitch">
                                        <label class="custom-control-label pane-sm" for="recBtnSwitch" style="font-weight: 300;" id="mobEnd">Recording Ends at Target Qty</label>
                                </div>
                                </div>
                                <div class="control-panel-items-sm wdt_outer_div">
                                    <div class="custom-control custom-switch recBtn-state wdt_inner_div">
                                        <input class="custom-control-input control-wdt-input pane-sm" type="checkbox" id="recBtnSwitch-3">
                                        <label class="custom-control-label pane-sm" for="recBtnSwitch-3" style="font-weight: 300;" id="mobWdt">Watchdog Timer</label>
                                    </div>
                                </div>
                                <div class="control-panel-items-sm progress_count">
                                    <div class="text-truncate border-0 pl-0 h-100"><span>Progress</span></div>
                                    <div class="text-truncate progress-text" style="text-align: right; height: 100%;"><span>&nbsp;950000 / 10000000</span></div>
                                </div>
                                <div class="control-panel-items-sm progress-pane-sm progress_percent">
                                    <!-- Start: progressbar-custom -->
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;"></div>
                                        <div class="progress-bar-title">60%</div>
                                    </div>
                                    <!-- End: progressbar-custom -->
                                </div>
                            </div>
                        </div>
                        <div class="control-sm-btn-frame"><button class="btn btn-success btn-lg snsBtn" type="button">START JOB</button></div>
                    </div>
                    <!-- End: control-pane-sm -->
                </div>
            </div>