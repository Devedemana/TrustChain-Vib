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
//   Paper,
//   LinearProgress,
//   Divider,
//   IconButton,
//   Badge,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Fade,
//   Slide,
//   useTheme,
//   useMediaQuery,
//   Container,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   ListItemAvatar
// } from '@mui/material';
// import {
//   TrendingUp,
//   AttachMoney,
//   LocationOn,
//   Business,
//   Psychology,
//   Star,
//   Verified,
//   Assessment,
//   Timeline,
//   Speed,
//   AutoAwesome,
//   Analytics,
//   School,
//   WorkOutline,
//   MonetizationOn,
//   BarChart,
//   ShowChart
// } from '@mui/icons-material';
// import { Line, Bar, Doughnut } from 'react-chartjs-2';

// interface CareerInsightsProps {
//   currentUser: any;
//   credentials: any[];
// }

// const CareerInsights: React.FC<CareerInsightsProps> = ({ 
//   currentUser, 
//   credentials 
// }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const [careerData, setCareerData] = useState<any>(null);
//   const [jobRecommendations, setJobRecommendations] = useState<any[]>([]);
//   const [skillGaps, setSkillGaps] = useState<any[]>([]);
//   const [salaryTrends, setSalaryTrends] = useState<any>(null);
//   const [animateIn, setAnimateIn] = useState(false);

//   useEffect(() => {
//     generateCareerInsights();
//     const timer = setTimeout(() => setAnimateIn(true), 300);
//     return () => clearTimeout(timer);
//   }, []);

//   const generateCareerInsights = () => {
//     // Mock career analytics data
//     setCareerData({
//       careerScore: 85,
//       marketDemand: 'High',
//       expectedSalary: '$95,000 - $130,000',
//       careerGrowth: '+15%',
//       topSkills: ['Blockchain', 'Smart Contracts', 'DeFi', 'Web3'],
//       nextRole: 'Senior Blockchain Developer'
//     });

//     // Mock job recommendations
//     setJobRecommendations([
//       {
//         id: 1,
//         title: 'Senior Blockchain Developer',
//         company: 'ConsenSys',
//         location: 'Remote / New York',
//         salary: '$120,000 - $160,000',
//         match: 95,
//         type: 'Full-time',
//         growth: '+22%',
//         description: 'Lead blockchain development initiatives and architect decentralized solutions.',
//         skills: ['Solidity', 'Ethereum', 'Smart Contracts', 'DeFi'],
//         posted: '2 days ago'
//       },
//       {
//         id: 2,
//         title: 'Web3 Product Manager',
//         company: 'Polygon',
//         location: 'San Francisco',
//         salary: '$140,000 - $180,000',
//         match: 88,
//         type: 'Full-time',
//         growth: '+30%',
//         description: 'Drive product strategy for next-generation Web3 applications.',
//         skills: ['Product Strategy', 'Tokenomics', 'Community', 'Analytics'],
//         posted: '1 week ago'
//       },
//       {
//         id: 3,
//         title: 'Smart Contract Auditor',
//         company: 'OpenZeppelin',
//         location: 'Remote',
//         salary: '$110,000 - $150,000',
//         match: 82,
//         type: 'Contract',
//         growth: '+18%',
//         description: 'Review and audit smart contracts for security vulnerabilities.',
//         skills: ['Security', 'Auditing', 'Solidity', 'Testing'],
//         posted: '3 days ago'
//       }
//     ]);

//     // Mock skill gaps
//     setSkillGaps([
//       {
//         skill: 'Advanced DeFi Protocols',
//         current: 65,
//         market: 85,
//         importance: 'High',
//         timeToLearn: '3 months'
//       },
//       {
//         skill: 'Layer 2 Solutions',
//         current: 45,
//         market: 80,
//         importance: 'Medium',
//         timeToLearn: '2 months'
//       },
//       {
//         skill: 'Cross-chain Development',
//         current: 30,
//         market: 75,
//         importance: 'High',
//         timeToLearn: '4 months'
//       }
//     ]);

//     // Mock salary trends
//     setSalaryTrends({
//       labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
//       datasets: [{
//         label: 'Average Salary',
//         data: [75000, 85000, 95000, 110000, 125000, 140000],
//         borderColor: 'rgb(75, 192, 192)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         tension: 0.4,
//         fill: true
//       }]
//     });
//   };

