'use strict';

const http=require('http');
const fs=require('fs');
const line=require('@line/bot-sdk');

const PORT=process.env.PORT || 8080;

const data=json.parse(fs.readFileSync('../secret.json'));
console.dir(data);

const config={
  channelAccessToken:data['channel_access_token'],
  channelSecret:data['channel_secret']
};

const client=new line.Client(config);

const server=http.createServer(function(req,res){
  try{

    /*LINEbotからのアクセス*/
    if(path.normalize(decodeURI(req.url))==='/callback' && req.method==='POST'){
      const signature=req.headers['X-Line-Signature'];
      console.dir(req.body.events[0]);
      line.middleware(config);

      Promise
        .all(req.body.events.map(handlerEvent))
        .then(function(result){
          res.json(result);
        });

    }

  }catch(err){
    console.log('SERVER err:'+err);
  }
});

async function handlerEvent(event){
  if(event.type!=='message' || event.message.type!=='text'){
    return Promise.resolve(null);
  }
  return client.replyMessage(event.replyToken,{
    type:'text',
    text:event.message.text+'//'
  });
}

server.listen(PORT,function(){
  console.log('porting:'+PORT);
});
