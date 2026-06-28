import 'dotenv/config';


const  AppConfig = new Map()

AppConfig.set('PORT',  process.env.PORT || 3000);
AppConfig.set('DATABASE_URL', process.env.DATABASE_URL || '');


export {AppConfig};