//   const onRecommendationClick = (job: any) => {
//     console.log('Job clicked:', job);
//     // Handle job application or more details
//   };

//   const getImportanceColor = (importance: string) => {
//     switch (importance.toLowerCase()) {
//       case 'high': return '#f44336';
//       case 'medium': return '#ff9800';
//       case 'low': return '#4caf50';
//       default: return '#757575';
//     }
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
//                 width: '400px',
//                 height: '400px',
//                 background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
//                 borderRadius: '50%',
//                 transform: 'translate(150px, -150px)'
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
//                       <TrendingUp sx={{ fontSize: 30 }} />
//                     </Avatar>
//                     <Box>
//                       <Typography variant="h4" fontWeight={700}>
//                         Career Insights
//                       </Typography>
//                       <Typography variant="h6" sx={{ opacity: 0.9 }}>
//                         AI-powered career analysis and job matching
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
//                       <Typography variant="h5" fontWeight={700}>{careerData?.careerScore}%</Typography>
//                       <Typography variant="caption">Career Score</Typography>
//                     </Paper>
//                     <Paper sx={{ 
//                       p: 2, 
//                       textAlign: 'center', 
//                       bgcolor: 'rgba(255,255,255,0.2)', 
//                       borderRadius: 2,
//                       backdropFilter: 'blur(10px)'
//                     }}>
//                       <Typography variant="h5" fontWeight={700}>{jobRecommendations.length}</Typography>
//                       <Typography variant="caption">Job Matches</Typography>
//                     </Paper>
//                   </Stack>
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Slide>

//           <Grid container spacing={4}>
//             {/* Main Content */}
//             <Grid item xs={12} lg={8}>
//               {/* Career Analytics */}
//               <Slide direction="right" in={animateIn} timeout={1000}>
//                 <Paper sx={{
//                   p: 3,
//                   borderRadius: 4,
//                   background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
//                   backdropFilter: 'blur(20px)',
//                   border: '1px solid rgba(255,255,255,0.2)',
//                   mb: 3
//                 }}>
//                   <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
//                     Career Analytics Dashboard
//                   </Typography>
                  
//                   <Grid container spacing={3}>
//                     <Grid item xs={6} sm={3}>
//                       <Paper sx={{ 
//                         p: 2, 
//                         textAlign: 'center', 
//                         borderRadius: 3,
//                         background: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
//                         color: 'white'
//                       }}>
//                         <Typography variant="h4" fontWeight={700}>{careerData?.careerScore}%</Typography>
//                         <Typography variant="body2">Career Score</Typography>
//                       </Paper>
//                     </Grid>
//                     <Grid item xs={6} sm={3}>
//                       <Paper sx={{ 
//                         p: 2, 
//                         textAlign: 'center', 
//                         borderRadius: 3,
//                         background: 'linear-gradient(135deg, #667eea, #764ba2)',
//                         color: 'white'
//                       }}>
//                         <Typography variant="h6" fontWeight={700}>{careerData?.marketDemand}</Typography>
//                         <Typography variant="body2">Market Demand</Typography>
//                       </Paper>
//                     </Grid>
//                     <Grid item xs={6} sm={3}>
//                       <Paper sx={{ 
//                         p: 2, 
//                         textAlign: 'center', 
//                         borderRadius: 3,
//                         background: 'linear-gradient(135deg, #f093fb, #f5576c)',
//                         color: 'white'
//                       }}>
//                         <Typography variant="h6" fontWeight={700}>{careerData?.careerGrowth}</Typography>
//                         <Typography variant="body2">Growth Rate</Typography>
//                       </Paper>
//                     </Grid>
//                     <Grid item xs={6} sm={3}>
//                       <Paper sx={{ 
//                         p: 2, 
//                         textAlign: 'center', 
//                         borderRadius: 3,
//                         background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
//                         color: 'white'
//                       }}>
//                         <Typography variant="h6" fontWeight={700} sx={{ fontSize: '0.9rem' }}>
//                           {careerData?.expectedSalary?.split(' - ')[0]}
//                         </Typography>
//                         <Typography variant="body2">Expected Salary</Typography>
//                       </Paper>
//                     </Grid>
//                   </Grid>
//                 </Paper>
//               </Slide>

