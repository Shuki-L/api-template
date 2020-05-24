/* tslint:disable:member-ordering */
import AWS = require('aws-sdk');
const moment = require('moment');

export class AwsCloudWatchLogs {
    private cloudwatchlogs: any;
    constructor(protected awsConfig = {}) {
        this.cloudwatchlogs = new AWS.CloudWatchLogs(awsConfig);
    }

    private async getLatestLogStreamName(logGroupName: string): Promise<string> {
        const result = await this.describeLogStreams(logGroupName, true, 1, 'LastEventTime');
        return result.length > 0 ? result[0].logStreamName : null;
    }

    private async describeLogStreams(logGroupName: string, descending: boolean, limit: number, orderBy: string): Promise<any> {
        const params = {
            logGroupName, /* required */
            descending,
            limit,
            orderBy
        };
        const result = await this.cloudwatchlogs.describeLogStreams(params).promise();
        return result.logStreams;
    }

    private async getLogEvents(logGroupName: string, logStreamName: string, limit: number): Promise<any> {
        const params = {
            logGroupName, /* required */
            logStreamName, /* required */
            limit,
        };
        const result = await this.cloudwatchlogs.getLogEvents(params).promise();
        return result.events;
    }

    public async getLatestLogEvents(logGroupName: string, limit: number): Promise<any> {
        const logStreamName = await this.getLatestLogStreamName(logGroupName);
        const logs = logStreamName ? await this.getLogEvents(logGroupName, logStreamName, limit) : {};
        return logs.map(log => {
            return {
                timestamp: moment(log.timestamp).format('YYYY-MM-DD h:mm:ss.SSS'), // 2019-04-17 8:19:27.061
                message: log.message
            }
        });
    }
}
export default AwsCloudWatchLogs;
