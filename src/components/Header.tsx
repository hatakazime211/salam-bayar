import { Button } from "@/components/ui/button";
import { Bell, User, LogOut } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SIPAY SEKOLAH
            </h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Dashboard
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Data Siswa
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Pembayaran
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Laporan
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Admin TU</span>
              </Button>
              <Button variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;