/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setSelectedGame(null);
              setActiveCategory('All');
              setSearchQuery('');
            }}
          >
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tighter hidden sm:block">
              UNBLOCKED<span className="text-purple-500">GAMES</span>
            </h1>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-white/20"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 text-xs font-medium text-white/40 uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Online
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === cat 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Game Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedGame(game)}
                    className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 cursor-pointer hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/10"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          PLAY NOW <Maximize2 className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors">{game.title}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-white/60">
                          {game.category}
                        </span>
                      </div>
                      <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">
                        {game.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-white/20" />
                  </div>
                  <h3 className="text-xl font-medium text-white/60">No games found</h3>
                  <p className="text-white/40">Try searching for something else</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Back to Hub
                </button>
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold">{selectedGame.title}</h2>
                  <span className="bg-purple-600/20 text-purple-400 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/20">
                    {selectedGame.category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/5">
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-0"
                  allowFullScreen
                  title={selectedGame.title}
                />
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-2">About {selectedGame.title}</h3>
                <p className="text-white/60 leading-relaxed">
                  {selectedGame.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Controls</span>
                    <span className="text-sm text-white/70">Keyboard & Mouse</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Platform</span>
                    <span className="text-sm text-white/70">Web Browser</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-40">
            <Gamepad2 className="w-5 h-5" />
            <span className="font-bold tracking-tighter">UNBLOCKED GAMES HUB</span>
          </div>
          <div className="flex gap-8 text-sm text-white/40 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-xs text-white/20">
            © 2026 Unblocked Games Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
