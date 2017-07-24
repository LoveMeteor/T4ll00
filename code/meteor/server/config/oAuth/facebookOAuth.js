/////////////////////////////////////////
//// Facebook OAuth Configuration
/////////////////////////////////////////

// Remove Default Configuration
ServiceConfiguration.configurations.remove({
  service: "facebook"
});

//Insert Custom Configuration
ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: "538849692957220",
  secret: "5184730087cf4f7db5127849afe76379"
});