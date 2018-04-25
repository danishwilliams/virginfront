/**
 * @license AngularJS v1.4.5
 * (c) 2010-2015 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {

'use strict';

/**
 * @ngdoc object
 * @name angular.mock
 * @description
 *
 * Namespace from 'angular-mocks.js' which contains testing related code.
 */
angular.mock = {};

/**
 * ! This is a private undocumented service !
 *
 * @name $browser
 *
 * @description
 * This service is a mock implementation of {@link ng.$browser}. It provides fake
 * implementation for commonly used browser apis that are hard to test, e.g. setTimeout, xhr,
 * cookies, etc...
 *
 * The api of this service is the same as that of the real {@link ng.$browser $browser}, except
 * that there are several helper methods available which can be used in tests.
 */
angular.mock.$BrowserProvider = function() {
  this.$get = function() {
    return new angular.mock.$Browser();
  };
};

angular.mock.$Browser = function() {
  var self = this;

  this.isMock = true;
  self.$$url = "http://server/";
  self.$$lastUrl = self.$$url; // used by url polling fn
  self.pollFns = [];

  // TODO(vojta): remove this temporary api
  self.$$completeOutstandingRequest = angular.noop;
  self.$$incOutstandingRequestCount = angular.noop;


  // register url polling fn

  self.onUrlChange = function(listener) {
    self.pollFns.push(
      function() {
        if (self.$$lastUrl !== self.$$url || self.$$state !== self.$$lastState) {
          self.$$lastUrl = self.$$url;
          self.$$lastState = self.$$state;
          listener(self.$$url, self.$$state);
        }
      }
    );

    return listener;
  };

  self.$$applicationDestroyed = angular.noop;
  self.$$checkUrlChange = angular.noop;

  self.deferredFns = [];
  self.deferredNextId = 0;

  self.defer = function(fn, delay) {
    delay = delay || 0;
    self.deferredFns.push({time:(self.defer.now + delay), fn:fn, id: self.deferredNextId});
    self.deferredFns.sort(function(a, b) { return a.time - b.time;});
    return self.deferredNextId++;
  };


  /**
   * @name $browser#defer.now
   *
   * @description
   * Current milliseconds mock time.
   */
  self.defer.now = 0;


  self.defer.cancel = function(deferId) {
    var fnIndex;

    angular.forEach(self.deferredFns, function(fn, index) {
      if (fn.id === deferId) fnIndex = index;
    });

    if (fnIndex !== undefined) {
      self.deferredFns.splice(fnIndex, 1);
      return true;
    }

    return false;
  };


  /**
   * @name $browser#defer.flush
   *
   * @description
   * Flushes all pending requests and executes the defer callbacks.
   *
   * @param {number=} number of milliseconds to flush. See {@link #defer.now}
   */
  self.defer.flush = function(delay) {
    if (angular.isDefined(delay)) {
      self.defer.now += delay;
    } else {
      if (self.deferredFns.length) {
        self.defer.now = self.deferredFns[self.deferredFns.length - 1].time;
      } else {
        throw new Error('No deferred tasks to be flushed');
      }
    }

    while (self.deferredFns.length && self.deferredFns[0].time <= self.defer.now) {
      self.deferredFns.shift().fn();
    }
  };

  self.$$baseHref = '/';
  self.baseHref = function() {
    return this.$$baseHref;
  };
};
angular.mock.$Browser.prototype = {

/**
  * @name $browser#poll
  *
  * @description
  * run all fns in pollFns
  */
  poll: function poll() {
    angular.forEach(this.pollFns, function(pollFn) {
      pollFn();
    });
  },

  url: function(url, replace, state) {
    if (angular.isUndefined(state)) {
      state = null;
    }
    if (url) {
      this.$$url = url;
      // Native pushState serializes & copies the object; simulate it.
      this.$$state = angular.copy(state);
      return this;
    }

    return this.$$url;
  },

  state: function() {
    return this.$$state;
  },

  notifyWhenNoOutstandingRequests: function(fn) {
    fn();
  }
};


/**
 * @ngdoc provider
 * @name $exceptionHandlerProvider
 *
 * @description
 * Configures the mock implementation of {@link ng.$exceptionHandler} to rethrow or to log errors
 * passed to the `$exceptionHandler`.
 */

/**
 * @ngdoc service
 * @name $exceptionHandler
 *
 * @description
 * Mock implementation of {@link ng.$exceptionHandler} that rethrows or logs errors passed
 * to it. See {@link ngMock.$exceptionHandlerProvider $exceptionHandlerProvider} for configuration
 * information.
 *
 *
 * ```js
 *   describe('$exceptionHandlerProvider', function() {
 *
 *     it('should capture log messages and exceptions', function() {
 *
 *       module(function($exceptionHandlerProvider) {
 *         $exceptionHandlerProvider.mode('log');
 *       });
 *
 *       inject(function($log, $exceptionHandler, $timeout) {
 *         $timeout(function() { $log.log(1); });
 *         $timeout(function() { $log.log(2); throw 'banana peel'; });
 *         $timeout(function() { $log.log(3); });
 *         expect($exceptionHandler.errors).toEqual([]);
 *         expect($log.assertEmpty());
 *         $timeout.flush();
 *         expect($exceptionHandler.errors).toEqual(['banana peel']);
 *         expect($log.log.logs).toEqual([[1], [2], [3]]);
 *       });
 *     });
 *   });
 * ```
 */

angular.mock.$ExceptionHandlerProvider = function() {
  var handler;

  /**
   * @ngdoc method
   * @name $exceptionHandlerProvider#mode
   *
   * @description
   * Sets the logging mode.
   *
   * @param {string} mode Mode of operation, defaults to `rethrow`.
   *
   *   - `log`: Sometimes it is desirable to test that an error is thrown, for this case the `log`
   *            mode stores an array of errors in `$exceptionHandler.errors`, to allow later
   *            assertion of them. See {@link ngMock.$log#assertEmpty assertEmpty()} and
   *            {@link ngMock.$log#reset reset()}
   *   - `rethrow`: If any errors are passed to the handler in tests, it typically means that there
   *                is a bug in the application or test, so this mock will make these tests fail.
   *                For any implementations that expect exceptions to be thrown, the `rethrow` mode
   *                will also maintain a log of thrown errors.
   */
  this.mode = function(mode) {

    switch (mode) {
      case 'log':
      case 'rethrow':
        var errors = [];
        handler = function(e) {
          if (arguments.length == 1) {
            errors.push(e);
          } else {
            errors.push([].slice.call(arguments, 0));
          }
          if (mode === "rethrow") {
            throw e;
          }
        };
        handler.errors = errors;
        break;
      default:
        throw new Error("Unknown mode '" + mode + "', only 'log'/'rethrow' modes are allowed!");
    }
  };

  this.$get = function() {
    return handler;
  };

  this.mode('rethrow');
};


/**
 * @ngdoc service
 * @name $log
 *
 * @description
 * Mock implementation of {@link ng.$log} that gathers all logged messages in arrays
 * (one array per logging level). These arrays are exposed as `logs` property of each of the
 * level-specific log function, e.g. for level `error` the array is exposed as `$log.error.logs`.
 *
 */
angular.mock.$LogProvider = function() {
  var debug = true;

  function concat(array1, array2, index) {
    return array1.concat(Array.prototype.slice.call(array2, index));
  }

  this.debugEnabled = function(flag) {
    if (angular.isDefined(flag)) {
      debug = flag;
      return this;
    } else {
      return debug;
    }
  };

  this.$get = function() {
    var $log = {
      log: function() { $log.log.logs.push(concat([], arguments, 0)); },
      warn: function() { $log.warn.logs.push(concat([], arguments, 0)); },
      info: function() { $log.info.logs.push(concat([], arguments, 0)); },
      error: function() { $log.error.logs.push(concat([], arguments, 0)); },
      debug: function() {
        if (debug) {
          $log.debug.logs.push(concat([], arguments, 0));
        }
      }
    };

    /**
     * @ngdoc method
     * @name $log#reset
     *
     * @description
     * Reset all of the logging arrays to empty.
     */
    $log.reset = function() {
      /**
       * @ngdoc property
       * @name $log#log.logs
       *
       * @description
       * Array of messages logged using {@link ng.$log#log `log()`}.
       *
       * @example
       * ```js
       * $log.log('Some Log');
       * var first = $log.log.logs.unshift();
       * ```
       */
      $log.log.logs = [];
      /**
       * @ngdoc property
       * @name $log#info.logs
       *
       * @description
       * Array of messages logged using {@link ng.$log#info `info()`}.
       *
       * @example
       * ```js
       * $log.info('Some Info');
       * var first = $log.info.logs.unshift();
       * ```
       */
      $log.info.logs = [];
      /**
       * @ngdoc property
       * @name $log#warn.logs
       *
       * @description
       * Array of messages logged using {@link ng.$log#warn `warn()`}.
       *
       * @example
       * ```js
       * $log.warn('Some Warning');
       * var first = $log.warn.logs.unshift();
       * ```
       */
      $log.warn.logs = [];
      /**
       * @ngdoc property
       * @name $log#error.logs
       *
       * @description
       * Array of messages logged using {@link ng.$log#error `error()`}.
       *
       * @example
       * ```js
       * $log.error('Some Error');
       * var first = $log.error.logs.unshift();
       * ```
       */
      $log.error.logs = [];
        /**
       * @ngdoc property
       * @name $log#debug.logs
       *
       * @description
       * Array of messages logged using {@link ng.$log#debug `debug()`}.
       *
       * @example
       * ```js
       * $log.debug('Some Error');
       * var first = $log.debug.logs.unshift();
       * ```
       */
      $log.debug.logs = [];
    };

    /**
     * @ngdoc method
     * @name $log#assertEmpty
     *
     * @description
     * Assert that all of the logging methods have no logged messages. If any messages are present,
     * an exception is thrown.
     */
    $log.assertEmpty = function() {
      var errors = [];
      angular.forEach(['error', 'warn', 'info', 'log', 'debug'], function(logLevel) {
        angular.forEach($log[logLevel].logs, function(log) {
          angular.forEach(log, function(logItem) {
            errors.push('MOCK $log (' + logLevel + '): ' + String(logItem) + '\n' +
                        (logItem.stack || ''));
          });
        });
      });
      if (errors.length) {
        errors.unshift("Expected $log to be empty! Either a message was logged unexpectedly, or " +
          "an expected log message was not checked and removed:");
        errors.push('');
        throw new Error(errors.join('\n---------\n'));
      }
    };

    $log.reset();
    return $log;
  };
};


/**
 * @ngdoc service
 * @name $interval
 *
 * @description
 * Mock implementation of the $interval service.
 *
 * Use {@link ngMock.$interval#flush `$interval.flush(millis)`} to
 * move forward by `millis` milliseconds and trigger any functions scheduled to run in that
 * time.
 *
 * @param {function()} fn A function that should be called repeatedly.
 * @param {number} delay Number of milliseconds between each function call.
 * @param {number=} [count=0] Number of times to repeat. If not set, or 0, will repeat
 *   indefinitely.
 * @param {boolean=} [invokeApply=true] If set to `false` skips model dirty checking, otherwise
 *   will invoke `fn` within the {@link ng.$rootScope.Scope#$apply $apply} block.
 * @param {...*=} Pass additional parameters to the executed function.
 * @returns {promise} A promise which will be notified on each iteration.
 */
angular.mock.$IntervalProvider = function() {
  this.$get = ['$browser', '$rootScope', '$q', '$$q',
       function($browser,   $rootScope,   $q,   $$q) {
    var repeatFns = [],
        nextRepeatId = 0,
        now = 0;

    var $interval = function(fn, delay, count, invokeApply) {
      var hasParams = arguments.length > 4,
          args = hasParams ? Array.prototype.slice.call(arguments, 4) : [],
          iteration = 0,
          skipApply = (angular.isDefined(invokeApply) && !invokeApply),
          deferred = (skipApply ? $$q : $q).defer(),
          promise = deferred.promise;

      count = (angular.isDefined(count)) ? count : 0;
      promise.then(null, null, (!hasParams) ? fn : function() {
        fn.apply(null, args);
      });

      promise.$$intervalId = nextRepeatId;

      function tick() {
        deferred.notify(iteration++);

        if (count > 0 && iteration >= count) {
          var fnIndex;
          deferred.resolve(iteration);

          angular.forEach(repeatFns, function(fn, index) {
            if (fn.id === promise.$$intervalId) fnIndex = index;
          });

          if (fnIndex !== undefined) {
            repeatFns.splice(fnIndex, 1);
          }
        }

        if (skipApply) {
          $browser.defer.flush();
        } else {
          $rootScope.$apply();
        }
      }

      repeatFns.push({
        nextTime:(now + delay),
        delay: delay,
        fn: tick,
        id: nextRepeatId,
        deferred: deferred
      });
      repeatFns.sort(function(a, b) { return a.nextTime - b.nextTime;});

      nextRepeatId++;
      return promise;
    };
    /**
     * @ngdoc method
     * @name $interval#cancel
     *
     * @description
     * Cancels a task associated with the `promise`.
     *
     * @param {promise} promise A promise from calling the `$interval` function.
     * @returns {boolean} Returns `true` if the task was successfully cancelled.
     */
    $interval.cancel = function(promise) {
      if (!promise) return false;
      var fnIndex;

      angular.forEach(repeatFns, function(fn, index) {
        if (fn.id === promise.$$intervalId) fnIndex = index;
      });

      if (fnIndex !== undefined) {
        repeatFns[fnIndex].deferred.reject('canceled');
        repeatFns.splice(fnIndex, 1);
        return true;
      }

      return false;
    };

    /**
     * @ngdoc method
     * @name $interval#flush
     * @description
     *
     * Runs interval tasks scheduled to be run in the next `millis` milliseconds.
     *
     * @param {number=} millis maximum timeout amount to flush up until.
     *
     * @return {number} The amount of time moved forward.
     */
    $interval.flush = function(millis) {
      now += millis;
      while (repeatFns.length && repeatFns[0].nextTime <= now) {
        var task = repeatFns[0];
        task.fn();
        task.nextTime += task.delay;
        repeatFns.sort(function(a, b) { return a.nextTime - b.nextTime;});
      }
      return millis;
    };

    return $interval;
  }];
};


/* jshint -W101 */
/* The R_ISO8061_STR regex is never going to fit into the 100 char limit!
 * This directive should go inside the anonymous function but a bug in JSHint means that it would
 * not be enacted early enough to prevent the warning.
 */
var R_ISO8061_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?:\:?(\d\d)(?:\:?(\d\d)(?:\.(\d{3}))?)?)?(Z|([+-])(\d\d):?(\d\d)))?$/;

function jsonStringToDate(string) {
  var match;
  if (match = string.match(R_ISO8061_STR)) {
    var date = new Date(0),
        tzHour = 0,
        tzMin  = 0;
    if (match[9]) {
      tzHour = toInt(match[9] + match[10]);
      tzMin = toInt(match[9] + match[11]);
    }
    date.setUTCFullYear(toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]));
    date.setUTCHours(toInt(match[4] || 0) - tzHour,
                     toInt(match[5] || 0) - tzMin,
                     toInt(match[6] || 0),
                     toInt(match[7] || 0));
    return date;
  }
  return string;
}

function toInt(str) {
  return parseInt(str, 10);
}

function padNumber(num, digits, trim) {
  var neg = '';
  if (num < 0) {
    neg =  '-';
    num = -num;
  }
  num = '' + num;
  while (num.length < digits) num = '0' + num;
  if (trim) {
    num = num.substr(num.length - digits);
  }
  return neg + num;
}


/**
 * @ngdoc type
 * @name angular.mock.TzDate
 * @description
 *
 * *NOTE*: this is not an injectable instance, just a globally available mock class of `Date`.
 *
 * Mock of the Date type which has its timezone specified via constructor arg.
 *
 * The main purpose is to create Date-like instances with timezone fixed to the specified timezone
 * offset, so that we can test code that depends on local timezone settings without dependency on
 * the time zone settings of the machine where the code is running.
 *
 * @param {number} offset Offset of the *desired* timezone in hours (fractions will be honored)
 * @param {(number|string)} timestamp Timestamp representing the desired time in *UTC*
 *
 * @example
 * !!!! WARNING !!!!!
 * This is not a complete Date object so only methods that were implemented can be called safely.
 * To make matters worse, TzDate instances inherit stuff from Date via a prototype.
 *
 * We do our best to intercept calls to "unimplemented" methods, but since the list of methods is
 * incomplete we might be missing some non-standard methods. This can result in errors like:
 * "Date.prototype.foo called on incompatible Object".
 *
 * ```js
 * var newYearInBratislava = new TzDate(-1, '2009-12-31T23:00:00Z');
 * newYearInBratislava.getTimezoneOffset() => -60;
 * newYearInBratislava.getFullYear() => 2010;
 * newYearInBratislava.getMonth() => 0;
 * newYearInBratislava.getDate() => 1;
 * newYearInBratislava.getHours() => 0;
 * newYearInBratislava.getMinutes() => 0;
 * newYearInBratislava.getSeconds() => 0;
 * ```
 *
 */
angular.mock.TzDate = function(offset, timestamp) {
  var self = new Date(0);
  if (angular.isString(timestamp)) {
    var tsStr = timestamp;

    self.origDate = jsonStringToDate(timestamp);

    timestamp = self.origDate.getTime();
    if (isNaN(timestamp)) {
      throw {
        name: "Illegal Argument",
        message: "Arg '" + tsStr + "' passed into TzDate constructor is not a valid date string"
      };
    }
  } else {
    self.origDate = new Date(timestamp);
  }

  var localOffset = new Date(timestamp).getTimezoneOffset();
  self.offsetDiff = localOffset * 60 * 1000 - offset * 1000 * 60 * 60;
  self.date = new Date(timestamp + self.offsetDiff);

  self.getTime = function() {
    return self.date.getTime() - self.offsetDiff;
  };

  self.toLocaleDateString = function() {
    return self.date.toLocaleDateString();
  };

  self.getFullYear = function() {
    return self.date.getFullYear();
  };

  self.getMonth = function() {
    return self.date.getMonth();
  };

  self.getDate = function() {
    return self.date.getDate();
  };

  self.getHours = function() {
    return self.date.getHours();
  };

  self.getMinutes = function() {
    return self.date.getMinutes();
  };

  self.getSeconds = function() {
    return self.date.getSeconds();
  };

  self.getMilliseconds = function() {
    return self.date.getMilliseconds();
  };

  self.getTimezoneOffset = function() {
    return offset * 60;
  };

  self.getUTCFullYear = function() {
    return self.origDate.getUTCFullYear();
  };

  self.getUTCMonth = function() {
    return self.origDate.getUTCMonth();
  };

  self.getUTCDate = function() {
    return self.origDate.getUTCDate();
  };

  self.getUTCHours = function() {
    return self.origDate.getUTCHours();
  };

  self.getUTCMinutes = function() {
    return self.origDate.getUTCMinutes();
  };

  self.getUTCSeconds = function() {
    return self.origDate.getUTCSeconds();
  };

  self.getUTCMilliseconds = function() {
    return self.origDate.getUTCMilliseconds();
  };

  self.getDay = function() {
    return self.date.getDay();
  };

  // provide this method only on browsers that already have it
  if (self.toISOString) {
    self.toISOString = function() {
      return padNumber(self.origDate.getUTCFullYear(), 4) + '-' +
            padNumber(self.origDate.getUTCMonth() + 1, 2) + '-' +
            padNumber(self.origDate.getUTCDate(), 2) + 'T' +
            padNumber(self.origDate.getUTCHours(), 2) + ':' +
            padNumber(self.origDate.getUTCMinutes(), 2) + ':' +
            padNumber(self.origDate.getUTCSeconds(), 2) + '.' +
            padNumber(self.origDate.getUTCMilliseconds(), 3) + 'Z';
    };
  }

  //hide all methods not implemented in this mock that the Date prototype exposes
  var unimplementedMethods = ['getUTCDay',
      'getYear', 'setDate', 'setFullYear', 'setHours', 'setMilliseconds',
      'setMinutes', 'setMonth', 'setSeconds', 'setTime', 'setUTCDate', 'setUTCFullYear',
      'setUTCHours', 'setUTCMilliseconds', 'setUTCMinutes', 'setUTCMonth', 'setUTCSeconds',
      'setYear', 'toDateString', 'toGMTString', 'toJSON', 'toLocaleFormat', 'toLocaleString',
      'toLocaleTimeString', 'toSource', 'toString', 'toTimeString', 'toUTCString', 'valueOf'];

  angular.forEach(unimplementedMethods, function(methodName) {
    self[methodName] = function() {
      throw new Error("Method '" + methodName + "' is not implemented in the TzDate mock");
    };
  });

  return self;
};

