// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Chip,
//   Avatar,
//   Stack,
//   IconButton,
//   LinearProgress,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Alert
// } from '@mui/material';
// import {
//   TrendingUp,
//   Work,
//   School,
//   Star,
//   AttachMoney,
//   ExpandMore,
//   Lightbulb,
//   Assessment,
//   Timeline,
//   BusinessCenter,
//   Psychology
// } from '@mui/icons-material';

// interface CareerInsightsProps {
//   credentials: any[];
//   onRecommendationClick: (recommendation: any) => void;
// }

// const CareerInsights: React.FC<CareerInsightsProps> = ({ credentials, onRecommendationClick }) => {
//   const [jobMatches, setJobMatches] = useState<any[]>([]);
//   const [salaryInsights, setSalaryInsights] = useState<any>({});
//   const [skillGaps, setSkillGaps] = useState<any[]>([]);
//   const [marketTrends, setMarketTrends] = useState<any[]>([]);
//   const [openRecommendations, setOpenRecommendations] = useState(false);

//   // Mock data generation based on credentials
//   useEffect(() => {
//     generateCareerInsights();
//   }, [credentials]);

//   const generateCareerInsights = () => {
//     // Generate job matches based on credentials
//     const jobs = [
//       {
//         title: "Senior Blockchain Developer",
//         company: "TechCorp",
//         match: 92,
//         salary: "$120K - $180K",
//         location: "Remote",
//         skills: ["Blockchain", "Solidity", "Web3"],
//         urgency: "High"
//       },
//       {
//         title: "Full Stack Engineer",
//         company: "StartupInc",
//         match: 87,
//         salary: "$90K - $140K",
//         location: "San Francisco",
//         skills: ["React", "Node.js", "MongoDB"],
//         urgency: "Medium"
//       },
//       {
//         title: "Product Manager - Fintech",
//         company: "FinanceFlow",
//         match: 78,
//         salary: "$110K - $160K",
//         location: "New York",
//         skills: ["Product Management", "Fintech", "Analytics"],
//         urgency: "Medium"
//       }
//     ];
//     setJobMatches(jobs);

//     // Generate salary insights
//     setSalaryInsights({
//       currentMarketValue: "$115K",
//       potentialIncrease: 23,
//       industryAverage: "$98K",
//       topPercentile: "$165K"
//     });

//     // Generate skill gaps
//     const gaps = [
//       {
//         skill: "AI/Machine Learning",
//         importance: 9,
//         marketDemand: "Very High",
//         timeToLearn: "3-6 months",
//         impact: "High salary increase potential"
//       },
//       {
//         skill: "Cloud Architecture (AWS)",
//         importance: 8,
//         marketDemand: "High", 
//         timeToLearn: "2-4 months",
//         impact: "Better job opportunities"
//       },
//       {
//         skill: "DevOps/CI-CD",
//         importance: 7,
//         marketDemand: "High",
//         timeToLearn: "2-3 months", 
//         impact: "Increased job security"
//       }
//     ];
//     setSkillGaps(gaps);

//     // Generate market trends
//     const trends = [
//       {
//         trend: "Blockchain adoption in traditional finance",
//         growth: "+34%",
//         impact: "Very High",
//         relevance: 95
//       },
//       {
//         trend: "Remote work opportunities",
//         growth: "+156%", 
//         impact: "High",
//         relevance: 89
//       },
//       {
//         trend: "DeFi and Web3 projects",
//         growth: "+78%",
//         impact: "Very High", 
//         relevance: 92
//       }
//     ];
//     setMarketTrends(trends);
//   };

//   const getMatchColor = (match: number) => {
//     if (match >= 90) return 'success';
//     if (match >= 80) return 'primary';
//     if (match >= 70) return 'warning';
//     return 'error';
//   };

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
//         <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
//         AI-Powered Career Insights
//       </Typography>

//       <Grid container spacing={3}>
//         {/* Market Value Card */}
//         <Grid item xs={12} md={4}>
//           <Card sx={{ 
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             color: 'white',
//             height: '100%'
//           }}>
//             <CardContent>
//               <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 2 }}>
//                 <AttachMoney />
//               </Avatar>
//               <Typography variant="h6" gutterBottom>Market Value</Typography>
//               <Typography variant="h3" sx={{ mb: 1 }}>
//                 {salaryInsights.currentMarketValue}
//               </Typography>
//               <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                 +{salaryInsights.potentialIncrease}% above industry average
//               </Typography>
//               <LinearProgress 
//                 variant="determinate" 
//                 value={75}
//                 sx={{ 
//                   mt: 2,
//                   height: 6, 
//                   borderRadius: 3,
//                   backgroundColor: 'rgba(255,255,255,0.2)'
//                 }}
//               />
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Top Job Matches */}
//         <Grid item xs={12} md={8}>
//           <Card sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom>
//               <Work sx={{ mr: 1, verticalAlign: 'middle' }} />
//               Top Job Matches
//             </Typography>
//             <Stack spacing={2}>
//               {jobMatches.slice(0, 3).map((job, index) => (
//                 <Box 
//                   key={index}
//                   sx={{ 
//                     p: 2, 
//                     border: '1px solid',
//                     borderColor: 'divider',
//                     borderRadius: 2,
//                     '&:hover': {
//                       bgcolor: 'action.hover',
//                       cursor: 'pointer'
//                     }
//                   }}
//                 >
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
//                     <Box>
//                       <Typography variant="subtitle1" fontWeight={600}>{job.title}</Typography>
//                       <Typography variant="body2" color="text.secondary">{job.company} • {job.location}</Typography>
//                     </Box>
//                     <Chip 
//                       label={`${job.match}% Match`}
//                       color={getMatchColor(job.match)}
//                       size="small"
//                     />
//                   </Box>
//                   <Typography variant="h6" color="primary" sx={{ mb: 1 }}>{job.salary}</Typography>
//                   <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
//                     {job.skills.slice(0, 3).map((skill: string, skillIndex: number) => (
//                       <Chip key={skillIndex} label={skill} size="small" variant="outlined" />
//                     ))}
//                   </Stack>
//                   <Chip 
//                     label={`${job.urgency} Urgency`}
//                     size="small"
//                     color={job.urgency === 'High' ? 'error' : 'warning'}
//                     variant="outlined"
//                   />
//                 </Box>
//               ))}
//             </Stack>
//           </Card>
//         </Grid>

