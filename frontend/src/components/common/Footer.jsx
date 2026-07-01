import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 text-muted-foreground text-xs">
        <p className="text-center md:text-left">
          &copy; {new Date().getFullYear()} FormManager. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Hệ thống hoạt động bình thường</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