//make "tzDateInstance instanceof Date" return true
angular.mock.TzDate.prototype = Date.prototype;
/* jshint +W101 */

angular.mock.animate = angular.module('ngAnimateMock', ['ng'])

  .config(['$provide', function($provide) {

    $provide.factory('$$forceReflow', function() {
      function reflowFn() {
        reflowFn.totalReflows++;
      }
      reflowFn.totalReflows = 0;
      return reflowFn;
    });

    $provide.factory('$$animateAsyncRun', function() {
      var queue = [];
      var queueFn = function() {
        return function(fn) {
          queue.push(fn);
        };
      };
      queueFn.flush = function() {
        if (queue.length === 0) return false;

        for (var i = 0; i < queue.length; i++) {
          queue[i]();
        }
        queue = [];

        return true;
      };
      return queueFn;
    });

    $provide.decorator('$animate', ['$delegate', '$timeout', '$browser', '$$rAF', '$$forceReflow', '$$animateAsyncRun',
                            function($delegate,   $timeout,   $browser,   $$rAF,   $$forceReflow,   $$animateAsyncRun) {

      var animate = {
        queue: [],
        cancel: $delegate.cancel,
        on: $delegate.on,
        off: $delegate.off,
        pin: $delegate.pin,
        get reflows() {
          return $$forceReflow.totalReflows;
        },
        enabled: $delegate.enabled,
        flush: function() {
          var rafsFlushed = false;
          if ($$rAF.queue.length) {
            $$rAF.flush();
            rafsFlushed = true;
          }

          var animatorsFlushed = $$animateAsyncRun.flush();
          if (!rafsFlushed && !animatorsFlushed) {
            throw new Error('No pending animations ready to be closed or flushed');
          }
        }
      };

      angular.forEach(
        ['animate','enter','leave','move','addClass','removeClass','setClass'], function(method) {
        animate[method] = function() {
          animate.queue.push({
            event: method,
            element: arguments[0],
            options: arguments[arguments.length - 1],
            args: arguments
          });
          return $delegate[method].apply($delegate, arguments);
        };
      });

      return animate;
    }]);

  }]);


/**
 * @ngdoc function
 * @name angular.mock.dump
 * @description
 *
 * *NOTE*: this is not an injectable instance, just a globally available function.
 *
 * Method for serializing common angular objects (scope, elements, etc..) into strings, useful for
 * debugging.
 *
 * This method is also available on window, where it can be used to display objects on debug
 * console.
 *
 * @param {*} object - any object to turn into string.
 * @return {string} a serialized string of the argument
 */
angular.mock.dump = function(object) {
  return serialize(object);

  function serialize(object) {
    var out;

    if (angular.isElement(object)) {
      object = angular.element(object);
      out = angular.element('<div></div>');
      angular.forEach(object, function(element) {
        out.append(angular.element(element).clone());
      });
      out = out.html();
    } else if (angular.isArray(object)) {
      out = [];
      angular.forEach(object, function(o) {
        out.push(serialize(o));
      });
      out = '[ ' + out.join(', ') + ' ]';
    } else if (angular.isObject(object)) {
      if (angular.isFunction(object.$eval) && angular.isFunction(object.$apply)) {
        out = serializeScope(object);
      } else if (object instanceof Error) {
        out = object.stack || ('' + object.name + ': ' + object.message);
      } else {
        // TODO(i): this prevents methods being logged,
        // we should have a better way to serialize objects
        out = angular.toJson(object, true);
      }
    } else {
      out = String(object);
    }

    return out;
  }

  function serializeScope(scope, offset) {
    offset = offset ||  '  ';
    var log = [offset + 'Scope(' + scope.$id + '): {'];
    for (var key in scope) {
      if (Object.prototype.hasOwnProperty.call(scope, key) && !key.match(/^(\$|this)/)) {
        log.push('  ' + key + ': ' + angular.toJson(scope[key]));
      }
    }
    var child = scope.$$childHead;
    while (child) {
      log.push(serializeScope(child, offset + '  '));
      child = child.$$nextSibling;
    }
    log.push('}');
    return log.join('\n' + offset);
  }
};

/**
 * @ngdoc service
 * @name $httpBackend
 * @description
 * Fake HTTP backend implementation suitable for unit testing applications that use the
 * {@link ng.$http $http service}.
 *
 * *Note*: For fake HTTP backend implementation suitable for end-to-end testing or backend-less
 * development please see {@link ngMockE2E.$httpBackend e2e $httpBackend mock}.
 *
 * During unit testing, we want our unit tests to run quickly and have no external dependencies so
 * we don’t want to send [XHR](https://developer.mozilla.org/en/xmlhttprequest) or
 * [JSONP](http://en.wikipedia.org/wiki/JSONP) requests to a real server. All we really need is
 * to verify whether a certain request has been sent or not, or alternatively just let the
 * application make requests, respond with pre-trained responses and assert that the end result is
 * what we expect it to be.
 *
 * This mock implementation can be used to respond with static or dynamic responses via the
 * `expect` and `when` apis and their shortcuts (`expectGET`, `whenPOST`, etc).
 *
 * When an Angular application needs some data from a server, it calls the $http service, which
 * sends the request to a real server using $httpBackend service. With dependency injection, it is
 * easy to inject $httpBackend mock (which has the same API as $httpBackend) and use it to verify
 * the requests and respond with some testing data without sending a request to a real server.
 *
 * There are two ways to specify what test data should be returned as http responses by the mock
 * backend when the code under test makes http requests:
 *
 * - `$httpBackend.expect` - specifies a request expectation
 * - `$httpBackend.when` - specifies a backend definition
 *
 *
 * # Request Expectations vs Backend Definitions
 *
 * Request expectations provide a way to make assertions about requests made by the application and
 * to define responses for those requests. The test will fail if the expected requests are not made
 * or they are made in the wrong order.
 *
 * Backend definitions allow you to define a fake backend for your application which doesn't assert
 * if a particular request was made or not, it just returns a trained response if a request is made.
 * The test will pass whether or not the request gets made during testing.
 *
 *
 * <table class="table">
 *   <tr><th width="220px"></th><th>Request expectations</th><th>Backend definitions</th></tr>
 *   <tr>
 *     <th>Syntax</th>
 *     <td>.expect(...).respond(...)</td>
 *     <td>.when(...).respond(...)</td>
 *   </tr>
 *   <tr>
 *     <th>Typical usage</th>
 *     <td>strict unit tests</td>
 *     <td>loose (black-box) unit testing</td>
 *   </tr>
 *   <tr>
 *     <th>Fulfills multiple requests</th>
 *     <td>NO</td>
 *     <td>YES</td>
 *   </tr>
 *   <tr>
 *     <th>Order of requests matters</th>
 *     <td>YES</td>
 *     <td>NO</td>
 *   </tr>
 *   <tr>
 *     <th>Request required</th>
 *     <td>YES</td>
 *     <td>NO</td>
 *   </tr>
 *   <tr>
 *     <th>Response required</th>
 *     <td>optional (see below)</td>
 *     <td>YES</td>
 *   </tr>
 * </table>
 *
 * In cases where both backend definitions and request expectations are specified during unit
 * testing, the request expectations are evaluated first.
 *
 * If a request expectation has no response specified, the algorithm will search your backend
 * definitions for an appropriate response.
 *
 * If a request didn't match any expectation or if the expectation doesn't have the response
 * defined, the backend definitions are evaluated in sequential order to see if any of them match
 * the request. The response from the first matched definition is returned.
 *
 *
 * # Flushing HTTP requests
 *
 * The $httpBackend used in production always responds to requests asynchronously. If we preserved
 * this behavior in unit testing, we'd have to create async unit tests, which are hard to write,
 * to follow and to maintain. But neither can the testing mock respond synchronously; that would
 * change the execution of the code under test. For this reason, the mock $httpBackend has a
 * `flush()` method, which allows the test to explicitly flush pending requests. This preserves
 * the async api of the backend, while allowing the test to execute synchronously.
 *
 *
 * # Unit testing with mock $httpBackend
 * The following code shows how to setup and use the mock backend when unit testing a controller.
 * First we create the controller under test:
 *
  ```js
  // The module code
  angular
    .module('MyApp', [])
    .controller('MyController', MyController);

  // The controller code
  function MyController($scope, $http) {
    var authToken;

    $http.get('/auth.py').success(function(data, status, headers) {
      authToken = headers('A-Token');
      $scope.user = data;
    });

    $scope.saveMessage = function(message) {
      var headers = { 'Authorization': authToken };
      $scope.status = 'Saving...';

      $http.post('/add-msg.py', message, { headers: headers } ).success(function(response) {
        $scope.status = '';
      }).error(function() {
        $scope.status = 'ERROR!';
      });
    };
  }
  ```
 *
 * Now we setup the mock backend and create the test specs:
 *
  ```js
    // testing controller
    describe('MyController', function() {
       var $httpBackend, $rootScope, createController, authRequestHandler;

       // Set up the module
       beforeEach(module('MyApp'));

       beforeEach(inject(function($injector) {
         // Set up the mock http service responses
         $httpBackend = $injector.get('$httpBackend');
         // backend definition common for all tests
         authRequestHandler = $httpBackend.when('GET', '/auth.py')
                                .respond({userId: 'userX'}, {'A-Token': 'xxx'});

         // Get hold of a scope (i.e. the root scope)
         $rootScope = $injector.get('$rootScope');
         // The $controller service is used to create instances of controllers
         var $controller = $injector.get('$controller');

         createController = function() {
           return $controller('MyController', {'$scope' : $rootScope });
         };
       }));


       afterEach(function() {
         $httpBackend.verifyNoOutstandingExpectation();
         $httpBackend.verifyNoOutstandingRequest();
       });


       it('should fetch authentication token', function() {
         $httpBackend.expectGET('/auth.py');
         var controller = createController();
         $httpBackend.flush();
       });


       it('should fail authentication', function() {

         // Notice how you can change the response even after it was set
         authRequestHandler.respond(401, '');

         $httpBackend.expectGET('/auth.py');
         var controller = createController();
         $httpBackend.flush();
         expect($rootScope.status).toBe('Failed...');
       });


       it('should send msg to server', function() {
         var controller = createController();
         $httpBackend.flush();

         // now you don’t care about the authentication, but
         // the controller will still send the request and
         // $httpBackend will respond without you having to
         // specify the expectation and response for this request

         $httpBackend.expectPOST('/add-msg.py', 'message content').respond(201, '');
         $rootScope.saveMessage('message content');
         expect($rootScope.status).toBe('Saving...');
         $httpBackend.flush();
         expect($rootScope.status).toBe('');
       });


       it('should send auth header', function() {
         var controller = createController();
         $httpBackend.flush();

         $httpBackend.expectPOST('/add-msg.py', undefined, function(headers) {
           // check if the header was sent, if it wasn't the expectation won't
           // match the request and the test will fail
           return headers['Authorization'] == 'xxx';
         }).respond(201, '');

         $rootScope.saveMessage('whatever');
         $httpBackend.flush();
       });
    });
   ```
 */
angular.mock.$HttpBackendProvider = function() {
  this.$get = ['$rootScope', '$timeout', createHttpBackendMock];
};

/**
 * General factory function for $httpBackend mock.
 * Returns instance for unit testing (when no arguments specified):
 *   - passing through is disabled
 *   - auto flushing is disabled
 *
 * Returns instance for e2e testing (when `$delegate` and `$browser` specified):
 *   - passing through (delegating request to real backend) is enabled
 *   - auto flushing is enabled
 *
 * @param {Object=} $delegate Real $httpBackend instance (allow passing through if specified)
 * @param {Object=} $browser Auto-flushing enabled if specified
 * @return {Object} Instance of $httpBackend mock
 */
function createHttpBackendMock($rootScope, $timeout, $delegate, $browser) {
  var definitions = [],
      expectations = [],
      responses = [],
      responsesPush = angular.bind(responses, responses.push),
      copy = angular.copy;

  function createResponse(status, data, headers, statusText) {
    if (angular.isFunction(status)) return status;

    return function() {
      return angular.isNumber(status)
          ? [status, data, headers, statusText]
          : [200, status, data, headers];
    };
  }

  // TODO(vojta): change params to: method, url, data, headers, callback
  function $httpBackend(method, url, data, callback, headers, timeout, withCredentials) {
    var xhr = new MockXhr(),
        expectation = expectations[0],
        wasExpected = false;

    function prettyPrint(data) {
      return (angular.isString(data) || angular.isFunction(data) || data instanceof RegExp)
          ? data
          : angular.toJson(data);
    }

    function wrapResponse(wrapped) {
      if (!$browser && timeout) {
        timeout.then ? timeout.then(handleTimeout) : $timeout(handleTimeout, timeout);
      }

      return handleResponse;

      function handleResponse() {
        var response = wrapped.response(method, url, data, headers);
        xhr.$$respHeaders = response[2];
        callback(copy(response[0]), copy(response[1]), xhr.getAllResponseHeaders(),
                 copy(response[3] || ''));
      }

      function handleTimeout() {
        for (var i = 0, ii = responses.length; i < ii; i++) {
          if (responses[i] === handleResponse) {
            responses.splice(i, 1);
            callback(-1, undefined, '');
            break;
          }
        }
      }
    }

    if (expectation && expectation.match(method, url)) {
      if (!expectation.matchData(data)) {
        throw new Error('Expected ' + expectation + ' with different data\n' +
            'EXPECTED: ' + prettyPrint(expectation.data) + '\nGOT:      ' + data);
      }

      if (!expectation.matchHeaders(headers)) {
        throw new Error('Expected ' + expectation + ' with different headers\n' +
                        'EXPECTED: ' + prettyPrint(expectation.headers) + '\nGOT:      ' +
                        prettyPrint(headers));
      }

      expectations.shift();

      if (expectation.response) {
        responses.push(wrapResponse(expectation));
        return;
      }
      wasExpected = true;
    }

    var i = -1, definition;
    while ((definition = definitions[++i])) {
      if (definition.match(method, url, data, headers || {})) {
        if (definition.response) {
          // if $browser specified, we do auto flush all requests
          ($browser ? $browser.defer : responsesPush)(wrapResponse(definition));
        } else if (definition.passThrough) {
          $delegate(method, url, data, callback, headers, timeout, withCredentials);
        } else throw new Error('No response defined !');
        return;
      }
    }
    throw wasExpected ?
        new Error('No response defined !') :
        new Error('Unexpected request: ' + method + ' ' + url + '\n' +
                  (expectation ? 'Expected ' + expectation : 'No more request expected'));
  }

  /**
   * @ngdoc method
   * @name $httpBackend#when
   * @description
   * Creates a new backend definition.
   *
   * @param {string} method HTTP method.
   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
   *   and returns true if the url matches the current definition.
   * @param {(string|RegExp|function(string))=} data HTTP request body or function that receives
   *   data string and returns true if the data is as expected.
   * @param {(Object|function(Object))=} headers HTTP headers or function that receives http header
   *   object and returns true if the headers match the current definition.
   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
   *   request is handled. You can save this object for later use and invoke `respond` again in
   *   order to change how a matched request is handled.
   *
   *  - respond –
   *      `{function([status,] data[, headers, statusText])
   *      | function(function(method, url, data, headers)}`
   *    – The respond method takes a set of static data to be returned or a function that can
   *    return an array containing response status (number), response data (string), response
   *    headers (Object), and the text for the status (string). The respond method returns the
   *    `requestHandler` object for possible overrides.
   */
  $httpBackend.when = function(method, url, data, headers) {
    var definition = new MockHttpExpectation(method, url, data, headers),
        chain = {
          respond: function(status, data, headers, statusText) {
            definition.passThrough = undefined;
            definition.response = createResponse(status, data, headers, statusText);
            return chain;
          }
        };

    if ($browser) {
      chain.passThrough = function() {
        definition.response = undefined;
        definition.passThrough = true;
        return chain;
      };
    }

    definitions.push(definition);
    return chain;
  };

  /**
   * @ngdoc method
   * @name $httpBackend#whenGET
   * @description
   * Creates a new backend definition for GET requests. For more info see `when()`.
   *
   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
   *   and returns true if the url matches the current definition.
   * @param {(Object|function(Object))=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
   * request is handled. You can save this object for later use and invoke `respond` again in
   * order to change how a matched request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#whenHEAD
   * @description
   * Creates a new backend definition for HEAD requests. For more info see `when()`.
   *
   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
   *   and returns true if the url matches the current definition.
   * @param {(Object|function(Object))=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
   * request is handled. You can save this object for later use and invoke `respond` again in
   * order to change how a matched request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#whenDELETE
   * @description
   * Creates a new backend definition for DELETE requests. For more info see `when()`.
   *
   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
   *   and returns true if the url matches the current definition.
   * @param {(Object|function(Object))=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
   * request is handled. You can save this object for later use and invoke `respond` again in
   * order to change how a matched request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#whenPOST
   * @description
   * Creates a new backend definition for POST requests. For more info see `when()`.
   *
   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
   *   and returns true if the url matches the current definition.
   * @param {(string|RegExp|function(string))=} data HTTP request body or function that receives
   *   data string and returns true if the data is as expected.
   * @param {(Object|function(Object))=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
   * request is handled. You can save this object for later use and invoke `respond` again in
   * order to change how a matched request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#whenPUT
   * @description
   * Creates a new backend definition for PUT requests.  For more info see `when()`.
   *
   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
   *   and returns true if the url matches the current definition.
   * @param {(string|RegExp|function(string))=} data HTTP request body or function that receives
   *   data string and returns true if the data is as expected.
   * @param {(Object|function(Object))=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
   * request is handled. You can save this object for later use and invoke `respond` again in
   * order to change how a matched request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#whenJSONP
   * @description
   * Creates a new backend definition for JSONP requests. For more info see `when()`.
   *
   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
   *   and returns true if the url matches the current definition.
   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
   * request is handled. You can save this object for later use and invoke `respond` again in
   * order to change how a matched request is handled.
   */
  createShortMethods('when');


  /**
   * @ngdoc method
   * @name $httpBackend#expect
   * @description
   * Creates a new request expectation.
   *
   * @param {string} method HTTP method.
   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
   *   and returns true if the url matches the current definition.
   * @param {(string|RegExp|function(string)|Object)=} data HTTP request body or function that
   *  receives data string and returns true if the data is as expected, or Object if request body
   *  is in JSON format.
   * @param {(Object|function(Object))=} headers HTTP headers or function that receives http header
   *   object and returns true if the headers match the current expectation.
   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
   *  request is handled. You can save this object for later use and invoke `respond` again in
   *  order to change how a matched request is handled.
   *
   *  - respond –
   *    `{function([status,] data[, headers, statusText])
   *    | function(function(method, url, data, headers)}`
   *    – The respond method takes a set of static data to be returned or a function that can
   *    return an array containing response status (number), response data (string), response
   *    headers (Object), and the text for the status (string). The respond method returns the
   *    `requestHandler` object for possible overrides.
   */
  $httpBackend.expect = function(method, url, data, headers) {
    var expectation = new MockHttpExpectation(method, url, data, headers),
        chain = {
          respond: function(status, data, headers, statusText) {
            expectation.response = createResponse(status, data, headers, statusText);
            return chain;
          }
        };

    expectations.push(expectation);
    return chain;
  };


  /**
   * @ngdoc method
   * @name $httpBackend#expectGET
   * @description
   * Creates a new request expectation for GET requests. For more info see `expect()`.
   *
   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
   *   and returns true if the url matches the current definition.
   * @param {Object=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
   * request is handled. You can save this object for later use and invoke `respond` again in
   * order to change how a matched request is handled. See #expect for more info.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#expectHEAD
   * @description
   * Creates a new request expectation for HEAD requests. For more info see `expect()`.
   *
   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
   *   and returns true if the url matches the current definition.
   * @param {Object=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
   *   request is handled. You can save this object for later use and invoke `respond` again in
   *   order to change how a matched request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#expectDELETE
   * @description
   * Creates a new request expectation for DELETE requests. For more info see `expect()`.
   *
   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
   *   and returns true if the url matches the current definition.
   * @param {Object=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
   *   request is handled. You can save this object for later use and invoke `respond` again in
   *   order to change how a matched request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#expectPOST
   * @description
   * Creates a new request expectation for POST requests. For more info see `expect()`.
   *
   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
   *   and returns true if the url matches the current definition.
   * @param {(string|RegExp|function(string)|Object)=} data HTTP request body or function that
   *  receives data string and returns true if the data is as expected, or Object if request body
   *  is in JSON format.
   * @param {Object=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
   *   request is handled. You can save this object for later use and invoke `respond` again in
   *   order to change how a matched request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#expectPUT
   * @description
   * Creates a new request expectation for PUT requests. For more info see `expect()`.
   *
   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
   *   and returns true if the url matches the current definition.
   * @param {(string|RegExp|function(string)|Object)=} data HTTP request body or function that
   *  receives data string and returns true if the data is as expected, or Object if request body
   *  is in JSON format.
   * @param {Object=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
   *   request is handled. You can save this object for later use and invoke `respond` again in
   *   order to change how a matched request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#expectPATCH
   * @description
   * Creates a new request expectation for PATCH requests. For more info see `expect()`.
   *
   * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
   *   and returns true if the url matches the current definition.
   * @param {(string|RegExp|function(string)|Object)=} data HTTP request body or function that
   *  receives data string and returns true if the data is as expected, or Object if request body
   *  is in JSON format.
   * @param {Object=} headers HTTP headers.
   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
   *   request is handled. You can save this object for later use and invoke `respond` again in
   *   order to change how a matched request is handled.
   */

  /**
   * @ngdoc method
   * @name $httpBackend#expectJSONP
   * @description
   * Creates a new request expectation for JSONP requests. For more info see `expect()`.
   *
   * @param {string|RegExp|function(string)} url HTTP url or function that receives an url
   *   and returns true if the url matches the current definition.
   * @returns {requestHandler} Returns an object with `respond` method that controls how a matched
   *   request is handled. You can save this object for later use and invoke `respond` again in
   *   order to change how a matched request is handled.
   */
  createShortMethods('expect');


  /**
   * @ngdoc method
   * @name $httpBackend#flush
   * @description
   * Flushes all pending requests using the trained responses.
   *
   * @param {number=} count Number of responses to flush (in the order they arrived). If undefined,
   *   all pending requests will be flushed. If there are no pending requests when the flush method
   *   is called an exception is thrown (as this typically a sign of programming error).
   */
  $httpBackend.flush = function(count, digest) {
    if (digest !== false) $rootScope.$digest();
    if (!responses.length) throw new Error('No pending request to flush !');

    if (angular.isDefined(count) && count !== null) {
      while (count--) {
        if (!responses.length) throw new Error('No more pending request to flush !');
        responses.shift()();
      }
    } else {
      while (responses.length) {
        responses.shift()();
      }
    }
    $httpBackend.verifyNoOutstandingExpectation(digest);
  };


  /**
   * @ngdoc method
   * @name $httpBackend#verifyNoOutstandingExpectation
   * @description
   * Verifies that all of the requests defined via the `expect` api were made. If any of the
   * requests were not made, verifyNoOutstandingExpectation throws an exception.
   *
   * Typically, you would call this method following each test case that asserts requests using an
   * "afterEach" clause.
   *
   * ```js
   *   afterEach($httpBackend.verifyNoOutstandingExpectation);
   * ```
   */
  $httpBackend.verifyNoOutstandingExpectation = function(digest) {
    if (digest !== false) $rootScope.$digest();
    if (expectations.length) {
      throw new Error('Unsatisfied requests: ' + expectations.join(', '));
    }
  };


  /**
   * @ngdoc method
   * @name $httpBackend#verifyNoOutstandingRequest
   * @description
   * Verifies that there are no outstanding requests that need to be flushed.
   *
   * Typically, you would call this method following each test case that asserts requests using an
   * "afterEach" clause.
   *
   * ```js
   *   afterEach($httpBackend.verifyNoOutstandingRequest);
   * ```
   */
  $httpBackend.verifyNoOutstandingRequest = function() {
    if (responses.length) {
      throw new Error('Unflushed requests: ' + responses.length);
    }
  };


  /**
   * @ngdoc method
   * @name $httpBackend#resetExpectations
   * @description
   * Resets all request expectations, but preserves all backend definitions. Typically, you would
   * call resetExpectations during a multiple-phase test when you want to reuse the same instance of
   * $httpBackend mock.
   */
  $httpBackend.resetExpectations = function() {
    expectations.length = 0;
    responses.length = 0;
  };

  return $httpBackend;


  function createShortMethods(prefix) {
    angular.forEach(['GET', 'DELETE', 'JSONP', 'HEAD'], function(method) {
     $httpBackend[prefix + method] = function(url, headers) {
       return $httpBackend[prefix](method, url, undefined, headers);
     };
    });

    angular.forEach(['PUT', 'POST', 'PATCH'], function(method) {
      $httpBackend[prefix + method] = function(url, data, headers) {
        return $httpBackend[prefix](method, url, data, headers);
      };
    });
  }
}

