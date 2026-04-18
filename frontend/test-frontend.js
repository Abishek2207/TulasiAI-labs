// Simple test script to verify frontend setup
const fs = require('fs');
const path = require('path');

console.log('Testing TulasiAI Labs Frontend Setup...\n');

// Check essential files
const essentialFiles = [
  'src/app/page.tsx',
  'src/app/login/page.tsx',
  'src/app/signup/page.tsx',
  'src/app/dashboard/page.tsx',
  'src/app/skills/page.tsx',
  'src/app/tasks/page.tsx',
  'src/app/career/page.tsx',
  'src/app/notifications/page.tsx',
  'src/components/layout/Layout.tsx',
  'src/components/layout/Navbar.tsx',
  'src/components/layout/Sidebar.tsx',
  'src/components/ui/Button.tsx',
  'src/components/ui/Card.tsx',
  'src/lib/api-client.ts',
  'src/lib/supabase-client.ts',
  'src/store/store.ts',
  'src/lib/utils.ts',
  'tailwind.config.ts',
  'src/app/globals.css',
  'package.json'
];

let allFilesExist = true;

essentialFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`\u2705 ${file}`);
  } else {
    console.log(`\u274c ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check package.json dependencies
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const requiredDeps = ['next', 'react', 'framer-motion', 'zustand', '@supabase/supabase-js', 'axios', 'lucide-react'];
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
  
  if (missingDeps.length === 0) {
    console.log('\n\u2705 All required dependencies are present');
  } else {
    console.log(`\u274c Missing dependencies: ${missingDeps.join(', ')}`);
    allFilesExist = false;
  }
} catch (error) {
  console.log('\u274c Error reading package.json');
  allFilesExist = false;
}

// Check Tailwind config
try {
  const tailwindConfig = fs.readFileSync(path.join(__dirname, 'tailwind.config.ts'), 'utf8');
  if (tailwindConfig.includes("darkMode: 'class'")) {
    console.log('\u2705 Tailwind dark mode configured');
  } else {
    console.log('\u274c Tailwind dark mode not configured');
    allFilesExist = false;
  }
} catch (error) {
  console.log('\u274c Error reading tailwind.config.ts');
  allFilesExist = false;
}

// Check globals.css
try {
  const globalsCss = fs.readFileSync(path.join(__dirname, 'src/app/globals.css'), 'utf8');
  if (globalsCss.includes('.dark')) {
    console.log('\u2705 Dark mode CSS variables present');
  } else {
    console.log('\u274c Dark mode CSS variables missing');
    allFilesExist = false;
  }
} catch (error) {
  console.log('\u274c Error reading globals.css');
  allFilesExist = false;
}

// Summary
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('\u2702\u2702\u2702 FRONTEND SETUP COMPLETE! \u2702\u2702\u2702');
  console.log('\nAll essential files and configurations are in place.');
  console.log('The frontend is ready for development with:');
  console.log('- Modern dark mode design');
  console.log('- Framer Motion animations');
  console.log('- Zustand state management');
  console.log('- Supabase authentication');
  console.log('- API integration');
  console.log('\nTo start the development server:');
  console.log('  npm run dev');
} else {
  console.log('\u274c\u274c\u274c FRONTEND SETUP INCOMPLETE \u274c\u274c\u274c');
  console.log('\nSome files or configurations are missing.');
  console.log('Please review the errors above and fix them.');
}
