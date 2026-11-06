import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COUNTRIES } from './welcome';

const QUESTIONS = [
  { id: 1, category: 'Economy & Work', question: 'Do you support the transition to a 4-day work week?' },
  { id: 2, category: 'Technology', question: 'Should Artificial Intelligence be strictly regulated by global laws?' },
  { id: 3, category: 'Environment', question: 'Should nuclear energy be the primary source of clean energy in the future?' },
];

export default function StatsScreen() {
  const [votes, setVotes] = useState<{ [key: number]: { yes: number; no: number; maybe: number } }>({
    0: { yes: 12, no: 5, maybe: 3 },
    1: { yes: 25, no: 2, maybe: 4 },
    2: { yes: 18, no: 10, maybe: 7 },
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        const savedVotes = localStorage.getItem('world_wide_votes');
        if (savedVotes) setVotes(JSON.parse(savedVotes));
      } catch (e) {
        console.error('Error loading stats', e);
      }
    }
  }, []);

  let totalGlobalVotes = 0;
  let totalYes = 0;
  let totalNo = 0;
  let totalMaybe = 0;

  Object.values(votes).forEach(v => {
    totalYes += v.yes;
    totalNo += v.no;
    totalMaybe += v.maybe;
    totalGlobalVotes += (v.yes + v.no + v.maybe);
  });

  const getPercentage = (count: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>📊 Global & Country Statistics</Text>
        <Text style={styles.subtitle}>Comprehensive transparency breakdown of worldwide votes</Text>

        {/* Global Summary Card */}
        <View style={styles.globalCard}>
          <Text style={styles.globalCardTitle}>Total Recorded Global Votes</Text>
          <Text style={styles.globalNumber}>{totalGlobalVotes}</Text>
          <View style={styles.globalSummaryRow}>
            <Text style={styles.summaryText}>YES: {totalYes} ({getPercentage(totalYes, totalGlobalVotes)}%)</Text>
            <Text style={styles.summaryText}>NO: {totalNo} ({getPercentage(totalNo, totalGlobalVotes)}%)</Text>
            <Text style={styles.summaryText}>MAYBE: {totalMaybe} ({getPercentage(totalMaybe, totalGlobalVotes)}%)</Text>
          </View>
        </View>

        {/* Polls Breakdown */}
        {QUESTIONS.map((q, index) => {
          const qVotes = votes[index] || { yes: 0, no: 0, maybe: 0 };
          const qTotal = qVotes.yes + qVotes.no + qVotes.maybe;

          return (
            <View key={q.id} style={styles.card}>
              <Text style={styles.categoryBadge}>{q.category}</Text>
              <Text style={styles.questionText}>{q.question}</Text>

              <View style={styles.statRow}>
                <Text style={styles.statLabel}>YES: {qVotes.yes} ({getPercentage(qVotes.yes, qTotal)}%)</Text>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${getPercentage(qVotes.yes, qTotal)}%`, backgroundColor: '#10b981' }]} />
                </View>
              </View>

              <View style={styles.statRow}>
                <Text style={styles.statLabel}>NO: {qVotes.no} ({getPercentage(qVotes.no, qTotal)}%)</Text>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${getPercentage(qVotes.no, qTotal)}%`, backgroundColor: '#ef4444' }]} />
                </View>
              </View>

              <View style={styles.statRow}>
                <Text style={styles.statLabel}>MAYBE: {qVotes.maybe} ({getPercentage(qVotes.maybe, qTotal)}%)</Text>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${getPercentage(qVotes.maybe, qTotal)}%`, backgroundColor: '#f59e0b' }]} />
                </View>
              </View>

              <Text style={styles.cardTotal}>Total for this poll: {qTotal}</Text>
            </View>
          );
        })}

        {/* Country Breakdown Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🌍 Registered Countries & Network Participation</Text>
          <Text style={styles.sectionSub}>All {COUNTRIES.length} global nations participating in the network:</Text>
          
          <View style={styles.countryListGrid}>
            {COUNTRIES.map(c => (
              <View key={c.code} style={styles.countryRow}>
                <Text style={styles.countryName}>{c.name}</Text>
                <Text style={styles.countryStatus}>Active 🟢</Text>
              </View>
            ))}
          </View>
        </View>

        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>⬅️ Back to Voting</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  scroll: { padding: 20, alignItems: 'center', justifyContent: 'center', flexGrow: 1 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 5, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#64748b', marginBottom: 20, textAlign: 'center' },
  globalCard: { backgroundColor: '#1e3a8a', width: '100%', maxWidth: 500, padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  globalCardTitle: { color: '#93c5fd', fontSize: 14, fontWeight: '600', marginBottom: 5 },
  globalNumber: { color: '#ffffff', fontSize: 36, fontWeight: 'bold', marginBottom: 15 },
  globalSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  summaryText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  card: { backgroundColor: '#ffffff', width: '100%', maxWidth: 500, padding: 20, borderRadius: 16, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  sectionSub: { fontSize: 12, color: '#64748b', marginBottom: 14 },
  countryListGrid: { gap: 8 },
  countryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  countryName: { fontSize: 13, fontWeight: '600', color: '#334155' },
  countryStatus: { fontSize: 12, color: '#10b981', fontWeight: 'bold' },
  categoryBadge: { alignSelf: 'flex-start', fontSize: 11, fontWeight: 'bold', color: '#2563eb', backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 8 },
  questionText: { fontSize: 15, fontWeight: '600', color: '#1e293b', marginBottom: 12 },
  statRow: { marginVertical: 4 },
  statLabel: { fontSize: 13, color: '#475569', fontWeight: '500', marginBottom: 3 },
  barBg: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  cardTotal: { fontSize: 12, color: '#64748b', textAlign: 'right', marginTop: 10, fontStyle: 'italic' },
  backButton: { backgroundColor: '#2563eb', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, marginTop: 10, marginBottom: 20 },
  backButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 }
});