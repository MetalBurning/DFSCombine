<table class="table table-hover" >
    <thead>
        <tr>
            <th>Draft</th>
            <th>
                <span class="fake-link" ng-click="setDraftSortTypeAndReverse('FPPG')">
                    FPPG
                </span>
            </th>
            <th>
                <span class="fake-link"  ng-click="setDraftSortTypeAndReverse('Actual')">
                    Actual Pts
                </span>
            </th>
            <th>
                <span class="fake-link"  ng-click="setDraftSortTypeAndReverse('salaryLeft')">
                    Salary left
                </span>
            </th>
            <th>
                <span class="fake-link"  ng-click="setDraftSortTypeAndReverse('pointsPerDollar')">
                    Average Value
                </span>
            </th>
            <th>
                <span class="fake-link"  ng-click="setDraftSortTypeAndReverse('averageRank')">
                    Average Rank
                </span>
            </th>
        </tr>
    </thead>
    <tbody >
        <tr ng-repeat="draft in _AllDisplayedDraftData | orderBy:sortTypeDraft:sortReverseDraft">
            <td>@{{$index + 1}} <button class="btn btn-xs btn-danger" ng-click="removeDraft(draft)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
            <td ng-click="openCloseDraftDetails(draft);">@{{draft.FPPG}}</td>
            <td ng-click="openCloseDraftDetails(draft);">@{{draft.Actual}}</td>
            <td ng-click="openCloseDraftDetails(draft);">@{{draft.salaryLeft}}</td>
            <td ng-click="openCloseDraftDetails(draft);">@{{draft.pointsPerDollar}}</td>
            <td ng-click="openCloseDraftDetails(draft);">@{{draft.averageRank}}</td>
        </tr>
    </tbody>
</table>
