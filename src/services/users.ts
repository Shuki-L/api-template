const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
export class Users {}
export default Users;
