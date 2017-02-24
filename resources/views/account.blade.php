@extends('layouts.app')

@section('content')
<script src="https://js.stripe.com/v3/"></script>
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
        <div class="panel panel-default" >
          <div class="panel-heading">
            Account Information
          </div>
          <div class="panel-body" >
            <div class="row">
              <div class="col-xs-12">
                <table class="table table-hover" >
                    <thead>
                         <tr>
                             <th>Account</th>
                             <th>Details</th>
                         </tr>
                    </thead>
                    <tbody>
                      <tr>
                          <td>Email</td>
                          <td>
                            <div class="input-group">
                              <span class="input-group-btn">
                                <button type="button" class="btn btn-primary" ng-disabled="disabledUpdate" ng-click="updateEmail()" >Update</button>
                              </span>
                              <input type="email" ng-model="_User.email" class="form-control">
                            </div>
                          </td>
                      </tr>
                       <tr>
                           <td>Account Creation Date</td>
                           <td>@{{_User.created_at.date}}</td>
                       </tr>
                       <tr>
                           <td>Currently Subscribed</td>
                           <td ng-if="!_User.onGracePeriod">@{{_User.subscribed}}</td>
                           <td ng-if="_User.onGracePeriod">@{{_User.subscribed}} - On Grace Period</td>
                       </tr>
                       <tr ng-if="_User.onGracePeriod">
                           <td>Subscription End Date</td>
                           <td>@{{_User.ends_at.date}}</td>
                       </tr>
                    </tbody>
                </table>
              </div>
            </div>

            <div class="row">
              @if (!Auth::user()->subscribed('main'))
                <div class="col-xs-12" >
                  <form action="/startSubscription" method="POST">
                    <script
                      src="https://checkout.stripe.com/checkout.js" class="stripe-button"
                      data-key="{{env('STRIPE_KEY')}}"
                      data-amount="899"
                      data-name="DFSCombine.com"
                      data-description="$8.99 per month"
                      data-image="https://stripe.com/img/documentation/checkout/marketplace.png"
                      data-locale="auto">
                    </script>
                    {{ csrf_field() }}
                  </form>
                </div>
              @endif
              <div class="col-xs-12" ng-if="_User.subscribed && !_User.onGracePeriod">
                <button type="button" class="btn btn-danger" ng-disabled="disabledSubButton" ng-click="cancelSubscription()" >Cancel Subscription</button>
              </div>
              <div class="col-xs-12" ng-if="_User.subscribed && _User.onGracePeriod">
                <button type="button" class="btn btn-success" ng-disabled="disabledSubButton" ng-click="resumeSubscription()" >Resume Subscription</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection
