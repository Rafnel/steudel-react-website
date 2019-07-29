import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import config from './config';

winston.add(new WinstonCloudWatch({
    logGroupName: config.cloudwatch.LOGGROUP,
    logStreamName: config.cloudwatch.LOGSTREAM,
    awsAccessKeyId: config.aws.ACCESSKEYID,
    awsSecretKey: config.aws.SECRETKEY,
    awsRegion: config.aws.REGION
}));

export default winston;