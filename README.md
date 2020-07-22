## This is forked/stolen from https://github.com/aws-samples/amazon-cognito-passwordless-email-auth

I have altered it to remove the accompanying backend code and make it conform to the same fundamental interface as the existing
federated identity (Google FB, etc) options within Cognito. This project will be used as a stop gap measure to save implementing all of this front end functionality ourselves within the existing product as we try and get to market ASAP with some acknowledgement of the growing tech debt to achieve this. Spike and Stabilise... ❤️ 😅 :) 

The Cognito triggers now call into [MeetBel](https://uat.meetbel.com) [authenticationService](https://github.com/meetbel/meetBelPlatform/tree/prod/authenticationService) which is a new microservice, where the relevant event flows trigger functionality within meetBel [usersService](https://github.com/meetbel/meetBelPlatform/tree/prod/usersService) via events published to the usersService event bus. See confluence for details diagrams etc :)

Issues:

*  Need to add Google Re-capcha to stop spamappy use, there is a basic rate limit implemented in the service atm.
* Deployment and CI (Cloud Formation template created and stack deployed to each environment account)
* Code Entry UI add arrow keys and such :) 

--- Existing readme from fork source below:

## Amazon Cognito Passwordless Email Auth

This is the _**sample**_ code that comes together with [the blog post on passwordless e-mail auth in Amazon Cognito](https://aws.amazon.com/blogs/mobile/implementing-passwordless-email-authentication-with-amazon-cognito/).

The purpose of this sample code is to demonstrate how Amazon Cognito Custom Authentication Flows can be used to implement passwordless e-mail auth. Please treat the code as an _**illustration**_––thoroughly review it and adapt it to your needs, if you want to use it for serious things.

The sample code is contained in these folders. Please visit these and run the sample solution:

- [./cognito](./cognito): a Serverless Application that includes a Cognito user pool with the necessary setup
- [./client](./client): a Web Client that authenticates with the Cognito user pool

## License Summary

This sample code is made available under a modified MIT license. See the LICENSE file.