function MockHttpExpectation(method, url, data, headers) {

  this.data = data;
  this.headers = headers;

  this.match = function(m, u, d, h) {
    if (method != m) return false;
    if (!this.matchUrl(u)) return false;
    if (angular.isDefined(d) && !this.matchData(d)) return false;
    if (angular.isDefined(h) && !this.matchHeaders(h)) return false;
    return true;
  };

  this.matchUrl = function(u) {
    if (!url) return true;
    if (angular.isFunction(url.test)) return url.test(u);
    if (angular.isFunction(url)) return url(u);
    return url == u;
  };

  this.matchHeaders = function(h) {
    if (angular.isUndefined(headers)) return true;
    if (angular.isFunction(headers)) return headers(h);
    return angular.equals(headers, h);
  };

  this.matchData = function(d) {
    if (angular.isUndefined(data)) return true;
    if (data && angular.isFunction(data.test)) return data.test(d);
    if (data && angular.isFunction(data)) return data(d);
    if (data && !angular.isString(data)) {
      return angular.equals(angular.fromJson(angular.toJson(data)), angular.fromJson(d));
    }
    return data == d;
  };

  this.toString = function() {
    return method + ' ' + url;
  };
}

function createMockXhr() {
  return new MockXhr();
}

function MockXhr() {

  // hack for testing $http, $httpBackend
  MockXhr.$$lastInstance = this;

  this.open = function(method, url, async) {
    this.$$method = method;
    this.$$url = url;
    this.$$async = async;
    this.$$reqHeaders = {};
    this.$$respHeaders = {};
  };

  this.send = function(data) {
    this.$$data = data;
  };

  this.setRequestHeader = function(key, value) {
    this.$$reqHeaders[key] = value;
  };

  this.getResponseHeader = function(name) {
    // the lookup must be case insensitive,
    // that's why we try two quick lookups first and full scan last
    var header = this.$$respHeaders[name];
    if (header) return header;

    name = angular.lowercase(name);
    header = this.$$respHeaders[name];
    if (header) return header;

    header = undefined;
    angular.forEach(this.$$respHeaders, function(headerVal, headerName) {
      if (!header && angular.lowercase(headerName) == name) header = headerVal;
    });
    return header;
  };

  this.getAllResponseHeaders = function() {
    var lines = [];

    angular.forEach(this.$$respHeaders, function(value, key) {
      lines.push(key + ': ' + value);
    });
    return lines.join('\n');
  };

  this.abort = angular.noop;
}


/**
 * @ngdoc service
 * @name $timeout
 * @description
 *
 * This service is just a simple decorator for {@link ng.$timeout $timeout} service
 * that adds a "flush" and "verifyNoPendingTasks" methods.
 */

angular.mock.$TimeoutDecorator = ['$delegate', '$browser', function($delegate, $browser) {

  /**
   * @ngdoc method
   * @name $timeout#flush
   * @description
   *
   * Flushes the queue of pending tasks.
   *
   * @param {number=} delay maximum timeout amount to flush up until
   */
  $delegate.flush = function(delay) {
    $browser.defer.flush(delay);
  };

  /**
   * @ngdoc method
   * @name $timeout#verifyNoPendingTasks
   * @description
   *
   * Verifies that there are no pending tasks that need to be flushed.
   */
  $delegate.verifyNoPendingTasks = function() {
    if ($browser.deferredFns.length) {
      throw new Error('Deferred tasks to flush (' + $browser.deferredFns.length + '): ' +
          formatPendingTasksAsString($browser.deferredFns));
    }
  };

  function formatPendingTasksAsString(tasks) {
    var result = [];
    angular.forEach(tasks, function(task) {
      result.push('{id: ' + task.id + ', ' + 'time: ' + task.time + '}');
    });

    return result.join(', ');
  }

  return $delegate;
}];

angular.mock.$RAFDecorator = ['$delegate', function($delegate) {
  var rafFn = function(fn) {
    var index = rafFn.queue.length;
    rafFn.queue.push(fn);
    return function() {
      rafFn.queue.splice(index, 1);
    };
  };

  rafFn.queue = [];
  rafFn.supported = $delegate.supported;

  rafFn.flush = function() {
    if (rafFn.queue.length === 0) {
      throw new Error('No rAF callbacks present');
    }

    var length = rafFn.queue.length;
    for (var i = 0; i < length; i++) {
      rafFn.queue[i]();
    }

    rafFn.queue = rafFn.queue.slice(i);
  };

  return rafFn;
}];

/**
 *
 */
angular.mock.$RootElementProvider = function() {
  this.$get = function() {
    return angular.element('<div ng-app></div>');
  };
};

/**
 * @ngdoc service
 * @name $controller
 * @description
 * A decorator for {@link ng.$controller} with additional `bindings` parameter, useful when testing
 * controllers of directives that use {@link $compile#-bindtocontroller- `bindToController`}.
 *
 *
 * ## Example
 *
 * ```js
 *
 * // Directive definition ...
 *
 * myMod.directive('myDirective', {
 *   controller: 'MyDirectiveController',
 *   bindToController: {
 *     name: '@'
 *   }
 * });
 *
 *
 * // Controller definition ...
 *
 * myMod.controller('MyDirectiveController', ['log', function($log) {
 *   $log.info(this.name);
 * })];
 *
 *
 * // In a test ...
 *
 * describe('myDirectiveController', function() {
 *   it('should write the bound name to the log', inject(function($controller, $log) {
 *     var ctrl = $controller('MyDirectiveController', { /* no locals &#42;/ }, { name: 'Clark Kent' });
 *     expect(ctrl.name).toEqual('Clark Kent');
 *     expect($log.info.logs).toEqual(['Clark Kent']);
 *   });
 * });
 *
 * ```
 *
 * @param {Function|string} constructor If called with a function then it's considered to be the
 *    controller constructor function. Otherwise it's considered to be a string which is used
 *    to retrieve the controller constructor using the following steps:
 *
 *    * check if a controller with given name is registered via `$controllerProvider`
 *    * check if evaluating the string on the current scope returns a constructor
 *    * if $controllerProvider#allowGlobals, check `window[constructor]` on the global
 *      `window` object (not recommended)
 *
 *    The string can use the `controller as property` syntax, where the controller instance is published
 *    as the specified property on the `scope`; the `scope` must be injected into `locals` param for this
 *    to work correctly.
 *
 * @param {Object} locals Injection locals for Controller.
 * @param {Object=} bindings Properties to add to the controller before invoking the constructor. This is used
 *                           to simulate the `bindToController` feature and simplify certain kinds of tests.
 * @return {Object} Instance of given controller.
 */
angular.mock.$ControllerDecorator = ['$delegate', function($delegate) {
  return function(expression, locals, later, ident) {
    if (later && typeof later === 'object') {
      var create = $delegate(expression, locals, true, ident);
      angular.extend(create.instance, later);
      return create();
    }
    return $delegate(expression, locals, later, ident);
  };
}];


/**
 * @ngdoc module
 * @name ngMock
 * @packageName angular-mocks
 * @description
 *
 * # ngMock
 *
 * The `ngMock` module provides support to inject and mock Angular services into unit tests.
 * In addition, ngMock also extends various core ng services such that they can be
 * inspected and controlled in a synchronous manner within test code.
 *
 *
 * <div doc-module-components="ngMock"></div>
 *
 */
angular.module('ngMock', ['ng']).provider({
  $browser: angular.mock.$BrowserProvider,
  $exceptionHandler: angular.mock.$ExceptionHandlerProvider,
  $log: angular.mock.$LogProvider,
  $interval: angular.mock.$IntervalProvider,
  $httpBackend: angular.mock.$HttpBackendProvider,
  $rootElement: angular.mock.$RootElementProvider
}).config(['$provide', function($provide) {
  $provide.decorator('$timeout', angular.mock.$TimeoutDecorator);
  $provide.decorator('$$rAF', angular.mock.$RAFDecorator);
  $provide.decorator('$rootScope', angular.mock.$RootScopeDecorator);
  $provide.decorator('$controller', angular.mock.$ControllerDecorator);
}]);

/**
 * @ngdoc module
 * @name ngMockE2E
 * @module ngMockE2E
 * @packageName angular-mocks
 * @description
 *
 * The `ngMockE2E` is an angular module which contains mocks suitable for end-to-end testing.
 * Currently there is only one mock present in this module -
 * the {@link ngMockE2E.$httpBackend e2e $httpBackend} mock.
 */
angular.module('ngMockE2E', ['ng']).config(['$provide', function($provide) {
  $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
}]);

/**
 * @ngdoc service
 * @name $httpBackend
 * @module ngMockE2E
 * @description
 * Fake HTTP backend implementation suitable for end-to-end testing or backend-less development of
 * applications that use the {@link ng.$http $http service}.
 *
 * *Note*: For fake http backend implementation suitable for unit testing please see
 * {@link ngMock.$httpBackend unit-testing $httpBackend mock}.
 *
 * This implementation can be used to respond with static or dynamic responses via the `when` api
 * and its shortcuts (`whenGET`, `whenPOST`, etc) and optionally pass through requests to the
 * real $httpBackend for specific requests (e.g. to interact with certain remote apis or to fetch
 * templates from a webserver).
 *
 * As opposed to unit-testing, in an end-to-end testing scenario or in scenario when an application
 * is being developed with the real backend api replaced with a mock, it is often desirable for
 * certain category of requests to bypass the mock and issue a real http request (e.g. to fetch
 * templates or static files from the webserver). To configure the backend with this behavior
 * use the `passThrough` request handler of `when` instead of `respond`.
 *
 * Additionally, we don't want to manually have to flush mocked out requests like we do during unit
 * testing. For this reason the e2e $httpBackend flushes mocked out requests
 * automatically, closely simulating the behavior of the XMLHttpRequest object.
 *
 * To setup the application to run with this http backend, you have to create a module that depends
 * on the `ngMockE2E` and your application modules and defines the fake backend:
 *
 * ```js
 *   myAppDev = angular.module('myAppDev', ['myApp', 'ngMockE2E']);
 *   myAppDev.run(function($httpBackend) {
 *     phones = [{name: 'phone1'}, {name: 'phone2'}];
 *
 *     // returns the current list of phones
 *     $httpBackend.whenGET('/phones').respond(phones);
 *
 *     // adds a new phone to the phones array
 *     $httpBackend.whenPOST('/phones').respond(function(method, url, data) {
 *       var phone = angular.fromJson(data);
 *       phones.push(phone);
 *       return [200, phone, {}];
 *     });
 *     $httpBackend.whenGET(/^\/templates\//).passThrough();
 *     //...
 *   });
 * ```
 *
 * Afterwards, bootstrap your app with this new module.
 */

/**
 * @ngdoc method
 * @name $httpBackend#when
 * @module ngMockE2E
 * @description
 * Creates a new backend definition.
 *
 * @param {string} method HTTP method.
 * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
 *   and returns true if the url matches the current definition.
 * @param {(string|RegExp)=} data HTTP request body.
 * @param {(Object|function(Object))=} headers HTTP headers or function that receives http header
 *   object and returns true if the headers match the current definition.
 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
 *   control how a matched request is handled. You can save this object for later use and invoke
 *   `respond` or `passThrough` again in order to change how a matched request is handled.
 *
 *  - respond –
 *    `{function([status,] data[, headers, statusText])
 *    | function(function(method, url, data, headers)}`
 *    – The respond method takes a set of static data to be returned or a function that can return
 *    an array containing response status (number), response data (string), response headers
 *    (Object), and the text for the status (string).
 *  - passThrough – `{function()}` – Any request matching a backend definition with
 *    `passThrough` handler will be passed through to the real backend (an XHR request will be made
 *    to the server.)
 *  - Both methods return the `requestHandler` object for possible overrides.
 */

/**
 * @ngdoc method
 * @name $httpBackend#whenGET
 * @module ngMockE2E
 * @description
 * Creates a new backend definition for GET requests. For more info see `when()`.
 *
 * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
 *   and returns true if the url matches the current definition.
 * @param {(Object|function(Object))=} headers HTTP headers.
 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
 *   control how a matched request is handled. You can save this object for later use and invoke
 *   `respond` or `passThrough` again in order to change how a matched request is handled.
 */

/**
 * @ngdoc method
 * @name $httpBackend#whenHEAD
 * @module ngMockE2E
 * @description
 * Creates a new backend definition for HEAD requests. For more info see `when()`.
 *
 * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
 *   and returns true if the url matches the current definition.
 * @param {(Object|function(Object))=} headers HTTP headers.
 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
 *   control how a matched request is handled. You can save this object for later use and invoke
 *   `respond` or `passThrough` again in order to change how a matched request is handled.
 */

/**
 * @ngdoc method
 * @name $httpBackend#whenDELETE
 * @module ngMockE2E
 * @description
 * Creates a new backend definition for DELETE requests. For more info see `when()`.
 *
 * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
 *   and returns true if the url matches the current definition.
 * @param {(Object|function(Object))=} headers HTTP headers.
 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
 *   control how a matched request is handled. You can save this object for later use and invoke
 *   `respond` or `passThrough` again in order to change how a matched request is handled.
 */

/**
 * @ngdoc method
 * @name $httpBackend#whenPOST
 * @module ngMockE2E
 * @description
 * Creates a new backend definition for POST requests. For more info see `when()`.
 *
 * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
 *   and returns true if the url matches the current definition.
 * @param {(string|RegExp)=} data HTTP request body.
 * @param {(Object|function(Object))=} headers HTTP headers.
 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
 *   control how a matched request is handled. You can save this object for later use and invoke
 *   `respond` or `passThrough` again in order to change how a matched request is handled.
 */

/**
 * @ngdoc method
 * @name $httpBackend#whenPUT
 * @module ngMockE2E
 * @description
 * Creates a new backend definition for PUT requests.  For more info see `when()`.
 *
 * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
 *   and returns true if the url matches the current definition.
 * @param {(string|RegExp)=} data HTTP request body.
 * @param {(Object|function(Object))=} headers HTTP headers.
 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
 *   control how a matched request is handled. You can save this object for later use and invoke
 *   `respond` or `passThrough` again in order to change how a matched request is handled.
 */

/**
 * @ngdoc method
 * @name $httpBackend#whenPATCH
 * @module ngMockE2E
 * @description
 * Creates a new backend definition for PATCH requests.  For more info see `when()`.
 *
 * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
 *   and returns true if the url matches the current definition.
 * @param {(string|RegExp)=} data HTTP request body.
 * @param {(Object|function(Object))=} headers HTTP headers.
 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
 *   control how a matched request is handled. You can save this object for later use and invoke
 *   `respond` or `passThrough` again in order to change how a matched request is handled.
 */

/**
 * @ngdoc method
 * @name $httpBackend#whenJSONP
 * @module ngMockE2E
 * @description
 * Creates a new backend definition for JSONP requests. For more info see `when()`.
 *
 * @param {string|RegExp|function(string)} url HTTP url or function that receives a url
 *   and returns true if the url matches the current definition.
 * @returns {requestHandler} Returns an object with `respond` and `passThrough` methods that
 *   control how a matched request is handled. You can save this object for later use and invoke
 *   `respond` or `passThrough` again in order to change how a matched request is handled.
 */
angular.mock.e2e = {};
angular.mock.e2e.$httpBackendDecorator =
  ['$rootScope', '$timeout', '$delegate', '$browser', createHttpBackendMock];


/**
 * @ngdoc type
 * @name $rootScope.Scope
 * @module ngMock
 * @description
 * {@link ng.$rootScope.Scope Scope} type decorated with helper methods useful for testing. These
 * methods are automatically available on any {@link ng.$rootScope.Scope Scope} instance when
 * `ngMock` module is loaded.
 *
 * In addition to all the regular `Scope` methods, the following helper methods are available:
 */
