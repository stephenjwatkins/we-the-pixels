Package.describe({
  summary: "Mail handling for WTP."
});

Npm.depends({
  // mailchimp: "0.9.5"
});

Package.on_use(function(api) {
  api.add_files("wtp-mail-server.js", "server");
});
