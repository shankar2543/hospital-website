import Parse from 'parse';

const APP_ID     = process.env.NEXT_PUBLIC_BACK4APP_APP_ID;
const JS_KEY     = process.env.NEXT_PUBLIC_BACK4APP_JS_KEY;
const SERVER_URL = process.env.NEXT_PUBLIC_BACK4APP_SERVER_URL;

console.log('Parse Config:', { APP_ID, SERVER_URL });

if (!Parse.applicationId) {
  Parse.initialize(APP_ID, JS_KEY);
  Parse.serverURL = SERVER_URL;
  console.log('Parse initialized successfully');
}

export default Parse;

