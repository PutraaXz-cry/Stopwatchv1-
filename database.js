const DB_KEY = "stopwatch_database";

const Database = {
  getAll: function () {
    const data = localStorage.getItem(DB_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return { laps: [] };
  },

  save: function (data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  },

  getLaps: function () {
    return this.getAll().laps;
  },

  saveLaps: function (laps) {
    const data = this.getAll();
    data.laps = laps;
    this.save(data);
  },

  clear: function () {
    localStorage.removeItem(DB_KEY);
  }
};