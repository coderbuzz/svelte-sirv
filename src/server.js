import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import morgan from 'morgan';
import ClusterWS from 'clusterws';
import mount from './loader';

// const pkg = require('./package.json');

// console.log(pkg);

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

new ClusterWS({
	port: PORT || 3000, // specify port of the application
	worker: Worker, // Worker function must be provided
	workers: dev ? 1 : require('os').cpus().length,
	restartWorkerOnFail: true
}); 

function Worker() { 

	// Get websocket server
    const wss = this.wss
    
	// Get http/https server
	const server = this.server

	// Listen on connections to websocket server
    wss.on('connection', (socket, req) => { });

    const main = polka();

    if (dev) {
        main.use(morgan('dev'));
    } else  {
        main.use(compression({ threshold: 0 }));
    }

    main.use(sirv(__dirname + '/client', { dev }));

    mount(main, wss);

	server.on('request', main.handler);
            
    // console.log('Server Ready', dev, NODE_ENV, PORT);
}



// function Worker() { 

// 	// Get websocket server
// 	const wss = this.wss
// 	// Get http/https server
// 	const server = this.server

// 	// Listen on connections to websocket server
//     wss.on('connection', (socket, req) => { });

//     const app = polka();
    
//     if (dev) {
//         app.use(morgan('dev'));
//     } else  {
//         app.use(compression({ threshold: 0 }));
//     }

// 	server.on('request',
//         app
//             .use(	
//                 sirv(__dirname + '/client', { dev })
//             )
//             .handler);
            
//     // console.log('Server Ready', dev, NODE_ENV, PORT);
// }