angular.mock.$RootScopeDecorator = ['$delegate', function($delegate) {

  var $rootScopePrototype = Object.getPrototypeOf($delegate);

  $rootScopePrototype.$countChildScopes = countChildScopes;
  $rootScopePrototype.$countWatchers = countWatchers;

  return $delegate;

  // ------------------------------------------------------------------------------------------ //

  /**
   * @ngdoc method
   * @name $rootScope.Scope#$countChildScopes
   * @module ngMock
   * @description
   * Counts all the direct and indirect child scopes of the current scope.
   *
   * The current scope is excluded from the count. The count includes all isolate child scopes.
   *
   * @returns {number} Total number of child scopes.
   */
  function countChildScopes() {
    // jshint validthis: true
    var count = 0; // exclude the current scope
    var pendingChildHeads = [this.$$childHead];
    var currentScope;

    while (pendingChildHeads.length) {
      currentScope = pendingChildHeads.shift();

      while (currentScope) {
        count += 1;
        pendingChildHeads.push(currentScope.$$childHead);
        currentScope = currentScope.$$nextSibling;
      }
    }

    return count;
  }


  /**
   * @ngdoc method
   * @name $rootScope.Scope#$countWatchers
   * @module ngMock
   * @description
   * Counts all the watchers of direct and indirect child scopes of the current scope.
   *
   * The watchers of the current scope are included in the count and so are all the watchers of
   * isolate child scopes.
   *
   * @returns {number} Total number of watchers.
   */
  function countWatchers() {
    // jshint validthis: true
    var count = this.$$watchers ? this.$$watchers.length : 0; // include the current scope
    var pendingChildHeads = [this.$$childHead];
    var currentScope;

    while (pendingChildHeads.length) {
      currentScope = pendingChildHeads.shift();

      while (currentScope) {
        count += currentScope.$$watchers ? currentScope.$$watchers.length : 0;
        pendingChildHeads.push(currentScope.$$childHead);
        currentScope = currentScope.$$nextSibling;
      }
    }

    return count;
  }
}];


if (window.jasmine || window.mocha) {

  var currentSpec = null,
      annotatedFunctions = [],
      isSpecRunning = function() {
        return !!currentSpec;
      };

  angular.mock.$$annotate = angular.injector.$$annotate;
  angular.injector.$$annotate = function(fn) {
    if (typeof fn === 'function' && !fn.$inject) {
      annotatedFunctions.push(fn);
    }
    return angular.mock.$$annotate.apply(this, arguments);
  };


  (window.beforeEach || window.setup)(function() {
    annotatedFunctions = [];
    currentSpec = this;
  });

  (window.afterEach || window.teardown)(function() {
    var injector = currentSpec.$injector;

    annotatedFunctions.forEach(function(fn) {
      delete fn.$inject;
    });

    angular.forEach(currentSpec.$modules, function(module) {
      if (module && module.$$hashKey) {
        module.$$hashKey = undefined;
      }
    });

    currentSpec.$injector = null;
    currentSpec.$modules = null;
    currentSpec = null;

    if (injector) {
      injector.get('$rootElement').off();
    }

    // clean up jquery's fragment cache
    angular.forEach(angular.element.fragments, function(val, key) {
      delete angular.element.fragments[key];
    });

    MockXhr.$$lastInstance = null;

    angular.forEach(angular.callbacks, function(val, key) {
      delete angular.callbacks[key];
    });
    angular.callbacks.counter = 0;
  });

  /**
   * @ngdoc function
   * @name angular.mock.module
   * @description
   *
   * *NOTE*: This function is also published on window for easy access.<br>
   * *NOTE*: This function is declared ONLY WHEN running tests with jasmine or mocha
   *
   * This function registers a module configuration code. It collects the configuration information
   * which will be used when the injector is created by {@link angular.mock.inject inject}.
   *
   * See {@link angular.mock.inject inject} for usage example
   *
   * @param {...(string|Function|Object)} fns any number of modules which are represented as string
   *        aliases or as anonymous module initialization functions. The modules are used to
   *        configure the injector. The 'ng' and 'ngMock' modules are automatically loaded. If an
   *        object literal is passed they will be registered as values in the module, the key being
   *        the module name and the value being what is returned.
   */
  window.module = angular.mock.module = function() {
    var moduleFns = Array.prototype.slice.call(arguments, 0);
    return isSpecRunning() ? workFn() : workFn;
    /////////////////////
    function workFn() {
      if (currentSpec.$injector) {
        throw new Error('Injector already created, can not register a module!');
      } else {
        var modules = currentSpec.$modules || (currentSpec.$modules = []);
        angular.forEach(moduleFns, function(module) {
          if (angular.isObject(module) && !angular.isArray(module)) {
            modules.push(function($provide) {
              angular.forEach(module, function(value, key) {
                $provide.value(key, value);
              });
            });
          } else {
            modules.push(module);
          }
        });
      }
    }
  };

  /**
   * @ngdoc function
   * @name angular.mock.inject
   * @description
   *
   * *NOTE*: This function is also published on window for easy access.<br>
   * *NOTE*: This function is declared ONLY WHEN running tests with jasmine or mocha
   *
   * The inject function wraps a function into an injectable function. The inject() creates new
   * instance of {@link auto.$injector $injector} per test, which is then used for
   * resolving references.
   *
   *
   * ## Resolving References (Underscore Wrapping)
   * Often, we would like to inject a reference once, in a `beforeEach()` block and reuse this
   * in multiple `it()` clauses. To be able to do this we must assign the reference to a variable
   * that is declared in the scope of the `describe()` block. Since we would, most likely, want
   * the variable to have the same name of the reference we have a problem, since the parameter
   * to the `inject()` function would hide the outer variable.
   *
   * To help with this, the injected parameters can, optionally, be enclosed with underscores.
   * These are ignored by the injector when the reference name is resolved.
   *
   * For example, the parameter `_myService_` would be resolved as the reference `myService`.
   * Since it is available in the function body as _myService_, we can then assign it to a variable
   * defined in an outer scope.
   *
   * ```
   * // Defined out reference variable outside
   * var myService;
   *
   * // Wrap the parameter in underscores
   * beforeEach( inject( function(_myService_){
   *   myService = _myService_;
   * }));
   *
   * // Use myService in a series of tests.
   * it('makes use of myService', function() {
   *   myService.doStuff();
   * });
   *
   * ```
   *
   * See also {@link angular.mock.module angular.mock.module}
   *
   * ## Example
   * Example of what a typical jasmine tests looks like with the inject method.
   * ```js
   *
   *   angular.module('myApplicationModule', [])
   *       .value('mode', 'app')
   *       .value('version', 'v1.0.1');
   *
   *
   *   describe('MyApp', function() {
   *
   *     // You need to load modules that you want to test,
   *     // it loads only the "ng" module by default.
   *     beforeEach(module('myApplicationModule'));
   *
   *
   *     // inject() is used to inject arguments of all given functions
   *     it('should provide a version', inject(function(mode, version) {
   *       expect(version).toEqual('v1.0.1');
   *       expect(mode).toEqual('app');
   *     }));
   *
   *
   *     // The inject and module method can also be used inside of the it or beforeEach
   *     it('should override a version and test the new version is injected', function() {
   *       // module() takes functions or strings (module aliases)
   *       module(function($provide) {
   *         $provide.value('version', 'overridden'); // override version here
   *       });
   *
   *       inject(function(version) {
   *         expect(version).toEqual('overridden');
   *       });
   *     });
   *   });
   *
   * ```
   *
   * @param {...Function} fns any number of functions which will be injected using the injector.
   */



  var ErrorAddingDeclarationLocationStack = function(e, errorForStack) {
    this.message = e.message;
    this.name = e.name;
    if (e.line) this.line = e.line;
    if (e.sourceId) this.sourceId = e.sourceId;
    if (e.stack && errorForStack)
      this.stack = e.stack + '\n' + errorForStack.stack;
    if (e.stackArray) this.stackArray = e.stackArray;
  };
  ErrorAddingDeclarationLocationStack.prototype.toString = Error.prototype.toString;

  window.inject = angular.mock.inject = function() {
    var blockFns = Array.prototype.slice.call(arguments, 0);
    var errorForStack = new Error('Declaration Location');
    return isSpecRunning() ? workFn.call(currentSpec) : workFn;
    /////////////////////
    function workFn() {
      var modules = currentSpec.$modules || [];
      var strictDi = !!currentSpec.$injectorStrict;
      modules.unshift('ngMock');
      modules.unshift('ng');
      var injector = currentSpec.$injector;
      if (!injector) {
        if (strictDi) {
          // If strictDi is enabled, annotate the providerInjector blocks
          angular.forEach(modules, function(moduleFn) {
            if (typeof moduleFn === "function") {
              angular.injector.$$annotate(moduleFn);
            }
          });
        }
        injector = currentSpec.$injector = angular.injector(modules, strictDi);
        currentSpec.$injectorStrict = strictDi;
      }
      for (var i = 0, ii = blockFns.length; i < ii; i++) {
        if (currentSpec.$injectorStrict) {
          // If the injector is strict / strictDi, and the spec wants to inject using automatic
          // annotation, then annotate the function here.
          injector.annotate(blockFns[i]);
        }
        try {
          /* jshint -W040 *//* Jasmine explicitly provides a `this` object when calling functions */
          injector.invoke(blockFns[i] || angular.noop, this);
          /* jshint +W040 */
        } catch (e) {
          if (e.stack && errorForStack) {
            throw new ErrorAddingDeclarationLocationStack(e, errorForStack);
          }
          throw e;
        } finally {
          errorForStack = null;
        }
      }
    }
  };


  angular.mock.inject.strictDi = function(value) {
    value = arguments.length ? !!value : true;
    return isSpecRunning() ? workFn() : workFn;

    function workFn() {
      if (value !== currentSpec.$injectorStrict) {
        if (currentSpec.$injector) {
          throw new Error('Injector already created, can not modify strict annotations');
        } else {
          currentSpec.$injectorStrict = value;
        }
      }
    }
  };
}


})(window, window.angular);

var root = this;

root.context = root.describe;
root.xcontext = root.xdescribe;


/*
jasmine-fixture 1.0.5
Makes injecting HTML snippets into the DOM easy & clean!
site: https://github.com/searls/jasmine-fixture
*/


