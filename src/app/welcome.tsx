import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Lista svetskih zemalja sortirana po abecedi sa zastavama i jezičkim kodovima
export const COUNTRIES = [
  { code: 'AR', name: 'Argentina 🇦🇷', lang: 'en' },
  { code: 'AU', name: 'Australia 🇦🇺', lang: 'en' },
  { code: 'AT', name: 'Austria 🇦🇹', lang: 'de' },
  { code: 'BA', name: 'Bosnia and Herzegovina 🇧🇦', lang: 'sr' },
  { code: 'BR', name: 'Brazil 🇧🇷', lang: 'en' },
  { code: 'ME', name: 'Montenegro 🇲🇪', lang: 'sr' },
  { code: 'DK', name: 'Denmark 🇩🇰', lang: 'en' },
  { code: 'EG', name: 'Egypt 🇪🇬', lang: 'en' },
  { code: 'FI', name: 'Finland 🇫🇮', lang: 'en' },
  { code: 'FR', name: 'France 🇫🇷', lang: 'en' },
  { code: 'GR', name: 'Greece 🇬🇷', lang: 'en' },
  { code: 'NL', name: 'Netherlands 🇳🇱', lang: 'en' },
  { code: 'HR', name: 'Croatia 🇭🇷', lang: 'sr' },
  { code: 'IN', name: 'India 🇮🇳', lang: 'en' },
  { code: 'IT', name: 'Italy 🇮🇹', lang: 'en' },
  { code: 'ZA', name: 'South Africa 🇿🇦', lang: 'en' },
  { code: 'KR', name: 'South Korea 🇰🇷', lang: 'en' },
  { code: 'CA', name: 'Canada 🇨🇦', lang: 'en' },
  { code: 'CN', name: 'China 🇨🇳', lang: 'en' },
  { code: 'CO', name: 'Colombia 🇨🇴', lang: 'en' },
  { code: 'MX', name: 'Mexico 🇲🇽', lang: 'en' },
  { code: 'DE', name: 'Germany 🇩🇪', lang: 'de' },
  { code: 'NG', name: 'Nigeria 🇳🇬', lang: 'en' },
  { code: 'NO', name: 'Norway 🇳🇴', lang: 'en' },
  { code: 'NZ', name: 'New Zealand 🇳🇿', lang: 'en' },
  { code: 'PE', name: 'Peru 🇵🇪', lang: 'en' },
  { code: 'PL', name: 'Poland 🇵🇱', lang: 'en' },
  { code: 'PT', name: 'Portugal 🇵🇹', lang: 'en' },
  { code: 'MK', name: 'North Macedonia 🇲🇰', lang: 'sr' },
  { code: 'SG', name: 'Singapore 🇸🇬', lang: 'en' },
  { code: 'SI', name: 'Slovenia 🇸🇮', lang: 'sr' },
  { code: 'RS', name: 'Serbia 🇷🇸', lang: 'sr' },
  { code: 'SE', name: 'Sweden 🇸🇪', lang: 'en' },
  { code: 'CH', name: 'Switzerland 🇨🇭', lang: 'de' },
  { code: 'ES', name: 'Spain 🇪🇸', lang: 'en' },
  { code: 'CL', name: 'Chile 🇨🇱', lang: 'en' },
  { code: 'AE', name: 'United Arab Emirates 🇦🇪', lang: 'en' },
  { code: 'GB', name: 'United Kingdom 🇬🇧', lang: 'en' },
  { code: 'US', name: 'United States 🇺🇸', lang: 'en' },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);

  const handleConfirmLocation = () => {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem('world_wide_user_country', JSON.stringify(selectedCountry));
      } catch (e) {
        console.error('Error saving location', e);
      }
    }
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>🌐 World Wide Vote</Text>
        <Text style={styles.title}>Select Your Home Country</Text>
        <Text style={styles.subtitle}>
          The list is sorted alphabetically for easy search. Your vote will be recorded for your chosen location.
        </Text>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.countryList}>
          {COUNTRIES.map(c => (
            <TouchableOpacity 
              key={c.code}
              style={[styles.countryItem, selectedCountry.code === c.code && styles.selectedItem]}
              onPress={() => setSelectedCountry(c)}
            >
              <Text style={[styles.countryText, selectedCountry.code === c.code && styles.selectedText]}>
                {c.name}
              </Text>
              {selectedCountry.code === c.code && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmLocation}>
          <Text style={styles.confirmBtnText}>Confirm & Continue ➡️</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: '#ffffff', width: '100%', maxWidth: 480, height: '88%', padding: 24, borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 12, color: '#64748b', textAlign: 'center', marginBottom: 16, lineHeight: 16 },
  scrollView: { width: '100%', marginBottom: 16 },
  countryList: { paddingBottom: 10 },
  countryItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#f8fafc', marginBottom: 8 },
  selectedItem: { backgroundColor: '#eff6ff', borderColor: '#2563eb' },
  countryText: { fontSize: 14, fontWeight: '600', color: '#334155' },
  selectedText: { color: '#1e3a8a', fontWeight: 'bold' },
  checkmark: { color: '#2563eb', fontWeight: 'bold', fontSize: 16 },
  confirmBtn: { backgroundColor: '#1e3a8a', width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  confirmBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 }
});