/* tslint:disable:member-ordering */
import AWS = require('aws-sdk');

export class AwsEC2 {
    private ec2: any;
    private config = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
    constructor(protected awsConfig = {}) {
        this.ec2 = new AWS.EC2(Object.assign(awsConfig, this.config));
    }

    private async describeInstances(InstanceIds: Array<string>): Promise<any> {
        const params = { InstanceIds };
        const result = await this.ec2.describeInstances(params).promise();
        return result.Reservations.length > 0 &&
            result.Reservations[0].Instances.length > 0
            ? result.Reservations[0].Instances
            : [];
    }

    public async getInstanceIp(InstanceId: string): Promise<any> {
        const instances = await this.describeInstances([InstanceId]);
        return instances.length > 0 ? instances[0].PrivateIpAddress : null;
    }
}
export default AwsEC2;
