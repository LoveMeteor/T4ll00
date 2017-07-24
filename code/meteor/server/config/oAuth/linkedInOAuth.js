/////////////////////////////////////////
//// Linked In OAuth Configuration
/////////////////////////////////////////

// Remove Default Configuration
ServiceConfiguration.configurations.remove({
  service: "linkedin"
});

//Insert Custom Configuration
ServiceConfiguration.configurations.insert({
  service: "linkedin",
  clientId: "75rgqas1hrxvr3",
  secret: "g1m4yH5hOzAutBfq"
});