(function() {
  var createHTMLBlock;

  (function($) {
    var jasmineFixture, originalAffix, originalInject, originalJasmineFixture, root, _;
    root = this;
    originalJasmineFixture = root.jasmineFixture;
    originalInject = root.inject;
    originalAffix = root.affix;
    _ = function(list) {
      return {
        inject: function(iterator, memo) {
          var item, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = list.length; _i < _len; _i++) {
            item = list[_i];
            _results.push(memo = iterator(memo, item));
          }
          return _results;
        }
      };
    };
    root.jasmineFixture = function($) {
      var $whatsTheRootOf, applyAttributes, defaultConfiguration, defaults, init, injectContents, isReady, isString, itLooksLikeHtml, rootId, tidyUp;
      $.fn.affix = root.affix = function(selectorOptions) {
        var $top;
        $top = null;
        _(selectorOptions.split(/[ ](?=[^\]]*?(?:\[|$))/)).inject(function($parent, elementSelector) {
          var $el;
          if (elementSelector === ">") {
            return $parent;
          }
          $el = createHTMLBlock($, elementSelector).appendTo($parent);
          $top || ($top = $el);
          return $el;
        }, $whatsTheRootOf(this));
        return $top;
      };
      $whatsTheRootOf = function(that) {
        if (that.jquery != null) {
          return that;
        } else if ($('#jasmine_content').length > 0) {
          return $('#jasmine_content');
        } else {
          return $('<div id="jasmine_content"></div>').appendTo('body');
        }
      };
      afterEach(function() {
        return $('#jasmine_content').remove();
      });
      isReady = false;
      rootId = "specContainer";
      defaultConfiguration = {
        el: "div",
        cssClass: "",
        id: "",
        text: "",
        html: "",
        defaultAttribute: "class",
        attrs: {}
      };
      defaults = $.extend({}, defaultConfiguration);
      $.jasmine = {
        inject: function(arg, context) {
          var $toInject, config, parent;
          if (isReady !== true) {
            init();
          }
          parent = (context ? context : $("#" + rootId));
          $toInject = void 0;
          if (itLooksLikeHtml(arg)) {
            $toInject = $(arg);
          } else {
            config = $.extend({}, defaults, arg, {
              userString: arg
            });
            $toInject = $("<" + config.el + "></" + config.el + ">");
            applyAttributes($toInject, config);
            injectContents($toInject, config);
          }
          return $toInject.appendTo(parent);
        },
        configure: function(config) {
          return $.extend(defaults, config);
        },
        restoreDefaults: function() {
          return defaults = $.extend({}, defaultConfiguration);
        },
        noConflict: function() {
          root.jasmineFixture = originalJasmineFixture;
          root.inject = originalInject;
          root.affix = originalAffix;
          return this;
        }
      };
      $.fn.inject = function(html) {
        return $.jasmine.inject(html, $(this));
      };
      applyAttributes = function($html, config) {
        var attrs, key, _results;
        attrs = $.extend({}, {
          id: config.id,
          "class": config["class"] || config.cssClass
        }, config.attrs);
        if (isString(config.userString)) {
          attrs[config.defaultAttribute] = config.userString;
        }
        _results = [];
        for (key in attrs) {
          if (attrs[key]) {
            _results.push($html.attr(key, attrs[key]));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      injectContents = function($el, config) {
        if (config.text && config.html) {
          throw "Error: because they conflict, you may only configure inject() to set `html` or `text`, not both! \n\nHTML was: " + config.html + " \n\n Text was: " + config.text;
        } else if (config.text) {
          return $el.text(config.text);
        } else {
          if (config.html) {
            return $el.html(config.html);
          }
        }
      };
      itLooksLikeHtml = function(arg) {
        return isString(arg) && arg.indexOf("<") !== -1;
      };
      isString = function(arg) {
        return arg && arg.constructor === String;
      };
      init = function() {
        $("body").append("<div id=\"" + rootId + "\"></div>");
        return isReady = true;
      };
      tidyUp = function() {
        $("#" + rootId).remove();
        return isReady = false;
      };
      $(function($) {
        return init();
      });
      afterEach(function() {
        return tidyUp();
      });
      return $.jasmine;
    };
    if ($) {
      jasmineFixture = root.jasmineFixture($);
      return root.inject = root.inject || jasmineFixture.inject;
    }
  })(window.jQuery);

  createHTMLBlock = (function() {
    var bindData, bindEvents, parseAttributes, parseClasses, parseContents, parseEnclosure, parseReferences, parseVariableScope, regAttr, regAttrDfn, regAttrs, regCBrace, regClass, regClasses, regData, regDatas, regEvent, regEvents, regExclamation, regId, regReference, regTag, regTagNotContent, regZenTagDfn;
    createHTMLBlock = function($, ZenObject, data, functions, indexes) {
      var ZenCode, arr, block, blockAttrs, blockClasses, blockHTML, blockId, blockTag, blocks, el, el2, els, forScope, indexName, inner, len, obj, origZenCode, paren, result, ret, zc, zo;
      if ($.isPlainObject(ZenObject)) {
        ZenCode = ZenObject.main;
      } else {
        ZenCode = ZenObject;
        ZenObject = {
          main: ZenCode
        };
      }
      origZenCode = ZenCode;
      if (indexes === undefined) {
        indexes = {};
      }
      if (ZenCode.charAt(0) === "!" || $.isArray(data)) {
        if ($.isArray(data)) {
          forScope = ZenCode;
        } else {
          obj = parseEnclosure(ZenCode, "!");
          obj = obj.substring(obj.indexOf(":") + 1, obj.length - 1);
          forScope = parseVariableScope(ZenCode);
        }
        while (forScope.charAt(0) === "@") {
          forScope = parseVariableScope("!for:!" + parseReferences(forScope, ZenObject));
        }
        zo = ZenObject;
        zo.main = forScope;
        el = $();
        if (ZenCode.substring(0, 5) === "!for:" || $.isArray(data)) {
          if (!$.isArray(data) && obj.indexOf(":") > 0) {
            indexName = obj.substring(0, obj.indexOf(":"));
            obj = obj.substr(obj.indexOf(":") + 1);
          }
          arr = ($.isArray(data) ? data : data[obj]);
          zc = zo.main;
          if ($.isArray(arr) || $.isPlainObject(arr)) {
            $.map(arr, function(value, index) {
              var next;
              zo.main = zc;
              if (indexName !== undefined) {
                indexes[indexName] = index;
              }
              if (!$.isPlainObject(value)) {
                value = {
                  value: value
                };
              }
              next = createHTMLBlock($, zo, value, functions, indexes);
              if (el.length !== 0) {
                return $.each(next, function(index, value) {
                  return el.push(value);
                });
              }
            });
          }
          if (!$.isArray(data)) {
            ZenCode = ZenCode.substr(obj.length + 6 + forScope.length);
          } else {
            ZenCode = "";
          }
        } else if (ZenCode.substring(0, 4) === "!if:") {
          result = parseContents("!" + obj + "!", data, indexes);
          if (result !== "undefined" || result !== "false" || result !== "") {
            el = createHTMLBlock($, zo, data, functions, indexes);
          }
          ZenCode = ZenCode.substr(obj.length + 5 + forScope.length);
        }
        ZenObject.main = ZenCode;
      } else if (ZenCode.charAt(0) === "(") {
        paren = parseEnclosure(ZenCode, "(", ")");
        inner = paren.substring(1, paren.length - 1);
        ZenCode = ZenCode.substr(paren.length);
        zo = ZenObject;
        zo.main = inner;
        el = createHTMLBlock($, zo, data, functions, indexes);
      } else {
        blocks = ZenCode.match(regZenTagDfn);
        block = blocks[0];
        if (block.length === 0) {
          return "";
        }
        if (block.indexOf("@") >= 0) {
          ZenCode = parseReferences(ZenCode, ZenObject);
          zo = ZenObject;
          zo.main = ZenCode;
          return createHTMLBlock($, zo, data, functions, indexes);
        }
        block = parseContents(block, data, indexes);
        blockClasses = parseClasses($, block);
        if (regId.test(block)) {
          blockId = regId.exec(block)[1];
        }
        blockAttrs = parseAttributes(block, data);
        blockTag = (block.charAt(0) === "{" ? "span" : "div");
        if (ZenCode.charAt(0) !== "#" && ZenCode.charAt(0) !== "." && ZenCode.charAt(0) !== "{") {
          blockTag = regTag.exec(block)[1];
        }
        if (block.search(regCBrace) !== -1) {
          blockHTML = block.match(regCBrace)[1];
        }
        blockAttrs = $.extend(blockAttrs, {
          id: blockId,
          "class": blockClasses,
          html: blockHTML
        });
        el = $("<" + blockTag + ">", blockAttrs);
        el.attr(blockAttrs);
        el = bindEvents(block, el, functions);
        el = bindData(block, el, data);
        ZenCode = ZenCode.substr(blocks[0].length);
        ZenObject.main = ZenCode;
      }
      if (ZenCode.length > 0) {
        if (ZenCode.charAt(0) === ">") {
          if (ZenCode.charAt(1) === "(") {
            zc = parseEnclosure(ZenCode.substr(1), "(", ")");
            ZenCode = ZenCode.substr(zc.length + 1);
          } else if (ZenCode.charAt(1) === "!") {
            obj = parseEnclosure(ZenCode.substr(1), "!");
            forScope = parseVariableScope(ZenCode.substr(1));
            zc = obj + forScope;
            ZenCode = ZenCode.substr(zc.length + 1);
          } else {
            len = Math.max(ZenCode.indexOf("+"), ZenCode.length);
            zc = ZenCode.substring(1, len);
            ZenCode = ZenCode.substr(len);
          }
          zo = ZenObject;
          zo.main = zc;
          els = $(createHTMLBlock($, zo, data, functions, indexes));
          els.appendTo(el);
        }
        if (ZenCode.charAt(0) === "+") {
          zo = ZenObject;
          zo.main = ZenCode.substr(1);
          el2 = createHTMLBlock($, zo, data, functions, indexes);
          $.each(el2, function(index, value) {
            return el.push(value);
          });
        }
      }
      ret = el;
      return ret;
    };
    bindData = function(ZenCode, el, data) {
      var datas, i, split;
      if (ZenCode.search(regDatas) === 0) {
        return el;
      }
      datas = ZenCode.match(regDatas);
      if (datas === null) {
        return el;
      }
      i = 0;
      while (i < datas.length) {
        split = regData.exec(datas[i]);
        if (split[3] === undefined) {
          $(el).data(split[1], data[split[1]]);
        } else {
          $(el).data(split[1], data[split[3]]);
        }
        i++;
      }
      return el;
    };
    bindEvents = function(ZenCode, el, functions) {
      var bindings, fn, i, split;
      if (ZenCode.search(regEvents) === 0) {
        return el;
      }
      bindings = ZenCode.match(regEvents);
      if (bindings === null) {
        return el;
      }
      i = 0;
      while (i < bindings.length) {
        split = regEvent.exec(bindings[i]);
        if (split[2] === undefined) {
          fn = functions[split[1]];
        } else {
          fn = functions[split[2]];
        }
        $(el).bind(split[1], fn);
        i++;
      }
      return el;
    };
    parseAttributes = function(ZenBlock, data) {
      var attrStrs, attrs, i, parts;
      if (ZenBlock.search(regAttrDfn) === -1) {
        return undefined;
      }
      attrStrs = ZenBlock.match(regAttrDfn);
      attrs = {};
      i = 0;
      while (i < attrStrs.length) {
        parts = regAttr.exec(attrStrs[i]);
        attrs[parts[1]] = "";
        if (parts[3] !== undefined) {
          attrs[parts[1]] = parseContents(parts[3], data);
        }
        i++;
      }
      return attrs;
    };
    parseClasses = function($, ZenBlock) {
      var classes, clsString, i;
      ZenBlock = ZenBlock.match(regTagNotContent)[0];
      if (ZenBlock.search(regClasses) === -1) {
        return undefined;
      }
      classes = ZenBlock.match(regClasses);
      clsString = "";
      i = 0;
      while (i < classes.length) {
        clsString += " " + regClass.exec(classes[i])[1];
        i++;
      }
      return $.trim(clsString);
    };
    parseContents = function(ZenBlock, data, indexes) {
      var html;
      if (indexes === undefined) {
        indexes = {};
      }
      html = ZenBlock;
      if (data === undefined) {
        return html;
      }
      while (regExclamation.test(html)) {
        html = html.replace(regExclamation, function(str, str2) {
          var begChar, fn, val;
          begChar = "";
          if (str.indexOf("!for:") > 0 || str.indexOf("!if:") > 0) {
            return str;
          }
          if (str.charAt(0) !== "!") {
            begChar = str.charAt(0);
            str = str.substring(2, str.length - 1);
          }
          fn = new Function("data", "indexes", "var r=undefined;" + "with(data){try{r=" + str + ";}catch(e){}}" + "with(indexes){try{if(r===undefined)r=" + str + ";}catch(e){}}" + "return r;");
          val = unescape(fn(data, indexes));
          return begChar + val;
        });
      }
      html = html.replace(/\\./g, function(str) {
        return str.charAt(1);
      });
      return unescape(html);
    };
    parseEnclosure = function(ZenCode, open, close, count) {
      var index, ret;
      if (close === undefined) {
        close = open;
      }
      index = 1;
      if (count === undefined) {
        count = (ZenCode.charAt(0) === open ? 1 : 0);
      }
      if (count === 0) {
        return;
      }
      while (count > 0 && index < ZenCode.length) {
        if (ZenCode.charAt(index) === close && ZenCode.charAt(index - 1) !== "\\") {
          count--;
        } else {
          if (ZenCode.charAt(index) === open && ZenCode.charAt(index - 1) !== "\\") {
            count++;
          }
        }
        index++;
      }
      ret = ZenCode.substring(0, index);
      return ret;
    };
    parseReferences = function(ZenCode, ZenObject) {
      ZenCode = ZenCode.replace(regReference, function(str) {
        var fn;
        str = str.substr(1);
        fn = new Function("objs", "var r=\"\";" + "with(objs){try{" + "r=" + str + ";" + "}catch(e){}}" + "return r;");
        return fn(ZenObject, parseReferences);
      });
      return ZenCode;
    };
    parseVariableScope = function(ZenCode) {
      var forCode, rest, tag;
      if (ZenCode.substring(0, 5) !== "!for:" && ZenCode.substring(0, 4) !== "!if:") {
        return undefined;
      }
      forCode = parseEnclosure(ZenCode, "!");
      ZenCode = ZenCode.substr(forCode.length);
      if (ZenCode.charAt(0) === "(") {
        return parseEnclosure(ZenCode, "(", ")");
      }
      tag = ZenCode.match(regZenTagDfn)[0];
      ZenCode = ZenCode.substr(tag.length);
      if (ZenCode.length === 0 || ZenCode.charAt(0) === "+") {
        return tag;
      } else if (ZenCode.charAt(0) === ">") {
        rest = "";
        rest = parseEnclosure(ZenCode.substr(1), "(", ")", 1);
        return tag + ">" + rest;
      }
      return undefined;
    };
    regZenTagDfn = /([#\.\@]?[\w-]+|\[([\w-!?=:"']+(="([^"]|\\")+")? {0,})+\]|\~[\w$]+=[\w$]+|&[\w$]+(=[\w$]+)?|[#\.\@]?!([^!]|\\!)+!){0,}(\{([^\}]|\\\})+\})?/i;
    regTag = /(\w+)/i;
    regId = /#([\w-!]+)/i;
    regTagNotContent = /((([#\.]?[\w-]+)?(\[([\w!]+(="([^"]|\\")+")? {0,})+\])?)+)/i;
    regClasses = /(\.[\w-]+)/g;
    regClass = /\.([\w-]+)/i;
    regReference = /(@[\w$_][\w$_\d]+)/i;
    regAttrDfn = /(\[([\w-!]+(="?([^"]|\\")+"?)? {0,})+\])/ig;
    regAttrs = /([\w-!]+(="([^"]|\\")+")?)/g;
    regAttr = /([\w-!]+)(="?(([^"\]]|\\")+)"?)?/i;
    regCBrace = /\{(([^\}]|\\\})+)\}/i;
    regExclamation = /(?:([^\\]|^))!([^!]|\\!)+!/g;
    regEvents = /\~[\w$]+(=[\w$]+)?/g;
    regEvent = /\~([\w$]+)=([\w$]+)/i;
    regDatas = /&[\w$]+(=[\w$]+)?/g;
    regData = /&([\w$]+)(=([\w$]+))?/i;
    return createHTMLBlock;
  })();

}).call(this);

/* jasmine-given - 2.4.0
 * Adds a Given-When-Then DSL to jasmine as an alternative style for specs
 * https://github.com/searls/jasmine-given
 */
(function() {
  (function(jasmine) {
    var additionalInsightsForErrorMessage, apparentReferenceError, attemptedEquality, comparisonInsight, declareJasmineSpec, deepEqualsNotice, doneWrapperFor, evalInContextOfSpec, finalStatementFrom, getBlock, invariantList, mostRecentExpectations, mostRecentlyUsed, o, root, stringifyExpectation, wasComparison, whenList;
    mostRecentlyUsed = null;
    beforeEach(function() {
      return this.addMatchers(jasmine._given.matchers);
    });
    root = this;
    root.Given = function() {
      mostRecentlyUsed = root.Given;
      return beforeEach(getBlock(arguments));
    };
    whenList = [];
    root.When = function() {
      var b;
      mostRecentlyUsed = root.When;
      b = getBlock(arguments);
      beforeEach(function() {
        return whenList.push(b);
      });
      return afterEach(function() {
        return whenList.pop();
      });
    };
    invariantList = [];
    root.Invariant = function(invariantBehavior) {
      mostRecentlyUsed = root.Invariant;
      beforeEach(function() {
        return invariantList.push(invariantBehavior);
      });
      return afterEach(function() {
        return invariantList.pop();
      });
    };
    getBlock = function(thing) {
      var assignResultTo, setupFunction;
      setupFunction = o(thing).firstThat(function(arg) {
        return o(arg).isFunction();
      });
      assignResultTo = o(thing).firstThat(function(arg) {
        return o(arg).isString();
      });
      return doneWrapperFor(setupFunction, function(done) {
        var context, result;
        context = jasmine.getEnv().currentSpec;
        result = setupFunction.call(context, done);
        if (assignResultTo) {
          if (!context[assignResultTo]) {
            return context[assignResultTo] = result;
          } else {
            throw new Error("Unfortunately, the variable '" + assignResultTo + "' is already assigned to: " + context[assignResultTo]);
          }
        }
      });
    };
    mostRecentExpectations = null;
    declareJasmineSpec = function(specArgs, itFunction) {
      var expectationFunction, expectations, label;
      if (itFunction == null) {
        itFunction = it;
      }
      label = o(specArgs).firstThat(function(arg) {
        return o(arg).isString();
      });
      expectationFunction = o(specArgs).firstThat(function(arg) {
        return o(arg).isFunction();
      });
      mostRecentlyUsed = root.subsequentThen;
      mostRecentExpectations = expectations = [expectationFunction];
      itFunction("then " + (label != null ? label : stringifyExpectation(expectations)), doneWrapperFor(expectationFunction, function(done) {
        var block, expectation, i, _i, _j, _len, _len1, _ref, _ref1, _results;
        _ref = whenList != null ? whenList : [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          block = _ref[_i];
          block();
        }
        _ref1 = invariantList.concat(expectations);
        _results = [];
        for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
          expectation = _ref1[i];
          _results.push(expect(expectation).not.toHaveReturnedFalseFromThen(jasmine.getEnv().currentSpec, i + 1, done));
        }
        return _results;
      }));
      return {
        Then: subsequentThen,
        And: subsequentThen
      };
    };
    doneWrapperFor = function(func, toWrap) {
      if (func.length === 0) {
        return function() {
          return toWrap();
        };
      } else {
        return function(done) {
          return toWrap(done);
        };
      }
    };
    root.Then = function() {
      return declareJasmineSpec(arguments);
    };
    root.Then.only = function() {
      return declareJasmineSpec(arguments, it.only);
    };
    root.subsequentThen = function(additionalExpectation) {
      mostRecentExpectations.push(additionalExpectation);
      return this;
    };
    mostRecentlyUsed = root.Given;
    root.And = function() {
      return mostRecentlyUsed.apply(this, jasmine.util.argsToArray(arguments));
    };
    o = function(thing) {
      return {
        isFunction: function() {
          return Object.prototype.toString.call(thing) === "[object Function]";
        },
        isString: function() {
          return Object.prototype.toString.call(thing) === "[object String]";
        },
        firstThat: function(test) {
          var i;
          i = 0;
          while (i < thing.length) {
            if (test(thing[i]) === true) {
              return thing[i];
            }
            i++;
          }
          return void 0;
        }
      };
    };
    jasmine._given = {
      matchers: {
        toHaveReturnedFalseFromThen: function(context, n, done) {
          var e, exception, result;
          result = false;
          exception = void 0;
          try {
            result = this.actual.call(context, done);
          } catch (_error) {
            e = _error;
            exception = e;
          }
          this.message = function() {
            var msg, stringyExpectation;
            stringyExpectation = stringifyExpectation(this.actual);
            msg = "Then clause" + (n > 1 ? " #" + n : "") + " `" + stringyExpectation + "` failed by ";
            if (exception) {
              msg += "throwing: " + exception.toString();
            } else {
              msg += "returning false";
            }
            msg += additionalInsightsForErrorMessage(stringyExpectation);
            return msg;
          };
          return result === false;
        }
      }
    };
    stringifyExpectation = function(expectation) {
      var matches;
      matches = expectation.toString().replace(/\n/g, '').match(/function\s?\(.*\)\s?{\s*(return\s+)?(.*?)(;)?\s*}/i);
      if (matches && matches.length >= 3) {
        return matches[2].replace(/\s+/g, ' ');
      } else {
        return "";
      }
    };
    additionalInsightsForErrorMessage = function(expectationString) {
      var comparison, expectation;
      expectation = finalStatementFrom(expectationString);
      if (comparison = wasComparison(expectation)) {
        return comparisonInsight(expectation, comparison);
      } else {
        return "";
      }
    };
    finalStatementFrom = function(expectationString) {
      var multiStatement;
      if (multiStatement = expectationString.match(/.*return (.*)/)) {
        return multiStatement[multiStatement.length - 1];
      } else {
        return expectationString;
      }
    };
    wasComparison = function(expectation) {
      var comparator, comparison, left, right, s;
      if (comparison = expectation.match(/(.*) (===|!==|==|!=|>|>=|<|<=) (.*)/)) {
        s = comparison[0], left = comparison[1], comparator = comparison[2], right = comparison[3];
        return {
          left: left,
          comparator: comparator,
          right: right
        };
      }
    };
    comparisonInsight = function(expectation, comparison) {
      var left, msg, right;
      left = evalInContextOfSpec(comparison.left);
      right = evalInContextOfSpec(comparison.right);
      if (apparentReferenceError(left) && apparentReferenceError(right)) {
        return "";
      }
      msg = "\n\nThis comparison was detected:\n  " + expectation + "\n  " + left + " " + comparison.comparator + " " + right;
      if (attemptedEquality(left, right, comparison.comparator)) {
        msg += "\n\n" + (deepEqualsNotice(comparison.left, comparison.right));
      }
      return msg;
    };
    apparentReferenceError = function(result) {
      return /^<Error: "ReferenceError/.test(result);
    };
    evalInContextOfSpec = function(operand) {
      var e;
      try {
        return (function() {
          return eval(operand);
        }).call(jasmine.getEnv().currentSpec);
      } catch (_error) {
        e = _error;
        return "<Error: \"" + ((e != null ? typeof e.message === "function" ? e.message() : void 0 : void 0) || e) + "\">";
      }
    };
    attemptedEquality = function(left, right, comparator) {
      return (comparator === "==" || comparator === "===") && jasmine.getEnv().equals_(left, right);
    };
    return deepEqualsNotice = function(left, right) {
      return "However, these items are deeply equal! Try an expectation like this instead:\n  expect(" + left + ").toEqual(" + right + ")";
    };
  })(jasmine);

}).call(this);

/* jasmine-only - 0.1.0
 * Exclusivity spec helpers for jasmine: `describe.only` and `it.only`
 * https://github.com/davemo/jasmine-only
 */
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(jasmine) {
    var describeOnly, env, itOnly, root;

    root = this;
    env = jasmine.getEnv();
    describeOnly = function(description, specDefinitions) {
      var suite;

      suite = new jasmine.Suite(this, description, null, this.currentSuite);
      suite.exclusive_ = 1;
      this.exclusive_ = Math.max(this.exclusive_, 1);
      return this.describe_(suite, specDefinitions);
    };
    itOnly = function(description, func) {
      var spec;

      spec = this.it(description, func);
      spec.exclusive_ = 2;
      this.exclusive_ = 2;
      return spec;
    };
    env.exclusive_ = 0;
    env.describe = function(description, specDefinitions) {
      var suite;

      suite = new jasmine.Suite(this, description, null, this.currentSuite);
      return this.describe_(suite, specDefinitions);
    };
    env.describe_ = function(suite, specDefinitions) {
      var declarationError, e, parentSuite;

      parentSuite = this.currentSuite;
      if (parentSuite) {
        parentSuite.add(suite);
      } else {
        this.currentRunner_.add(suite);
      }
      this.currentSuite = suite;
      declarationError = null;
      try {
        specDefinitions.call(suite);
      } catch (_error) {
        e = _error;
        declarationError = e;
      }
      if (declarationError) {
        this.it("encountered a declaration exception", function() {
          throw declarationError;
        });
      }
      this.currentSuite = parentSuite;
      return suite;
    };
    env.specFilter = function(spec) {
      return this.exclusive_ <= spec.exclusive_;
    };
    env.describe.only = function() {
      return describeOnly.apply(env, arguments);
    };
    env.it.only = function() {
      return itOnly.apply(env, arguments);
    };
    root.describe.only = function(description, specDefinitions) {
      return env.describe.only(description, specDefinitions);
    };
    root.it.only = function(description, func) {
      return env.it.only(description, func);
    };
    root.iit = root.it.only;
    root.ddescribe = root.describe.only;
    jasmine.Spec = (function(_super) {
      __extends(Spec, _super);

      function Spec(env, suite, description) {
        this.exclusive_ = suite.exclusive_;
        Spec.__super__.constructor.call(this, env, suite, description);
      }

      return Spec;

    })(jasmine.Spec);
    return jasmine.Suite = (function(_super) {
      __extends(Suite, _super);

      function Suite(env, suite, specDefinitions, parentSuite) {
        this.exclusive_ = parentSuite && parentSuite.exclusive_ || 0;
        Suite.__super__.constructor.call(this, env, suite, specDefinitions, parentSuite);
      }

      return Suite;

    })(jasmine.Suite);
  })(jasmine);

}).call(this);

/* jasmine-stealth - 0.0.13
 * Makes Jasmine spies a bit more robust
 * https://github.com/searls/jasmine-stealth
 */
(function() {
  var Captor, fake, root, stubChainer, unfakes, whatToDoWhenTheSpyGetsCalled, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  root = this;

  _ = function(obj) {
    return {
      each: function(iterator) {
        var item, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = obj.length; _i < _len; _i++) {
          item = obj[_i];
          _results.push(iterator(item));
        }
        return _results;
      },
      isFunction: function() {
        return Object.prototype.toString.call(obj) === "[object Function]";
      },
      isString: function() {
        return Object.prototype.toString.call(obj) === "[object String]";
      }
    };
  };

  root.spyOnConstructor = function(owner, classToFake, methodsToSpy) {
    var fakeClass, spies;
    if (methodsToSpy == null) {
      methodsToSpy = [];
    }
    if (_(methodsToSpy).isString()) {
      methodsToSpy = [methodsToSpy];
    }
    spies = {
      constructor: jasmine.createSpy("" + classToFake + "'s constructor")
    };
    fakeClass = (function() {
      function _Class() {
        spies.constructor.apply(this, arguments);
      }

      return _Class;

    })();
    _(methodsToSpy).each(function(methodName) {
      spies[methodName] = jasmine.createSpy("" + classToFake + "#" + methodName);
      return fakeClass.prototype[methodName] = function() {
        return spies[methodName].apply(this, arguments);
      };
    });
    fake(owner, classToFake, fakeClass);
    return spies;
  };

  unfakes = [];

  afterEach(function() {
    _(unfakes).each(function(u) {
      return u();
    });
    return unfakes = [];
  });

  fake = function(owner, thingToFake, newThing) {
    var originalThing;
    originalThing = owner[thingToFake];
    owner[thingToFake] = newThing;
    return unfakes.push(function() {
      return owner[thingToFake] = originalThing;
    });
  };

  root.stubFor = root.spyOn;

  jasmine.createStub = jasmine.createSpy;

  jasmine.createStubObj = function(baseName, stubbings) {
    var name, obj, stubbing;
    if (stubbings.constructor === Array) {
      return jasmine.createSpyObj(baseName, stubbings);
    } else {
      obj = {};
      for (name in stubbings) {
        stubbing = stubbings[name];
        obj[name] = jasmine.createSpy(baseName + "." + name);
        if (_(stubbing).isFunction()) {
          obj[name].andCallFake(stubbing);
        } else {
          obj[name].andReturn(stubbing);
        }
      }
      return obj;
    }
  };

  whatToDoWhenTheSpyGetsCalled = function(spy) {
    var matchesStub, priorStubbing;
    matchesStub = function(stubbing, args, context) {
      switch (stubbing.type) {
        case "args":
          return jasmine.getEnv().equals_(stubbing.ifThis, jasmine.util.argsToArray(args));
        case "context":
          return jasmine.getEnv().equals_(stubbing.ifThis, context);
      }
    };
    priorStubbing = spy.plan();
    return spy.andCallFake(function() {
      var i, stubbing;
      i = 0;
      while (i < spy._stealth_stubbings.length) {
        stubbing = spy._stealth_stubbings[i];
        if (matchesStub(stubbing, arguments, this)) {
          if (stubbing.satisfaction === "callFake") {
            return stubbing.thenThat.apply(stubbing, arguments);
          } else {
            return stubbing.thenThat;
          }
        }
        i++;
      }
      return priorStubbing;
    });
  };

  jasmine.Spy.prototype.whenContext = function(context) {
    var spy;
    spy = this;
    spy._stealth_stubbings || (spy._stealth_stubbings = []);
    whatToDoWhenTheSpyGetsCalled(spy);
    return stubChainer(spy, "context", context);
  };

  jasmine.Spy.prototype.when = function() {
    var ifThis, spy;
    spy = this;
    ifThis = jasmine.util.argsToArray(arguments);
    spy._stealth_stubbings || (spy._stealth_stubbings = []);
    whatToDoWhenTheSpyGetsCalled(spy);
    return stubChainer(spy, "args", ifThis);
  };

  stubChainer = function(spy, type, ifThis) {
    var addStubbing;
    addStubbing = function(satisfaction) {
      return function(thenThat) {
        spy._stealth_stubbings.push({
          type: type,
          ifThis: ifThis,
          satisfaction: satisfaction,
          thenThat: thenThat
        });
        return spy;
      };
    };
    return {
      thenReturn: addStubbing("return"),
      thenCallFake: addStubbing("callFake")
    };
  };

  jasmine.Spy.prototype.mostRecentCallThat = function(callThat, context) {
    var i;
    i = this.calls.length - 1;
    while (i >= 0) {
      if (callThat.call(context || this, this.calls[i]) === true) {
        return this.calls[i];
      }
      i--;
    }
  };

  jasmine.Matchers.ArgThat = (function(_super) {
    __extends(ArgThat, _super);

    function ArgThat(matcher) {
      this.matcher = matcher;
    }

    ArgThat.prototype.jasmineMatches = function(actual) {
      return this.matcher(actual);
    };

    return ArgThat;

  })(jasmine.Matchers.Any);

  jasmine.Matchers.ArgThat.prototype.matches = jasmine.Matchers.ArgThat.prototype.jasmineMatches;

  jasmine.argThat = function(expected) {
    return new jasmine.Matchers.ArgThat(expected);
  };

  jasmine.Matchers.Capture = (function(_super) {
    __extends(Capture, _super);

    function Capture(captor) {
      this.captor = captor;
    }

    Capture.prototype.jasmineMatches = function(actual) {
      this.captor.value = actual;
      return true;
    };

    return Capture;

  })(jasmine.Matchers.Any);

  jasmine.Matchers.Capture.prototype.matches = jasmine.Matchers.Capture.prototype.jasmineMatches;

  Captor = (function() {
    function Captor() {}

    Captor.prototype.capture = function() {
      return new jasmine.Matchers.Capture(this);
    };

    return Captor;

  })();

  jasmine.captor = function() {
    return new Captor();
  };

}).call(this);

