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
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [researchData, setResearchData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [comparisonUrl, setComparisonUrl] = useState('');
  const [isComparing, setIsComparing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Fetch website content
      const websiteContent = await fetch('/api/scrapewebsiteurl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteurl: url })
      }).then(res => res.json());

      // Fetch subpages
      const subpagesContent = await fetch('/api/scrapewebsitesubpages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteurl: url })
      }).then(res => res.json());

      // Generate company summary
      const summary = await fetch('/api/companysummary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          websiteurl: url,
          mainpage: websiteContent.results[0],
          subpages: subpagesContent.results[0]
        })
      }).then(res => res.json());

      // Generate mind map
      const mindMap = await fetch('/api/companymap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          websiteurl: url,
          mainpage: websiteContent.results[0]
        })
      }).then(res => res.json());

      // Fetch all other data in parallel
      const [
        linkedin, github, twitter, twitterProfile, youtube, tiktok, reddit,
        news, competitors, wikipedia, financials, funding, founders,
        crunchbase, pitchbook, tracxn
      ] = await Promise.all([
        fetch('/api/scrapelinkedin', { method: 'POST', body: JSON.stringify({ websiteurl: url }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchgithuburl', { method: 'POST', body: JSON.stringify({ websiteurl: url }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/scraperecenttweets', { method: 'POST', body: JSON.stringify({ username: websiteContent.results[0]?.twitter_username }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/scrapetwitterprofile', { method: 'POST', body: JSON.stringify({ websiteurl: url }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchyoutubevideos', { method: 'POST', body: JSON.stringify({ websiteurl: url }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchtiktok', { method: 'POST', body: JSON.stringify({ websiteurl: url }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/scrapereddit', { method: 'POST', body: JSON.stringify({ websiteurl: url }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/findnews', { method: 'POST', body: JSON.stringify({ websiteurl: url }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/findcompetitors', { method: 'POST', body: JSON.stringify({ websiteurl: url, summaryText: summary.result }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchwikipedia', { method: 'POST', body: JSON.stringify({ websiteurl: url }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchfinancialreport', { method: 'POST', body: JSON.stringify({ websiteurl: url }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchfunding', { method: 'POST', body: JSON.stringify({ websiteurl: url }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchfounders', { method: 'POST', body: JSON.stringify({ websiteurl: url }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchcrunchbase', { method: 'POST', body: JSON.stringify({ websiteurl: url }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchpitchbook', { method: 'POST', body: JSON.stringify({ websiteurl: url }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json()),
        fetch('/api/fetchtracxn', { method: 'POST', body: JSON.stringify({ websiteurl: url }), headers: { 'Content-Type': 'application/json' } }).then(res => res.json())
      ]);

      setResearchData({
        summary: summary.result,
        mindMap: mindMap.result,
        linkedin: linkedin.results[0],
        github: github.results[0],
        twitter: twitter.results,
        twitterProfile: twitterProfile.results[0],
        youtube: youtube.results,
        tiktok: tiktok.results[0],
        reddit: reddit.results,
        news: news.results,
        competitors: competitors.results,
        wikipedia: wikipedia.results[0],
        financials: financials.results,
        funding: funding.results[0],
        founders: founders.results,
        crunchbase: crunchbase.results[0],
        pitchbook: pitchbook.results[0],
        tracxn: tracxn.results[0]
      });
    } catch (err) {
      setError('Tietojen haku epäonnistui. Yritä uudelleen.');
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
            Yritysten tutkimus helpommaksi
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Syötä yrityksen verkko-osoite saadaksesi kattavan analyysin sen tuotteista, rahoituksesta ja tiimistä.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Syötä yrityksen verkko-osoite (esim. google.com)"
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
                type="url"
                value={comparisonUrl}
                onChange={(e) => setComparisonUrl(e.target.value)}
                placeholder="Syötä kilpailijan verkko-osoite vertailua varten"
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
                <WikipediaDisplay data={researchData.wikipedia} websiteUrl={url} />
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
                  description: 'Saat yksityiskohtaista tietoa yrityksen tuotteista, rahoituksesta ja markkina-asemasta.'
                },
                {
                  title: 'Reaaliaikainen data',
                  description: 'Pääsy ajantasaisiin tietoihin useista luotettavista lähteistä.'
                },
                {
                  title: 'Älykäs kilpailija-analyysi',
                  description: 'Ymmärrä kilpailijoita, markkinatrendejä ja liiketoimintamahdollisuuksia.'
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
                Yritystutkimus on tehty helpottamaan yritysten analysointia ja vertailua.
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