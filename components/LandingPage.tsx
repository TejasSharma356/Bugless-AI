import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { Button } from './ui/Button';

interface LandingPageProps {
  onNavigateToSignUp: () => void;
  onNavigateToLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToSignUp, onNavigateToLogin }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header/Navigation */}
      <header className="py-6 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <LogoIcon className="h-8 w-8 text-white" />
            <span className="ml-3 text-xl font-semibold text-white">BuglessAI</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm">
            <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
            <a href="#reviews" className="text-gray-400 hover:text-white transition-colors">Reviews</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onNavigateToLogin} 
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Log in
            </button>
            <button 
              onClick={onNavigateToSignUp} 
              className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="relative px-6 lg:px-12 py-20 lg:py-32 overflow-hidden min-h-[90vh]">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-4xl mx-auto lg:mx-0 mb-16 lg:mb-20 text-center lg:text-left relative z-20">
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              BuglessAI is a purpose-built tool for finding and fixing bugs
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0">
              Meet the AI-powered code review system for modern software development. Streamline bug detection, code quality, and security analysis.
            </p>
          </div>
        </div>
        
        {/* Embedded Code Editor - Behind Text with Fade Effect */}
        <div 
          className="absolute right-0 top-[8%] lg:top-[3%] w-[70%] lg:w-[75%] max-w-6xl h-[900px] lg:h-[1100px] pointer-events-none"
          style={{
            transform: 'perspective(2000px) rotateY(-10deg) rotateX(1deg)',
            transformStyle: 'preserve-3d',
            transformOrigin: 'right center',
            zIndex: 1,
            opacity: 0.65,
          }}
        >
          <div className="relative w-full h-full">
            {/* Fade gradient overlay on left edge */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-2/5 z-20 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)',
              }}
            ></div>
            
            <div className="w-full h-full bg-gray-900/90 border border-gray-800/50 rounded-xl overflow-hidden backdrop-blur-sm" style={{
              boxShadow: '0 60px 120px -30px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}>
              {/* Code Editor Header */}
              <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-xs text-gray-400 font-mono">code-review.js</div>
              </div>
              
              {/* Code Content - Extended */}
              <div className="p-6 font-mono text-sm leading-relaxed h-full overflow-y-auto">
                <pre className="text-gray-300">
                  <code>
                    <span className="text-blue-400">function</span> <span className="text-yellow-300">analyzeCode</span><span className="text-white">(</span><span className="text-purple-400">code</span><span className="text-white">)</span> <span className="text-white">{'{'}</span>{'\n'}
                    <span className="text-gray-500">  // AI-powered analysis</span>{'\n'}
                    <span className="text-blue-400">  const</span> <span className="text-yellow-300">issues</span> <span className="text-white">=</span> <span className="text-yellow-300">findBugs</span><span className="text-white">(</span><span className="text-purple-400">code</span><span className="text-white">);</span>{'\n'}
                    <span className="text-blue-400">  const</span> <span className="text-yellow-300">suggestions</span> <span className="text-white">=</span> <span className="text-yellow-300">generateFixes</span><span className="text-white">(</span><span className="text-purple-400">issues</span><span className="text-white">);</span>{'\n'}
                    {'\n'}
                    <span className="text-blue-400">  return</span> <span className="text-white">{'{'}</span>{'\n'}
                    <span className="text-white">    </span><span className="text-yellow-300">score</span><span className="text-white">:</span> <span className="text-green-400">85</span><span className="text-white">,</span>{'\n'}
                    <span className="text-white">    </span><span className="text-yellow-300">issues</span><span className="text-white">,</span>{'\n'}
                    <span className="text-white">    </span><span className="text-yellow-300">suggestions</span>{'\n'}
                    <span className="text-white">  {'}'};</span>{'\n'}
                    <span className="text-white">{'}'}</span>{'\n'}
                    {'\n'}
                    <span className="text-gray-500">// Security vulnerability detected</span>{'\n'}
                    <span className="text-red-400">if</span> <span className="text-white">(</span><span className="text-purple-400">userInput</span><span className="text-white">) {'{'}</span>{'\n'}
                    <span className="text-yellow-300">  executeSQL</span><span className="text-white">(</span><span className="text-purple-400">userInput</span><span className="text-white">);</span>{'\n'}
                    <span className="text-white">  </span><span className="text-gray-500">// ⚠️ SQL injection risk</span>{'\n'}
                    <span className="text-white">{'}'}</span>{'\n'}
                    {'\n'}
                    <span className="text-blue-400">function</span> <span className="text-yellow-300">optimizePerformance</span><span className="text-white">() {'{'}</span>{'\n'}
                    <span className="text-blue-400">  const</span> <span className="text-yellow-300">cache</span> <span className="text-white">=</span> <span className="text-blue-400">new</span> <span className="text-yellow-300">Map</span><span className="text-white">();</span>{'\n'}
                    <span className="text-blue-400">  return</span> <span className="text-yellow-300">cache</span><span className="text-white">;</span>{'\n'}
                    <span className="text-white">{'}'}</span>{'\n'}
                    {'\n'}
                    <span className="text-gray-500">// Review completed ✅</span>{'\n'}
                    <span className="text-green-400">console</span><span className="text-white">.</span><span className="text-yellow-300">log</span><span className="text-white">(</span><span className="text-green-300">'Analysis finished'</span><span className="text-white">);</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* About Section */}
      <section id="about" className="px-6 lg:px-12 py-24 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">About Bugless</h2>
          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              BuglessAI is an AI-powered code review platform designed to help developers identify and fix issues before they reach production. Our advanced AI analyzes your code for logic errors, performance bottlenecks, security vulnerabilities, and style inconsistencies.
            </p>
            <p>
              Built with modern development workflows in mind, Bugless provides instant feedback on your code, helping you ship higher-quality software faster. Whether you're working on a solo project or collaborating with a team, Bugless adapts to your development process.
            </p>
            <p>
              We leverage state-of-the-art AI models to provide comprehensive code analysis that goes beyond traditional linting. Get detailed explanations, corrected code suggestions, and actionable improvements tailored to your programming language and style.
            </p>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section id="reviews" className="px-6 lg:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center">What developers are saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-cyan-400 font-semibold">JD</span>
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">John Doe</p>
                  <p className="text-gray-400 text-sm">Senior Developer</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                "Bugless has transformed how I review code. The AI catches issues I would have missed, and the suggestions are always spot-on. It's like having a senior developer reviewing every commit."
              </p>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-cyan-400 font-semibold">SM</span>
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">Sarah Miller</p>
                  <p className="text-gray-400 text-sm">Tech Lead</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                "The instant feedback loop is incredible. We've reduced our bug rate by 60% since integrating Bugless into our workflow. The security analysis alone has saved us multiple times."
              </p>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-cyan-400 font-semibold">AK</span>
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">Alex Kumar</p>
                  <p className="text-gray-400 text-sm">Full Stack Developer</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                "As a solo developer, having AI-powered code reviews has been a game-changer. Bugless helps me maintain code quality without slowing down my development pace."
              </p>
            </div>
          </div>
          </div>
        </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <LogoIcon className="h-6 w-6 text-white" />
            <span className="ml-2 text-sm text-gray-400">Bugless</span>
          </div>
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Bugless. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
