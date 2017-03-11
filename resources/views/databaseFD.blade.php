<div class="row">
    <div class="col-xs-12">
      <div class="panel panel-default" >
          <div class="panel-heading">
            <div class='btn-toolbar pull-right'>
              <label class="btn btn-primary btn-file btn-xs">
                  Add Actual CSV File <input type="file" style="display: none;" custom-on-change="loadActual">
              </label>
              <label class="btn btn-primary btn-file btn-xs">
                  Add FanDuel Player CSV File <input type="file" style="display: none;" custom-on-change="loadPlayers">
              </label>

            </div>
              <h3 class="panel-title">Load Saved History</h3>

          </div>
          <div class="panel-body" set-height id="savedHistory">
            <div class="row">
              <div class="col-xs-12">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Draft #</th>
                            <th>Title</th>
                            <th>Site</th>
                            <th>Draft Created Date</th>
                            <th>Load</th>
                        </tr>
                    </thead>
                    <tbody ng-repeat="savedSettings in savedPastSettings">
                      <tr>
                        <td class="col-md-1">@{{$index+1}}</td>
                        <td class="col-md-3"><input class="form-control" type="text" ng-model="savedSettings.title"></td>
                        <td class="col-md-2">@{{savedSettings.site}}</td>
                        <td class="col-md-2">@{{savedSettings.created_at}}</td>
                        <td class="col-md-4">
                          <button class="btn btn-sm btn-primary" ng-disabled="savedSettings.site === 'DraftKings'" ng-click="read(savedSettings.id)">Load</button>
                          <button class="btn btn-sm btn-info" ng-click="updateTitle(savedSettings.id, savedSettings.title)">Update</button>
                          -
                          <button class="btn btn-sm btn-danger"  ng-show="!showDeleteConfirmation(savedSettings.id)" ng-click="setDeleteConfirmation(savedSettings.id)">Delete</button>
                          <button class="btn btn-sm btn-primary" ng-show="showDeleteConfirmation(savedSettings.id)" ng-click="delete(savedSettings.id)">Yes</button>
                          <button class="btn btn-sm btn-default" ng-show="showDeleteConfirmation(savedSettings.id)" ng-click="unsetDeleteConfirmation()">No</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <button class="btn btn-info" ng-click="loadHistory()" ng-disabled="savedPastSettings.length % 10 != 0">Load More</button>
              </div>
            </div>
          </div>
      </div>
    </div>
