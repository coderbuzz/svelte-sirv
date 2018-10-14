import App from './App.html';

const app = new App({
	target: document.body,
	data: {
		name: 'World this is Admin'
	}
});

window.app = app;

export default app;


console.log('Ready!');