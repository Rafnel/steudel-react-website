export default {
    s3: {
      REGION: "us-east-1",
      BUCKET: "steudel-site-uploads"
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://g2aixb3x4j.execute-api.us-east-1.amazonaws.com/prod"
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_5ZejbEBGx",
      APP_CLIENT_ID: "4uptuglukt70bicve75q28duu6",
      IDENTITY_POOL_ID: "us-east-1:6b75db04-a71c-4142-8782-22f3412aca63"
    },

    googleMapsAPI: "AIzaSyARjO9lguynh0_QUVugofAmN3hyjcPZvL8",

    cloudwatch: {
      LOGGROUP: "rafnel-react-logs",
      LOGSTREAM: "react-page"
    }
};
  