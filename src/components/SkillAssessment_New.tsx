// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Button,
//   Avatar,
//   Stack,
//   Chip,
//   LinearProgress,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   TextField,
//   Divider,
//   IconButton,
//   Stepper,
//   Step,
//   StepLabel,
//   StepContent,
//   Fade,
//   Slide,
//   Zoom,
//   useTheme,
//   useMediaQuery,
//   Container,
//   CircularProgress,
//   Alert,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails
// } from '@mui/material';
// import {
//   Assessment,
//   Quiz,
//   EmojiEvents,
//   Star,
//   CheckCircle,
//   Schedule,
//   PlayArrow,
//   Refresh,
//   TrendingUp,
//   Psychology,
//   Code,
//   Security,
//   DataObject,
//   Business,
//   School,
//   Science,
//   Computer,
//   Build,
//   Analytics,
//   Speed,
//   AutoAwesome,
//   GpsFixed as Target,
//   Timeline,
//   WorkspacePremium,
//   ExpandMore,
//   Lightbulb,
//   HelpOutline,
//   Timer,
//   Done,
//   Close
// } from '@mui/icons-material';
// import { Radar, Doughnut, Bar } from 'react-chartjs-2';

// interface SkillAssessmentProps {
//   currentUser: any;
//   credentials: any[];
// }

// interface Question {
//   id: number;
//   question: string;
//   type: 'multiple-choice' | 'code' | 'scenario';
//   options?: string[];
//   correctAnswer?: number;
//   code?: string;
//   difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
//   skill: string;
//   timeLimit?: number;
// }

// interface Assessment {
//   id: number;
//   title: string;
//   description: string;
//   skill: string;
//   level: string;
//   duration: string;
//   questions: number;
//   icon: React.ReactNode;
//   color: string;
//   completed: boolean;
//   score?: number;
//   badge?: string;
// }

// const SkillAssessment: React.FC<SkillAssessmentProps> = ({
//   currentUser,
//   credentials
// }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const [availableAssessments, setAvailableAssessments] = useState<Assessment[]>([]);
//   const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState<{ [key: number]: any }>({});
//   const [assessmentStarted, setAssessmentStarted] = useState(false);
//   const [assessmentCompleted, setAssessmentCompleted] = useState(false);
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [skillScores, setSkillScores] = useState<{ [key: string]: number }>({});
//   const [animateIn, setAnimateIn] = useState(false);
//   const [showResults, setShowResults] = useState(false);

//   useEffect(() => {
//     generateAssessments();
//     generateSkillScores();
//     const timer = setTimeout(() => setAnimateIn(true), 300);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (assessmentStarted && !assessmentCompleted && timeRemaining > 0) {
//       timer = setTimeout(() => {
//         setTimeRemaining(prev => prev - 1);
//       }, 1000);
//     } else if (timeRemaining === 0 && assessmentStarted) {
//       handleCompleteAssessment();
//     }
//     return () => clearTimeout(timer);
//   }, [timeRemaining, assessmentStarted, assessmentCompleted]);

//   const generateAssessments = () => {
//     setAvailableAssessments([
//       {
//         id: 1,
//         title: "Blockchain Fundamentals",
//         description: "Test your understanding of blockchain technology, consensus mechanisms, and distributed systems",
//         skill: "Blockchain",
//         level: "Intermediate",
//         duration: "15 min",
//         questions: 20,
//         icon: <DataObject />,
//         color: '#667eea',
//         completed: false
//       },
//       {
//         id: 2,
//         title: "Smart Contract Security",
//         description: "Evaluate your knowledge of smart contract vulnerabilities, best practices, and security patterns",
//         skill: "Security",
//         level: "Advanced",
//         duration: "25 min",
//         questions: 15,
//         icon: <Security />,
//         color: '#f093fb',
//         completed: true,
//         score: 88,
//         badge: 'Security Expert'
//       },
//       {
//         id: 3,
//         title: "JavaScript/TypeScript Proficiency",
//         description: "Comprehensive assessment of modern JavaScript and TypeScript development skills",
//         skill: "Programming",
//         level: "Intermediate",
//         duration: "20 min",
//         questions: 25,
//         icon: <Code />,
//         color: '#4ECDC4',
//         completed: false
//       },
//       {
//         id: 4,
//         title: "Data Structures & Algorithms",
//         description: "Challenge your problem-solving skills with algorithmic thinking and data structure optimization",
//         skill: "Computer Science",
//         level: "Advanced",
//         duration: "30 min",
//         questions: 18,
//         icon: <Psychology />,
//         color: '#45B7D1',
//         completed: false
//       },
//       {
//         id: 5,
//         title: "Business Strategy",
//         description: "Test your understanding of strategic thinking, market analysis, and business development",
//         skill: "Business",
//         level: "Beginner",
//         duration: "12 min",
//         questions: 16,
//         icon: <Business />,
//         color: '#96CEB4',
//         completed: true,
//         score: 92,
//         badge: 'Strategy Analyst'
//       },
//       {
//         id: 6,
//         title: "System Design",
//         description: "Evaluate your ability to design scalable, distributed systems and architect solutions",
//         skill: "Engineering",
//         level: "Advanced",
//         duration: "35 min",
//         questions: 12,
//         icon: <Build />,
//         color: '#FFEAA7',
//         completed: false
//       }
//     ]);
//   };

