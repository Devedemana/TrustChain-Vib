// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Button,
//   LinearProgress,
//   Stack,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Chip,
//   Avatar,
//   Paper,
//   Divider,
//   Alert,
//   IconButton,
//   Fade,
//   Slide,
//   useTheme,
//   useMediaQuery,
//   Container,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Badge,
//   Tooltip
// } from '@mui/material';
// import {
//   TrendingUp,
//   School,
//   Work,
//   Psychology,
//   AttachMoney,
//   EmojiEvents,
//   Star,
//   ExpandMore,
//   Lightbulb,
//   Assessment,
//   Timeline,
//   BusinessCenter,
//   LocationOn,
//   Schedule,
//   TrendingDown,
//   AutoAwesome,
//   Verified,
//   FlashOn,
//   Radar,
//   Analytics,
//   Insights,
//   AccountBalance
// } from '@mui/icons-material';

// interface CareerInsightsProps {
//   credentials: any[];
//   onRecommendationClick: (recommendation: any) => void;
// }

// const CareerInsights: React.FC<CareerInsightsProps> = ({ 
//   credentials, 
//   onRecommendationClick 
// }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const [jobMatches, setJobMatches] = useState<any[]>([]);
//   const [salaryInsights, setSalaryInsights] = useState<any>({});
//   const [skillGaps, setSkillGaps] = useState<any[]>([]);
//   const [marketTrends, setMarketTrends] = useState<any[]>([]);
//   const [openRecommendations, setOpenRecommendations] = useState(false);
//   const [animateIn, setAnimateIn] = useState(false);

//   useEffect(() => {
//     generateCareerInsights();
//     const timer = setTimeout(() => setAnimateIn(true), 300);
//     return () => clearTimeout(timer);
//   }, [credentials]);

//   const generateCareerInsights = () => {
//     // Mock job matches based on credentials
//     const jobs = [
//       {
//         title: "Senior Blockchain Developer",
//         company: "CryptoTech Solutions",
//         salary: "$120,000 - $180,000",
//         match: 95,
//         location: "Remote / San Francisco",
//         type: "Full-time",
//         skills: ["Solidity", "Web3", "React", "Node.js"],
//         description: "Lead blockchain development for next-gen DeFi applications",
//         growth: "+23%"
//       },
//       {
//         title: "Web3 Product Manager",
//         company: "Decentralized Labs",
//         salary: "$130,000 - $160,000", 
//         match: 88,
//         location: "New York, NY",
//         type: "Full-time",
//         skills: ["Product Strategy", "Blockchain", "Analytics"],
//         description: "Drive product vision for Web3 consumer applications",
//         growth: "+31%"
//       },
//       {
//         title: "Smart Contract Auditor",
//         company: "SecureChain Audit",
//         salary: "$100,000 - $150,000",
//         match: 82,
//         location: "Remote / London",
//         type: "Contract",
//         skills: ["Security", "Solidity", "Testing", "Documentation"],
//         description: "Audit smart contracts for security vulnerabilities",
//         growth: "+67%"
//       }
//     ];
//     setJobMatches(jobs);

//     // Mock salary insights
//     setSalaryInsights({
//       current: "$85,000",
//       potential: "$135,000",
//       marketAverage: "$112,000",
//       growth: "+58%",
//       topPercentile: "$200,000"
//     });

//     // Mock skill gaps
//     setSkillGaps([
//       { skill: "Advanced Solidity Patterns", priority: "High", courses: 3 },
//       { skill: "DeFi Protocol Development", priority: "Medium", courses: 5 },
//       { skill: "Blockchain Security", priority: "High", courses: 2 },
//       { skill: "Layer 2 Solutions", priority: "Medium", courses: 4 }
//     ]);

//     // Mock market trends
//     setMarketTrends([
//       { technology: "DeFi", growth: "+234%", demand: "Very High" },
//       { technology: "NFTs", growth: "+189%", demand: "High" },
//       { technology: "Layer 2", growth: "+156%", demand: "Very High" },
//       { technology: "Web3 Gaming", growth: "+298%", demand: "Emerging" }
//     ]);
//   };

