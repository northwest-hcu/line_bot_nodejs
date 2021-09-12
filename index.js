'use strict';

const http=require('http');
const fs=require('fs');
const line=require('@line/bot-sdk');
const path=require('path');

const PORT=process.env.PORT || 8080;

const data=JSON.parse(fs.readFileSync('../secret.json'));

const config={
  channelAccessToken:data['channel_access_token'],
  channelSecret:data['channel_secret']
};

const client=new line.Client(config);

const server=http.createServer(function(req,res){
  try{
    const request=path.normalize(decodeURI(req.url));
    console.log(request);
    /*LINEbotからのアクセス*/
    if(request==='/callback' && req.method==='POST'){

      console.dir(req.headers);
      line.middleware(config);

      let data='',body;
      req.on('data',function(chunk){
        data+=chunk;
      });
      req.on('end',function(chunk){
        body=JSON.parse(data);
        console.dir(body);
        console.log('user id:'+body.events[0].source.userId);
        handlerEvent(body.events[0]);
      });
    }

  }catch(err){
    console.log('SERVER err:'+err);
  }
});

function handlerEvent(event){
  if(event.type==='message' && event.message.type==='text'){
    let text=event.message.text+'//';
    if(event.message.text==='温度'){
      fs.readFile('/sys/class/thermal/thermal_zone0/temp','utf-8',function(err,data){
        if(err){
          console.log('handler err:'+err);
        }
        text='現在のCPU温度は '+(Number(data)/1000)+'° です。';
        return client.replyMessage(event.replyToken,{
          type:'text',
          text:text
        });
      });
    }else{
      return client.replyMessage(event.replyToken,{
        type:'text',
        text:event.message.text+'//'
      });
    }
  }
}

server.listen(PORT,function(){
  console.log('porting:'+PORT);
});