//               {/* Job Recommendations */}
//               <Slide direction="right" in={animateIn} timeout={1100}>
//                 <Paper sx={{
//                   p: 3,
//                   borderRadius: 4,
//                   background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
//                   backdropFilter: 'blur(20px)',
//                   border: '1px solid rgba(255,255,255,0.2)'
//                 }}>
//                   <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
//                     Personalized Job Recommendations
//                   </Typography>
                  
//                   <Grid container spacing={3}>
//                     {jobRecommendations.map((job, index) => (
//                       <Grid item xs={12} key={job.id}>
//                         <Card sx={{
//                           borderRadius: 4,
//                           border: '2px solid transparent',
//                           background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #4ECDC4, #45B7D1) border-box',
//                           transition: 'all 0.3s ease',
//                           '&:hover': {
//                             transform: 'translateY(-4px)',
//                             boxShadow: '0 12px 30px rgba(78, 205, 196, 0.2)'
//                           }
//                         }}>
//                           <CardContent sx={{ p: 3 }}>
//                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
//                               <Box sx={{ flex: 1 }}>
//                                 <Typography variant="h6" fontWeight={700} gutterBottom>
//                                   {job.title}
//                                 </Typography>
//                                 <Typography variant="body2" color="text.secondary" gutterBottom>
//                                   {job.company}
//                                 </Typography>
//                               </Box>
//                               <Badge
//                                 badgeContent={`${job.match}%`}
//                                 color="primary"
//                                 sx={{
//                                   '& .MuiBadge-badge': {
//                                     fontSize: '0.8rem',
//                                     fontWeight: 700,
//                                     padding: '0 8px',
//                                     borderRadius: 2
//                                   }
//                                 }}
//                               >
//                                 <Avatar sx={{ 
//                                   bgcolor: 'success.main',
//                                   width: 50,
//                                   height: 50
//                                 }}>
//                                   <Verified />
//                                 </Avatar>
//                               </Badge>
//                             </Box>

//                             <Stack spacing={2}>
//                               <Box>
//                                 <Stack direction="row" spacing={1} alignItems="center">
//                                   <AttachMoney sx={{ fontSize: 18, color: 'success.main' }} />
//                                   <Typography variant="body2" fontWeight={600} color="success.main">
//                                     {job.salary}
//                                   </Typography>
//                                   <Chip 
//                                     label={job.growth}
//                                     size="small"
//                                     color="success"
//                                     variant="outlined"
//                                   />
//                                 </Stack>
//                               </Box>

//                               <Box>
//                                 <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
//                                   <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
//                                   <Typography variant="body2" color="text.secondary">
//                                     {job.location}
//                                   </Typography>
//                                   <Chip 
//                                     label={job.type}
//                                     size="small"
//                                     variant="outlined"
//                                   />
//                                 </Stack>
//                               </Box>

//                               <Typography variant="body2" sx={{ mb: 2 }}>
//                                 {job.description}
//                               </Typography>

//                               <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
//                                 {job.skills.map((skill: string, skillIndex: number) => (
//                                   <Chip 
//                                     key={skillIndex}
//                                     label={skill}
//                                     size="small"
//                                     sx={{ 
//                                       bgcolor: 'primary.light',
//                                       color: 'white',
//                                       fontWeight: 500
//                                     }}
//                                   />
//                                 ))}
//                               </Stack>

//                               <Button
//                                 variant="contained"
//                                 fullWidth
//                                 sx={{
//                                   background: 'linear-gradient(135deg, #4ECDC4, #45B7D1)',
//                                   borderRadius: 2,
//                                   py: 1,
//                                   fontWeight: 600,
//                                   textTransform: 'none',
//                                   '&:hover': {
//                                     background: 'linear-gradient(135deg, #45B7D1, #4ECDC4)'
//                                   }
//                                 }}
//                                 onClick={() => onRecommendationClick(job)}
//                               >
//                                 View Details & Apply
//                               </Button>
//                             </Stack>
//                           </CardContent>
//                         </Card>
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </Paper>
//               </Slide>
//             </Grid>

