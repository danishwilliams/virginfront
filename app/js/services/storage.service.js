angular
  .module("app")
  .factory('Storage', StorageService);

function StorageService() {
  var self = this;
  var storage = {};

  var storageService = {
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem
  };

  // Checks if localStorage exists
  function getStorage() {
    var storageImpl;

    try {
      localStorage.setItem("storage", "");
      localStorage.removeItem("storage");
      storageImpl = localStorage;
    } catch (err) {
      storageImpl = new LocalStorageAlternative();
    }

    return storageImpl;
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  }

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function LocalStorageAlternative() {

    this.setItem = function (key, value) {
      setCookie(key, value, 10);
    };

    this.getItem = function (key) {
      return getCookie(key);
    };

    this.removeItem = function (key) {
      setCookie(key, undefined);
    };
  }

  storage = getStorage();

  function getItem(item) {
    return storage.getItem(item);
  }

  function setItem(item, value) {
    storage.setItem(item, value);
  }

  function removeItem(item) {
    storage.removeItem(item);
  }

  return storageService;
}