//         {/* Skill Gap Analysis */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom>
//               <Lightbulb sx={{ mr: 1, verticalAlign: 'middle' }} />
//               Skill Gap Analysis
//             </Typography>
//             <Stack spacing={2}>
//               {skillGaps.map((gap, index) => (
//                 <Accordion key={index} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
//                   <AccordionSummary expandIcon={<ExpandMore />}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 2 }}>
//                       <Typography variant="subtitle2">{gap.skill}</Typography>
//                       <Chip 
//                         label={`Impact: ${gap.importance}/10`}
//                         size="small"
//                         color="primary"
//                         variant="outlined"
//                       />
//                     </Box>
//                   </AccordionSummary>
//                   <AccordionDetails>
//                     <Grid container spacing={2}>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" display="block">Market Demand</Typography>
//                         <Typography variant="body2" fontWeight={600}>{gap.marketDemand}</Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="caption" display="block">Time to Learn</Typography>
//                         <Typography variant="body2" fontWeight={600}>{gap.timeToLearn}</Typography>
//                       </Grid>
//                       <Grid item xs={12}>
//                         <Typography variant="caption" display="block">Impact</Typography>
//                         <Typography variant="body2" color="primary">{gap.impact}</Typography>
//                       </Grid>
//                     </Grid>
//                   </AccordionDetails>
//                 </Accordion>
//               ))}
//             </Stack>
//           </Card>
//         </Grid>

//         {/* Market Trends */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom>
//               <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
//               Industry Trends
//             </Typography>
//             <Stack spacing={2}>
//               {marketTrends.map((trend, index) => (
//                 <Box key={index} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//                     <Typography variant="subtitle2">{trend.trend}</Typography>
//                     <Chip 
//                       label={trend.growth}
//                       color="success"
//                       size="small"
//                     />
//                   </Box>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <Typography variant="caption">Impact: {trend.impact}</Typography>
//                     <Typography variant="caption">Relevance: {trend.relevance}%</Typography>
//                   </Box>
//                 </Box>
//               ))}
//             </Stack>
//           </Card>
//         </Grid>

//         {/* Personalized Recommendations */}
//         <Grid item xs={12}>
//           <Card sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom>
//               <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
//               AI Recommendations
//             </Typography>
//             <Alert severity="info" sx={{ mb: 2 }}>
//               Based on your credential profile and market analysis, here are personalized recommendations to boost your career.
//             </Alert>
//             <Button 
//               variant="contained" 
//               onClick={() => setOpenRecommendations(true)}
//               sx={{ mr: 2 }}
//             >
//               View Detailed Recommendations
//             </Button>
//             <Button variant="outlined">
//               Generate Learning Path
//             </Button>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Recommendations Dialog */}
//       <Dialog 
//         open={openRecommendations} 
//         onClose={() => setOpenRecommendations(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>Personalized Career Recommendations</DialogTitle>
//         <DialogContent>
//           <List>
//             <ListItem>
//               <ListItemIcon><Star color="primary" /></ListItemIcon>
//               <ListItemText 
//                 primary="Complete a Machine Learning certification"
//                 secondary="This will increase your market value by an estimated 25-40% and open up 120+ new job opportunities"
//               />
//             </ListItem>
//             <ListItem>
//               <ListItemIcon><TrendingUp color="success" /></ListItemIcon>
//               <ListItemText 
//                 primary="Focus on DeFi protocol development"
//                 secondary="DeFi is experiencing 78% growth with high demand for skilled developers"
//               />
//             </ListItem>
//             <ListItem>
//               <ListItemIcon><BusinessCenter color="warning" /></ListItemIcon>
//               <ListItemText 
//                 primary="Consider remote blockchain consulting"
//                 secondary="High-paying consulting opportunities are 156% more available for your skill set"
//               />
//             </ListItem>
//           </List>
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// };

// export default CareerInsights;
