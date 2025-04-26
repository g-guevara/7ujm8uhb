import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { styles } from '../styles/HomeStyles';
import ProfileScreen from './ProfileScreen';

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

interface SearchResult {
  id: string;
  name: string;
  type: 'product' | 'organic';
  category?: string;
}

// Sample search data - in a real app, this would come from your API
const sampleProducts: SearchResult[] = [
  { id: '1', name: 'FrostyCream', type: 'product' },
  { id: '2', name: 'NutriFlakes', type: 'product' },
  { id: '3', name: 'FizzUp', type: 'product' },
  { id: '4', name: 'Milk', type: 'organic', category: 'Dairy' },
  { id: '5', name: 'Apples', type: 'organic', category: 'Fruits' },
  { id: '6', name: 'Rice', type: 'organic', category: 'Grains' },
  { id: '7', name: 'Beans', type: 'organic', category: 'Legumes' },
  { id: '8', name: 'Chicken', type: 'organic', category: 'Meat' },
  { id: '9', name: 'Almonds', type: 'organic', category: 'Nuts' },
  { id: '10', name: 'Salmon', type: 'organic', category: 'Seafood' },
  { id: '11', name: 'Carrots', type: 'organic', category: 'Vegetables' },
];

export default function HomeScreen({ user, onLogout }: HomeScreenProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    if (!searchText) {
      setIsSearchFocused(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim()) {
      setIsSearching(true);
      // Simulate API call with timeout
      setTimeout(() => {
        const results = sampleProducts.filter(product => 
          product.name.toLowerCase().includes(text.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header with Home title and Profile icon */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Home</Text>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => setShowProfile(true)}
          >
            <Svg width={52} height={52} viewBox="0 0 24 24" fill="#000">
              <Path 
                fillRule="evenodd" 
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" 
                clipRule="evenodd" 
              />
            </Svg>
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}> 
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search" 
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={handleSearch}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
          {searchText ? (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={clearSearch}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        
        {isSearchFocused ? (
          // Search Results View
          <View style={styles.searchResultsContainer}>
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
              </View>
            ) : searchText && searchResults.length > 0 ? (
              searchResults.map((result) => (
                <TouchableOpacity 
                  key={result.id} 
                  style={styles.searchResultItem}
                >
                  <View style={styles.searchResultContent}>
                    <Text style={styles.searchResultText}>{result.name}</Text>
                    {result.category && (
                      <Text style={styles.searchResultCategory}>
                        {result.category}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.arrowIcon}>→</Text>
                </TouchableOpacity>
              ))
            ) : searchText ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No results found for "{searchText}"
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          // Home Content View
          <>
            <Text style={styles.sectionTitle}>Searched Products</Text>
            
            <TouchableOpacity style={styles.productItem}>
              <Text style={styles.productText}>FrostyCream</Text>
              <Text style={styles.arrowIcon}>→</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.productItem}>
              <Text style={styles.productText}>NutriFlakes</Text>
              <Text style={styles.arrowIcon}>→</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.productItem}>
              <Text style={styles.productText}>FizzUp</Text>
              <Text style={styles.arrowIcon}>→</Text>
            </TouchableOpacity>
            
            <Text style={styles.sectionTitle}>Organic Categories</Text>
            
            <View style={styles.categoriesContainer}>
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#FFCC66' }]}>
                <Text style={styles.categoryIcon}></Text>
                <Text style={styles.categoryText}>Dairy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#66CC99' }]}>
                <Text style={styles.categoryIcon}></Text>
                <Text style={styles.categoryText}>Fruits</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#FF8888' }]}>
                <Text style={styles.categoryIcon}></Text>
                <Text style={styles.categoryText}>Grains</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#77AAFF' }]}>
                <Text style={styles.categoryIcon}></Text>
                <Text style={styles.categoryText}>Legumes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#FFAA99' }]}>
                <Text style={styles.categoryIcon}></Text>
                <Text style={styles.categoryText}>Meat</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#AAAAAA' }]}>
                <Text style={styles.categoryIcon}></Text>
                <Text style={styles.categoryText}>Nuts</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#9999FF' }]}>
                <Text style={styles.categoryIcon}></Text>
                <Text style={styles.categoryText}>Seafood</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#88DDAA' }]}>
                <Text style={styles.categoryIcon}></Text>
                <Text style={styles.categoryText}>Vegetables</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Profile Screen Modal */}
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