//   return (
//     <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
//       <Fade in={animateIn} timeout={1000}>
//         <Box>
//           {/* Career Summary Cards */}
//           <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
//             <Grid item xs={12} lg={8}>
//               <Slide direction="right" in={animateIn} timeout={800}>
//                 <Paper sx={{
//                   p: 3,
//                   borderRadius: 4,
//                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                   color: 'white',
//                   position: 'relative',
//                   overflow: 'hidden',
//                   '&::before': {
//                     content: '""',
//                     position: 'absolute',
//                     top: 0,
//                     right: 0,
//                     width: '200px',
//                     height: '200px',
//                     background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
//                     borderRadius: '50%',
//                     transform: 'translate(50px, -50px)'
//                   }
//                 }}>
//                   <Grid container spacing={3}>
//                     <Grid item xs={12} md={6}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                         <Avatar sx={{ 
//                           bgcolor: 'rgba(255,255,255,0.2)', 
//                           mr: 2,
//                           width: 60,
//                           height: 60
//                         }}>
//                           <TrendingUp sx={{ fontSize: 30 }} />
//                         </Avatar>
//                         <Box>
//                           <Typography variant="h5" fontWeight={700}>
//                             Career Trajectory
//                           </Typography>
//                           <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                             AI-Powered Career Analysis
//                           </Typography>
//                         </Box>
//                       </Box>

//                       <Stack spacing={2}>
//                         <Box>
//                           <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
//                             Current Market Value
//                           </Typography>
//                           <Typography variant="h4" fontWeight={800}>
//                             {salaryInsights.current}
//                           </Typography>
//                         </Box>
//                         <Box>
//                           <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
//                             Growth Potential
//                           </Typography>
//                           <Chip 
//                             label={salaryInsights.growth}
//                             sx={{ 
//                               bgcolor: 'rgba(76, 175, 80, 0.2)', 
//                               color: '#4CAF50',
//                               fontWeight: 700
//                             }}
//                           />
//                         </Box>
//                       </Stack>
//                     </Grid>

//                     <Grid item xs={12} md={6}>
//                       <Box sx={{ textAlign: 'center' }}>
//                         <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
//                           Salary Progression
//                         </Typography>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 2 }}>
//                           {[
//                             { label: 'Current', value: 60, amount: '$85K' },
//                             { label: 'Market Avg', value: 80, amount: '$112K' },
//                             { label: 'Potential', value: 95, amount: '$135K' },
//                             { label: 'Top 10%', value: 100, amount: '$200K' }
//                           ].map((item, index) => (
//                             <Box key={index} sx={{ textAlign: 'center', width: '20%' }}>
//                               <Box sx={{
//                                 height: `${item.value}px`,
//                                 backgroundColor: 'rgba(255,255,255,0.3)',
//                                 borderRadius: 1,
//                                 mb: 1,
//                                 position: 'relative'
//                               }} />
//                               <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
//                                 {item.label}
//                               </Typography>
//                               <Typography variant="caption" display="block" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
//                                 {item.amount}
//                               </Typography>
//                             </Box>
//                           ))}
//                         </Box>
//                       </Box>
//                     </Grid>
//                   </Grid>
//                 </Paper>
//               </Slide>
//             </Grid>

//             <Grid item xs={12} lg={4}>
//               <Slide direction="left" in={animateIn} timeout={800}>
//                 <Paper sx={{
//                   p: 3,
//                   borderRadius: 4,
//                   background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
//                   backdropFilter: 'blur(20px)',
//                   border: '1px solid rgba(255,255,255,0.2)',
//                   height: '100%',
//                   position: 'relative'
//                 }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                     <Avatar sx={{ 
//                       bgcolor: 'primary.main',
//                       mr: 2,
//                       background: 'linear-gradient(135deg, #F7B731, #FC4A1A)'
//                     }}>
//                       <Insights />
//                     </Avatar>
//                     <Typography variant="h6" fontWeight={700} color="text.primary">
//                       Market Insights
//                     </Typography>
//                   </Box>

