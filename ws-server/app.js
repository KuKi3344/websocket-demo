//导入websocket包
const PORT = 3000
const ws = require('nodejs-websocket');
//创建一个server
let count = 0;	//当前连接用户数量
//connect，每个连接到服务器的用户，都会有一个connect对象
const server = ws.createServer(connect=>{
	console.log('新的连接')
	count++;
	connect.username=`用户${count}`;
	//告诉所有用户，有人加入了聊天室
	broadcast({
		type:'in',
		msg:`${connect.username}进入了聊天室`,
		time: new Date().toLocaleTimeString()
	})
	//每当接受到用户传递过来的数据，这个text事件就会被触发
	connect.on('text',data=>{
		//当我们接收到某个用户的信息，告诉所有用户消息内容
		broadcast({
			type:'msg',
			msg:`${connect.username}:${data}`,
			time: new Date().toLocaleTimeString()
		})
	})
	connect.on('close',()=>{
		console.log('连接断开了')
		count--;
		//告诉所有用户，有人离开了聊天室
		broadcast({
			type:'out',
			msg:`${connect.username}离开了聊天室`,
			time: new Date().toLocaleTimeString()
		})
	})
	//发生异常触发
	connect.on('error',(e)=>{
		console.log('用户连接异常')
	})
})
//广播，给所有用户发消息
function broadcast(data){
	server.connections.forEach(item=>{
		item.send(JSON.stringify(data));
	})
}
server.listen(PORT,()=>{
	console.log('websocket服务启动成功,3000')
}) 