@extends('layouts.app')

@section('content')
<script src="/js/AngularControllers/AccountController.js?v={{str_random(40)}}"></script>
<div ng-app="AccountApp">
  <div class="container" ng-controller="AccountController as account" >
    <div class="row">
        <div class="col-xs-12" id="messages">
          <div uib-alert ng-repeat="alert in alerts track by $index" ng-show="$last" ng-class="'alert-' + alert.type" close="closeAlert($index)">@{{alert.msg}} <div ng-show="alert.login" style="display: inline-block;"><a href="/login">Please login again here.</a></div>- <abbr title="Number of notification of this type.">(@{{alert.number}})</abbr></div>
        </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <table class="table">
            <thead>
                 <tr>
                     <th>Account</th>
                     <th>Details</th>
                 </tr>
            </thead>
            <tbody>
              <tr>
                  <td>Email</td>
                  <td><input type="text" value="@{{_User.email}}" class="form-control"></td>
              </tr>
               <tr>
                   <td>Creation Date</td>
                   <td>@{{_User.created_at.date}}</td>
               </tr>
               <tr>
                   <td>Subscription Start Date</td>
                   <td>Dec. 12, 2016, 2:18 p.m.</td>
               </tr>
               <tr>
                   <td>Trial End Date</td>
                   <td>@{{_User.trial_ends_at}}</td>
               </tr>
            </tbody>
        </table>
      </div>
    </div>
    <hr class="featurette-divider">
    <div class="row">
      <div class="col-xs-12">

      </div>
    </div>
  </div>
</div>
@endsection
