module.exports = appInfo => {
  const config = {};

  config.keys = "pzhuweb";

  // config.host = 'http://www.pzhuweb.cn';

  config.security = {
    csrf: false
  }

  config.bodyParser = {
    jsonLimit: '100mb',
    formLimit: '100mb',
  }

  //邮件信息配置
  config.nodemailer = {
    user: 'register@hiclay.top',
    pass: 'luowen19980520LW',
    from: 'register@hiclay.top',
    replyTo: '1291962779@qq.com'
  }

  // 数据库配置
  config.sequelize = {
    dialect: 'mysql',
    database: 'pzhuweb',
    port: '3306',
    host: '127.0.0.1',
    username: 'root',
    password: '123456',
  }
  //token登录鉴权秘钥
  config.token='webJWT'
  

  // 配置session
  config.session = {
    key: 'SESSION_ID', //key名字
    maxAge: 1000 * 60 * 24,
    httpOnly: true,
    encrypt: true, //加密 
    renew: true //最大时间范围内，刷新，自动增加最大时间
  }
  config.cors = {
    credentials: true
  }

  return config;
};