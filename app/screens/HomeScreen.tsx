import React from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TextInput, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { styles } from '../styles/HomeStyles';

interface User {
  // Add your user interface properties here
  id?: string;
  name?: string;
  email?: string;
}

interface HomeScreenProps {
  user?: User;
  onLogout?: () => void;
}

export default function HomeScreen({ user, onLogout }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header with Home title and Profile icon */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Home</Text>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={onLogout}
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
            placeholder="Search..." 
            placeholderTextColor="#999" 
          /> 
        </View>
        
        <Text style={styles.sectionTitle}>Most Searched Products</Text>
        
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
      </ScrollView>
    </SafeAreaView>
  );
}