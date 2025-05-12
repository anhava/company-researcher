'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function CompanyResearchHome() {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search submission
    console.log('Searching for:', url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Logo Section */}
      <div className="flex justify-center mb-12">
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

      {/* Hero Text */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          Company Research Made Simple
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Enter any company's website URL to get instant insights about their products, funding, team, and more.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter company website URL (e.g., example.com)"
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-white 
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-default focus:border-transparent
                     placeholder:text-gray-400 text-gray-900"
            required
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-brand-default 
                     text-white rounded-lg hover:bg-brand-dark transition-colors duration-200
                     font-medium text-sm"
          >
            Research
          </button>
        </div>
      </form>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {[
          {
            title: 'Comprehensive Analysis',
            description: 'Get detailed insights about any company\'s products, funding, and market position.'
          },
          {
            title: 'Real-time Data',
            description: 'Access up-to-date information from multiple reliable sources across the web.'
          },
          {
            title: 'Smart Insights',
            description: 'Understand competitors, market trends, and business opportunities at a glance.'
          }
        ].map((feature, index) => (
          <div 
            key={index}
            className="p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100
                     hover:border-brand-default/20 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}