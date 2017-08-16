var speedComp = {
  bindings: {},
  controller: function ($scope, $http, $interval) {
      var ctrl = this;
      var i = 0;
      var timer;
      ctrl.speed = 200;
      ctrl.startReset = "Start"
      ctrl.readerStarted = false;
      ctrl.readerPaused = true;
      ctrl.display = " ";
      ctrl.mono = {
        title: '',
        content: ''
      };

      ctrl.fetchData = function () {
          $http.get('app/data/mono.json').then(function(data) {
            var mono = data.data;
            $scope.$emit('dat', mono);
          })

          $scope.$on('dat', function(event, mono) {
              ctrl.setData(mono);
          })
      }

      ctrl.setData = function (mono) {
          var randNum = getRand();
          ctrl.mono.content = mono[randNum].content;
          ctrl.mono.title = mono[randNum].title;
          ctrl.mono.caption = mono[randNum].caption;
          ctrl.mono.img = mono[randNum].img;
      }

      var setRandomNumber = function (mono) {
          var last;
          return function(random) {
            var random;
            do {
              random = Math.floor(Math.random() * 6);
            } while (random === last);
            last = random;
            return random;
          };
      };
      var getRand = setRandomNumber()


      ctrl.startOrReset = function() {
        if (!ctrl.readerStarted) {
          ctrl.startReset = "Start";
          ctrl.startReader();
        } else if (ctrl.readerPaused){
          ctrl.startReset = "Reset"
          ctrl.resetReader();
        }
      }

      ctrl.playOrPause = function() {
        if (!ctrl.readerPaused) {
          ctrl.playPause = "Pause";
          ctrl.stopReader();
        } else {
          ctrl.playPause = "Play"
          ctrl.startReader();
        }
      }


      ctrl.startReader = function (arr) {
          ctrl.readerStarted = true;
          ctrl.readerPaused = false;
          ctrl.startReset = "Reset";
          ctrl.playPause = "Pause";
          var arr = ctrl.mono.content.split(" ")

          timer = $interval(function() {
            ctrl.display = arr[i];
            i++;
          }, ctrl.speed, arr.length);
      }

      ctrl.stopReader = function() {
          $interval.cancel(timer);
          ctrl.readerPaused = true;
          ctrl.playPause = "Play";
          ctrl.startReset = "Reset"
      }

      ctrl.faster = function() {
    		  ctrl.speed -= 50;

    	}

      ctrl.slower = function() {
          ctrl.speed += 50;
      }

      ctrl.newMono = function() {
        ctrl.stopReader();
        ctrl.fetchData();
        ctrl.readerStarted = false;
        ctrl.readerPaused = true;
        ctrl.display = " ";
        ctrl.startReset = "Start";
      }

      ctrl.resetReader = function() {
        ctrl.stopReader();
        ctrl.display = " ";
        ctrl.readerStarted = false;
        ctrl.startReset = "Start";
      }

  },
  template: `
  <body>
    <div
      ng-init="$ctrl.fetchData()"
      ng-style="{'background-image':'url(' + $ctrl.mono.img + ')'}"
      id="container">

      <div id="reader">
        <div id="title">
          <h2>{{ $ctrl.mono.title }}</h2>
        </div>

        <div id="readerBox">
          <div id="wordBox">
            <p
              ng-bind="$ctrl.display"
              ng-show="$ctrl.readerStarted">
            </p>
          </div>
        </div>

        <div id="speedDiv">
            <button
              ng-click="$ctrl.slower()"
              ng-disabled="$ctrl.readerStarted && !$ctrl.readerPaused"
              class="btn control-btns">
              -
            </button>

            <span ng-bind="$ctrl.speed"></span>
            <span>ms delay</span>

            <button
              ng-click="$ctrl.faster()"
              ng-disabled="$ctrl.readerStarted && !$ctrl.readerPaused"
              class="btn">
              +
            </button>
        </div>

        <div id="controlBtns">
            <button
              ng-click="$ctrl.startOrReset()"
              ng-disabled="!$ctrl.readerPaused"
              ng-bind="$ctrl.startReset"
              class="btn btn-primary">
              Start!
            </button>

            <button
              ng-class="(!$ctrl.readerStarted) ? 'hid' : ''"
              ng-click="$ctrl.playOrPause();"
              class="btn btn-danger"
              ng-bind="$ctrl.playPause">
            </button>

            <button
              ng-click="$ctrl.newMono()"
              class="btn">
              New Script
            </button>
        </div>
        </div>

        <div class="monologue"
          <p>{{ $ctrl.mono.content }}</p>
          <p>{{ $ctrl.mono.caption }}</p>
        </div>
    </div>
  </body>
  `
}

angular
  .module('mySpeedReader')
  .component('speedComp', speedComp);
