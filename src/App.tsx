/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/ToastContainer';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { AIChefModal } from './components/AIChefModal';

import { HomeView } from './views/HomeView';
import { RegionsView } from './views/RegionsView';
import { FavoritesView } from './views/FavoritesView';
import { ShoppingListView } from './views/ShoppingListView';
import { ProfileView } from './views/ProfileView';
import { TableSearchView } from './views/TableSearchView';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-amber-50/40 dark:bg-amber-950/80 text-amber-950 dark:text-amber-50 font-sans transition-colors duration-300 selection:bg-amber-500 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main View Container */}
      <main className="max-w-5xl mx-auto px-4 pt-4 pb-24 min-h-[calc(100vh-120px)]">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'table-search' && <TableSearchView />}
        {activeTab === 'regions' && <RegionsView />}
        {activeTab === 'favorites' && <FavoritesView />}
        {activeTab === 'shopping' && <ShoppingListView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Bottom Sticky Navigation */}
      <BottomNav />

      {/* Global Modals & Toasts */}
      <RecipeDetailModal />
      <AIChefModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  return (
    <AppProvider>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <MainLayout />
      )}
    </AppProvider>
  );
}