//                   <Stack spacing={2}>
//                     {marketTrends.slice(0, 3).map((trend, index) => (
//                       <Box key={index} sx={{ 
//                         p: 2, 
//                         borderRadius: 2, 
//                         backgroundColor: 'rgba(0,0,0,0.05)',
//                         border: '1px solid rgba(0,0,0,0.1)'
//                       }}>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//                           <Typography variant="subtitle2" fontWeight={600}>
//                             {trend.technology}
//                           </Typography>
//                           <Chip 
//                             label={trend.growth}
//                             size="small"
//                             color="success"
//                             variant="outlined"
//                           />
//                         </Box>
//                         <Typography variant="caption" color="text.secondary">
//                           Demand: {trend.demand}
//                         </Typography>
//                       </Box>
//                     ))}
//                   </Stack>
//                 </Paper>
//               </Slide>
//             </Grid>
//           </Grid>

//           {/* Job Matches Section */}
//           <Slide direction="up" in={animateIn} timeout={1000}>
//             <Paper sx={{
//               p: 3,
//               borderRadius: 4,
//               background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
//               backdropFilter: 'blur(20px)',
//               border: '1px solid rgba(255,255,255,0.2)',
//               mb: 4
//             }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                 <Avatar sx={{ 
//                   bgcolor: 'primary.main',
//                   mr: 2,
//                   background: 'linear-gradient(135deg, #4ECDC4, #44A08D)'
//                 }}>
//                   <Work />
//                 </Avatar>
//                 <Typography variant="h5" fontWeight={700} color="text.primary">
//                   AI Job Matches
//                 </Typography>
//                 <Chip 
//                   label={`${jobMatches.length} Found`}
//                   color="primary"
//                   sx={{ ml: 2 }}
//                 />
//               </Box>

//               <Grid container spacing={3}>
//                 {jobMatches.map((job, index) => (
//                   <Grid item xs={12} lg={6} key={index}>
//                     <Card sx={{
//                       borderRadius: 3,
//                       border: '2px solid transparent',
//                       background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #4ECDC4, #45B7D1) border-box',
//                       transition: 'all 0.3s ease',
//                       '&:hover': {
//                         transform: 'translateY(-4px)',
//                         boxShadow: '0 12px 30px rgba(78, 205, 196, 0.2)'
//                       }
//                     }}>
//                       <CardContent sx={{ p: 3 }}>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
//                           <Box sx={{ flex: 1 }}>
//                             <Typography variant="h6" fontWeight={700} gutterBottom>
//                               {job.title}
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary" gutterBottom>
//                               {job.company}
//                             </Typography>
//                           </Box>
//                           <Badge
//                             badgeContent={`${job.match}%`}
//                             color="primary"
//                             sx={{
//                               '& .MuiBadge-badge': {
//                                 fontSize: '0.8rem',
//                                 fontWeight: 700,
//                                 padding: '0 8px',
//                                 borderRadius: 2
//                               }
//                             }}
//                           >
//                             <Avatar sx={{ 
//                               bgcolor: 'success.main',
//                               width: 50,
//                               height: 50
//                             }}>
//                               <Verified />
//                             </Avatar>
//                           </Badge>
//                         </Box>

//                         <Stack spacing={2}>
//                           <Box>
//                             <Stack direction="row" spacing={1} alignItems="center">
//                               <AttachMoney sx={{ fontSize: 18, color: 'success.main' }} />
//                               <Typography variant="body2" fontWeight={600} color="success.main">
//                                 {job.salary}
//                               </Typography>
//                               <Chip 
//                                 label={job.growth}
//                                 size="small"
//                                 color="success"
//                                 variant="outlined"
//                               />
//                             </Stack>
//                           </Box>

//                           <Box>
//                             <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
//                               <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
//                               <Typography variant="body2" color="text.secondary">
//                                 {job.location}
//                               </Typography>
//                               <Chip 
//                                 label={job.type}
//                                 size="small"
//                                 variant="outlined"
//                               />
//                             </Stack>
//                           </Box>