//   const generateSkillScores = () => {
//     setSkillScores({
//       'Blockchain': 85,
//       'Programming': 78,
//       'Security': 88,
//       'Business': 92,
//       'Computer Science': 65,
//       'Engineering': 70,
//       'Data Science': 82,
//       'Design': 75
//     });
//   };

//   const sampleQuestions: Question[] = [
//     {
//       id: 1,
//       question: "What is the primary purpose of a consensus mechanism in blockchain?",
//       type: "multiple-choice",
//       options: [
//         "To encrypt transactions",
//         "To achieve agreement on the state of the ledger",
//         "To compress blockchain data",
//         "To create new cryptocurrencies"
//       ],
//       correctAnswer: 1,
//       difficulty: "Intermediate",
//       skill: "Blockchain",
//       timeLimit: 60
//     },
//     {
//       id: 2,
//       question: "Which of the following is a common smart contract vulnerability?",
//       type: "multiple-choice",
//       options: [
//         "Reentrancy attacks",
//         "Integer overflow",
//         "Unchecked external calls",
//         "All of the above"
//       ],
//       correctAnswer: 3,
//       difficulty: "Advanced",
//       skill: "Security",
//       timeLimit: 45
//     },
//     {
//       id: 3,
//       question: "Complete the following TypeScript function to safely parse JSON:",
//       type: "code",
//       code: "function safeJsonParse<T>(json: string): T | null {\n  // Your implementation here\n}",
//       difficulty: "Intermediate",
//       skill: "Programming",
//       timeLimit: 120
//     }
//   ];

//   const startAssessment = (assessment: Assessment) => {
//     setActiveAssessment(assessment);
//     setCurrentQuestionIndex(0);
//     setAnswers({});
//     setAssessmentStarted(true);
//     setAssessmentCompleted(false);
//     setTimeRemaining(15 * 60); // 15 minutes
//   };

//   const handleAnswerChange = (questionId: number, answer: any) => {
//     setAnswers(prev => ({
//       ...prev,
//       [questionId]: answer
//     }));
//   };

//   const nextQuestion = () => {
//     if (currentQuestionIndex < sampleQuestions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     } else {
//       handleCompleteAssessment();
//     }
//   };

//   const handleCompleteAssessment = () => {
//     setAssessmentCompleted(true);
//     setAssessmentStarted(false);
    
//     // Calculate score (mock calculation)
//     const score = Math.floor(Math.random() * 30) + 70; // 70-100
    
//     // Update assessment with results
//     if (activeAssessment) {
//       setAvailableAssessments(prev => prev.map(assessment => 
//         assessment.id === activeAssessment.id 
//           ? { ...assessment, completed: true, score, badge: score >= 90 ? 'Expert' : score >= 80 ? 'Proficient' : 'Competent' }
//           : assessment
//       ));
//     }
    
