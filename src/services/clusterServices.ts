/* tslint:disable:member-ordering */
import AWS = require('aws-sdk');
import AwsECS from './awsECS';

import awsEC2, { AwsEC2 } from './awsEC2';
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
export class ClusterServices {
    private ecs: any;
    private result: any;
    private awsEcs;
    private awsEc2;

    constructor(protected awsConfig = {}) {
        this.awsEcs = new AwsECS(awsConfig);
        this.awsEc2 = new AwsEC2(awsConfig);
    }

    public async getClusterinfo(clusterArn, clusterName) {
        const clusterCache = cache.get('cluster');
        if (clusterCache) {
            return clusterCache;
        }

        const cluster = {
            name: clusterName,
            arn: clusterArn,
        };

        this.result = [];
        const containersList = await this.awsEcs.getInctences(clusterArn);
        const containerElements = containersList.map(
            (container) => container.split('/')[1],
        );
        const containerDetailsList = await this.awsEcs.insctenceDetails(
            clusterName,
            containerElements,
        );

        const instanceIds = containerDetailsList.containerInstances.map(
            (containerDetails) => {
                return containerDetails.ec2InstanceId;
            },
        );

        let index = 0;
        cluster['instances'] = [];
        const ipPromises = [];
        const servicePromises = [];

        for (const instanceId of instanceIds) {
            ipPromises.push(this.awsEc2.getInstanceIp(instanceId));
            servicePromises.push(
                this.getTaskInfo(clusterArn, containerElements[index]),
            );
            index++;
        }
        const ips = await Promise.all(ipPromises);
        // const services = await Promise.all(servicePromises);
        const services = [];
        for (const servicePromise of servicePromises) {
            services.push(await servicePromise);
        }

        for (let i = 0; i < ips.length; i++) {
            cluster['instances'].push({
                ip: ips[i],
                services: services[i],
            });
        }
        console.log(cluster);

        cache.set('cluster', cluster);
        return cluster;
    }

    public async getTaskStatuses(clusterArn: string, containers: string[]) {
        let tasksList = [];
        for (let index = 0; index < containers.length; index++) {
            const container = containers[index];
            const list = await this.awsEcs.getTasks(clusterArn, container);
            tasksList = tasksList.concat(list);
        }
        const res = await this.awsEcs.getTaskStatusBatch(clusterArn, tasksList);
        return res;
    }

    private async getTaskInfo(
        clusterArn: string,
        containerInstance: string,
    ): Promise<any[]> {
        const tasks = [];
        const taskArns = await this.awsEcs.getTasks(
            clusterArn,
            containerInstance,
        );
        // console.log(taskArns);
        // if (taskArns.length == 0) return [];
        for (const taskArn of taskArns) {
            const taskName = await this.awsEcs.getTaskName(clusterArn, taskArn);
            const task = { name: taskName };
            tasks.push(task);
        }
        return tasks;
    }
}
export default ClusterServices;
