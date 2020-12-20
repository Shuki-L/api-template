/* tslint:disable:member-ordering */
import AWS = require('aws-sdk');

export class AwsS3 {
    private s3: any;
    constructor(
        protected awsConfig = {},
        protected bucketName = process.env.BUCKET_NAME,
    ) {
        this.s3 = new AWS.S3(awsConfig);
    }
    public async upload(rawData: any, orgId: string): Promise<any> {
        const params = {
            Bucket: this.bucketName,
            Key: `myKey/proxy.pac`,
            Body: rawData,
            ContentType: 'application/json',
        };
        const s3Result = await this.s3.upload(params).promise();
        return s3Result.Key;
    }
}
export default AwsS3;
