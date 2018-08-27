Package.describe({
  summary: "User Porting from old WTP"
});

Npm.depends({
  "csv" : "0.3.0"
});

Package.on_use(function(api) {
  api.add_files("wtp-userPort-server.js", "server");
});