describe("controller: LoginController ($httpBackend.expect().respond, vanilla jasmine, javascript)", function() {

  beforeEach(function() {
    module("app");
  });

  beforeEach(inject(function($controller, $location, $httpBackend) {
    this.$location = $location;
    this.$httpBackend = $httpBackend;
    this.redirect = spyOn($location, 'path');
    loginController = $controller('LoginController', {
      $location: $location
    });
  }));

  afterEach(function() {
    this.$httpBackend.verifyNoOutstandingRequest();
    this.$httpBackend.verifyNoOutstandingExpectation();
  });

  describe("successfully logging in", function() {
    it("should redirect you to /admin/playlists", function() {
      this.$httpBackend.expectPOST('/login', loginController.credentials).respond(200);
      loginController.login();
      this.$httpBackend.flush();
      expect(this.redirect).toHaveBeenCalledWith('/admin/playlists');
    });
  });
});

/**
 * Created by rogersaner on 15/09/22.
 */
ddescribe("controller: Playlist_editController(vanilla jasmine, javascript)", function () {

  var playlistController;

  beforeEach(function () {
    module("app");
  });

  /**
   * Given some kind of collection (like playlistController.goals) return the member with SortOrder = sortorder
   */
  var returnItemBySortOrder = function (collection, sortorder) {
    var value = {};
    var found = false;
    collection.forEach(function (item) {
      if (!found && item.SortOrder === sortorder) {
        value = item;
      }
    });
    return value;
  };

  beforeEach(inject(function ($controller, $httpBackend, Playlists, Tracks, $rootScope) {
    this.$httpBackend = $httpBackend;
    this.Tracks = Tracks;
    this.Playlists = Playlists;

    // Various ways of working with a Factory
    //@see http://jasonmore.net/unit-testing-http-service-angular-js/

    // 1. Actually passing the call to the function in the Factory
    // But I found that these functions are getting called anyway, but the value of
    // playlistController.goals = Playlists.getGoals() isn't being updated, maybe because the value is being
    // set in a callback? Dunno.

    //spyOn(Playlists, 'loadGoals').andCallThrough();
    //spyOn(Playlists, 'getGoals').andCallThrough();

    // 2. Giving a pretend response from a Factory method
    /*
    spyOn(Playlists, 'loadGoals').andCallFake(function () {
      return {
        success: function (callback) {
          callback(
            [
              {
                "id": 0,
                "goal": "Warm Up",
                "aim": "We want you to ride at 80 - 90 rpm for the duration of the song",
                "bpm_low": 80,
                "bpm_high": 90,
                "goal_options": [
                  {
                    "id": 0,
                    "name": "Half time",
                    "position": "Seated",
                    "beat_ratio": 0.5,
                    "effort": 50,
                    "effort_high": 60
                  }
                ]
              }
            ]
          )
        }
      };
    });
    */

    playlistController = $controller('Playlist_editController', {
      $httpBackend: $httpBackend,
      $scope: $rootScope.$new(),
      Playlists: Playlists,
      Tracks: Tracks
    });

    this.createAnewPlaylist = function () {
      var playlist = this.Playlists.createNewPlaylistFromTemplate(this.playlistTemplate);
      this.Playlists.setPlaylist(playlist);
      playlistController.newPlaylist = true;
      playlistController.playlist = this.Playlists.getPlaylist();
    };

    this.createAnewFreestylePlaylist = function () {
      var playlist = this.Playlists.createNewPlaylistFromTemplate(this.playlistFreestyleTemplate);
      this.Playlists.setPlaylist(playlist);
      playlistController.newPlaylist = true;
      playlistController.playlist = this.Playlists.getPlaylist();
      //playlistController.initFreestylePlaylist(); // This was removed at some point
    };

    this.editPlaylist = function () {
      this.Playlists.setPlaylist(this.playlist);
      playlistController.newPlaylist = false;
      playlistController.playlist = this.Playlists.getPlaylist();
    };

    this.giveThePlaylistAname = function () {
      playlistController.playlist.Name = 'Awesome playlist';
    };

    this.removeThePlaylistname = function () {
      playlistController.playlist.Name = '';
    };

    this.setPlaylistComplete = function (complete) {
      playlistController.playlist.Complete = complete;
    };

    this.setPlaylistIsSyncedToGyms = function(isSynced) {
      playlistController.playlist.IsSyncedToGyms = isSynced;
      if (!isSynced) {
        playlistController.newPlaylist = true;
      }
    };


    /****** Playlist add/edit tests because they're called multiple times ******/

    this.testTrackCanBeAddedToTheFirstGoal = function () {
      this.Playlists.addTrackToGoalPlaylist(0, this.trackNormal);

      expect(playlistController.playlist.PlaylistGoals[0].PlaylistGoalTracks[0].Track.Name).toEqual('Hello');
    };

    this.testTrackCanBeRemovedFromAgoal = function () {
      this.Playlists.addTrackToGoalPlaylist(0, this.trackNormal);

      playlistController.removeTrack(0, this.trackNormal);

      expect(playlistController.playlist.PlaylistGoals[0].PlaylistGoalTracks.length).toBe(0);
    };

    this.testTrackCounterCorrectAfterAddingSong = function () {
      this.Playlists.addTrackToGoalPlaylist(0, this.trackNormal);

      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();

      expect(playlistController.playlistTracksLength).toEqual(260);
    };

    this.testTrackCounterCorrectAfterAddingTwoSongs = function () {
      this.Playlists.addTrackToGoalPlaylist(0, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(1, this.trackShort);

      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();

      expect(playlistController.playlistTracksLength).toEqual(320);
    };

    this.testTrackCounterCorrectAfterAddingManySongs = function () {
      this.Playlists.addTrackToGoalPlaylist(0, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(1, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(2, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(3, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(4, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(5, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(6, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(7, this.trackLong);

      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();

      expect(playlistController.playlistTracksLength).toEqual(1620);
    };

    this.testTrackCounterCorrectAfterAddingAndRemovingSongs = function () {
      this.Playlists.addTrackToGoalPlaylist(0, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(1, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(2, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(3, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(4, this.trackNormal);
      playlistController.removeTrack(0, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(5, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(6, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(7, this.trackLong);
      playlistController.removeTrack(6, this.trackShort);

      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();

      expect(playlistController.playlistTracksLength).toEqual(1300);
    };

    this.givePlaylistSomeTracks = function (track, fillTheEntirePlaylist) {
      var k = 5;
      if (fillTheEntirePlaylist) {
        k = 11;
      }
      for (var i = 0; i < k; i++) {
        this.Playlists.addTrackToGoalPlaylist(i, track);
      }
    };

    this.fillPlaylistWithTracks = function (track) {
      this.givePlaylistSomeTracks(track, true);
    };

    this.removeAllTracks = function (track) {
      for (var i = 0; i < 11; i++) {
        playlistController.removeTrack(i, track);
      }
    };

    // Set values of goals, currentgoal, Tracks and Playlist. Mock all this data! It's a damn unit test!
    // We don't care about the quality of data which other things are giving us. At all. That can be tested separately.
    // (We do want to use the structure of data which the API is returning, though.)
    // What we care about is, does this unit of functionality in this controller work? That's all.

    // Set up some tracks
    this.trackNormal = {
      "Name": "Hello",
      "Album": "Hello",
      "Artist": "Adele",
      "Bpm": 82,
      "DurationSeconds": 260,
      "Source": "http://l3.simfyafrica.com/data/3/7/a/9/37a96fa3f8ac31e10d7c24eb984c74c3?nvb=20151129210306&nva=20151202070415&encoded=0e3ece39d05351c826b15",
      "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/54525247/320.jpg",
      "MusicProviderTrackId": "54525247",
      "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
      "GenreId": "31db3a05-30c7-4058-94a6-504046d4b178",
      "Genre": {
        "Name": "Pop",
        "Id": "31db3a05-30c7-4058-94a6-504046d4b178"
      }
    };
    this.trackShort = {
      "Name": "The Wolf",
      "Album": "Wilder Mind",
      "Artist": "Mumford & Sons",
      "Bpm": 135,
      "DurationSeconds": 60,
      "Source": "http://l3.simfyafrica.com/data/d/4/1/d/d41d773f4bfc03be65d4e4b4d6b47c43?nvb=20151129222204&nva=20151202070524&encoded=06ad3e442a06912e43d41",
      "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/50503094/320.jpg",
      "MusicProviderTrackId": "50503094",
      "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
      "GenreId": "7c87cd38-cdad-4bb7-9380-2b9121f7eef3",
      "Genre": {
        "Name": "Alternative",
        "Id": "7c87cd38-cdad-4bb7-9380-2b9121f7eef3"
      }
    };
    this.trackLong = {
      "Name": "Concerto No. 21 in C Major for Piano and Orchestra, K. 467: II. Andante (\"Elvira Madigan\")",
      "Album": "Homework Hits, Vol. 5: Mozart",
      "Artist": "Wolfgang Amadeus Mozart",
      "Bpm": 125,
      "DurationSeconds": 600,
      "Source": "http://l3.simfyafrica.com/data/0/0/c/3/00c3cd373ae3ec0a14b229c965d81565?nvb=20151129210306&nva=20151202070440&encoded=0dbf4adbc2ff2d9e6d42f",
      "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/14130640/320.jpg",
      "MusicProviderTrackId": "14130640",
      "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
      "GenreId": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67",
      "Genre": {
        "Name": "Other",
        "Id": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67"
      }
    };

    this.playlistFreestyleTemplate = {
      "Id": "d4262d8e-eb68-437a-97c9-d0015a7abd1f",
      "TemplateGroup": {
        "Name": "Freestyle",
        "Description": "Create your own.",
        "IconFileName": "freestyle.svg",
        "Type": "freestyle",
        "Id": "36372f87-5986-4c57-8e33-460844620089"
      },
      "ClassLengthMinutes": 45,
      "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
      "Goals": [{
        "GoalOptions": [{
          "Name": null,
          "Effort": 50,
          "EffortHigh": 60,
          "Position": "Seated",
          "GoalId": "61038c2e-4ee9-44cb-9dac-b7371b501197",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "91d13ce5-f3c5-4cee-87e3-fabb7906a4ea"
        }],
        "Id": "61038c2e-4ee9-44cb-9dac-b7371b501197",
        "SortOrder": 1,
        "Name": "Warm Up",
        "BpmHigh": 100,
        "BpmLow": 90,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }]
    };

    this.playlistTemplate = {
      "Id": "3d139eb7-5a3a-416b-8ab4-bf9d345eae8e",
      "TemplateGroup": {
        "Name": "All Terrain",
        "Description": "Mix it up with a variety of track goals and a broad range of intensities.",
        "IconFileName": "allterrain.svg",
        "Id": "f30a2661-21f2-4455-8cd1-5a793eb8c438"
      },
      "ClassLengthMinutes": 45,
      "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
      "Goals": [{
        "GoalOptions": [{
          "Name": null,
          "Effort": 50,
          "EffortHigh": 60,
          "Position": "Seated",
          "GoalId": "61038c2e-4ee9-44cb-9dac-b7371b501197",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "91d13ce5-f3c5-4cee-87e3-fabb7906a4ea"
        }],
        "Id": "61038c2e-4ee9-44cb-9dac-b7371b501197",
        "SortOrder": 1,
        "Name": "Warm Up",
        "BpmHigh": 100,
        "BpmLow": 90,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": null,
          "Effort": 60,
          "EffortHigh": 70,
          "Position": "Seated",
          "GoalId": "442fc263-1972-437a-b1f3-fdbdd9740acf",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "702da904-4ae1-46c8-9c20-3b12a0237c97"
        }],
        "Id": "442fc263-1972-437a-b1f3-fdbdd9740acf",
        "SortOrder": 2,
        "Name": "Seated Ride",
        "BpmHigh": 110,
        "BpmLow": 90,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": "Sprint",
          "Effort": 70,
          "EffortHigh": 80,
          "Position": "Seated",
          "GoalId": "00e1a846-8e8e-472b-a9dd-a23410011f31",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "a7148f42-d11e-4fbc-9963-83968ea42b0e"
        }, {
          "Name": "Recovery",
          "Effort": 60,
          "EffortHigh": 0,
          "Position": "Seated",
          "GoalId": "00e1a846-8e8e-472b-a9dd-a23410011f31",
          "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
          "Beat": {
            "Name": "Half Time",
            "Ratio": 0.5,
            "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
          },
          "Id": "297c3502-7ad0-42b0-a0fd-0004d3040a4f"
        }],
        "Id": "00e1a846-8e8e-472b-a9dd-a23410011f31",
        "SortOrder": 3,
        "Name": "Seated Interval",
        "BpmHigh": 130,
        "BpmLow": 110,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": null,
          "Effort": 80,
          "EffortHigh": 90,
          "Position": "Standing",
          "GoalId": "c011d9a2-aa8b-4e5b-a090-c4a89c347014",
          "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
          "Beat": {
            "Name": "Half Time",
            "Ratio": 0.5,
            "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
          },
          "Id": "8099abb0-7608-4c53-a12a-eb992e1a9042"
        }],
        "Id": "c011d9a2-aa8b-4e5b-a090-c4a89c347014",
        "SortOrder": 4,
        "Name": "Standing Climb",
        "BpmHigh": 160,
        "BpmLow": 120,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": null,
          "Effort": 70,
          "EffortHigh": 80,
          "Position": "Seated",
          "GoalId": "c887dae4-98ef-43a0-a64d-937ce60e26d3",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "87db1a3e-2ea8-48ba-af27-c54e302746c0"
        }],
        "Id": "c887dae4-98ef-43a0-a64d-937ce60e26d3",
        "SortOrder": 5,
        "Name": "Seated Rolling Hills",
        "BpmHigh": 110,
        "BpmLow": 90,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": "Sprint",
          "Effort": 60,
          "EffortHigh": 0,
          "Position": "Seated",
          "GoalId": "ccc20698-8253-491b-9783-5cda00935522",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "b5e93e55-8a30-4bfd-ab28-ea7d412afc5f"
        }, {
          "Name": "Recovery",
          "Effort": 60,
          "EffortHigh": 0,
          "Position": "Seated",
          "GoalId": "ccc20698-8253-491b-9783-5cda00935522",
          "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
          "Beat": {
            "Name": "Half Time",
            "Ratio": 0.5,
            "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
          },
          "Id": "651fb47d-b27a-42cd-a17c-d383a23c7169"
        }],
        "Id": "ccc20698-8253-491b-9783-5cda00935522",
        "SortOrder": 6,
        "Name": "Active Recovery",
        "BpmHigh": 180,
        "BpmLow": 160,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": "Sprint",
          "Effort": 70,
          "EffortHigh": 80,
          "Position": "Seated",
          "GoalId": "00e1a846-8e8e-472b-a9dd-a23410011f31",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "a7148f42-d11e-4fbc-9963-83968ea42b0e"
        }, {
          "Name": "Recovery",
          "Effort": 60,
          "EffortHigh": 0,
          "Position": "Seated",
          "GoalId": "00e1a846-8e8e-472b-a9dd-a23410011f31",
          "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
          "Beat": {
            "Name": "Half Time",
            "Ratio": 0.5,
            "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
          },
          "Id": "297c3502-7ad0-42b0-a0fd-0004d3040a4f"
        }],
        "Id": "00e1a846-8e8e-472b-a9dd-a23410011f31",
        "SortOrder": 7,
        "Name": "Seated Interval",
        "BpmHigh": 130,
        "BpmLow": 110,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": null,
          "Effort": 80,
          "EffortHigh": 90,
          "Position": "Seated",
          "GoalId": "c1d42fa8-a27f-4129-a1da-e0930efb2cec",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "07df87dc-e90d-429b-9eae-0201414d3e3c"
        }],
        "Id": "c1d42fa8-a27f-4129-a1da-e0930efb2cec",
        "SortOrder": 8,
        "Name": "Standing Rolling Hills",
        "BpmHigh": 100,
        "BpmLow": 80,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": "Sprint",
          "Effort": 90,
          "EffortHigh": 0,
          "Position": "Seated",
          "GoalId": "3a796d73-4406-409d-893f-6ed04e2dead9",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "6ae5546e-b967-496e-8451-764c40e635a9"
        }, {
          "Name": "Recovery",
          "Effort": 60,
          "EffortHigh": 0,
          "Position": "Standing",
          "GoalId": "3a796d73-4406-409d-893f-6ed04e2dead9",
          "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
          "Beat": {
            "Name": "Half Time",
            "Ratio": 0.5,
            "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
          },
          "Id": "cb46f85d-96da-4b1c-bb56-1ba9b955d875"
        }],
        "Id": "3a796d73-4406-409d-893f-6ed04e2dead9",
        "SortOrder": 9,
        "Name": "Alt Seated & Standing Climb",
        "BpmHigh": 160,
        "BpmLow": 120,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": null,
          "Effort": 90,
          "EffortHigh": 100,
          "Position": "Seated",
          "GoalId": "1a63b68c-2f9b-48eb-9ded-883d71d670e7",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "cc6dde04-d7d1-449c-a96b-fb06c4157ea2"
        }],
        "Id": "1a63b68c-2f9b-48eb-9ded-883d71d670e7",
        "SortOrder": 10,
        "Name": "The Finish Line Sprint",
        "BpmHigh": 200,
        "BpmLow": 130,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": null,
          "Effort": 50,
          "EffortHigh": 60,
          "Position": "Seated",
          "GoalId": "8dec4aa5-b994-438d-b64f-17c96d53dfe4",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "f9afe5cd-128f-4950-ba9f-691cf6c5be0f"
        }],
        "Id": "8dec4aa5-b994-438d-b64f-17c96d53dfe4",
        "SortOrder": 11,
        "Name": "Cool Down",
        "BpmHigh": 90,
        "BpmLow": 80,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }]
    };

    this.playlist = {
      "Name": "calvin harris 2",
      "Shared": false,
      "IsSyncedToGyms": true,
      "SharedFromPlayListId": null,
      "UserId": "d1510e26-d628-459c-9f50-379662f61d05",
      "User": null,
      "TemplateName": "All Terrain",
      "TemplateIconFileName": "allterrain.svg",
      "TemplateId": "3d139eb7-5a3a-416b-8ab4-bf9d345eae8e",
      "LastUpdated": "2015-11-27T09:42:18.203",
      "CreateDate": "2015-10-28T12:21:37.257",
      "ClassLengthMinutes": 45,
      "MusicProviderPlaylistId": "18061059",
      "MusicProviderPlaylistSaved": false,
      "Complete": true,
      "PlaylistGoals": [{
        "SortOrder": 1,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "4733c545-81e3-4138-b91a-47a096c9d7dc",
        "Goal": {
          "Name": "Warm Up",
          "BpmHigh": 90,
          "BpmLow": 80,
          "Aim": "We want you to ride at 80 - 90 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "On the beat",
            "Effort": 90,
            "EffortHigh": 0,
            "Position": "Standing",
            "GoalId": "4733c545-81e3-4138-b91a-47a096c9d7dc",
            "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
            "Beat": {
              "Name": "On The Beat",
              "Ratio": 1,
              "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
            },
            "Id": "2e832bde-1317-4f49-951a-6bae1242ca76"
          }],
          "Id": "4733c545-81e3-4138-b91a-47a096c9d7dc"
        },
        "PlaylistGoalNotes": [{
          "TrackTimeSeconds": null,
          "NoteText": "I'd like to add some notes, please!",
          "TrackId": "00ae4a3b-52ce-4c29-88e9-29ed070f4c27",
          "SortOrder": 1,
          "Id": "5c5baf44-b4c7-477b-853f-d646920610c5"
        }],
        "PlaylistGoalTracks": [{
          "TrackId": "0f60c832-43cc-4c7d-9105-1f9e593b4faa",
          "Track": {
            "Name": "Lean On (feat. MØ & DJ Snake)",
            "Album": "Peace Is The Mission",
            "Artist": "Major Lazer",
            "Bpm": 177,
            "DurationSeconds": 176,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/51340018/320.jpg",
            "MusicProviderTrackId": "51340018",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67",
            "Genre": {
              "Name": "Other",
              "Id": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67"
            },
            "Id": "0f60c832-43cc-4c7d-9105-1f9e593b4faa"
          },
          "SortOrder": 0,
          "Id": "49e122a4-4856-4ece-b95d-0e1cd5715938"
        }],
        "Id": "7d811b32-5e1f-44ed-99b8-247f58720098"
      }, {
        "SortOrder": 2,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "21c37c85-b8b5-4e54-8750-8ea48d412104",
        "Goal": {
          "Name": "Seated Ride",
          "BpmHigh": 120,
          "BpmLow": 100,
          "Aim": "We want you to ride at 100 - 120 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Seated Sprint",
            "Effort": 70,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "21c37c85-b8b5-4e54-8750-8ea48d412104",
            "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
            "Beat": {
              "Name": "On The Beat",
              "Ratio": 1,
              "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
            },
            "Id": "dd297d55-8b05-4988-8091-4fb642b9afd7"
          }],
          "Id": "21c37c85-b8b5-4e54-8750-8ea48d412104"
        },
        "PlaylistGoalNotes": [],
        "PlaylistGoalTracks": [{
          "TrackId": "d842cbb2-c834-49c5-b545-f68c8ff8b69c",
          "Track": {
            "Name": "Não Tô Entendendo",
            "Album": "Ronaldo Foi Pra Guerra",
            "Artist": "Lobão E Os Ronaldos",
            "Bpm": 103,
            "DurationSeconds": 152,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/28093011/320.jpg",
            "MusicProviderTrackId": "28093011",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "31db3a05-30c7-4058-94a6-504046d4b178",
            "Genre": {
              "Name": "Pop",
              "Id": "31db3a05-30c7-4058-94a6-504046d4b178"
            },
            "Id": "d842cbb2-c834-49c5-b545-f68c8ff8b69c"
          },
          "SortOrder": 0,
          "Id": "9e301d6e-3a2c-4f69-98f0-bece19b4f1cf"
        }],
        "Id": "ac4e1472-1b65-49fa-ba2b-53eafa8937a4"
      }, {
        "SortOrder": 3,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "aef40c68-b087-45b2-be0b-119f6b686329",
        "Goal": {
          "Name": "Seated Intervals",
          "BpmHigh": 140,
          "BpmLow": 120,
          "Aim": "We want you to alternate sprinting at 120 - 140 rpm and recovering at 60 - 80 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Seated Sprint",
            "Effort": 80,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "aef40c68-b087-45b2-be0b-119f6b686329",
            "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
            "Beat": {
              "Name": "On The Beat",
              "Ratio": 1,
              "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
            },
            "Id": "6e63ccfe-ebb9-4e4d-b0ce-6ac74b48a7ca"
          }, {
            "Name": "Seated",
            "Effort": 50,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "aef40c68-b087-45b2-be0b-119f6b686329",
            "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
            "Beat": {
              "Name": "Half Time",
              "Ratio": 0.5,
              "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
            },
            "Id": "6182c77c-480e-4007-86cd-9a63155c6ed4"
          }],
          "Id": "aef40c68-b087-45b2-be0b-119f6b686329"
        },
        "PlaylistGoalNotes": [{
          "TrackTimeSeconds": null,
          "NoteText": "Aim: Alternate between sprinting on the beat and recovering on the half beat for the duration of the song.",
          "TrackId": "47a79159-6ae9-46c1-92ea-e28f0dcae417",
          "SortOrder": 1,
          "Id": "67b70591-658a-4e4a-9397-c83e0aeb6641"
        }],
        "PlaylistGoalTracks": [{
          "TrackId": "47a79159-6ae9-46c1-92ea-e28f0dcae417",
          "Track": {
            "Name": "Le Legionnaire",
            "Album": "Bzn Live - 20 Jaar",
            "Artist": "BZN",
            "Bpm": 123,
            "DurationSeconds": 288,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/12761579/320.jpg",
            "MusicProviderTrackId": "53636415",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "31db3a05-30c7-4058-94a6-504046d4b178",
            "Genre": {
              "Name": "Pop",
              "Id": "31db3a05-30c7-4058-94a6-504046d4b178"
            },
            "Id": "47a79159-6ae9-46c1-92ea-e28f0dcae417"
          },
          "SortOrder": 0,
          "Id": "0807fd5c-baee-4d73-89b3-d41f410ae78a"
        }],
        "Id": "b6edab4d-4ff7-415f-8a4d-ba07759d588c"
      }, {
        "SortOrder": 4,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "b0b675be-684e-45f8-a275-03844f713674",
        "Goal": {
          "Name": "Seated Climb",
          "BpmHigh": 130,
          "BpmLow": 100,
          "Aim": "We want you to ride at 50 - 65 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Half time",
            "Effort": 80,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "b0b675be-684e-45f8-a275-03844f713674",
            "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
            "Beat": {
              "Name": "Half Time",
              "Ratio": 0.5,
              "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
            },
            "Id": "1223f8d4-2391-47b7-9c83-93fa7eba5e2d"
          }],
          "Id": "b0b675be-684e-45f8-a275-03844f713674"
        },
        "PlaylistGoalNotes": [{
          "TrackTimeSeconds": 14,
          "NoteText": "Hit them hard now!",
          "TrackId": "21761241-4dd4-45d3-8b5d-898b0ae867e0",
          "SortOrder": 1,
          "Id": "16ec1aa1-081e-443a-8cfa-2a62cd128029"
        }],
        "PlaylistGoalTracks": [{
          "TrackId": "0e2c6ea8-bb06-4e0f-a702-e1532b2410f0",
          "Track": {
            "Name": "Devil In Me",
            "Album": "22-20s",
            "Artist": "22-20s",
            "Bpm": 103,
            "DurationSeconds": 259,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/14585397/320.jpg",
            "MusicProviderTrackId": "14585397",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67",
            "Genre": {
              "Name": "Other",
              "Id": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67"
            },
            "Id": "0e2c6ea8-bb06-4e0f-a702-e1532b2410f0"
          },
          "SortOrder": 0,
          "Id": "57e24191-f480-453d-ad84-0b97130fbfae"
        }],
        "Id": "b5999600-a1d7-4b40-9530-d60f948b1871"
      }, {
        "SortOrder": 5,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "cb06d8b8-d1d7-4dec-96c3-9a552e7ea7c1",
        "Goal": {
          "Name": "Standing Climb",
          "BpmHigh": 130,
          "BpmLow": 100,
          "Aim": "We want you to ride at 50 - 65 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Half time",
            "Effort": 90,
            "EffortHigh": 0,
            "Position": "Standing",
            "GoalId": "cb06d8b8-d1d7-4dec-96c3-9a552e7ea7c1",
            "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
            "Beat": {
              "Name": "On The Beat",
              "Ratio": 1,
              "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
            },
            "Id": "55cd31d7-5ef6-4a2f-b5ca-c9bd45d2c8a4"
          }],
          "Id": "cb06d8b8-d1d7-4dec-96c3-9a552e7ea7c1"
        },
        "PlaylistGoalNotes": [{
          "TrackTimeSeconds": 55,
          "NoteText": "Hmmm what should I eat tonight",
          "TrackId": "69cb3bbf-757d-434f-b734-eed62f66ba68",
          "SortOrder": 1,
          "Id": "6dc84a27-0edd-4b23-9846-35cef14e75b2"
        }],
        "PlaylistGoalTracks": [{
          "TrackId": "bbaf11fb-89d5-4991-b8c8-0eedd0d063eb",
          "Track": {
            "Name": "My Name Is Jonas",
            "Album": "Weezer",
            "Artist": "Weezer",
            "Bpm": 118,
            "DurationSeconds": 204,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/288351/320.jpg",
            "MusicProviderTrackId": "288351",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "31db3a05-30c7-4058-94a6-504046d4b178",
            "Genre": {
              "Name": "Pop",
              "Id": "31db3a05-30c7-4058-94a6-504046d4b178"
            },
            "Id": "bbaf11fb-89d5-4991-b8c8-0eedd0d063eb"
          },
          "SortOrder": 0,
          "Id": "b7502f19-582c-4a6c-91c4-4af077362d1e"
        }],
        "Id": "92bf8e0f-0143-4c1c-82e2-d1a739e27705"
      }, {
        "SortOrder": 6,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "faa2dc8e-676c-41e7-9ff1-7e991b72bcc2",
        "Goal": {
          "Name": "Recovery",
          "BpmHigh": 150,
          "BpmLow": 120,
          "Aim": "We want you to ride at 60 - 75 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Half time",
            "Effort": 60,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "faa2dc8e-676c-41e7-9ff1-7e991b72bcc2",
            "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
            "Beat": {
              "Name": "Half Time",
              "Ratio": 0.5,
              "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
            },
            "Id": "00a8228a-9e49-4cd8-8f0d-1718905c1524"
          }],
          "Id": "faa2dc8e-676c-41e7-9ff1-7e991b72bcc2"
        },
        "PlaylistGoalNotes": [],
        "PlaylistGoalTracks": [{
          "TrackId": "83ef494c-f721-4400-923c-56f45e28ce22",
          "Track": {
            "Name": "Madagascar",
            "Album": "Chinese Democracy",
            "Artist": "Guns N' Roses",
            "Bpm": 128,
            "DurationSeconds": 338,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/572075/320.jpg",
            "MusicProviderTrackId": "572075",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "34ab966c-7c95-4dc3-ac71-be3153ee8a98",
            "Genre": {
              "Name": "Rock",
              "Id": "34ab966c-7c95-4dc3-ac71-be3153ee8a98"
            },
            "Id": "83ef494c-f721-4400-923c-56f45e28ce22"
          },
          "SortOrder": 0,
          "Id": "66af16c6-704c-4a3c-a4ea-ff08581380cb"
        }],
        "Id": "2e832bde-1317-4f49-951a-6bae1242ca76"
      }, {
        "SortOrder": 7,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "4278403d-3652-4085-b491-ba3a9ced4f17",
        "Goal": {
          "Name": "Seated Climb 2",
          "BpmHigh": 130,
          "BpmLow": 100,
          "Aim": "We want you to ride at 50 - 65 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Half time",
            "Effort": 80,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "4278403d-3652-4085-b491-ba3a9ced4f17",
            "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
            "Beat": {
              "Name": "Half Time",
              "Ratio": 0.5,
              "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
            },
            "Id": "dc0b56b7-5595-4222-8a4d-b6dd81ffab5b"
          }],
          "Id": "4278403d-3652-4085-b491-ba3a9ced4f17"
        },
        "PlaylistGoalNotes": [],
        "PlaylistGoalTracks": [{
          "TrackId": "cac52c3f-5be1-4618-8e00-85b224a91f39",
          "Track": {
            "Name": "Daniel Na Cova Dos Leões",
            "Album": "Letra & Música: Canções de Renato Russo",
            "Artist": "Célia Porto",
            "Bpm": 108,
            "DurationSeconds": 147,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/48342403/320.jpg",
            "MusicProviderTrackId": "48342403",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67",
            "Genre": {
              "Name": "Other",
              "Id": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67"
            },
            "Id": "cac52c3f-5be1-4618-8e00-85b224a91f39"
          },
          "SortOrder": 0,
          "Id": "68268934-5300-414e-bf8f-462f812a6ef1"
        }],
        "Id": "1bcd3397-08e1-4668-900e-82a3a8d54b92"
      }, {
        "SortOrder": 8,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "c24f3530-38ee-4ec1-b486-cd5ef8d59b92",
        "Goal": {
          "Name": "Standing Climb 2",
          "BpmHigh": 130,
          "BpmLow": 100,
          "Aim": "We want you to ride at 50 - 65 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Half time",
            "Effort": 90,
            "EffortHigh": 0,
            "Position": "Standing",
            "GoalId": "c24f3530-38ee-4ec1-b486-cd5ef8d59b92",
            "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
            "Beat": {
              "Name": "Half Time",
              "Ratio": 0.5,
              "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
            },
            "Id": "b24d83b0-8360-49a7-9807-18ecd1637e07"
          }],
          "Id": "c24f3530-38ee-4ec1-b486-cd5ef8d59b92"
        },
        "PlaylistGoalNotes": [],
        "PlaylistGoalTracks": [{
          "TrackId": "2d4a6b86-7671-459d-9922-34da6059928f",
          "Track": {
            "Name": "Still Remains",
            "Album": "AB III",
            "Artist": "Alter Bridge",
            "Bpm": 105,
            "DurationSeconds": 284,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/23069128/320.jpg",
            "MusicProviderTrackId": "23069128",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "34ab966c-7c95-4dc3-ac71-be3153ee8a98",
            "Genre": {
              "Name": "Rock",
              "Id": "34ab966c-7c95-4dc3-ac71-be3153ee8a98"
            },
            "Id": "2d4a6b86-7671-459d-9922-34da6059928f"
          },
          "SortOrder": 0,
          "Id": "16ebc972-8081-4496-9fec-82dced8c20e5"
        }],
        "Id": "4c38ef69-5aeb-4b3d-a056-effa469dd144"
      }, {
        "SortOrder": 9,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "2dc1ee7f-fcb9-4b49-bfb0-5986204b989d",
        "Goal": {
          "Name": "Seated Intervals 2",
          "BpmHigh": 140,
          "BpmLow": 120,
          "Aim": "We want you to alternate sprinting at 120 - 140 rpm and recovering at 60 - 80 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Recover Half Time",
            "Effort": 50,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "2dc1ee7f-fcb9-4b49-bfb0-5986204b989d",
            "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
            "Beat": {
              "Name": "Half Time",
              "Ratio": 0.5,
              "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
            },
            "Id": "aecaf685-85ca-4f74-bec8-a3eff2883248"
          }, {
            "Name": "Sprint on the beat",
            "Effort": 80,
            "EffortHigh": 90,
            "Position": "Seated",
            "GoalId": "2dc1ee7f-fcb9-4b49-bfb0-5986204b989d",
            "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
            "Beat": {
              "Name": "On The Beat",
              "Ratio": 1,
              "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
            },
            "Id": "ba9c551e-9f7c-4b7d-ae09-b6d694e23c21"
          }],
          "Id": "2dc1ee7f-fcb9-4b49-bfb0-5986204b989d"
        },
        "PlaylistGoalNotes": [],
        "PlaylistGoalTracks": [{
          "TrackId": "2a7791b2-559c-42d2-8775-7470581bd318",
          "Track": {
            "Name": "Forgotten Man",
            "Album": "Hypnotic Eye",
            "Artist": "Tom Petty & The Heartbreakers",
            "Bpm": 130,
            "DurationSeconds": 168,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/43933655/320.jpg",
            "MusicProviderTrackId": "43933655",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "34ab966c-7c95-4dc3-ac71-be3153ee8a98",
            "Genre": {
              "Name": "Rock",
              "Id": "34ab966c-7c95-4dc3-ac71-be3153ee8a98"
            },
            "Id": "2a7791b2-559c-42d2-8775-7470581bd318"
          },
          "SortOrder": 0,
          "Id": "96da0cff-9c04-4d48-9b89-1daa51e78ab8"
        }],
        "Id": "fe552888-26cd-47ab-869b-76e547694d36"
      }, {
        "SortOrder": 10,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "6c9af002-d0e2-477c-91ec-50d71fffba50",
        "Goal": {
          "Name": "The Finish Line",
          "BpmHigh": 130,
          "BpmLow": 90,
          "Aim": "We want you to ride at 90 - 130 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Sprint on the beat",
            "Effort": 90,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "6c9af002-d0e2-477c-91ec-50d71fffba50",
            "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
            "Beat": {
              "Name": "On The Beat",
              "Ratio": 1,
              "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
            },
            "Id": "60b669c3-7373-4fa0-aaa3-725eb6ab7ba7"
          }],
          "Id": "6c9af002-d0e2-477c-91ec-50d71fffba50"
        },
        "PlaylistGoalNotes": [],
        "PlaylistGoalTracks": [{
          "TrackId": "cfa5c59e-c607-430c-9eb6-75aff3531255",
          "Track": {
            "Name": "Must Have Done Something Right",
            "Album": "Five Score and Seven Years Ago",
            "Artist": "Relient K",
            "Bpm": 98,
            "DurationSeconds": 199,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/35785292/320.jpg",
            "MusicProviderTrackId": "35785292",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67",
            "Genre": {
              "Name": "Other",
              "Id": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67"
            },
            "Id": "cfa5c59e-c607-430c-9eb6-75aff3531255"
          },
          "SortOrder": 0,
          "Id": "eeb22476-9183-4c82-8ddf-4a846467c699"
        }],
        "Id": "78557a4a-d28b-4db9-908c-3eb9ba1b6303"
      }, {
        "SortOrder": 11,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "ab3c2ee0-dd6c-4c47-b154-9f0d9fd0f93f",
        "Goal": {
          "Name": "Cool Down",
          "BpmHigh": 90,
          "BpmLow": 60,
          "Aim": null,
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "On the beat",
            "Effort": 50,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "ab3c2ee0-dd6c-4c47-b154-9f0d9fd0f93f",
            "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
            "Beat": {
              "Name": "On The Beat",
              "Ratio": 1,
              "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
            },
            "Id": "ab8a791f-b50f-4e7f-98b1-a1b135bcbff8"
          }],
          "Id": "ab3c2ee0-dd6c-4c47-b154-9f0d9fd0f93f"
        },
        "PlaylistGoalNotes": [],
        "PlaylistGoalTracks": [{
          "TrackId": "6fcbca3e-130a-4911-bf73-bce7f424db62",
          "Track": {
            "Name": "Get Down With Me",
            "Album": "Tribute to the Spice Girls: Girl Power!",
            "Artist": "Déjà Vu",
            "Bpm": 143,
            "DurationSeconds": 227,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/16367533/320.jpg",
            "MusicProviderTrackId": "16367533",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67",
            "Genre": {
              "Name": "Other",
              "Id": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67"
            },
            "Id": "6fcbca3e-130a-4911-bf73-bce7f424db62"
          },
          "SortOrder": 0,
          "Id": "7bcb0057-89ed-41c0-a866-f04d6b435043"
        }],
        "Id": "dae6c184-0438-4b20-b0b4-64c30621cead"
      }],
      "BackgroundTracks": [{
        "SortOrder": 1,
        "PlaylistPosition": "Before",
        "TrackId": "0953ad56-64c9-4a88-85be-0dcadbd1e39c",
        "Track": {
          "Name": "Dog days are over",
          "Album": "",
          "Artist": "Florence + The Machine",
          "Bpm": 150,
          "DurationSeconds": 245,
          "CoverImgUrl": "http://media.giphy.com/media/PgxjDJUaUqy6k/giphy-facebook_s.jpg",
          "MusicProviderTrackId": "12321195",
          "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
          "MusicProvider": null,
          "GenreId": "7c87cd38-cdad-4bb7-9380-2b9121f7eef3",
          "Genre": {
            "Name": "Alternative",
            "Id": "7c87cd38-cdad-4bb7-9380-2b9121f7eef3"
          },
          "Id": "0953ad56-64c9-4a88-85be-0dcadbd1e39c"
        },
        "Id": "49b51cd0-ba07-400a-81e3-5afb3d3cd246"
      }, {
        "SortOrder": 1,
        "PlaylistPosition": "After",
        "TrackId": "12aec035-cec2-48a4-ba83-af992ee00174",
        "Track": {
          "Name": "Too bad, so sad",
          "Album": "Salute",
          "Artist": "Matric",
          "Bpm": 80,
          "DurationSeconds": 245,
          "CoverImgUrl": "http://media.giphy.com/media/PgxjDJUaUqy6k/giphy-facebook_s.jpg",
          "MusicProviderTrackId": "573787",
          "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
          "MusicProvider": null,
          "GenreId": "31db3a05-30c7-4058-94a6-504046d4b178",
          "Genre": {
            "Name": "Pop",
            "Id": "31db3a05-30c7-4058-94a6-504046d4b178"
          },
          "Id": "12aec035-cec2-48a4-ba83-af992ee00174"
        },
        "Id": "8cfb4b93-b91a-4bb0-89d6-d1774055e140"
      }, {
        "SortOrder": 2,
        "PlaylistPosition": "After",
        "TrackId": "3a0a7f77-d473-43cd-8bcb-bb1ae61e2769",
        "Track": {
          "Name": "Pump it up",
          "Album": "",
          "Artist": "Toya Delazy",
          "Bpm": 100,
          "DurationSeconds": 245,
          "CoverImgUrl": "http://media.giphy.com/media/PgxjDJUaUqy6k/giphy-facebook_s.jpg",
          "MusicProviderTrackId": "32093259",
          "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
          "MusicProvider": null,
          "GenreId": "7c87cd38-cdad-4bb7-9380-2b9121f7eef3",
          "Genre": {
            "Name": "Alternative",
            "Id": "7c87cd38-cdad-4bb7-9380-2b9121f7eef3"
          },
          "Id": "3a0a7f77-d473-43cd-8bcb-bb1ae61e2769"
        },
        "Id": "16ec1aa1-081e-443a-8cfa-2a62cd128029"
      }, {
        "SortOrder": 2,
        "PlaylistPosition": "Before",
        "TrackId": "dddc39da-8bea-4c5f-8f12-31c1316a6443",
        "Track": {
          "Name": "Burn",
          "Album": "Burn",
          "Artist": "Ellie Golding",
          "Bpm": 174,
          "DurationSeconds": 245,
          "CoverImgUrl": "http://media.giphy.com/media/PgxjDJUaUqy6k/giphy-facebook_s.jpg",
          "MusicProviderTrackId": "46545191",
          "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
          "MusicProvider": null,
          "GenreId": "7c87cd38-cdad-4bb7-9380-2b9121f7eef3",
          "Genre": {
            "Name": "Alternative",
            "Id": "7c87cd38-cdad-4bb7-9380-2b9121f7eef3"
          },
          "Id": "dddc39da-8bea-4c5f-8f12-31c1316a6443"
        },
        "Id": "17d2ab27-d953-49ca-bce2-ec44021ae27d"
      }],
      "CoverImages": [
        "http://www.simfy.co.za/photos/tracks/51340018/320.jpg",
        "http://www.simfy.co.za/photos/tracks/28093011/320.jpg",
        "http://www.simfy.co.za/photos/tracks/12761579/320.jpg",
        "http://www.simfy.co.za/photos/tracks/14585397/320.jpg",
        "http://www.simfy.co.za/photos/tracks/288351/320.jpg",
        "http://www.simfy.co.za/photos/tracks/572075/320.jpg",
        "http://www.simfy.co.za/photos/tracks/48342403/320.jpg",
        "http://www.simfy.co.za/photos/tracks/23069128/320.jpg",
        "http://www.simfy.co.za/photos/tracks/43933655/320.jpg",
        "http://www.simfy.co.za/photos/tracks/35785292/320.jpg",
        "http://www.simfy.co.za/photos/tracks/16367533/320.jpg"
      ],
      "TrackCount": 11,
      "TotalDurationSeconds": 2442,
      "Id": "0e16d4ba-1557-46d0-891c-05ac87ecf90a"
    };
  }));

  /*

  Create
  ------

  createNewPlaylistFromTemplate(template_id)


  Edit
  ----

  Load up new playlist json structure


  Can create a new playlist from a template, which has specific goals
  Can add a track and track counter is correct
  Can remove a track
  Can add another track and track counter is correct
  Can click out, come back, and all is sane

  Checking submit button text and visibility
  * on playlist creation, on playlist edit:
    * no tracks added
    * some tracks added
    * all tracks added
      * time too short
      * time just right
      * time too long

  */

  describe('[Add a playlist] Goals', function () {

    beforeEach(function () {
      this.createAnewPlaylist();
    });

    it('There should be some goals', function () {
      var i = 0;
      playlistController.playlist.PlaylistGoals.forEach(function () {
        i++;
      });
      expect(i).toBeGreaterThan(1);
    });

    it('The first goal should be called Warm Up', function () {
      // The playlist object should have goals sorted by sortorder anyway
      expect(playlistController.playlist.PlaylistGoals[0].Goal.Name).toEqual('Warm Up');
    });

    it('The last goal should be called Cool Down', function () {
      var i = playlistController.playlist.PlaylistGoals.length;
      expect(playlistController.playlist.PlaylistGoals[i - 1].Goal.Name).toEqual('Cool Down');
    });
  });

  describe('Editing a playlist', function () {

    beforeEach(function () {
      this.editPlaylist();
    });

    it('There should be some goals', function () {
      var i = 0;
      playlistController.playlist.PlaylistGoals.forEach(function () {
        i++;
      });
      expect(i).toBeGreaterThan(1);
    });

    it('The first goal should be called Warm Up', function () {
      // The playlist object should have goals sorted by sortorder anyway
      expect(playlistController.playlist.PlaylistGoals[0].Goal.Name).toEqual('Warm Up');
    });

    it('The last goal should be called Cool Down', function () {
      var i = playlistController.playlist.PlaylistGoals.length;
      expect(playlistController.playlist.PlaylistGoals[i - 1].Goal.Name).toEqual('Cool Down');
    });

    it('There should be one track per goal in this playlist', function () {
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
    });

  });

  describe('[Add a playlist] Building a playlist with tracks', function () {

    beforeEach(inject(function () {
      this.createAnewPlaylist();
    }));

    it('A track can be added to the first goal', function () {
      this.testTrackCanBeAddedToTheFirstGoal();
    });

    it('A track can be removed from a goal', function () {
      this.testTrackCanBeRemovedFromAgoal();
    });

    it('Track counter is correct after adding a song', function () {
      this.testTrackCounterCorrectAfterAddingSong();
    });

    it('Track counter is correct after adding two songs', function () {
      this.testTrackCounterCorrectAfterAddingTwoSongs();
    });

    it('Track counter is correct after adding many songs', function () {
      this.testTrackCounterCorrectAfterAddingManySongs();
    });

    it('Track counter is correct after adding and removing many songs', function () {
      this.testTrackCounterCorrectAfterAddingAndRemovingSongs();
    });

  });

  describe('[Add/editing a playlist] Testing workflow', function () {

    it('A track can be added to the first goal', function () {
      this.createAnewPlaylist();
      this.editPlaylist();
      this.testTrackCanBeAddedToTheFirstGoal();
      this.createAnewPlaylist();
      this.testTrackCanBeAddedToTheFirstGoal();
      this.editPlaylist();
      this.testTrackCanBeAddedToTheFirstGoal();
      this.createAnewPlaylist();
      this.testTrackCanBeAddedToTheFirstGoal();
    });

    it('A track can be removed from a goal', function () {
      this.createAnewPlaylist();
      this.editPlaylist();
      this.testTrackCanBeRemovedFromAgoal();
      this.createAnewPlaylist();
      this.testTrackCanBeRemovedFromAgoal();
      this.editPlaylist();
      this.testTrackCanBeRemovedFromAgoal();
      this.createAnewPlaylist();
      this.testTrackCanBeRemovedFromAgoal();
    });

    it('Track counter is correct after adding a song', function () {
      this.editPlaylist();
      this.createAnewPlaylist();
      this.editPlaylist();
      this.createAnewPlaylist();
      this.testTrackCounterCorrectAfterAddingSong();
    });

    it('Track counter is correct after adding two songs', function () {
      this.editPlaylist();
      this.createAnewPlaylist();
      this.testTrackCounterCorrectAfterAddingTwoSongs();
    });

    it('Track counter is correct after adding many songs', function () {
      this.createAnewPlaylist();
      this.editPlaylist();
      this.createAnewPlaylist();
      this.testTrackCounterCorrectAfterAddingManySongs();
    });

    it('Track counter is correct after adding and removing many songs', function () {
      this.createAnewPlaylist();
      this.editPlaylist();
      this.createAnewPlaylist();
      this.testTrackCounterCorrectAfterAddingAndRemovingSongs();
    });

  });

  describe('[New playlist] Checking submit button', function () {

    beforeEach(inject(function () {
      this.createAnewPlaylist();
    }));

    it('Playlist contains no tracks', function () {
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(false);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('SAVE_CONTINUE_LATER');

      // Check if the submit button is disabled
      expect(playlistController.disableSubmitButton()).toBe(true);
      this.giveThePlaylistAname();
      expect(playlistController.disableSubmitButton()).toBe(false);
    });

    it('Playlist contains some tracks', function () {
      this.givePlaylistSomeTracks(this.trackNormal);
      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(false);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('SAVE_CONTINUE_LATER');

      // Check if the submit button is disabled
      expect(playlistController.disableSubmitButton()).toBe(true);
      this.giveThePlaylistAname();
      expect(playlistController.disableSubmitButton()).toBe(false);
    });

    it('Playlist has a track per goal: total time too short', function () {
      this.fillPlaylistWithTracks(this.trackShort);
      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('SAVE_CONTINUE_LATER');

      // Check if the submit button is disabled
      expect(playlistController.disableSubmitButton()).toBe(true);
      this.giveThePlaylistAname();
      expect(playlistController.disableSubmitButton()).toBe(false);
    });

    it('Playlist has a track per goal: total time is good - no background music', function () {
      this.fillPlaylistWithTracks(this.trackNormal);
      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
      expect(playlistController.checkPlaylistLength()).toBe(true);
      expect(playlistController.checkHasPreRideBackgroundTracks()).toBe(false);
      expect(playlistController.checkHasPostRideBackgroundTracks()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('SAVE_CONTINUE_LATER');

      // Check if the submit button is disabled
      expect(playlistController.disableSubmitButton()).toBe(true);
      this.giveThePlaylistAname();
      expect(playlistController.disableSubmitButton()).toBe(false);
    });

    it('Playlist has a track per goal: total time is good - has pre-ride background music', function () {
      this.fillPlaylistWithTracks(this.trackNormal);

      // set currentgoal to a background music goal
      this.Playlists.setCurrentGoal({
        Goal: {
          Name: 'Background music',
          BpmLow: 0,
          BpmHigh: 200
        },
        BackgroundSection: 'before'
      });

      this.Playlists.addBackgroundTrack('before', this.trackNormal);

      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
      expect(playlistController.checkPlaylistLength()).toBe(true);
      expect(playlistController.checkHasPreRideBackgroundTracks()).toBe(true);
      expect(playlistController.checkHasPostRideBackgroundTracks()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('SAVE_CONTINUE_LATER');

      // Check if the submit button is disabled
      expect(playlistController.disableSubmitButton()).toBe(true);
      this.giveThePlaylistAname();
      expect(playlistController.disableSubmitButton()).toBe(false);
    });

    it('Playlist has a track per goal: total time is good - has post-ride background music', function () {
      this.fillPlaylistWithTracks(this.trackNormal);

      this.Playlists.addBackgroundTrack('after', this.trackNormal);

      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
      expect(playlistController.checkPlaylistLength()).toBe(true);
      expect(playlistController.checkHasPreRideBackgroundTracks()).toBe(false);
      expect(playlistController.checkHasPostRideBackgroundTracks()).toBe(true);
      expect(playlistController.submitButtonText()).toEqual('SAVE_CONTINUE_LATER');

      // Check if the submit button is disabled
      expect(playlistController.disableSubmitButton()).toBe(true);
      this.giveThePlaylistAname();
      expect(playlistController.disableSubmitButton()).toBe(false);
    });

    it('Playlist has a track per goal: total time is good - has background music', function () {
      this.fillPlaylistWithTracks(this.trackNormal);

      this.Playlists.addBackgroundTrack('before', this.trackNormal);
      this.Playlists.addBackgroundTrack('after', this.trackNormal);

      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
      expect(playlistController.checkPlaylistLength()).toBe(true);
      expect(playlistController.checkHasPreRideBackgroundTracks()).toBe(true);
      expect(playlistController.checkHasPostRideBackgroundTracks()).toBe(true);
      expect(playlistController.submitButtonText()).toEqual('NEXT_PREVIEW');

      // Check if the submit button is disabled
      expect(playlistController.disableSubmitButton()).toBe(true);
      this.giveThePlaylistAname();
      expect(playlistController.disableSubmitButton()).toBe(false);
    });

    it('Playlist has a track per goal: total time too long', function () {
      this.fillPlaylistWithTracks(this.trackLong);

      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('SAVE_CONTINUE_LATER');

      // Check if the submit button is disabled
      expect(playlistController.disableSubmitButton()).toBe(true);
      this.giveThePlaylistAname();
      expect(playlistController.disableSubmitButton()).toBe(false);
    });

  });

  describe('[Edited playlist] Checking submit button', function () {

    beforeEach(inject(function () {
      this.editPlaylist();
    }));

    it('Playlist contains no tracks', function () {
      this.removeAllTracks(this.trackNormal);
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(false);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('SAVE_CONTINUE_LATER');

      // Check if the submit button is disabled
      expect(playlistController.disableSubmitButton()).toBe(true);
      this.setPlaylistComplete(false);
      expect(playlistController.submitButtonText()).toEqual('SAVE_CONTINUE_LATER');
      expect(playlistController.disableSubmitButton()).toBe(false);
      this.removeThePlaylistname();
      expect(playlistController.disableSubmitButton()).toBe(true);
    });

    it('Playlist contains some tracks', function () {
      this.removeAllTracks(this.trackNormal);
      this.givePlaylistSomeTracks(this.trackNormal);

      expect(playlistController.checkAllGoalsHaveTracks()).toBe(false);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('SAVE_CONTINUE_LATER');

      // Check if the submit button is disabled
      expect(playlistController.disableSubmitButton()).toBe(true);
      this.setPlaylistComplete(false);
      expect(playlistController.submitButtonText()).toEqual('SAVE_CONTINUE_LATER');
      expect(playlistController.disableSubmitButton()).toBe(false);
      this.removeThePlaylistname();
      expect(playlistController.disableSubmitButton()).toBe(true);
    });

    it('Playlist has a track per goal: total time too short', function () {
      this.removeAllTracks(this.trackNormal);
      this.fillPlaylistWithTracks(this.trackShort);

      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('SAVE_CONTINUE_LATER');

      // Check if the submit button is disabled
      expect(playlistController.disableSubmitButton()).toBe(true);
      this.setPlaylistComplete(false);
      expect(playlistController.submitButtonText()).toEqual('SAVE_CONTINUE_LATER');
      expect(playlistController.disableSubmitButton()).toBe(false);
      this.removeThePlaylistname();
      expect(playlistController.disableSubmitButton()).toBe(true);
    });

    it('Previously complete Playlist has a track per goal: total time is good', function () {
      this.removeAllTracks(this.trackNormal);
      this.fillPlaylistWithTracks(this.trackNormal);

      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
      expect(playlistController.checkPlaylistLength()).toBe(true);
      expect(playlistController.submitButtonText()).toEqual('UPDATE');

      // Check if the submit button is disabled
      expect(playlistController.disableSubmitButton()).toBe(false);
      this.setPlaylistComplete(false);
      expect(playlistController.disableSubmitButton()).toBe(false);
      this.removeThePlaylistname();
      expect(playlistController.disableSubmitButton()).toBe(true);
    });

    it('Playlist has a track per goal: total time too long', function () {
      this.removeAllTracks(this.trackNormal);
      this.fillPlaylistWithTracks(this.trackLong);

      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('SAVE_CONTINUE_LATER');

      // Check if the submit button is disabled
      expect(playlistController.disableSubmitButton()).toBe(true);
      this.setPlaylistComplete(false);
      expect(playlistController.submitButtonText()).toEqual('SAVE_CONTINUE_LATER');
      expect(playlistController.disableSubmitButton()).toBe(false);
      this.removeThePlaylistname();
      expect(playlistController.disableSubmitButton()).toBe(true);
    });

  });

  describe('[Editing incomplete playlist and making it complete] Checking submit button', function () {

    beforeEach(inject(function () {
      this.editPlaylist();
      this.setPlaylistComplete(false);
      this.setPlaylistIsSyncedToGyms(false);
    }));

    it('Previously incomplete Playlist has a track per goal: total time is good', function () {
      this.removeAllTracks(this.trackNormal);
      this.fillPlaylistWithTracks(this.trackNormal);

      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
      expect(playlistController.checkPlaylistLength()).toBe(true);
      expect(playlistController.submitButtonText()).toEqual('NEXT_PREVIEW');

      // Check if the submit button is disabled
      expect(playlistController.disableSubmitButton()).toBe(false);
      this.removeThePlaylistname();
      expect(playlistController.disableSubmitButton()).toBe(true);
    });

  });

  describe('New freestyle playlist', function () {

    beforeEach(inject(function () {
      this.createAnewFreestylePlaylist();
    }));

    it('Playlist contains no tracks', function () {
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(false);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('SAVE_CONTINUE_LATER');

      // Check if the submit button is disabled
      expect(playlistController.disableSubmitButton()).toBe(true);
      this.giveThePlaylistAname();
      expect(playlistController.disableSubmitButton()).toBe(false);
    });

  });

});

