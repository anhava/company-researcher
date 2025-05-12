'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import CompanyMindMap from './mindmap/CompanyMindMap';
import CompanySummary from './companycontent/CompanySummar';
import LinkedInDisplay from './linkedin/LinkedinDisplay';
import GitHubDisplay from './github/GitHubDisplay';
import TwitterProfileDisplay from './twitter/TwitterProfileDisplay';
import RecentTweetsDisplay from './twitter/RecentTweetsDisplay';
import YouTubeVideosDisplay from './youtube/YoutubeVideosDisplay';
import TikTokDisplay from './tiktok/TikTokDisplay';
import RedditDisplay from './reddit/RedditDisplay';
import NewsDisplay from './news/NewsDisplay';
import CompetitorsDisplay from './competitors/CompetitorsDisplay';
import WikipediaDisplay from './wikipedia/WikipediaDisplay';
import FinancialReportDisplay from './financial/FinancialReportDisplay';
import FundingDisplay from './companycontent/FundingDisplay';
import FoundersDisplay from './founders/FoundersDisplay';
import CrunchbaseDisplay from './crunchbase/CrunchbaseDisplay';
import PitchBookDisplay from './pitchbook/PitchBookDisplay';
import TracxnDisplay from './tracxn/TracxnDisplay';

export default function CompanyResearcher() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [researchData, setResearchData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [comparisonInput, setComparisonInput] = useState('');
  const [isComparing, setIsComparing] = useState(false);

  // Function to validate and format input (URL or Business ID)
  const formatInput = (input: string): { type: 'url' | 'businessId', value: string } => {
    const cleanInput = input.trim().toLowerCase();
    
    // Check if input matches Finnish Business ID format (Y-tunnus)
    const businessIdRegex = /^(\d{7}-\d{1}|\d{8})$/;
    if (businessIdRegex.test(cleanInput.replace(/\s/g, ''))) {
      return {
        type: 'businessId',
        value: cleanInput.replace(/\s/g, '')
      };
    }
    
    // Handle URL
    let formattedUrl = cleanInput;
    formattedUrl = formattedUrl.replace(/^(https?:\/\/)?(www\.)?/, '');
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    return {
      type: 'url',
      value: formattedUrl
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formattedInput = formatInput(input);

    try {
      let data: any = {};

      // If input is a business ID, fetch data from Finnish sources first
      if (formattedInput.type === 'businessId') {
        const [prhData, ytjData, suomifiData, businessFinlandData, tilastokeskusData] = await Promise.all([
          fetch('/api/prh', { method: 'POST', body: JSON.stringify({ businessId: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
          fetch('/api/ytj', { method: 'POST', body: JSON.stringify({ businessId: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
          fetch('/api/suomifi', { method: 'POST', body: JSON.stringify({ businessId: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
          fetch('/api/businessfinland', { method: 'POST', body: JSON.stringify({ businessId: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
          fetch('/api/tilastokeskus', { method: 'POST', body: JSON.stringify({ businessId: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json())
        ]);

        data = {
          prh: prhData.results,
          ytj: ytjData.results,
          suomifi: suomifiData.results,
          businessFinland: businessFinlandData.results,
          tilastokeskus: tilastokeskusData.results
        };

        // Extract website URL from PRH/YTJ data if available
        formattedInput.value = data.prh?.websites?.[0] || data.ytj?.websiteUrl || formattedInput.value;
      }

      // Continue with regular website content fetching
      const websiteContent = await fetch('/api/scrapewebsiteurl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteurl: formattedInput.value })
      }).then(res => res.json());

      // Check if websiteContent has valid results
      if (!websiteContent?.results || !Array.isArray(websiteContent.results) || websiteContent.results.length === 0) {
        throw new Error('Verkkosivun sisällön hakeminen epäonnistui. Tarkista syöttämäsi osoite.');
      }

      const mainPageContent = websiteContent.results[0];

      // Fetch subpages
      const subpagesContent = await fetch('/api/scrapewebsitesubpages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteurl: formattedInput.value })
      }).then(res => res.json());

      const subpages = subpagesContent?.results?.[0] || [];

      // Generate company summary
      const summary = await fetch('/api/companysummary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          websiteurl: formattedInput.value,
          mainpage: mainPageContent,
          subpages: subpages
        })
      }).then(res => res.json());

      // Generate mind map
      const mindMap = await fetch('/api/companymap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          websiteurl: formattedInput.value,
          mainpage: mainPageContent
        })
      }).then(res => res.json());

      // Fetch all other data in parallel
      const [
        linkedin, github, twitter, twitterProfile, youtube, tiktok, reddit,
        news, competitors, wikipedia, financials, funding, founders,
        crunchbase, pitchbook, tracxn
      ] = await Promise.all([
        fetch('/api/scrapelinkedin', { method: 'POST', body: JSON.stringify({ websiteurl: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchgithuburl', { method: 'POST', body: JSON.stringify({ websiteurl: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/scraperecenttweets', { method: 'POST', body: JSON.stringify({ username: mainPageContent?.twitter_username }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/scrapetwitterprofile', { method: 'POST', body: JSON.stringify({ websiteurl: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchyoutubevideos', { method: 'POST', body: JSON.stringify({ websiteurl: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchtiktok', { method: 'POST', body: JSON.stringify({ websiteurl: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/scrapereddit', { method: 'POST', body: JSON.stringify({ websiteurl: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/findnews', { method: 'POST', body: JSON.stringify({ websiteurl: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/findcompetitors', { method: 'POST', body: JSON.stringify({ websiteurl: formattedInput.value, summaryText: summary?.result || '' }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchwikipedia', { method: 'POST', body: JSON.stringify({ websiteurl: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchfinancialreport', { method: 'POST', body: JSON.stringify({ websiteurl: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchfunding', { method: 'POST', body: JSON.stringify({ websiteurl: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchfounders', { method: 'POST', body: JSON.stringify({ websiteurl: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchcrunchbase', { method: 'POST', body: JSON.stringify({ websiteurl: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchpitchbook', { method: 'POST', body: JSON.stringify({ websiteurl: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchtracxn', { method: 'POST', body: JSON.stringify({ websiteurl: formattedInput.value }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json())
      ]);

      setResearchData({
        ...data, // Include Finnish business data
        summary: summary?.result || null,
        mindMap: mindMap?.result || null,
        linkedin: linkedin?.results?.[0] || null,
        github: github?.results?.[0] || null,
        twitter: twitter?.results || [],
        twitterProfile: twitterProfile?.results?.[0] || null,
        youtube: youtube?.results || [],
        tiktok: tiktok?.results?.[0] || null,
        reddit: reddit?.results || [],
        news: news?.results || [],
        competitors: competitors?.results || [],
        wikipedia: wikipedia?.results?.[0] || null,
        financials: financials?.results || [],
        funding: funding?.results?.[0] || null,
        founders: founders?.results || [],
        crunchbase: crunchbase?.results?.[0] || null,
        pitchbook: pitchbook?.results?.[0] || null,
        tracxn: tracxn?.results?.[0] || null
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Tietojen haku epäonnistui. Yritä uudelleen.';
      setError(errorMessage);
      console.error('Research error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8ff] to-white">
      <header className="w-full bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src="/exa-logo-light.svg" 
              alt="Exa Logo" 
              className="h-8 object-contain"
            />
            <span className="text-xl font-semibold text-gray-900">Yritystutkimus</span>
          </div>
          <nav>
            <ul className="flex gap-6">
              <li>
                <a href="#features" className="text-gray-600 hover:text-gray-900">Ominaisuudet</a>
              </li>
              <li>
                <a href="#about" className="text-gray-600 hover:text-gray-900">Tietoa</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Suomalaisten yritysten tutkimus
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Syötä yrityksen verkko-osoite tai Y-tunnus saadaksesi kattavan analyysin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Syötä yrityksen verkko-osoite tai Y-tunnus (esim. firma.fi tai 1234567-8)"
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-white 
                       shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-default focus:border-transparent
                       placeholder:text-gray-400 text-gray-900"
              required
            />
          </div>

          {isComparing && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={comparisonInput}
                onChange={(e) => setComparisonInput(e.target.value)}
                placeholder="Syötä kilpailijan verkko-osoite tai Y-tunnus vertailua varten"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-white 
                         shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-default focus:border-transparent
                         placeholder:text-gray-400 text-gray-900"
              />
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 bg-brand-default text-white rounded-xl 
                       transition-colors duration-200 font-medium
                       ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-brand-dark'}`}
            >
              {isLoading ? 'Analysoidaan...' : 'Analysoi'}
            </button>
            <button
              type="button"
              onClick={() => setIsComparing(!isComparing)}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl
                       hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              {isComparing ? 'Piilota vertailu' : 'Vertaile kilpailijaan'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-2xl mx-auto mt-8 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Research Results */}
        {researchData && (
          <div className="mt-16 space-y-12">
            {/* Company Summary */}
            {researchData.summary && (
              <section>
                <CompanySummary summary={researchData.summary} />
              </section>
            )}

            {/* Mind Map */}
            {researchData.mindMap && (
              <section>
                <h2 className="text-2xl font-normal mb-6">Yrityksen yleiskatsaus</h2>
                <CompanyMindMap data={researchData.mindMap} />
              </section>
            )}

            {/* LinkedIn Profile */}
            {researchData.linkedin && (
              <section>
                <LinkedInDisplay data={researchData.linkedin} />
              </section>
            )}

            {/* Funding Information */}
            {researchData.funding && (
              <section>
                <FundingDisplay fundingData={researchData.funding} />
              </section>
            )}

            {/* Financial Reports */}
            {researchData.financials?.length > 0 && (
              <section>
                <FinancialReportDisplay report={researchData.financials} />
              </section>
            )}

            {/* Founders */}
            {researchData.founders?.length > 0 && (
              <section>
                <FoundersDisplay founders={researchData.founders} />
              </section>
            )}

            {/* Company Profiles */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {researchData.crunchbase && <CrunchbaseDisplay data={researchData.crunchbase} />}
              {researchData.pitchbook && <PitchBookDisplay data={researchData.pitchbook} />}
              {researchData.tracxn && <TracxnDisplay data={researchData.tracxn} />}
            </section>

            {/* Wikipedia */}
            {researchData.wikipedia && (
              <section>
                <WikipediaDisplay data={researchData.wikipedia} websiteUrl={input} />
              </section>
            )}

            {/* Competitors */}
            {researchData.competitors?.length > 0 && (
              <section>
                <CompetitorsDisplay competitors={researchData.competitors} />
              </section>
            )}

            {/* News */}
            {researchData.news?.length > 0 && (
              <section>
                <NewsDisplay news={researchData.news} />
              </section>
            )}

            {/* Social Media Section */}
            <div className="space-y-12">
              {/* GitHub */}
              {researchData.github && (
                <section>
                  <GitHubDisplay githubUrl={researchData.github.url} />
                </section>
              )}

              {/* Twitter Profile and Tweets */}
              {researchData.twitterProfile && (
                <section className="space-y-8">
                  <TwitterProfileDisplay rawText={researchData.twitterProfile.text} username={researchData.twitterProfile.username} />
                  {researchData.twitter?.length > 0 && (
                    <RecentTweetsDisplay tweets={researchData.twitter} />
                  )}
                </section>
              )}

              {/* YouTube Videos */}
              {researchData.youtube?.length > 0 && (
                <section>
                  <YouTubeVideosDisplay videos={researchData.youtube} />
                </section>
              )}

              {/* TikTok */}
              {researchData.tiktok && (
                <section>
                  <TikTokDisplay data={researchData.tiktok} />
                </section>
              )}

              {/* Reddit */}
              {researchData.reddit?.length > 0 && (
                <section>
                  <RedditDisplay posts={researchData.reddit} />
                </section>
              )}
            </div>
          </div>
        )}

        {/* Features Section */}
        {!researchData && !isLoading && (
          <section id="features" className="py-24">
            <h2 className="text-3xl font-bold text-center mb-12">Ominaisuudet</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Kattava analyysi',
                  description: 'Saat yksityiskohtaista tietoa suomalaisten yritysten tuotteista, rahoituksesta ja markkina-asemasta.'
                },
                {
                  title: 'Reaaliaikainen data',
                  description: 'Pääsy ajantasaisiin tietoihin useista luotettavista lähteistä, mukaan lukien YTJ ja PRH.'
                },
                {
                  title: 'Älykäs kilpailija-analyysi',
                  description: 'Vertaile yrityksiä ja ymmärrä markkinatrendejä suomalaisessa liiketoimintaympäristössä.'
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 bg-white rounded-xl border border-gray-100
                           hover:border-brand-default/20 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-gray-50 border-t mt-24">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Tietoa palvelusta</h3>
              <p className="text-gray-600">
                Yritystutkimus on suunniteltu erityisesti suomalaisten yritysten analysointiin ja vertailuun.
                Powered by Exa.ai.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Ominaisuudet</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Yritysanalyysi</li>
                <li>Kilpailija-analyysi</li>
                <li>Markkinatutkimus</li>
                <li>Rahoitustiedot</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Yhteystiedot</h3>
              <p className="text-gray-600">
                Ota yhteyttä saadaksesi lisätietoja palvelusta.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}