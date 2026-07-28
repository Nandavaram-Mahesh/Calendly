import 'dotenv/config';


const  AppConfig = new Map()

AppConfig.set('PORT',  process.env.PORT || 3000);
AppConfig.set('DATABASE_URL', process.env.DATABASE_URL || '');
AppConfig.set('SLOT_GENERATION_DAYS', Number(process.env.SLOT_GENERATION_DAYS)|| 30);



export const TEMPORAL_ADDRESS = process.env.TEMPORAL_ADDRESS || 'localhost:7233';
export const TEMPORAL_NAMESPACE = process.env.TEMPORAL_NAMESPACE || 'default';
export const TEMPORAL_TASK_QUEUE = process.env.TEMPORAL_TASK_QUEUE || 'calendly-tasks';
export const TEMPORAL_ENABLED = true;

export const SMTP_HOST = process.env.SMTP_HOST || 'localhost';
export const SMTP_PORT = Number(process.env.SMTP_PORT) || 1025;
export const SMTP_USER = process.env.SMTP_USER || '';
export const SMTP_PASS = process.env.SMTP_PASS || '';
export const EMAIL_FROM = process.env.EMAIL_FROM || 'Calendly <noreply@example.com>';

export {AppConfig};
