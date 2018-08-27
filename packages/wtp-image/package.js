Package.describe({
  summary: "Image processing for WTP."
});

Npm.depends({
  gm: "1.8.2",
  knox: "0.7.0",
  bufferjs: "2.0.0"
});

Package.on_use(function(api) {
  api.add_files("wtp-image-common.js", ["client", "server"]);
  api.add_files("wtp-image-server.js", "server");
});