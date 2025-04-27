import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { styles } from '../styles/HomeStyles';
import ProfileScreen from './ProfileScreen';
import HomeHeaderAndSearch from '../components/home/HomeHeaderAndSearch';
import HomeContent from '../components/home/HomeContent';
import { OpenFoodFactsApi, Product } from '../services/openFoodFactsApi';

interface User {
  id?: string;
  name?: string;
  email?: string;
  language?: string;
  trialPeriodDays?: number;
}

interface HomeScreenProps {
  user?: User;
  onLogout?: () => void;
}

export default function HomeScreen({ user, onLogout }: HomeScreenProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const performSearch = async (text: string) => {
    if (text.trim().length > 2) {
      setIsSearching(true);
      try {
        const response = await OpenFoodFactsApi.searchProducts(text);
        setSearchResults(response.products || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      performSearch(text);
    }, 3000);
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchResults([]);
    setIsSearchFocused(false);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
  };

  const handleProductSelect = (product: Product) => {
    console.log('Selected product:', product);
  };

  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <HomeHeaderAndSearch
          searchText={searchText}
          onSearchTextChange={handleSearch}
          onClearSearch={clearSearch}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => {
            if (!searchText) setIsSearchFocused(false);
          }}
          onProfilePress={() => setShowProfile(true)}
        />

        <HomeContent
          isSearchFocused={isSearchFocused}
          isSearching={isSearching}
          searchText={searchText}
          searchResults={searchResults}
          onProductSelect={handleProductSelect}
        />
      </ScrollView>

      {showProfile && user && (
        <ProfileScreen
          user={{
            _id: user.id || '',
            userID: user.id || '',
            name: user.name || '',
            email: user.email || '',
            language: user.language || 'en',
            trialPeriodDays: user.trialPeriodDays || 5,
          }}
          onLogout={() => {
            setShowProfile(false);
            onLogout?.();
          }}
          onClose={() => setShowProfile(false)}
        />
      )}
    </SafeAreaView>
  );
}