//             {/* Sidebar */}
//             <Grid item xs={12} lg={4}>
//               <Stack spacing={3}>
//                 {/* Salary Trends */}
//                 <Slide direction="left" in={animateIn} timeout={1200}>
//                   <Paper sx={{
//                     p: 3,
//                     borderRadius: 4,
//                     background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
//                     color: 'white',
//                     textAlign: 'center'
//                   }}>
//                     <Typography variant="h6" fontWeight={700} gutterBottom>
//                       Salary Progression
//                     </Typography>
//                     <Box sx={{ height: 200, mt: 2 }}>
//                       {salaryTrends && (
//                         <Line
//                           data={salaryTrends}
//                           options={{
//                             responsive: true,
//                             maintainAspectRatio: false,
//                             plugins: {
//                               legend: {
//                                 display: false
//                               }
//                             },
//                             scales: {
//                               x: {
//                                 grid: {
//                                   display: false
//                                 },
//                                 ticks: {
//                                   color: 'white'
//                                 }
//                               },
//                               y: {
//                                 grid: {
//                                   color: 'rgba(255,255,255,0.2)'
//                                 },
//                                 ticks: {
//                                   color: 'white',
//                                   callback: function(value) {
//                                     return '$' + (value as number).toLocaleString();
//                                   }
//                                 }
//                               }
//                             }
//                           }}
//                         />
//                       )}
//                     </Box>
//                   </Paper>
//                 </Slide>

//                 {/* Skill Gaps */}
//                 <Slide direction="left" in={animateIn} timeout={1400}>
//                   <Paper sx={{
//                     p: 3,
//                     borderRadius: 4,
//                     background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
//                     backdropFilter: 'blur(20px)',
//                     border: '1px solid rgba(255,255,255,0.2)'
//                   }}>
//                     <Typography variant="h6" fontWeight={700} gutterBottom>
//                       Skill Gap Analysis
//                     </Typography>
//                     <Stack spacing={3}>
//                       {skillGaps.map((gap, index) => (
//                         <Box key={index}>
//                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//                             <Typography variant="body2" fontWeight={600}>
//                               {gap.skill}
//                             </Typography>
//                             <Chip 
//                               label={gap.importance}
//                               size="small"
//                               sx={{
//                                 bgcolor: getImportanceColor(gap.importance),
//                                 color: 'white',
//                                 fontWeight: 600
//                               }}
//                             />
//                           </Box>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
//                             <Typography variant="caption" color="text.secondary" sx={{ minWidth: 60 }}>
//                               Current
//                             </Typography>
//                             <LinearProgress
//                               variant="determinate"
//                               value={gap.current}
//                               sx={{
//                                 flex: 1,
//                                 height: 6,
//                                 borderRadius: 3,
//                                 backgroundColor: 'rgba(0,0,0,0.1)',
//                                 '& .MuiLinearProgress-bar': {
//                                   borderRadius: 3,
//                                   backgroundColor: '#2196F3'
//                                 }
//                               }}
//                             />
//                             <Typography variant="caption" fontWeight={600}>
//                               {gap.current}%
//                             </Typography>
//                           </Box>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
//                             <Typography variant="caption" color="text.secondary" sx={{ minWidth: 60 }}>
//                               Market
//                             </Typography>
//                             <LinearProgress
//                               variant="determinate"
//                               value={gap.market}
//                               sx={{
//                                 flex: 1,
//                                 height: 6,
//                                 borderRadius: 3,
//                                 backgroundColor: 'rgba(0,0,0,0.1)',
//                                 '& .MuiLinearProgress-bar': {
//                                   borderRadius: 3,
//                                   backgroundColor: '#4CAF50'
//                                 }
//                               }}
//                             />
//                             <Typography variant="caption" fontWeight={600}>
//                               {gap.market}%
//                             </Typography>
//                           </Box>
//                           <Typography variant="caption" color="text.secondary">
//                             Estimated learning time: {gap.timeToLearn}
//                           </Typography>
//                           {index < skillGaps.length - 1 && <Divider sx={{ mt: 2 }} />}
//                         </Box>
//                       ))}
//                     </Stack>
//                   </Paper>
//                 </Slide>
//               </Stack>
//             </Grid>
//           </Grid>
//         </Box>
//       </Fade>
//     </Container>
//   );
// };

// export default CareerInsights;
