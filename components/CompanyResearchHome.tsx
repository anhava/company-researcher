import React from 'react';

export default function CompanyResearchHome() {
  return (
    <div>
      <img 
        src="/exa-logo-light.svg" 
        alt="Exa Logo" 
        className="h-6 sm:h-7 object-contain dark:hidden"
      />
      <img 
        src="/exa-logo-dark.svg" 
        alt="Exa Logo" 
        className="h-6 sm:h-7 object-contain hidden dark:block"
      />
    </div>
  );
}