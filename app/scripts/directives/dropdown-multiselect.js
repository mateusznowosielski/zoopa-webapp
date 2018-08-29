'use strict';

var directiveModule = angular.module('dropdown-multiselect', []);

directiveModule.directive('ngDropdownMultiselect', ['$filter', '$document', '$compile', '$parse', '$timeout',
                                           function ($filter,   $document,   $compile,   $parse,   $timeout) {

	return {
		restrict: 'AE',
		scope:{
			selectedModel: '=',
			options: '=',
			extraSettings: '=',
			events: '=',
            translationTexts: '=',
            singleAllSelected: '=',
            dropdownDisabled: '=',
			groupBy: '@'
		},
		template: function(element, attrs) {
			var groups = attrs.groupBy ? true : false;

			var template = '<div class="multiselect-parent btn-group dropdown-multiselect">';
			template += '<button type="button" class="dropdown-toggle dropdown-min-width" ng-class="settings.buttonClasses" style="text-align: left;" ng-click="toggleDropdown($event)" ng-disabled="dropdownDisabled"><span class="glyphicon glyphicon-chevron-down pull-right" style="padding-top:3px; padding-left: 5px;"></span>{{getButtonText()}}</button>';
			template += '<div class="dropdown-menu dropdown-menu-form dropdown-min-width"  ng-style="{display: open ? \'block\' : \'none\'}" >';
			template += '<div ng-show="settings.enableSearch" style="padding: 0 10px;"><input type="text" ng-model="searchFilter" style="width: 100%; margin: 0px -5px 5px -5px;" placeholder="{{texts.searchPlaceholder}}" /></div>';
			template += '<ul class="list-unstyled" style="max-height:300px; overflow-y: auto;">';
            template += '<li ng-hide="!settings.showSingleAll"><a data-ng-click="selectSingleAll()" style="padding: 3px 50px 3px 10px;"><span ng-class="{\'glyphicon glyphicon-ok\': isSingleAllChecked()}" class="pull-left" style="margin: 4px 10px 4px 5px; width: 10px; height: 10px;"></span>{{texts.singleAll}}</a></li>';
			template += '<li ng-show="settings.showSingleAll" class="divider"></li>';

			if (groups)
			{
				template += '<li ng-repeat-start="option in orderedItems | filter: searchFilter" ng-show="getPropertyForObject(option, settings.groupBy) !== getPropertyForObject(orderedItems[$index - 1], settings.groupBy)" role="presentation" class="dropdown-header">{{ getGroupTitle(getPropertyForObject(option, settings.groupBy)) }}</li>';
				template += '<li ng-repeat-end role="presentation">';
			}
			else
			{
				template += '<li role="presentation" ng-repeat="option in options | filter: searchFilter"><a role="menuitem" tabindex="-1" ng-click="setSelectedItem(getPropertyForObject(option,settings.idProp))" style="padding: 3px 50px 3px 10px;"><span data-ng-class="{\'glyphicon glyphicon-ok\': isChecked(getPropertyForObject(option,settings.idProp))}" class="pull-left" style="margin: 4px 10px 4px 5px; width: 10px; height: 10px;" ></span>{{getPropertyForObject(option, settings.displayProp)}}</a></li>';
            }

			template += '<li class="divider" ng-show="(showSelectionLimitLabel && settings.selectionLimit > 1)"></li>';
			template += '<li role="presentation" ng-show="(showSelectionLimitLabel && settings.selectionLimit > 1)"><a role="menuitem">{{selectedModel.length}} {{texts.selectionOf}} {{settings.selectionLimit}} {{texts.selectionCount}}</a></li>';

			template += '</ul>';
			template += '</div>';
			template += '</div>';

			element.html(template);
		},
		link: function($scope, $element, $attrs){

			/**
             * Toggle opening dropdown and setting focus on search input field.
             * @param  {object} ng-click event
             */
			$scope.toggleDropdown = function(event)
			{
				$scope.open = !$scope.open;

				if($scope.open) {
                    $timeout(function() {
                        $element.find('input')[0].focus();
                    }, 0);
				}
			};

			$scope.searchFilter = '';

			/**
			 * Creating events
			 */
			$scope.externalEvents = {
				onItemSelect: angular.noop,
				onItemDeselect: angular.noop,
				onSelectSingleAll: angular.noop,
				onInitDone: angular.noop,
				onMaxSelectionReached: angular.noop
			};

            /**
             * Creating default settings
             */
			$scope.settings = {
				dynamicTitle: true,
				closeOnBlur: true,
				displayProp: 'label',
				idProp: 'id',
				externalIdProp: 'id',
				enableSearch: true,
				selectionLimit: 0,
				showSelectionLimitLabel: false,
                showSingleAll: true,
                autoReverseToSingleAll: true,
				closeOnSelect: false,
                buttonClasses: 'btn btn-default',
				closeOnDeselect: false,
				groupBy: $attrs.groupBy || undefined,
				groupByTextProvider: null
            };

            /**
             * Creating default text providers
             */
            $scope.texts = {
                singleAll: 'All',
                selectionCount: 'selected',
                selectionOf: '/',
                searchPlaceholder: '',
                buttonDefaultText: 'Select',
                dynamicButtonTextSuffix: 'selected'
            };

            // Check if there is a grouping enabled and if so watch for option changes,
            // and sort items based on group
			if (angular.isDefined($scope.settings.groupBy))
			{
				$scope.$watch('options', function(newValue) {
					if (angular.isDefined(newValue))
					{
						$scope.orderedItems = $filter('orderBy')(newValue, $scope.settings.groupBy);
					}
				});
			}

			angular.extend($scope.settings, $scope.extraSettings || []);
			angular.extend($scope.externalEvents, $scope.events || []);
            angular.extend($scope.texts, $scope.translationTexts);

			$scope.singleSelection = $scope.settings.selectionLimit === 1;

            /**
             * Create and return a new object with a proper id property.
             * Useful when running _.find or _.findIndex methods by a property.
             * @param   {string}   id
             * @return  {object}   new object with a specified id property
             */
			function getFindObj(id)
			{
				var findObj = {};

				if ($scope.settings.externalIdProp === '')
				{
					findObj[$scope.settings.idProp] = id;
				}
				else {
					findObj[$scope.settings.externalIdProp] = id;
				}

				return findObj;
			}

            /**
             * Clears / Remove all properties from the object
             * @param   {object}   object to be cleared
             */
			function clearObject(object)
			{
				for (var prop in object) {
					delete object[prop];
				}
			}

            // When single selection we need to clear an object if it is an array
			if ($scope.singleSelection)
			{
				if (angular.isArray($scope.selectedModel) && $scope.selectedModel.length === 0)
				{
					clearObject($scope.selectedModel);
				}
			}

            // Handles case when we want to close opened dropdown on blur.
			if ($scope.settings.closeOnBlur) {
			    // Somehow click can't be invoked when clicking on dropdown button,
			    // so mousedown event is registered.
				$document.on('mousedown', function (e) {

					var target = e.target.parentElement;
					var parentFound = false;

                    // We need to check if we are not hitting any of dropdown children
                    // so we do it from target using bubbling phase down until we find
                    // a parent which is the element of this linking method.
					while (angular.isDefined(target) && target !== null && !parentFound) {
						if(target == $element[0]) {
							parentFound = true;
						}
						target = target.parentElement;
					}

                    // If we didn't find a target which belongs to element in this linking method
                    // then we close the dropdown.
					if (!parentFound) {
						$scope.$apply(function () {
							$scope.open = false;
						});
					}
				});
			}

			$scope.$on("$destroy", function (e) {
                $document.off('mousedown');
            });

            /**
             * Returns the group title with regards to text provider
             * @param   {string}   initial group title
             * @return  {string}   evaluated group title
             */
			$scope.getGroupTitle = function(groupValue)
			{
				if ($scope.settings.groupByTextProvider !== null)
				{
					return $scope.settings.groupByTextProvider(groupValue);
				}

				return groupValue;
			};

            /**
             * Returns the proper button label.
             */
			$scope.getButtonText = function()
			{
				if ($scope.settings.dynamicTitle)
				{
					var totalSelected = 0;

					if($scope.singleAllSelected)
					{
					    return $scope.texts.singleAll;
					}

                    // If single selection total item selected can be 0 or 1
					if ($scope.singleSelection)
					{
						totalSelected = ($scope.selectedModel != null && angular.isDefined($scope.selectedModel[$scope.settings.idProp])) ? 1 : 0;
					}
					// If multiple selection than we can have 0 or many items selected - let's find out
					else
					{
						totalSelected = $scope.selectedModel != null ? $scope.selectedModel.length : 0;
					}

                    // If nothing is selected than let's display default button label
					if (totalSelected === 0)
					{
						return $scope.texts.buttonDefaultText;
					}
					// If there is only one item selected then let's display it - we have enough space to display it
					else if(totalSelected === 1)
					{
					    // TODO: We may simply use findObj[$scope.settings.displayProp], but needs to be well tested.
					    var findObj = $scope.singleSelection ? $scope.selectedModel : $scope.selectedModel[0];
					    var newFinalObj = null;

					    for(var i=0; i < $scope.options.length; i++) {
					        if($scope.options[i][$scope.settings.idProp] == findObj[$scope.settings.idProp])
					        {
					            newFinalObj = $scope.options[i];
					            break;
					        }
					    }

                        if(newFinalObj != null)
                        {
                            return newFinalObj[$scope.settings.displayProp];
                        }
					}
					// If there are more than 1 items selected we just show number of selected items
					else
					{
						return totalSelected + ' ' + $scope.texts.dynamicButtonTextSuffix;
					}
				}
				else
				{
					return $scope.texts.buttonDefaultText;
				}
			};

            /**
             * Returns the value of object property if it exists. If not just an empty string.
             * @param   {object}   given object
             * @param   {string}   given property string of an object from @param 1
             * @return  {object}   value of property of an object
             */
			$scope.getPropertyForObject = function(object, property)
			{
				if (angular.isDefined(object) && object.hasOwnProperty(property)) {
					return object[property];
				}

				return '';
			};

            /**
             * Deselect any selected items.
             */
			$scope.deselectAll = function() {

				if ($scope.singleSelection) {
					clearObject($scope.selectedModel);
				}
				else {
				    if($scope.selectedModel != null) {
					    $scope.selectedModel.splice(0, $scope.selectedModel.length);
				    }
				}
			};

            /**
             * Toggles selecting the all button. It handles also auto-deselecting other items
             * if multiselect is enabled.
             * Can be called with select parameter to force selection/deselection
             * or leave it to figure out based on conditions and previous state.
             * @param   {bool}   optional, indicates if 'All' btn should be selected or not
             */
			$scope.selectSingleAll = function (select) {

                // EXPLICIT: select is specified
                // select 'All'
			    if(select === true) {
			        $scope.singleAllSelected = true;
			        $scope.externalEvents.onSelectSingleAll();
                    return;
			    }
			    // deselect 'All'
			    else if(select === false) {
			        $scope.singleAllSelected = false;
			        $scope.externalEvents.onSelectSingleAll();
			        return;
			    }

			    $scope.searchFilter = '';

                // INEXPLICIT: select is not specified
                // deselects other selected items
                if(!$scope.singleAllSelected) {
                    $scope.deselectAll();
                }

                // if single selection then we can only select it on click
                // we can not leave a list with no item selected
                if($scope.singleSelection) {
                    $scope.singleAllSelected = true;
                    $scope.externalEvents.onSelectSingleAll();

                    $scope.open = false;
                }
                // if multiple selected let's toggle
                else {
                    $scope.singleAllSelected = !$scope.singleAllSelected;
                    $scope.externalEvents.onSelectSingleAll();
                }
            }

            /**
             * Selects item based on id.
             * @param   {string} id of selected item
             * @param   {bool}   indicates that it shouldn't be deselected
             */
			$scope.setSelectedItem = function(id, dontRemove){

				var findObj = getFindObj(id);
				var finalObj = null;

				finalObj = _.find($scope.options, findObj);

				if ($scope.singleSelection)
				{
				    if($scope.selectedModel == null) {
				        $scope.selectedModel = {};
				    }
					clearObject($scope.selectedModel);
					angular.extend($scope.selectedModel, finalObj);
					$scope.externalEvents.onItemSelect(finalObj);
					$scope.selectSingleAll(false);

					$scope.open = false;

					return;
				}

				dontRemove = dontRemove || false;

                if($scope.selectedModel == null) {
                    $scope.selectedModel = [];
                }

				var exists = _.findIndex($scope.selectedModel, findObj) !== -1;

				if (!dontRemove && exists) {
					$scope.selectedModel.splice(_.findIndex($scope.selectedModel, findObj), 1);
					$scope.externalEvents.onItemDeselect(findObj);
				} else if (!exists && ($scope.settings.selectionLimit === 0 || $scope.selectedModel.length < $scope.settings.selectionLimit)) {
					$scope.selectedModel.push(finalObj);
					$scope.externalEvents.onItemSelect(finalObj);
				}
			};

            /**
             * Checks if an item based on id is selected or not.
             * @param   {string} id of selected item
             * @return  {bool}   true when is selected, false when not
             */
			$scope.isChecked = function (id) {

				if ($scope.singleSelection)
				{
				    return $scope.selectedModel != null && angular.isDefined($scope.selectedModel[$scope.settings.idProp]) && $scope.selectedModel[$scope.settings.idProp] === getFindObj(id)[$scope.settings.idProp];
				}

				return _.findIndex($scope.selectedModel, getFindObj(id)) !== -1;
			};

            /**
             * Evaluates if 'All' btn should be selected.
             * @return  {bool}   true when is selected, false when not
             */
			$scope.isSingleAllChecked = function () {

                if($scope.singleSelection) {
                    if($scope.selectedModel != null && _.findIndex($scope.options, $scope.selectedModel) !== -1) {
                        $scope.selectSingleAll(false);
                    }
                    else {
                        if($scope.settings.autoReverseToSingleAll) {
                            $scope.selectSingleAll(true);
                        }
                    }
                }
                else {
                    //IMPORTANT!!!
                    //we can check if the selected values actually exist in the options
//			        if(_.some($scope.selectedModel, function(item) {
//			            return _.findIndex($scope.options, item) !== -1;
//			        })) {
//			            $scope.selectSingleAll(true);
//			        }
                    //or we can just assume that they exist in the options
                    if($scope.selectedModel != null && $scope.selectedModel.length > 0) {
                        $scope.selectSingleAll(false);
                    }
                    else {
                        if($scope.settings.autoReverseToSingleAll) {
                            $scope.selectSingleAll(true);
                        }
                    }
                }

			    return $scope.singleAllSelected;
			}

			$scope.externalEvents.onInitDone();
		}
	};
}]);