//                           <Typography variant="body2" sx={{ mb: 2 }}>
//                             {job.description}
//                           </Typography>

//                           <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
//                             {job.skills.map((skill: string, skillIndex: number) => (
//                               <Chip 
//                                 key={skillIndex}
//                                 label={skill}
//                                 size="small"
//                                 sx={{ 
//                                   bgcolor: 'primary.light',
//                                   color: 'white',
//                                   fontWeight: 500
//                                 }}
//                               />
//                             ))}
//                           </Stack>

//                           <Button
//                             variant="contained"
//                             fullWidth
//                             sx={{
//                               background: 'linear-gradient(135deg, #4ECDC4, #45B7D1)',
//                               borderRadius: 2,
//                               py: 1,
//                               fontWeight: 600,
//                               textTransform: 'none',
//                               '&:hover': {
//                                 background: 'linear-gradient(135deg, #45B7D1, #4ECDC4)'
//                               }
//                             }}
//                             onClick={() => onRecommendationClick(job)}
//                           >
//                             View Details & Apply
//                           </Button>
//                         </CardContent>
//                       </Card>
//                     </Grid>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Paper>
//           </Slide>

//           {/* Skill Gaps & Recommendations */}
//           <Slide direction="up" in={animateIn} timeout={1200}>
//             <Paper sx={{
//               p: 3,
//               borderRadius: 4,
//               background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
//               backdropFilter: 'blur(20px)',
//               border: '1px solid rgba(255,255,255,0.2)'
//             }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                 <Avatar sx={{ 
//                   bgcolor: 'warning.main',
//                   mr: 2,
//                   background: 'linear-gradient(135deg, #F7B731, #FC4A1A)'
//                 }}>
//                   <Psychology />
//                 </Avatar>
//                 <Typography variant="h5" fontWeight={700} color="text.primary">
//                   AI Skill Gap Analysis
//                 </Typography>
//               </Box>

//               <Alert 
//                 severity="info" 
//                 sx={{ 
//                   mb: 3,
//                   background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(103, 58, 183, 0.1))',
//                   border: '1px solid rgba(33, 150, 243, 0.2)'
//                 }}
//               >
//                 Based on your credential profile and market analysis, here are personalized recommendations to boost your career.
//               </Alert>

//               <Grid container spacing={3}>
//                 {skillGaps.map((gap, index) => (
//                   <Grid item xs={12} md={6} key={index}>
//                     <Card sx={{
//                       borderRadius: 3,
//                       border: `2px solid ${gap.priority === 'High' ? '#F44336' : '#FF9800'}`,
//                       backgroundColor: gap.priority === 'High' ? 'rgba(244, 67, 54, 0.05)' : 'rgba(255, 152, 0, 0.05)'
//                     }}>
//                       <CardContent sx={{ p: 2.5 }}>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                           <Typography variant="h6" fontWeight={600}>
//                             {gap.skill}
//                           </Typography>
//                           <Chip 
//                             label={gap.priority}
//                             size="small"
//                             color={gap.priority === 'High' ? 'error' : 'warning'}
//                             sx={{ fontWeight: 600 }}
//                           />
//                         </Box>
                        
//                         <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                           {gap.courses} relevant courses available
//                         </Typography>

//                         <Button
//                           variant="outlined"
//                           size="small"
//                           startIcon={<School />}
//                           fullWidth
//                           sx={{
//                             borderColor: gap.priority === 'High' ? 'error.main' : 'warning.main',
//                             color: gap.priority === 'High' ? 'error.main' : 'warning.main',
//                             '&:hover': {
//                               borderColor: gap.priority === 'High' ? 'error.main' : 'warning.main',
//                               backgroundColor: gap.priority === 'High' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 152, 0, 0.1)'
//                             }
//                           }}
//                         >
//                           View Learning Path
//                         </Button>
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Paper>
//           </Slide>
//         </Box>
//       </Fade>
//     </Container>
//   );
// };

// export default CareerInsights;
