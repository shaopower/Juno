const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const task2 = require('./server.js').task2;

if (cluster.isMaster) {
    console.log('[master] ' + "start master...");

    for (var i = 0; i < numCPUs; i++) {
         cluster.fork();
    }

    cluster.on('listening', function (worker, address) {
        console.log('[master] ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port);
    });

} else if (cluster.isWorker) {
    console.log('[worker] ' + "start worker ..." + cluster.worker.id);
    http.createServer(function (req, res) {
        console.log('worker'+cluster.worker.id+new Date);
        
        task2(req, res);
    }).listen(3001);
}
