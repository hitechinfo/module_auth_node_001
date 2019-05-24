const systemMessage = require('../../../config/systemMessage');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const commonUtil = require('../common/commonUtil');

const redis = require("redis");
const client    = redis.createClient({
    port      : 6379,
    host      : process.env.redishost,
    password  : process.env.redispassword
    }
  );
  
client.select(3);


// 토큰 create
exports.createToken = (req,res) => {
  const userId = req.body.userId || '';
  const userType = req.body.userType || '';

  if(!userId.length){
    return res.status(400).json({error:"token error , " + systemMessage.search.incorrectKey + "userId" , req:userId});
  }

  if(!userType.length){
    return res.status(400).json({error:"token error , " + systemMessage.search.incorrectKey + "userType" , req:userType});
  }

  let payload = {
      userId: userId,
      userType: userType
  };
  let secretOrPrivateKey = process.env.JWT_SECRET;
  let options = {
      expiresIn: 60 * 60 * Number(process.env.tokenEffectiveTime)
  };

  jwt.sign(payload, secretOrPrivateKey, options, (err, token) => {
      if (err) {
        return res.json({error: "token error , " + err});
      }
      // 토큰을 redis에 저장 (white list)
      client.set(payload.userId, token);
      return res.json(token);
  });
};

// 토큰 refresh
exports.refreshToken = (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (!token || token == "null") {
    return res.status(999).json({error:systemMessage.token.tokenRequired});
  }else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          if(err.name == "TokenExpiredError") return res.status(998).json({error:systemMessage.token.tokenExpired});
          else if(err.name == "JsonWebTokenError") return res.status(401).json({error:systemMessage.token.tokenInvalidInfo});
        }
        else {
          // 토큰 유효성 체크 : 헤더에서 보낸 값과 레디스에 들어있는 토큰 값이 같아야만 Refresh Token 발급
          var userId = decoded.userId;
          var userType = decoded.userType;

          client.get(userId, (err, reply) => {
            if (err) return res.json({'error': err});
            if(token != reply) {
              return res.status(401).json({error:systemMessage.token.tokenDisagreement});
            } else {
              let payload = {
                  userId: userId,
                  userType: userType
              };
              let secretOrPrivateKey = process.env.JWT_SECRET;
              let options = {
                  expiresIn: 60 * 60 * Number(process.env.tokenEffectiveTime)
              };

              return jwt.sign(payload, secretOrPrivateKey, options, (err, token) => {
                  if (err) {
                    return res.json({error: "token error , " + err});
                  } else{
                    client.set(payload.userId, token);
                    return res.json(token);
                  }
              });
            }
          });
        }
    });
  }
};

// logout 시 token 삭제
exports.deleteToken = (req,res) => {
  const userId = req.body.userId || '';
  const userType = req.body.userType || '';
  
  let payload = {
      userId: userId
  };

  client.del(payload.userId , function(err, value){  
    if(err){
      return res.status(400).json({error :"token error , " + err});
    }else{
      return res.status(200).json("ok");
    }
    
  });
};







