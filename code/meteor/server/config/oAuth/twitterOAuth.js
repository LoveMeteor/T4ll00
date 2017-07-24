/////////////////////////////////////////
//// Twitter OAuth Configuration
/////////////////////////////////////////

// Remove Default Configuration
ServiceConfiguration.configurations.remove({
    service: 'twitter'
});

//Insert Custom Configuration
ServiceConfiguration.configurations.insert({
    service: 'twitter',
    consumerKey: 'QRqdaeUCEv2ZzpLqY0jhh7P8S',
    secret: 'GFNbSVQHQMFYIRVn7xXYFqCQIVqik5nqTrTqXFIURnzPOFd0bd'
});