describe("directive: shows-message-when-hovered (vanilla jasmine, coffeescript)", function() {

  beforeEach(function() {
    module("app");
  });

  beforeEach(inject(function($rootScope, $compile) {
    this.directiveMessage = 'ralph was here';
    this.html = "<div shows-message-when-hovered message='" + this.directiveMessage + "'></div>";
    this.scope = $rootScope.$new();
    this.scope.message = this.originalMessage = 'things are looking grim';
    this.elem = $compile(this.html)(this.scope);
  }));

  describe("when a user mouses over the element", function() {
    it("sets the message on the scope to the message attribute of the element", function() {
      this.elem.triggerHandler('mouseenter');
      expect(this.scope.message).toBe(this.directiveMessage);
    });
  });

  describe("when a users mouse leaves the element", function() {
    it("restores the message to the original", function() {
      this.elem.triggerHandler('mouseleave');
      expect(this.scope.message).toBe(this.originalMessage);
    });
  });

});

(function() {
  describe("directive: shows-message-when-hovered (jasmine-given, coffeescript)", function() {
    Given(function() {
      return module("app");
    });
    Given(inject(function($rootScope, $compile) {
      this.directiveMessage = 'ralph was here';
      this.html = "<div shows-message-when-hovered message='" + this.directiveMessage + "'></div>";
      this.scope = $rootScope.$new();
      this.scope.message = this.originalMessage = 'things are looking grim';
      return this.elem = $compile(this.html)(this.scope);
    }));
    describe("when a user mouses over the element", function() {
      When(function() {
        return this.elem.triggerHandler('mouseenter');
      });
      return Then("the message on the scope is set to the message attribute of the element", function() {
        return this.scope.message === this.directiveMessage;
      });
    });
    return describe("when a users mouse leaves the element", function() {
      When(function() {
        return this.elem.triggerHandler('mouseleave');
      });
      return Then("the message is reset to the original message", function() {
        return this.scope.message === this.originalMessage;
      });
    });
  });

}).call(this);

//# sourceMappingURL=spec.js.map