//     setShowResults(true);
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const getDifficultyColor = (level: string) => {
//     switch (level.toLowerCase()) {
//       case 'beginner': return '#4CAF50';
//       case 'intermediate': return '#FF9800';
//       case 'advanced': return '#F44336';
//       default: return '#757575';
//     }
//   };

//   const skillRadarData = {
//     labels: Object.keys(skillScores),
//     datasets: [
//       {
//         label: 'Current Skills',
//         data: Object.values(skillScores),
//         backgroundColor: 'rgba(78, 205, 196, 0.2)',
//         borderColor: 'rgba(78, 205, 196, 1)',
//         pointBackgroundColor: 'rgba(78, 205, 196, 1)',
//         pointBorderColor: '#fff',
//         pointHoverBackgroundColor: '#fff',
//         pointHoverBorderColor: 'rgba(78, 205, 196, 1)'
//       }
//     ]
//   };

//   const completionData = {
//     labels: ['Completed', 'Remaining'],
//     datasets: [
//       {
//         data: [
//           availableAssessments.filter(a => a.completed).length,
//           availableAssessments.filter(a => !a.completed).length
//         ],
//         backgroundColor: ['#4CAF50', '#E0E0E0'],
//         borderWidth: 0
//       }
//     ]
//   };

//   return (
//     <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
//       <Fade in={animateIn} timeout={1000}>
//         <Box>
//           {/* Header Section */}
//           <Slide direction="down" in={animateIn} timeout={800}>
//             <Paper sx={{
//               p: 3,
//               borderRadius: 4,
//               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//               color: 'white',
//               mb: 4,
//               position: 'relative',
//               overflow: 'hidden',
//               '&::before': {
//                 content: '""',
//                 position: 'absolute',
//                 top: 0,
//                 right: 0,
//                 width: '500px',
//                 height: '500px',
//                 background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
//                 borderRadius: '50%',
//                 transform: 'translate(200px, -200px)'
//               }
//             }}>
//               <Grid container spacing={3} alignItems="center">
//                 <Grid item xs={12} md={8}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                     <Avatar sx={{ 
//                       bgcolor: 'rgba(255,255,255,0.2)', 
//                       mr: 2,
//                       width: 60,
//                       height: 60
//                     }}>
//                       <Assessment sx={{ fontSize: 30 }} />
//                     </Avatar>
//                     <Box>
//                       <Typography variant="h4" fontWeight={700}>
//                         Skill Assessment Center
//                       </Typography>
//                       <Typography variant="h6" sx={{ opacity: 0.9 }}>
//                         Validate your expertise with comprehensive skill evaluations
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Grid>
                
//                 <Grid item xs={12} md={4}>
//                   <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-end' }}>
//                     <Paper sx={{ 
//                       p: 2, 
//                       textAlign: 'center', 
//                       bgcolor: 'rgba(255,255,255,0.2)', 
//                       borderRadius: 2,
//                       backdropFilter: 'blur(10px)'
//                     }}>
//                       <Typography variant="h5" fontWeight={700}>
//                         {availableAssessments.filter(a => a.completed).length}
//                       </Typography>
//                       <Typography variant="caption">Completed</Typography>
//                     </Paper>
//                     <Paper sx={{ 
//                       p: 2, 
//                       textAlign: 'center', 
//                       bgcolor: 'rgba(255,255,255,0.2)', 
//                       borderRadius: 2,
//                       backdropFilter: 'blur(10px)'
//                     }}>
//                       <Typography variant="h5" fontWeight={700}>
//                         {Math.round(Object.values(skillScores).reduce((a, b) => a + b, 0) / Object.values(skillScores).length)}%
//                       </Typography>
//                       <Typography variant="caption">Avg Score</Typography>
//                     </Paper>
//                   </Stack>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Slide>

//           {/* Skills Overview */}
//           <Grid container spacing={4} sx={{ mb: 4 }}>
//             <Grid item xs={12} md={8}>
//               <Paper sx={{
//                 p: 3,
//                 borderRadius: 4,
//                 background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
//                 backdropFilter: 'blur(20px)',
//                 border: '1px solid rgba(255,255,255,0.2)',
//                 minHeight: 400
//               }}>
//                 <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
//                   Available Skill Assessments
//                 </Typography>
                
//                 <Grid container spacing={3}>
//                   {availableAssessments.map((assessment, index) => (
//                     <Grid item xs={12} sm={6} lg={4} key={assessment.id}>
//                       <Slide direction="up" in={animateIn} timeout={1000 + index * 200}>
//                         <Card sx={{
//                           borderRadius: 4,
//                           border: assessment.completed ? '2px solid #4CAF50' : '2px solid transparent',
//                           background: assessment.completed 
//                             ? 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #4CAF50, #66BB6A) border-box'
//                             : 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #E0E0E0, #BDBDBD) border-box',
//                           transition: 'all 0.3s ease',
//                           position: 'relative',
//                           overflow: 'hidden',
//                           '&:hover': {
//                             transform: 'translateY(-8px)',
//                             boxShadow: `0 16px 40px ${assessment.color}30`
//                           }
//                         }}>
//                           {assessment.completed && (
//                             <Box sx={{
//                               position: 'absolute',
//                               top: 16,
//                               right: 16,
//                               zIndex: 2
//                             }}>
//                               <Chip
//                                 icon={<CheckCircle />}
//                                 label={assessment.badge}
//                                 color="success"
//                                 size="small"
//                                 sx={{ fontWeight: 600 }}
//                               />
//                             </Box>
//                           )}
                          
//                           <CardContent sx={{ p: 3 }}>
//                             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                               <Avatar sx={{ 
//                                 bgcolor: assessment.color,
//                                 mr: 2,
//                                 width: 50,
//                                 height: 50
//                               }}>
//                                 {assessment.icon}
//                               </Avatar>
//                               <Box sx={{ flex: 1 }}>
//                                 <Typography variant="h6" fontWeight={700} gutterBottom>
//                                   {assessment.title}
//                                 </Typography>
//                                 <Chip 
//                                   label={assessment.level}
//                                   size="small"
//                                   sx={{
//                                     bgcolor: getDifficultyColor(assessment.level),
//                                     color: 'white',
//                                     fontWeight: 500
//                                   }}
//                                 />
//                               </Box>
//                             </Box>

//                             <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                               {assessment.description}
//                             </Typography>

//                             <Stack spacing={2}>
//                               <Stack direction="row" justifyContent="space-between">
//                                 <Typography variant="body2" color="text.secondary">
//                                   Duration: {assessment.duration}
//                                 </Typography>
//                                 <Typography variant="body2" color="text.secondary">
//                                   {assessment.questions} questions
//                                 </Typography>
//                               </Stack>

//                               {assessment.completed ? (
//                                 <Box>
//                                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//                                     <Typography variant="body2" color="text.secondary">
//                                       Your Score
//                                     </Typography>
//                                     <Typography variant="h6" fontWeight={700} color="primary.main">
//                                       {assessment.score}%
//                                     </Typography>
//                                   </Box>
//                                   <LinearProgress
//                                     variant="determinate"
//                                     value={assessment.score || 0}
//                                     sx={{
//                                       height: 8,
//                                       borderRadius: 4,
//                                       backgroundColor: 'rgba(0,0,0,0.1)',
//                                       '& .MuiLinearProgress-bar': {
//                                         borderRadius: 4,
//                                         backgroundColor: '#4CAF50'
//                                       }
//                                     }}
//                                   />
//                                 </Box>
//                               ) : (
//                                 <Button
//                                   variant="contained"
//                                   fullWidth
//                                   startIcon={<PlayArrow />}
//                                   onClick={() => startAssessment(assessment)}
//                                   sx={{
//                                     borderRadius: 2,
//                                     py: 1.5,
//                                     background: `linear-gradient(135deg, ${assessment.color}, ${assessment.color}CC)`,
//                                     fontWeight: 600,
//                                     textTransform: 'none',
//                                     '&:hover': {
//                                       background: `linear-gradient(135deg, ${assessment.color}CC, ${assessment.color})`
//                                     }
//                                   }}
//                                 >
//                                   Start Assessment
//                                 </Button>
//                               )}
//                             </Stack>
//                           </CardContent>
//                         </Card>
//                       </Slide>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Paper>
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <Stack spacing={3}>
//                 {/* Skills Radar Chart */}
//                 <Slide direction="left" in={animateIn} timeout={1200}>
//                   <Paper sx={{
//                     p: 3,
//                     borderRadius: 4,
//                     background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
//                     color: 'white',
//                     textAlign: 'center'
//                   }}>
//                     <Typography variant="h6" fontWeight={700} gutterBottom>
//                       Skill Level Overview
//                     </Typography>
//                     <Box sx={{ height: 250, mt: 2 }}>
//                       <Radar
//                         data={skillRadarData}
//                         options={{
//                           responsive: true,
//                           maintainAspectRatio: false,
//                           plugins: {
//                             legend: {
//                               display: false
//                             }
//                           },
//                           scales: {
//                             r: {
//                               beginAtZero: true,
//                               max: 100,
//                               grid: {
//                                 color: 'rgba(255,255,255,0.3)'
//                               },
//                               pointLabels: {
//                                 color: 'white',
//                                 font: {
//                                   size: 10
//                                 }
//                               },
//                               ticks: {
//                                 display: false
//                               }
//                             }
//                           }
//                         }}
//                       />
//                     </Box>
//                   </Paper>
//                 </Slide>

//                 {/* Assessment Progress */}
//                 <Slide direction="left" in={animateIn} timeout={1400}>
//                   <Paper sx={{
//                     p: 3,
//                     borderRadius: 4,
//                     background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
//                     backdropFilter: 'blur(20px)',
//                     border: '1px solid rgba(255,255,255,0.2)',
//                     textAlign: 'center'
//                   }}>
//                     <Typography variant="h6" fontWeight={700} gutterBottom>
//                       Assessment Progress
//                     </Typography>
//                     <Box sx={{ height: 200, mt: 2 }}>
//                       <Doughnut
//                         data={completionData}
//                         options={{
//                           responsive: true,
//                           maintainAspectRatio: false,
//                           plugins: {
//                             legend: {
//                               position: 'bottom'
//                             }
//                           }
//                         }}
//                       />
//                     </Box>
//                     <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
//                       {availableAssessments.filter(a => a.completed).length} of {availableAssessments.length} assessments completed
//                     </Typography>
//                   </Paper>
//                 </Slide>
//               </Stack>
//             </Grid>
//           </Grid>

//           {/* Assessment Dialog */}
//           <Dialog
//             open={assessmentStarted || assessmentCompleted}
//             onClose={() => {
//               setAssessmentStarted(false);
//               setAssessmentCompleted(false);
//               setActiveAssessment(null);
//             }}
//             maxWidth="md"
//             fullWidth
//             PaperProps={{
//               sx: {
//                 borderRadius: 4,
//                 minHeight: 600
//               }
//             }}
//           >
//             {assessmentStarted && !assessmentCompleted && (
//               <>
//                 <DialogTitle sx={{ 
//                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                   color: 'white',
//                   position: 'relative'
//                 }}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Typography variant="h6" fontWeight={700}>
//                       {activeAssessment?.title}
//                     </Typography>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                       <Chip 
//                         label={formatTime(timeRemaining)}
//                         sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
//                         icon={<Timer sx={{ color: 'white !important' }} />}
//                       />
//                       <Typography variant="body2">
//                         {currentQuestionIndex + 1} / {sampleQuestions.length}
//                       </Typography>
//                     </Box>
//                   </Box>
//                   <LinearProgress
//                     variant="determinate"
//                     value={(currentQuestionIndex / sampleQuestions.length) * 100}
//                     sx={{
//                       mt: 2,
//                       height: 6,
//                       borderRadius: 3,
//                       backgroundColor: 'rgba(255,255,255,0.3)',
//                       '& .MuiLinearProgress-bar': {
//                         borderRadius: 3,
//                         backgroundColor: '#4CAF50'
//                       }
//                     }}
//                   />
//                 </DialogTitle>
//                 <DialogContent sx={{ p: 4 }}>
//                   {currentQuestionIndex < sampleQuestions.length && (
//                     <Box>
//                       <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
//                         {sampleQuestions[currentQuestionIndex].question}
//                       </Typography>
                      
//                       {sampleQuestions[currentQuestionIndex].type === 'multiple-choice' && (
//                         <FormControl component="fieldset" fullWidth>
//                           <RadioGroup
//                             value={answers[sampleQuestions[currentQuestionIndex].id] || ''}
//                             onChange={(e) => handleAnswerChange(sampleQuestions[currentQuestionIndex].id, e.target.value)}
//                           >
//                             {sampleQuestions[currentQuestionIndex].options?.map((option, index) => (
//                               <FormControlLabel
//                                 key={index}
//                                 value={index.toString()}
//                                 control={<Radio />}
//                                 label={option}
//                                 sx={{
//                                   mb: 1,
//                                   p: 2,
//                                   borderRadius: 2,
//                                   border: '1px solid #E0E0E0',
//                                   transition: 'all 0.3s ease',
//                                   '&:hover': {
//                                     backgroundColor: 'rgba(0,0,0,0.05)'
//                                   }
//                                 }}
//                               />
//                             ))}
//                           </RadioGroup>
//                         </FormControl>
//                       )}

//                       {sampleQuestions[currentQuestionIndex].type === 'code' && (
//                         <Box>
//                           <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
//                             <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
//                               {sampleQuestions[currentQuestionIndex].code}
//                             </Typography>
//                           </Paper>
//                           <TextField
//                             fullWidth
//                             multiline
//                             rows={6}
//                             placeholder="Write your solution here..."
//                             value={answers[sampleQuestions[currentQuestionIndex].id] || ''}
//                             onChange={(e) => handleAnswerChange(sampleQuestions[currentQuestionIndex].id, e.target.value)}
//                             sx={{
//                               '& .MuiOutlinedInput-root': {
//                                 fontFamily: 'monospace',
//                                 fontSize: '0.875rem'
//                               }
//                             }}
//                           />
//                         </Box>
//                       )}
//                     </Box>
//                   )}
//                 </DialogContent>
//                 <DialogActions sx={{ p: 3 }}>
//                   <Button
//                     variant="outlined"
//                     onClick={() => {
//                       setAssessmentStarted(false);
//                       setActiveAssessment(null);
//                     }}
//                   >
//                     Exit Assessment
//                   </Button>
//                   <Button
//                     variant="contained"
//                     onClick={nextQuestion}
//                     disabled={!answers[sampleQuestions[currentQuestionIndex]?.id]}
//                     sx={{
//                       background: 'linear-gradient(135deg, #4ECDC4, #45B7D1)',
//                       fontWeight: 600,
//                       textTransform: 'none',
//                       px: 3
//                     }}
//                   >
//                     {currentQuestionIndex === sampleQuestions.length - 1 ? 'Complete Assessment' : 'Next Question'}
//                   </Button>
//                 </DialogActions>
//               </>
//             )}

//             {assessmentCompleted && showResults && (
//               <>
//                 <DialogTitle sx={{
//                   background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
//                   color: 'white',
//                   textAlign: 'center'
//                 }}>
//                   <Avatar sx={{ 
//                     bgcolor: 'rgba(255,255,255,0.2)', 
//                     mx: 'auto',
//                     mb: 2,
//                     width: 80,
//                     height: 80
//                   }}>
//                     <EmojiEvents sx={{ fontSize: 40 }} />
//                   </Avatar>
//                   <Typography variant="h5" fontWeight={700}>
//                     Assessment Complete!
//                   </Typography>
//                 </DialogTitle>
//                 <DialogContent sx={{ p: 4, textAlign: 'center' }}>
//                   <Stack spacing={3} alignItems="center">
//                     <Box>
//                       <Typography variant="h3" fontWeight={700} color="primary.main" gutterBottom>
//                         {availableAssessments.find(a => a.id === activeAssessment?.id)?.score}%
//                       </Typography>
//                       <Typography variant="h6" color="text.secondary">
//                         {availableAssessments.find(a => a.id === activeAssessment?.id)?.badge}
//                       </Typography>
//                     </Box>
                    
//                     <Paper sx={{ 
//                       p: 3, 
//                       borderRadius: 3, 
//                       bgcolor: 'success.light',
//                       color: 'white',
//                       width: '100%'
//                     }}>
//                       <Typography variant="body1" gutterBottom>
//                         Congratulations! You've demonstrated strong knowledge in {activeAssessment?.skill}.
//                       </Typography>
//                       <Typography variant="body2">
//                         This assessment has been added to your verified credentials.
//                       </Typography>
//                     </Paper>

//                     <Grid container spacing={2} sx={{ mt: 2 }}>
//                       <Grid item xs={4}>
//                         <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
//                           <Typography variant="h6" fontWeight={700} color="primary.main">
//                             {sampleQuestions.length}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             Questions
//                           </Typography>
//                         </Paper>
//                       </Grid>
//                       <Grid item xs={4}>
//                         <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
//                           <Typography variant="h6" fontWeight={700} color="primary.main">
//                             {formatTime(900 - timeRemaining)}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             Time Taken
//                           </Typography>
//                         </Paper>
//                       </Grid>
//                       <Grid item xs={4}>
//                         <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
//                           <Typography variant="h6" fontWeight={700} color="primary.main">
//                             {Math.ceil((availableAssessments.find(a => a.id === activeAssessment?.id)?.score || 0) / 10)}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             Correct Answers
//                           </Typography>
//                         </Paper>
//                       </Grid>
//                     </Grid>
//                   </Stack>
//                 </DialogContent>
//                 <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
//                   <Button
//                     variant="contained"
//                     onClick={() => {
//                       setAssessmentCompleted(false);
//                       setActiveAssessment(null);
//                       setShowResults(false);
//                     }}
//                     sx={{
//                       background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
//                       fontWeight: 600,
//                       textTransform: 'none',
//                       px: 4,
//                       py: 1.5
//                     }}
//                   >
//                     Continue Learning
//                   </Button>
//                 </DialogActions>
//               </>
//             )}
//           </Dialog>
//         </Box>
//       </Fade>
//     </Container>
//   );
// };

// export default SkillAssessment;
