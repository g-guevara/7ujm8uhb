import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { styles } from '../styles/HomeStyles';
import ProfileScreen from './ProfileScreen';
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

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    if (!searchText) {
      setIsSearchFocused(false);
    }
  };

  const handleSearch = async (text: string) => {
    setSearchText(text);
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

  const clearSearch = () => {
    setSearchText('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  const handleProductSelect = async (product: Product) => {
    // Here you can add navigation to a product detail screen
    console.log('Selected product:', product);
    // You can also fetch full product details if needed:
    // const fullProduct = await OpenFoodFactsApi.getProductByBarcode(product.code);
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
            placeholder="Search products..." 
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
            ) : searchText.length > 2 && searchResults.length > 0 ? (
              searchResults.map((product) => (
                <TouchableOpacity 
                  key={product.code} 
                  style={styles.searchResultItem}
                  onPress={() => handleProductSelect(product)}
                >
                  <View style={styles.productImageContainer}>
                    {product.image_small_url ? (
                      <Image 
                        source={{ uri: product.image_small_url }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>No Image</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.searchResultContent}>
                    <Text style={styles.searchResultText} numberOfLines={2}>
                      {product.product_name || 'Unknown Product'}
                    </Text>
                    {product.brands && (
                      <Text style={styles.searchResultBrand} numberOfLines={1}>
                        {product.brands}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.arrowIcon}>→</Text>
                </TouchableOpacity>
              ))
            ) : searchText.length > 2 ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No results found for "{searchText}"
                </Text>
              </View>
            ) : searchText ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  Type at least 3 characters to search
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          // Home Content View
          <>
            <Text style={styles.sectionTitle}>Recently Searched</Text>
            
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
            
            <Text style={styles.sectionTitle}>Food Categories</Text>
            
            <View style={styles.categoriesContainer}>
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#FFCC66' }]}>
                <Text style={styles.categoryIcon}>🥛</Text>
                <Text style={styles.categoryText}>Dairy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#66CC99' }]}>
                <Text style={styles.categoryIcon}>🍎</Text>
                <Text style={styles.categoryText}>Fruits</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#FF8888' }]}>
                <Text style={styles.categoryIcon}>🌾</Text>
                <Text style={styles.categoryText}>Grains</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#77AAFF' }]}>
                <Text style={styles.categoryIcon}>🫘</Text>
                <Text style={styles.categoryText}>Legumes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#FFAA99' }]}>
                <Text style={styles.categoryIcon}>🥩</Text>
                <Text style={styles.categoryText}>Meat</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#AAAAAA' }]}>
                <Text style={styles.categoryIcon}>🥜</Text>
                <Text style={styles.categoryText}>Nuts</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#9999FF' }]}>
                <Text style={styles.categoryIcon}>🐟</Text>
                <Text style={styles.categoryText}>Seafood</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#88DDAA' }]}>
                <Text style={styles.categoryIcon}>🥬</Text>
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