import { Routes, Route } from 'react-router-dom';
import Landing from './routes/Landing';
import Students from './routes/Students';
import StudentProfile from './routes/StudentProfile';
import PortfolioDetail from './routes/PortfolioDetail';
import Opportunities from './routes/Opportunities';
import OpportunityDetail from './routes/OpportunityDetail';
import Projects from './routes/Projects';
import ProjectDetail from './routes/ProjectDetail';
import Profile from './routes/Profile';
import EditProfile from './routes/EditProfile';
import Onboarding from './routes/Onboarding';
import SignIn from './routes/SignIn';
import NotFound from './routes/NotFound';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/students" element={<Students />} />
      <Route path="/students/:id" element={<StudentProfile />} />
      <Route path="/students/:id/portfolio/:itemId" element={<PortfolioDetail />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/opportunities" element={<Opportunities />} />
      <Route path="/opportunities/:id" element={<OpportunityDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
