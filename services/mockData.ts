
import { Exam, UserRole, User, Question } from '../types';

export const MOCK_USER: User = {
  id: 'u1',
  email: 'student@studyflow.pro',
  name: 'Alex Johnson',
  role: UserRole.STUDENT,
  avatar: 'https://picsum.photos/seed/alex/100/100'
};

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q1',
    topic: 'Data Structures',
    content: 'What is the time complexity of searching for an element in a Balanced Binary Search Tree?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
    correctOption: 2,
    explanation: 'A balanced BST ensures the height is logarithmic to the number of nodes.',
    weight: 1
  },
  {
    id: 'q2',
    topic: 'Operating Systems',
    content: 'Which of the following is not a process state?',
    options: ['New', 'Running', 'Waiting', 'Executing'],
    correctOption: 3,
    explanation: 'Process states are New, Ready, Running, Waiting, and Terminated. Executing is a conceptual term but not a state name.',
    weight: 1
  },
  {
    id: 'q3',
    topic: 'Computer Networks',
    content: 'Which layer of the OSI model is responsible for routing?',
    options: ['Data Link', 'Transport', 'Network', 'Physical'],
    correctOption: 2,
    explanation: 'The Network layer handles logical addressing and routing packets.',
    weight: 1
  },
  {
    id: 'q4',
    topic: 'Data Structures',
    content: 'Which data structure follows LIFO principle?',
    options: ['Queue', 'Stack', 'LinkedList', 'Tree'],
    correctOption: 1,
    explanation: 'Stack follows Last-In-First-Out (LIFO).',
    weight: 1
  }
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'exam1',
    title: 'Computer Science Fundamentals',
    description: 'A comprehensive quiz covering OS, DSA, and Networking.',
    durationMinutes: 30,
    totalMarks: 4,
    category: 'Computer Science',
    questions: SAMPLE_QUESTIONS
  },
  {
    id: 'exam2',
    title: 'Operating Systems Deep Dive',
    description: 'Detailed analysis of scheduling and memory management.',
    durationMinutes: 45,
    totalMarks: 10,
    category: 'OS',
    questions: SAMPLE_QUESTIONS.slice(1, 2)
  }
];
