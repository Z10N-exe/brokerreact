const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Aspire Secure Trade Development Environment...\n');

// Start backend server
console.log('📦 Starting Backend Server...');
const backendPath = path.join(__dirname, '..', 'backend');
const backendProcess = spawn('npm', ['start'], {
  cwd: backendPath,
  stdio: 'inherit',
  shell: true
});

// Wait a moment for backend to start
setTimeout(() => {
  console.log('\n🎨 Starting Frontend Development Server...');
  
  // Start frontend server
  const frontendPath = path.join(__dirname, '..', 'frontend');
  const frontendProcess = spawn('npm', ['run', 'dev'], {
    cwd: frontendPath,
    stdio: 'inherit',
    shell: true
  });

  // Handle process cleanup
  const cleanup = () => {
    console.log('\n🛑 Shutting down servers...');
    backendProcess.kill();
    frontendProcess.kill();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  backendProcess.on('close', (code) => {
    console.log(`\nBackend process exited with code ${code}`);
  });

  frontendProcess.on('close', (code) => {
    console.log(`\nFrontend process exited with code ${code}`);
  });

}, 3000);

console.log('✅ Development environment started!');
console.log('   Backend: http://localhost:5000');
console.log('   Frontend: http://localhost:5173');
console.log('\nPress Ctrl+C to stop both servers');
