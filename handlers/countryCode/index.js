
exports.init = function(app) {

  app.use(function*(next) {
    this.countryCode = (this.get('cf-ipcountry') || this.get('x-nginx-geo') || '').toLowerCase();
    if (this.countryCode == 'xx') this.countryCode = ''; // CloudFlare cannot detect country
    yield* next;
  });

};

