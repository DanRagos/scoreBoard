<div id="visual-tab" class="tab-pane fade" role="tabpanel" style="height: 100%">
                <!-- Start: header -->
                <!-- Hanz: Added parent. Part of fix for http-1201 bug #8 -->
                <div id="productivity-subheader-parent">
                    <div id="productivity-subheader">
                        <span id="productivity-title">Productivity</span>
                        <button id="productivity-show-data-btn" type="button" class="btn dark btn-sm"><i class="fas fa-table text-success"></i> <span>Show Data</span></button>
                        <button id="productivity-export-btn" type="button" type="button" class="btn dark btn-sm"><i class="fa fa-download text-success"></i> <span>Export</span></button>
                        <button id="productivity-view-btn" type="button" type="button" class="btn dark btn-sm"><i class="fas fa-calendar-check"></i> <span>View</span></button>
                        <button id="productivity-refresh-btn" type="button" type="button" class="btn dark btn-sm"><i class="fas fa-sync"></i> <span>Refresh</span></button>
                        <select id="visualDevice" class="form-control form-control-sm dark">
                            <option value='0' hidden selected class="no-dev-lbl">No Device Selected</option>
                        </select>
                        <select id="visualJobs" class="form-control form-control-sm dark">
                            <option value='0' hidden selected class="no-job-lbl">No Job Selected</option>
                        </select>
                        <div id="productivity-chart-btn-group" class="btn-group btn-group-sm" role="group" aria-label="chart select">
                            <button type="button" class="btn btn-sm btn-dark dark active" id="overviewlbl">Overview</button>
                            <button type="button" class="btn btn-sm btn-dark dark" id="goodqtylbl">Good Qty. per Unit time</button>
                            <button type="button" class="btn btn-sm btn-dark dark" id="cycletimelbl">Cycletime</button>
                        </div>
                        <div id="productivity-interval-btn-group" class="btn-group btn-group-sm" role="group" aria-label="interval select">
                            <button type="button" class="btn btn-sm btn-dark dark" id="hrlbl">Hour</button>
                            <button type="button" class="btn btn-sm btn-dark dark active" id="minutelbl">Minute</button>
                        </div>
                        <div id="productivity-fr" class="input-group input-group-sm">
                            <div class="input-group-prepend">
                                <span class="input-group-text dark" id="inputGroup-sizing-sm"><i class="fa fa-calendar"></i>&nbsp;Fr</span>
                            </div>
                            <input type="text" class="form-control dateFr" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readonly="" placeholder="-- / -- / --">
                        </div>
                        <div id="productivity-to" class="input-group input-group-sm">
                            <div class="input-group-prepend">
                                <span class="input-group-text dark" id="inputGroup-sizing-sm"><i class="fa fa-calendar"></i>&nbsp;To</span>
                            </div>
                            <input type="text" class="form-control dateTo" aria-label="Small" aria-describedby="inputGroup-sizing-sm" readonly="" placeholder="-- / -- / --">
                        </div>
                        <div id="productivity-interval" class="input-group input-group-sm">
                            <div class="input-group-prepend">
                                <span class="input-group-text dark interval-label" id="inputGroup-sizing-sm">Interval</span>
                            </div>
                            <!-- <input type="text" class="form-control dark-date" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="--" maxlength="3"> -->
                            <input type="text" class="form-control decimal0" inputmode="numeric" pattern="[0-9]*" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="--" maxlength="3" >
                        </div>
                        <button id="toggle-productivity" type="button" class="btn dark btn-sm table-opt"><span>Show Options</span>&nbsp;<i class="fas fa-caret-down"></i></button>
                        
                    </div>
                </div>
                <!-- End: More header -->
                <div id="visual-page" class="graph-view">
                    <!-- set height to 95% from 100% if the refresh button is to be readded back -->
                    <div id="visual-table-container" style="flex-grow: 1; align-self: center; display: none">
                    <div class="text-center table-responsive">
                        <table class="table table-sm pageResize nowrap" id="productivityTbl" collspacing="0" width="100%">
                            <thead>
                                <tr>
                                    <th>Start Time</th>
                                    <th>Good Qty</th>
                                    <th>CNTA</th>
                                    <th>CNTB</th>
                                    <th>Time Per Piece, sec</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    </div>
                    <!-- set height to 95% from 100% if the refresh button is to be readded back -->
                    <div id="visual-container" style="flex-grow: 1; height: 100%; width: 100%; align-self: center; margin-bottom: 3.5rem"></div>
                    <!-- <div style="background-color: black">
                        <button class="btn btn-dark btn-sm mr-2 refresh-btn" type="button" id="productivity-refresh-btn">
                            <i class="fa fa-undo"></i>&nbsp;<span>Refresh</span>
                        </button>
                        <span id="productivity-last-updated" class="last-update table-update">Last Updated: </span>
                    </div> -->
                </div>
            </div>