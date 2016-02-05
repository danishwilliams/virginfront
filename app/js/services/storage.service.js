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

  function LocalStorageAlternative() {
    var structureLocalStorage = {};

    this.setItem = function (key, value) {
      structureLocalStorage[key] = value;
    };

    this.getItem = function (key) {
      if (typeof structureLocalStorage[key] !== 'undefined') {
        return structureLocalStorage[key];
      } else {
        return null;
      }
    };

    this.removeItem = function (key) {
      structureLocalStorage[key] = undefined;
    };
  }

  storage = getStorage();

  function getItem(item) {
    console.log('getting ', item);
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
