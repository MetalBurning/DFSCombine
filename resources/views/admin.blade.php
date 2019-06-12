@extends('layouts.app')

@section('content')
<script src="/js/AngularControllers/AdminController.js?v={{str_random(40)}}"></script>
<div ng-app="AdminApp">
  <div class="container" ng-controller="AdminController as admin" >
    <div class="row">
        <div class="col-xs-12" id="messages">
          <div uib-alert ng-repeat="alert in alerts track by $index" ng-show="$last" ng-class="'alert-' + alert.type" close="closeAlert($index)">@{{alert.msg}} <div ng-show="alert.login" style="display: inline-block;"><a href="/login">Please login again here.</a></div>- <abbr title="Number of notification of this type.">(@{{alert.number}})</abbr></div>
        </div>
    </div>
    <uib-tabset active="activeJustified" justified="true">
        <uib-tab index="0" heading="NBA" >
          <div class="row">
              <div class="col-xs-12">
                <div class="panel panel-default" >
                    <div class="panel-heading">
                      Data
                    </div>
                    <div class="panel-body" set-height id="savedHistory">
                      <div class="row">
                        <div class="col-xs-6">
                            Add Data File: <div class="input-group input-group">
                                              <input type="file" style="btn btn-default" custom-on-change="uploadBDBFile" >
                                          </div>
                        </div>
                        <div class="col-xs-6">
                          <h4> Set FD Slate Data</h4>
                          Title:
                          <select class="form-control" ng-model="admin.SlateName" >
                            <option value="Early">Early</option>
                            <option value="AllDay">AllDay</option>
                            <option value="Main">Main</option>
                            <option value="Express">Express</option>
                            <option value="Late">Late</option>
                            <option value="AfterHours">AfterHours</option>
                            <option value="Express2">Express2</option>
                            <option value="Express3">Express3</option>
                          </select>
                          Site:
                          <select class="form-control" ng-model="admin.SlateSite" >
                            <option value="FD">FD</option>
                            <option value="DK">DK</option>
                            <option value="Y">Y</option>
                          </select>
                          Date: <input type="date" class="form-control" ng-model="admin.SlateDate" aria-describedby="sizing-addon1">

                          <div class="input-group input-group">
                              <input type="file" style="btn btn-default" custom-on-change="loadSlate" >
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
          </div>

        </uib-tab>
        <uib-tab index="1" heading="MLB" >
mlb

        </uib-tab>
        <uib-tab index="2" heading="NFL" >
NFL

        </uib-tab>
      </uib-tabset>


  </div>
</div>
@endsection
