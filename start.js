const concurrently = require('concurrently');
const { result } = concurrently([
  { 
    command: 'cd backend && npm start',
    name: 'backend',
    prefixColor: 'blue'
  },
  { 
    command: 'cd frontend && npm start',
    name: 'frontend',
    prefixColor: 'green'
  }
], {
  prefix: 'name',
  killOthers: ['failure', 'success'],
  restartTries: 3,
});