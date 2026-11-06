import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Suggestion {
  id: string;
  question: string;
  category: string;
  votes: number;
  submittedBy: string;
}

export default function SuggestionsScreen() {
  const [userCountry, setUserCountry] = useState<any>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [category, setCategory] = useState('General');
  
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    { id: '1', question: 'Should universal basic income (UBI) be tested worldwide?', category: 'Economy', votes: 42, submittedBy: 'Canada 🇨🇦' },
    { id: '2', question: 'Should space exploration budget be doubled globally?', category: 'Science', votes: 38, submittedBy: 'Germany 🇩🇪' },
    { id: '3', question: 'Should social media access be restricted for under 16s globally?', category: 'Technology', votes: 29, submittedBy: 'Sweden 🇸🇪' },
  ]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        const savedUser = localStorage.getItem('world_wide_user_country');
        if (savedUser) setUserCountry(JSON.parse(savedUser));

        const savedSuggestions = localStorage.getItem('world_wide_suggestions');
        if (savedSuggestions) setSuggestions(JSON.parse(savedSuggestions));
      } catch (e) {
        console.error('Error loading suggestions', e);
      }
    }
  }, []);

  const handleAddSuggestion = () => {
    if (!newQuestion.trim()) return;

    const newEntry: Suggestion = {
      id: Date.now().toString(),
      question: newQuestion.trim(),
      category: category,
      votes: 1,
      submittedBy: userCountry ? userCountry.name : 'Global Citizen',
    };

    const updated = [newEntry, ...suggestions];
    setSuggestions(updated);
    setNewQuestion('');

    if (Platform.OS === 'web') {
      try {
        localStorage.setItem('world_wide_suggestions', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving suggestion', e);
      }
    }
  };

  const handleUpvote = (id: string) => {
    const updated = suggestions.map(item => {
      if (item.id === id) {
        return { ...item, votes: item.votes + 1 };
      }
      return item;
    });

    // Re-sort by votes
    updated.sort((a, b) => b.votes - a.votes);

    setSuggestions(updated);
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem('world_wide_suggestions', JSON.stringify(updated));
      } catch (e) {
        console.error('Error updating vote', e);
      }
    }
  };

  // Sort display array by votes descending
  const sortedSuggestions = [...suggestions].sort((a, b) => b.votes - a.votes);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>💡 Suggest & Vote Questions</Text>
        <Text style={styles.subtitle}>
          Top 5 voted questions will be selected for next week's global voting!
        </Text>

        {/* Submission Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Suggest a New Question</Text>
          
          <TextInput 
            style={styles.input}
            placeholder="What important question should the world vote on?"
            placeholderTextColor="#94a3b8"
            value={newQuestion}
            onChangeText={setNewQuestion}
          />

          <View style={styles.categoryRow}>
            {['General', 'Economy', 'Technology', 'Environment'].map((cat) => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.catChip, category === cat && styles.catChipActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleAddSuggestion}>
            <Text style={styles.submitBtnText}>Submit Suggestion ✨</Text>
          </TouchableOpacity>
        </View>

        {/* Suggestions List */}
        <View style={styles.listSection}>
          <Text style={styles.sectionHeader}>🔥 Candidate Questions for Next Week</Text>

          {sortedSuggestions.map((item, index) => {
            const isTop5 = index < 5;

            return (
              <View key={item.id} style={[styles.suggestionCard, isTop5 && styles.top5Card]}>
                {isTop5 && (
                  <View style={styles.topBadge}>
                    <Text style={styles.topBadgeText}>🔥 TOP {index + 1} candidate</Text>
                  </View>
                )}

                <View style={styles.cardHeader}>
                  <Text style={styles.catBadge}>{item.category}</Text>
                  <Text style={styles.authorText}>Proposed by {item.submittedBy}</Text>
                </View>

                <Text style={styles.questionText}>{item.question}</Text>

                <View style={styles.voteRow}>
                  <TouchableOpacity style={styles.heartBtn} onPress={() => handleUpvote(item.id)}>
                    <Text style={styles.heartText}>❤️ {item.votes} votes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>⬅️ Back to Home</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  scroll: { padding: 20, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 5, textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: 20, textAlign: 'center', maxWidth: 480 },
  formCard: { backgroundColor: '#ffffff', width: '100%', maxWidth: 500, padding: 18, borderRadius: 16, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  formTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 12, fontSize: 13, color: '#1e293b', marginBottom: 12 },
  categoryRow: { flexDirection: 'row', gap: 6, marginBottom: 12, flexWrap: 'wrap' },
  catChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, backgroundColor: '#f1f5f9' },
  catChipActive: { backgroundColor: '#2563eb' },
  catChipText: { fontSize: 11, color: '#64748b', fontWeight: '600' },
  catChipTextActive: { color: '#ffffff' },
  submitBtn: { backgroundColor: '#1e3a8a', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  submitBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  listSection: { width: '100%', maxWidth: 500 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 12 },
  suggestionCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  top5Card: { borderColor: '#bfdbfe', backgroundColor: '#faf5ff' },
  topBadge: { alignSelf: 'flex-start', backgroundColor: '#7c3aed', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 8 },
  topBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  catBadge: { fontSize: 10, fontWeight: 'bold', color: '#2563eb', backgroundColor: '#eff6ff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  authorText: { fontSize: 11, color: '#94a3b8' },
  questionText: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 10 },
  voteRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  heartBtn: { backgroundColor: '#fef2f2', borderBottomColor: '#fecaca', borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  heartText: { color: '#ef4444', fontWeight: 'bold', fontSize: 12 },
  backButton: { backgroundColor: '#2563eb', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, marginTop: 10, marginBottom: 30 },
  backButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 }
});