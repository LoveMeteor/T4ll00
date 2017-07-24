// Monitor User Activtiy.
safeStartMonitor = function() {
  return Deps.autorun(function(c) {
    try {
      UserStatus.startMonitor({
        threshold: 30000, 
        interval: 10000,
        idleOnBlur: false});
      c.stop();
      return console.log("Idle monitor started with ", settings);
    } catch (_error) {}
  });
};

safeStartMonitor();