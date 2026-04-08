const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
if (!content.includes('ThemeProvider')) {
  content = content.replace('import { AuthProvider, useAuth } from "@/hooks/useAuth";', 'import { AuthProvider, useAuth } from "@/hooks/useAuth";\nimport { ThemeProvider } from "@/components/theme-provider";');
}

// Add ThemeProvider wrapper
if (!content.includes('<ThemeProvider')) {
  content = content.replace(
    '<QueryClientProvider client={queryClient}>\n    <AuthProvider>',
    '<QueryClientProvider client={queryClient}>\n    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">\n      <AuthProvider>'
  );
  content = content.replace(
    '<QueryClientProvider client={queryClient}>\r\n    <AuthProvider>',
    '<QueryClientProvider client={queryClient}>\r\n    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">\r\n      <AuthProvider>'
  );
  content = content.replace(
    '</AuthProvider>\n  </QueryClientProvider>',
    '</AuthProvider>\n    </ThemeProvider>\n  </QueryClientProvider>'
  );
  content = content.replace(
    '</AuthProvider>\r\n  </QueryClientProvider>',
    '</AuthProvider>\r\n    </ThemeProvider>\r\n  </QueryClientProvider>'
  );
}

fs.writeFileSync('src/App.tsx', content);
