import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const QUESTIONS = [
  { id: 1, category: 'Economy & Work', question: 'Do you support the transition to a 4-day work week?' },
  { id: 2, category: 'Technology', question: 'Should Artificial Intelligence be strictly regulated by global laws?' },
  { id: 3, category: 'Environment', question: 'Should nuclear energy be the primary source of clean energy in the future?' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [userCountry, setUserCountry] = useState<any>(null);
  
  const [votes, setVotes] = useState<{ [key: number]: { yes: number; no: number; maybe: number } }>({
    0: { yes: 12, no: 5, maybe: 3 },
    1: { yes: 25, no: 2, maybe: 4 },
    2: { yes: 18, no: 10, maybe: 7 },
  });

  const [comments, setComments] = useState<{ [key: number]: string[] }>({
    0: ['Great initiative for work-life balance!', 'Needs careful economic testing.'],
    1: ['Regulation is necessary to prevent misuse.', 'Innovation might get slowed down.'],
    2: ['Safest and most stable green energy option.', 'Nuclear waste remains a big concern.'],
  });
  const [newCommentText, setNewCommentText] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        const savedUser = localStorage.getItem('world_wide_user_country');
        if (!savedUser) {
          router.replace('/welcome');
        } else {
          setUserCountry(JSON.parse(savedUser));
        }

        const savedVotes = localStorage.getItem('world_wide_votes');
        if (savedVotes) setVotes(JSON.parse(savedVotes));

        const savedComments = localStorage.getItem('world_wide_comments');
        if (savedComments) setComments(JSON.parse(savedComments));
      } catch (e) {
        console.error('Error loading data', e);
      }
    }
  }, []);

  const handleVote = (qIndex: number, type: 'yes' | 'no' | 'maybe') => {
    const updatedVotes = {
      ...votes,
      [qIndex]: {
        ...votes[qIndex],
        [type]: (votes[qIndex]?.[type] || 0) + 1,
      },
    };
    setVotes(updatedVotes);

    if (Platform.OS === 'web') {
      try {
        localStorage.setItem('world_wide_votes', JSON.stringify(updatedVotes));
      } catch (e) {
        console.error('Error saving vote', e);
      }
    }
  };

  const handleAddComment = (qIndex: number) => {
    const text = newCommentText[qIndex]?.trim();
    if (!text) return;

    const countryPrefix = userCountry ? `[${userCountry.name}] ` : '';
    const updatedComments = {
      ...comments,
      [qIndex]: [...(comments[qIndex] || []), countryPrefix + text],
    };

    setComments(updatedComments);
    setNewCommentText({ ...newCommentText, [qIndex]: '' });

    if (Platform.OS === 'web') {
      try {
        localStorage.setItem('world_wide_comments', JSON.stringify(updatedComments));
      } catch (e) {
        console.error('Error saving comment', e);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerCard}>
          <Text style={styles.logo}>🌐 World Wide Vote</Text>
          {userCountry && (
            <View style={styles.countryBadge}>
              <Text style={styles.countryBadgeText}>Home Location: {userCountry.name}</Text>
            </View>
          )}
        </View>

        {QUESTIONS.map((q, index) => {
          const qVotes = votes[index] || { yes: 0, no: 0, maybe: 0 };
          const total = qVotes.yes + qVotes.no + qVotes.maybe;
          const yesPct = total > 0 ? Math.round((qVotes.yes / total) * 100) : 0;
          const noPct = total > 0 ? Math.round((qVotes.no / total) * 100) : 0;
          const maybePct = total > 0 ? Math.round((qVotes.maybe / total) * 100) : 0;

          return (
            <View key={q.id} style={styles.pollCard}>
              <Text style={styles.categoryBadge}>{q.category}</Text>
              <Text style={styles.questionText}>{q.question}</Text>

              <View style={styles.voteButtonsRow}>
                <TouchableOpacity style={[styles.voteBtn, styles.yesBtn]} onPress={() => handleVote(index, 'yes')}>
                  <Text style={styles.voteBtnText}>YES 👍 ({qVotes.yes})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.voteBtn, styles.noBtn]} onPress={() => handleVote(index, 'no')}>
                  <Text style={styles.voteBtnText}>NO 👎 ({qVotes.no})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.voteBtn, styles.maybeBtn]} onPress={() => handleVote(index, 'maybe')}>
                  <Text style={styles.voteBtnText}>MAYBE 🤔 ({qVotes.maybe})</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.miniProgressContainer}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.barYes, { width: `${yesPct}%` }]} />
                  <View style={[styles.barNo, { width: `${noPct}%` }]} />
                  <View style={[styles.barMaybe, { width: `${maybePct}%` }]} />
                </View>
                <Text style={styles.progressText}>Total votes: {total} ({yesPct}% Yes)</Text>
              </View>

              <View style={styles.commentsSection}>
                <Text style={styles.commentsTitle}>💬 Global Discussion ({comments[index]?.length || 0})</Text>
                
                {comments[index]?.map((c, cIdx) => (
                  <View key={cIdx} style={styles.commentBubble}>
                    <Text style={styles.commentText}>{c}</Text>
                  </View>
                ))}

                <View style={styles.commentInputRow}>
                  <TextInput 
                    style={styles.commentInput}
                    placeholder="Add your opinion..."
                    placeholderTextColor="#94a3b8"
                    value={newCommentText[index] || ''}
                    onChangeText={(txt) => setNewCommentText({ ...newCommentText, [index]: txt })}
                  />
                  <TouchableOpacity style={styles.commentSendBtn} onPress={() => handleAddComment(index)}>
                    <Text style={styles.commentSendText}>Post</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.bottomSection}>
          <Link href="/suggestions" asChild>
            <TouchableOpacity style={styles.suggestionNavBtn}>
              <Text style={styles.suggestionNavBtnText}>💡 Suggest & Vote Questions</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/stats" asChild>
            <TouchableOpacity style={styles.statsButton}>
              <Text style={styles.statsButtonText}>📊 View Global & Country Statistics</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  scroll: { padding: 20, alignItems: 'center' },
  headerCard: { width: '100%', maxWidth: 500, alignItems: 'center', marginBottom: 20 },
  logo: { fontSize: 26, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 8 },
  countryBadge: { backgroundColor: '#dbeafe', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#bfdbfe' },
  countryBadgeText: { fontSize: 13, fontWeight: '600', color: '#1e40af' },
  pollCard: { backgroundColor: '#ffffff', width: '100%', maxWidth: 500, padding: 20, borderRadius: 16, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  categoryBadge: { alignSelf: 'flex-start', fontSize: 11, fontWeight: 'bold', color: '#2563eb', backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 8 },
  questionText: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 14, lineHeight: 22 },
  voteButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6, marginBottom: 12 },
  voteBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  yesBtn: { backgroundColor: '#10b981' },
  noBtn: { backgroundColor: '#ef4444' },
  maybeBtn: { backgroundColor: '#f59e0b' },
  voteBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  miniProgressContainer: { marginBottom: 16 },
  progressBarBg: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, flexDirection: 'row', overflow: 'hidden', marginBottom: 4 },
  barYes: { height: '100%', backgroundColor: '#10b981' },
  barNo: { height: '100%', backgroundColor: '#ef4444' },
  barMaybe: { height: '100%', backgroundColor: '#f59e0b' },
  progressText: { fontSize: 11, color: '#64748b', textAlign: 'right' },
  commentsSection: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  commentsTitle: { fontSize: 13, fontWeight: 'bold', color: '#334155', marginBottom: 8 },
  commentBubble: { backgroundColor: '#f8fafc', padding: 8, borderRadius: 8, marginBottom: 6, borderWidth: 1, borderColor: '#e2e8f0' },
  commentText: { fontSize: 12, color: '#475569' },
  commentInputRow: { flexDirection: 'row', marginTop: 6, gap: 6 },
  commentInput: { flex: 1, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 10, height: 36, fontSize: 12, color: '#1e293b' },
  commentSendBtn: { backgroundColor: '#2563eb', justifyContent: 'center', paddingHorizontal: 14, borderRadius: 8 },
  commentSendText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  bottomSection: { width: '100%', maxWidth: 500, marginTop: 10, marginBottom: 30, gap: 10, alignItems: 'center' },
  suggestionNavBtn: { backgroundColor: '#7c3aed', width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  suggestionNavBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  statsButton: { backgroundColor: '#1e3a8a', width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  statsButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 }
});