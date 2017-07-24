/////////////////////////////////////////
//// Google OAuth Configuration
/////////////////////////////////////////

// Remove Default Configuration
ServiceConfiguration.configurations.remove({
  service: "google"
});

//Insert Custom Configuration
ServiceConfiguration.configurations.insert({
  service: "google",
  clientId: "154923927128-ivf43pipj28192jk01621f61vctfpf1a.apps.googleusercontent.com",
  secret: "blX-yRwxIE_D9uZqaJjdqewy"
});