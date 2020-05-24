/* tslint:disable:member-ordering */
import AWS = require('aws-sdk');

export class AwsECS {


    private config = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }

    private ecs: any;
    constructor(protected awsConfig = {}) {

        this.ecs = new AWS.ECS(Object.assign(awsConfig, this.config));

    }

    public async getClusters() {
        const params = {
        };

        const res = await this.ecs.listClusters(params).promise();
        return res.clusterArns
    }

    public async getInctences(clusterName) {
        try {
            const params = {
                cluster: clusterName,
                //'arn:aws:ecs:us-east-1:995121555896:cluster/cliq-dev-01',
            };
            const instencesResult = await this.ecs.listContainerInstances(params).promise();
            console.log(instencesResult.containerInstanceArns);
            return instencesResult.containerInstanceArns;
        } catch (error) {
            console.log(`error ${error}`);
        }
    }

    public async insctenceDetails(clusterName, containerinstances) {
        try {
            const params = {
                cluster: clusterName,
                containerInstances: containerinstances
            };
            const result = await this.ecs.describeContainerInstances(params).promise();
            return result;
        }
        catch (error) {
            console.log(error)
        }
    }

    public async getTasks(cluster, containerInstance: string) {
        try {
            const params = {
                cluster: cluster,
                containerInstance: containerInstance
            };
            const res = await this.ecs.listTasks(params).promise();
            // console.log(res);
            return res.taskArns
        } catch (error) {
            console.log(`error ${error}`);
        }
    }

    public async getTaskName(cluster: string, task: string): Promise<string> {
        try {
            const params = {
                tasks: [task],
                cluster: cluster
            };
            const res = await this.ecs.describeTasks(params).promise();
            return res.tasks.length > 0 ? res.tasks[0].containers[0].name : {}
        } catch (error) {
            console.log(`error ${error}`);
        }
    }

    public async getTaskStatus(cluster: string, task: string): Promise<any> {
        try {
            const params = {
                tasks: [task],
                cluster: cluster
            };
            const res = await this.ecs.describeTasks(params).promise();
            const taskName = res.tasks[0].taskDefinitionArn.split('/').pop().split(':')[0];
            const status = res.tasks[0].lastStatus == 'RUNNING' ;
            return { [taskName] : status}
        } catch (error) {
            console.log(`error ${error}`);
        }
    }    

    public async getTaskStatusBatch(cluster: string, task: any): Promise<any> {
        try {
            const params = {
                tasks: task,
                cluster: cluster
            };
            const res = [];
            const tasksData = await this.ecs.describeTasks(params).promise();
            const tasksArr = tasksData.tasks;
            console.log(tasksArr.length)
            for (let taskData of tasksArr) {
                const taskName = taskData.containers[0].name;
                const status = taskData.lastStatus == 'RUNNING' ;
                res.push({ [taskName] : status})
            }
            return res
        } catch (error) {
            console.log(`error ${error}`);
        }
    }    

}
export default AwsECS;
