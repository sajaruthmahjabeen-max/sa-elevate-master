const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Add import
if (!content.includes('import { ThemeToggle }')) {
  // Replace the supabase import with supabase + ThemeToggle
  content = content.replace(
    "import { supabase } from '@/lib/supabase';",
    "import { supabase } from '@/lib/supabase';\nimport { ThemeToggle } from '@/components/ThemeToggle';"
  );
}

// Add to Desktop
if (!content.includes('<ThemeToggle />')) {
  // Next to the social icons
  content = content.replace(
    '          </div>\n\n          {!user ? (',
    '          </div>\n\n          <ThemeToggle />\n\n          {!user ? ('
  );
  content = content.replace(
    '          </div>\r\n\r\n          {!user ? (',
    '          </div>\r\n\r\n          <ThemeToggle />\r\n\r\n          {!user ? ('
  );

  // Add to Mobile
  content = content.replace(
    '        {/* Mobile toggle */}\n        <button\n          className="lg:hidden text-foreground ml-4"\n          onClick={() => setMobileOpen(!mobileOpen)}\n        >\n          {mobileOpen ? <X size={24} /> : <Menu size={24} />}\n        </button>',
    '        {/* Mobile toggle */}\n        <div className="lg:hidden flex items-center gap-2 ml-auto">\n          <ThemeToggle />\n          <button\n            className="text-foreground p-2"\n            onClick={() => setMobileOpen(!mobileOpen)}\n          >\n            {mobileOpen ? <X size={24} /> : <Menu size={24} />}\n          </button>\n        </div>'
  );
  content = content.replace(
    '        {/* Mobile toggle */}\r\n        <button\r\n          className="lg:hidden text-foreground ml-4"\r\n          onClick={() => setMobileOpen(!mobileOpen)}\r\n        >\r\n          {mobileOpen ? <X size={24} /> : <Menu size={24} />}\r\n        </button>',
    '        {/* Mobile toggle */}\r\n        <div className="lg:hidden flex items-center gap-2 ml-auto">\r\n          <ThemeToggle />\r\n          <button\r\n            className="text-foreground p-2"\r\n            onClick={() => setMobileOpen(!mobileOpen)}\r\n          >\r\n            {mobileOpen ? <X size={24} /> : <Menu size={24} />}\r\n          </button>\r\n        </div>'
  );
}

fs.writeFileSync('src/components/Navbar.tsx', content);
