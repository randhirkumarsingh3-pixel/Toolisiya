
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate, useLocation, useParams } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { ActiveToolsProvider, useActiveTools } from '@/contexts/ActiveToolsContext.jsx';
import { AppUsageProvider } from '@/contexts/AppUsageContext.jsx';
import { PwaProvider } from '@/contexts/PwaContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import AdminProtectedRoute from '@/components/AdminProtectedRoute.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import MobileBottomNav from '@/components/MobileBottomNav.jsx';
import PwaInstallPrompt from '@/components/PwaInstallPrompt.jsx';
import OfflineBanner from '@/components/OfflineBanner.jsx';
import SplashScreen from '@/components/SplashScreen.jsx';
import GoogleScriptsInjector from '@/components/GoogleScriptsInjector.jsx';
import StickyNavigation from '@/components/StickyNavigation.jsx';
import { useAnalyticsTracker } from '@/hooks/useAnalyticsTracker.js';
import { toolPaths } from '@/data/toolPaths.js';
// import AIAssistant from '@/components/AIAssistant.jsx';
import pb from '@/lib/pocketbaseClient.js';

const validCategories = [
  'finance', 'career', 'developer', 'image', 'document', 'pdf', 
  'science', 'productivity', 'converters', 'utilities', 'generators', 'real-estate'
];

const ToolRedirectHandler = () => {
  const { toolId } = useParams();
  const normalizedToolId = toolId?.toLowerCase().replace(/[\s_]+/g, '-');
  const targetPath = toolPaths[normalizedToolId];
  
  if (targetPath) {
    return <Navigate to={targetPath} replace />;
  }
  
  if (validCategories.includes(normalizedToolId)) {
    return <Navigate to={`/${normalizedToolId}`} replace />;
  }
  
  return <Navigate to="/browse-categories" replace />;
};

const RootToolRedirectHandler = () => {
  const { toolId } = useParams();
  const normalizedToolId = toolId?.toLowerCase().replace(/[\s_]+/g, '-');
  
  // First check if it matches a known tool
  const targetPath = toolPaths[normalizedToolId];
  if (targetPath) {
    return <Navigate to={targetPath} replace />;
  }
  
  // Then check if it matches a category that might have been hit via /CategoryName
  if (validCategories.includes(normalizedToolId)) {
    return <Navigate to={`/${normalizedToolId}`} replace />;
  }
  
  // Otherwise, it's a real 404
  return <NotFoundPage />;
};

const CategoryToolRedirectHandler = () => {
  const { toolId } = useParams();
  const normalizedToolId = toolId?.toLowerCase().replace(/[\s_]+/g, '-');
  
  // Check if it matches a known tool regardless of the wrong category in URL
  const targetPath = toolPaths[normalizedToolId];
  if (targetPath) {
    return <Navigate to={targetPath} replace />;
  }
  
  return <NotFoundPage />;
};

// Core Pages
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const SignUpPage = lazy(() => import('./pages/SignUpPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const OTPLoginPage = lazy(() => import('./pages/OTPLoginPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const HealthReportPage = lazy(() => import('./pages/HealthReportPage.jsx'));
const VerificationTestPage = lazy(() => import('./pages/VerificationTestPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const PwaDashboardPage = lazy(() => import('./pages/PwaDashboardPage.jsx'));
const PwaSettingsPage = lazy(() => import('./pages/PwaSettingsPage.jsx'));
const PwaDownloadPage = lazy(() => import('./pages/PwaDownloadPage.jsx'));

// Legal & Info Pages
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage.jsx'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage.jsx'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage.jsx'));
const BlogListPage = lazy(() => import('./pages/BlogListPage.jsx'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage.jsx'));

// Content Pages
const BestFreeToolsPage = lazy(() => import('./pages/BestFreeToolsPage.jsx'));
const ToolsForStudentsPage = lazy(() => import('./pages/ToolsForStudentsPage.jsx'));
const ToolsForDevelopersPage = lazy(() => import('./pages/ToolsForDevelopersPage.jsx'));
const BusinessToolsPage = lazy(() => import('./pages/BusinessToolsPage.jsx'));
const DailyLifeToolsPage = lazy(() => import('./pages/DailyLifeToolsPage.jsx'));
const IndiaToolsPage = lazy(() => import('./pages/IndiaToolsPage.jsx'));
const BrowseAllCategoriesPage = lazy(() => import('./pages/BrowseAllCategoriesPage.jsx'));

// Admin Pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminAnalyticsDashboard = lazy(() => import('./pages/admin/AdminAnalyticsDashboard.jsx'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement.jsx'));
const ToolsManagement = lazy(() => import('./pages/admin/ToolsManagement.jsx'));
const ContentManagement = lazy(() => import('./pages/admin/ContentManagement.jsx'));
const SEOSettings = lazy(() => import('./pages/admin/SEOSettings.jsx'));
const SEOManagement = lazy(() => import('./pages/admin/SEOManagement.jsx'));
const SEOMonitoring = lazy(() => import('./pages/admin/SEOMonitoring.jsx'));
const SEODashboard = lazy(() => import('./pages/admin/SEODashboard.jsx'));
const GoogleIntegrations = lazy(() => import('./pages/admin/GoogleIntegrations.jsx'));
const SocialMediaSettings = lazy(() => import('./pages/admin/SocialMediaSettings.jsx'));
const GeneralSettings = lazy(() => import('./pages/admin/GeneralSettings.jsx'));
const WebsiteConfiguration = lazy(() => import('./pages/admin/WebsiteConfiguration.jsx'));
const MenuSetup = lazy(() => import('./pages/admin/MenuSetup.jsx'));
const AdminToolControlPanel = lazy(() => import('./pages/admin/AdminToolControlPanel.jsx'));
const AdminProfilePage = lazy(() => import('./pages/admin/AdminProfilePage.jsx'));
const AuditLogPage = lazy(() => import('./pages/admin/AuditLogPage.jsx'));
const DatabaseBackupPage = lazy(() => import('./pages/admin/DatabaseBackupPage.jsx'));

// Category Pages
const FinancePage = lazy(() => import('./pages/FinancePage.jsx'));
const CareerPage = lazy(() => import('./pages/CareerPage.jsx'));
const DeveloperToolsPage = lazy(() => import('./pages/DeveloperToolsPage.jsx'));
const ImagePhotoToolsPage = lazy(() => import('./pages/ImagePhotoToolsPage.jsx'));
const DocumentMediaToolsPage = lazy(() => import('./pages/DocumentMediaToolsPage.jsx'));
const PDFToolsPage = lazy(() => import('./pages/PDFToolsPage.jsx'));

// Finance Tools 
const GstCalculatorPage = lazy(() => import('./pages/GstCalculatorPage.jsx'));
const EmiCalculatorPage = lazy(() => import('./pages/EmiCalculatorPage.jsx'));
const LoanCalculatorPage = lazy(() => import('./pages/LoanCalculatorPage.jsx'));
const InvestmentCalculatorPage = lazy(() => import('./pages/InvestmentCalculatorPage.jsx'));
const SalaryCalculatorPage = lazy(() => import('./pages/SalaryCalculatorPage.jsx'));
const SIPCalculatorPage = lazy(() => import('./pages/SIPCalculatorPage.jsx'));
const FDCalculatorPage = lazy(() => import('./pages/FDCalculatorPage.jsx'));
const DiscountCalculatorPage = lazy(() => import('./pages/DiscountCalculatorPage.jsx'));
const PercentageCalculatorPage = lazy(() => import('./pages/PercentageCalculatorPage.jsx'));
const TaxCalculatorPage = lazy(() => import('./pages/TaxCalculatorPage.jsx'));
const CurrencyConverterPage = lazy(() => import('./pages/CurrencyConverterPage.jsx'));
const AdvancedScientificCalculatorPage = lazy(() => import('./pages/AdvancedScientificCalculatorPage.jsx'));

// Developer Tools
const HtmlPreviewPage = lazy(() => import('./pages/HtmlPreviewPage.jsx'));
const JsonFormatterPage = lazy(() => import('./pages/JSONFormatterPage.jsx'));
const XmlFormatterPage = lazy(() => import('./pages/XmlFormatterPage.jsx'));
const CodeBeautifierPage = lazy(() => import('./pages/CodeBeautifierPage.jsx'));
const ColorPickerPage = lazy(() => import('./pages/ColorPickerPage.jsx'));
const Base64EncoderPage = lazy(() => import('./pages/Base64EncoderPage.jsx'));
const UrlEncoderPage = lazy(() => import('./pages/UrlEncoderPage.jsx'));
const MarkdownToHtmlPage = lazy(() => import('./pages/MarkdownToHtmlPage.jsx'));

// Career Tools
const ResumeBuilderPage = lazy(() => import('./pages/ResumeBuilderPage.jsx'));
const CoverLetterGeneratorPage = lazy(() => import('./pages/CoverLetterGeneratorPage.jsx'));
const JobApplicationTrackerPage = lazy(() => import('./pages/JobApplicationTrackerPage.jsx'));

// Image Tools
const PhotoEditorPage = lazy(() => import('./pages/PhotoEditorPage.jsx'));
const ImageMetadataViewerPage = lazy(() => import('./pages/ImageMetadataViewerPage.jsx'));
const QRCodeScannerPage = lazy(() => import('./pages/QRCodeScannerPage.jsx'));
const OCRDocumentReaderPage = lazy(() => import('./pages/tools/OCRDocumentReaderPage.jsx'));
const ImageCompressorPage = lazy(() => import('./pages/ImageCompressorPage.jsx'));
const ImageConverterPage = lazy(() => import('./pages/ImageConverterPage.jsx'));
const ImageResizerPage = lazy(() => import('./pages/ImageResizerPage.jsx'));
const ImageCropperPage = lazy(() => import('./pages/ImageCropperPage.jsx'));
const ImageFilterPage = lazy(() => import('./pages/ImageFilterPage.jsx'));
const ImageWatermarkPage = lazy(() => import('./pages/ImageWatermarkPage.jsx'));
const ImageMetadataRemoverPage = lazy(() => import('./pages/ImageMetadataRemoverPage.jsx'));
const ImageBatchProcessorPage = lazy(() => import('./pages/ImageBatchProcessorPage.jsx'));
const BatchFramePage = lazy(() => import('./pages/BatchFramePage.jsx'));

// Document Tools
const ReceiptGeneratorPage = lazy(() => import('./pages/ReceiptGeneratorPage.jsx'));
const CertificateGeneratorPage = lazy(() => import('./pages/CertificateGeneratorPage.jsx'));
const LetterGeneratorPage = lazy(() => import('./pages/LetterGeneratorPage.jsx'));
const ContractGeneratorPage = lazy(() => import('./pages/ContractGeneratorPage.jsx'));
const ProposalGeneratorPage = lazy(() => import('./pages/ProposalGeneratorPage.jsx'));
const QuoteGeneratorPage = lazy(() => import('./pages/QuoteGeneratorPage.jsx'));
const BillGeneratorPage = lazy(() => import('./pages/BillGeneratorPage.jsx'));
const InvoiceGeneratorPage = lazy(() => import('./pages/InvoiceGeneratorPage.jsx'));

// PDF Tools
const DocumentScannerPage = lazy(() => import('./pages/DocumentScannerPage.jsx'));
const PDFCompressorPage = lazy(() => import('./pages/PDFCompressorPage.jsx'));
const PDFMergerPage = lazy(() => import('./pages/PDFMergerPage.jsx'));
const PDFSplitterPage = lazy(() => import('./pages/PDFSplitterPage.jsx'));
const PDFPageRotatorPage = lazy(() => import('./pages/PDFPageRotatorPage.jsx'));
const PDFPageExtractorPage = lazy(() => import('./pages/PDFPageExtractorPage.jsx'));
const PDFWatermarkAdderPage = lazy(() => import('./pages/PDFWatermarkAdderPage.jsx'));
const PDFToImageConverterPage = lazy(() => import('./pages/PDFToImageConverterPage.jsx'));
const PDFBlankPageRemoverPage = lazy(() => import('./pages/PDFBlankPageRemoverPage.jsx'));
const PDFPageNumbererPage = lazy(() => import('./pages/PDFPageNumbererPage.jsx'));
const PDFHeaderFooterAdderPage = lazy(() => import('./pages/PDFHeaderFooterAdderPage.jsx'));
const PDFQRCodeAdderPage = lazy(() => import('./pages/PDFQRCodeAdderPage.jsx'));
const PDFBookmarkCreatorPage = lazy(() => import('./pages/PDFBookmarkCreatorPage.jsx'));
const PdfToWordPage = lazy(() => import('./pages/PdfToWordPage.jsx'));
const EditPdfOnlinePage = lazy(() => import('./pages/EditPdfOnlinePage.jsx'));

// Generator Tools
const BarcodeGeneratorPage = lazy(() => import('./pages/BarcodeGeneratorPage.jsx'));
const QrCodeGeneratorPage = lazy(() => import('./pages/QRCodeGeneratorPage.jsx'));
const PasswordGeneratorPage = lazy(() => import('./pages/PasswordGeneratorPage.jsx'));
const TextCaseConverterPage = lazy(() => import('./pages/TextCaseConverterPage.jsx'));
const SlugGeneratorPage = lazy(() => import('./pages/SlugGeneratorPage.jsx'));
const RandomNameGeneratorPage = lazy(() => import('./pages/RandomNameGeneratorPage.jsx'));
const NumberToWordsPage = lazy(() => import('./pages/NumberToWordsPage.jsx'));
const UuidGeneratorPage = lazy(() => import('./pages/UuidGeneratorPage.jsx'));
const WordCounterPage = lazy(() => import('./pages/WordCounterPage.jsx'));

// Science Tools
const ScienceToolsPage = lazy(() => import('./pages/ScienceToolsPage.jsx'));
const MolarityCalculatorPage = lazy(() => import('./pages/MolarityCalculatorPage.jsx'));
const NormalityCalculatorPage = lazy(() => import('./pages/NormalityCalculatorPage.jsx'));
const DilutionCalculatorPage = lazy(() => import('./pages/DilutionCalculatorPage.jsx'));
const MoleFractionCalculatorPage = lazy(() => import('./pages/MoleFractionCalculatorPage.jsx'));
const MolalityCalculatorPage = lazy(() => import('./pages/MolalityCalculatorPage.jsx'));
const PHCalculatorPage = lazy(() => import('./pages/PHCalculatorPage.jsx'));
const VelocityCalculatorPage = lazy(() => import('./pages/VelocityCalculatorPage.jsx'));
const ForceCalculatorPage = lazy(() => import('./pages/ForceCalculatorPage.jsx'));
const WorkCalculatorPage = lazy(() => import('./pages/WorkCalculatorPage.jsx'));
const PowerCalculatorPage = lazy(() => import('./pages/PowerCalculatorPage.jsx'));
const KineticEnergyCalculatorPage = lazy(() => import('./pages/KineticEnergyCalculatorPage.jsx'));
const PotentialEnergyCalculatorPage = lazy(() => import('./pages/PotentialEnergyCalculatorPage.jsx'));
const OhmsLawCalculatorPage = lazy(() => import('./pages/OhmsLawCalculatorPage.jsx'));
const PressureCalculatorPage = lazy(() => import('./pages/PressureCalculatorPage.jsx'));
const WaveSpeedCalculatorPage = lazy(() => import('./pages/WaveSpeedCalculatorPage.jsx'));
const DNARNAConverterPage = lazy(() => import('./pages/DNARNAConverterPage.jsx'));

// Productivity Tools
const ProductivityPage = lazy(() => import('./pages/ProductivityPage.jsx'));
const SmartTodoListPage = lazy(() => import('./pages/SmartTodoListPage.jsx'));
const TaskBoardPage = lazy(() => import('./pages/TaskBoardPage.jsx'));
const DailyPlannerPage = lazy(() => import('./pages/DailyPlannerPage.jsx'));
const StickyNotesPage = lazy(() => import('./pages/StickyNotesPage.jsx'));
const MeetingNotesPage = lazy(() => import('./pages/MeetingNotesPage.jsx'));
const CountdownTimerPage = lazy(() => import('./pages/CountdownTimerPage.jsx'));
const PomodoroTimerPage = lazy(() => import('./pages/PomodorTimerPage.jsx'));
const HabitStreakPage = lazy(() => import('./pages/HabitStreakPage.jsx'));
const WaterTrackerPage = lazy(() => import('./pages/WaterTrackerPage.jsx'));
const MoodTrackerPage = lazy(() => import('./pages/MoodTrackerPage.jsx'));
const ExpenseReminderPage = lazy(() => import('./pages/ExpenseReminderPage.jsx'));
const MedicineReminderPage = lazy(() => import('./pages/MedicineReminderPage.jsx'));
const MealPlannerPage = lazy(() => import('./pages/MealPlannerPage.jsx'));
const RoutineBuilderPage = lazy(() => import('./pages/RoutineBuilderPage.jsx'));
const TextToSpeechPage = lazy(() => import('./pages/TextToSpeechPage.jsx'));
const SpeechToTextPage = lazy(() => import('./pages/SpeechToTextPage.jsx'));

// Converter Tools
const ConvertersPage = lazy(() => import('./pages/ConvertersPage.jsx'));
const LengthConverterPage = lazy(() => import('./pages/LengthConverterPage.jsx'));
const WeightConverterPage = lazy(() => import('./pages/WeightConverterPage.jsx'));
const TemperatureConverterPage = lazy(() => import('./pages/TemperatureConverterPage.jsx'));
const VolumeConverterPage = lazy(() => import('./pages/VolumeConverterPage.jsx'));
const SpeedConverterPage = lazy(() => import('./pages/SpeedConverterPage.jsx'));
const AreaConverterPage = lazy(() => import('./pages/AreaConverterPage.jsx'));
const AudioConverterPage = lazy(() => import('./pages/AudioConverterPage.jsx'));
const VideoConverterPage = lazy(() => import('./pages/VideoConverterPage.jsx'));
const SubtitleConverterPage = lazy(() => import('./pages/SubtitleConverterPage.jsx'));

// Additional Finance Tools
const AgeCalculatorPage = lazy(() => import('./pages/AgeCalculatorPage.jsx'));
const BudgetPlannerPage = lazy(() => import('./pages/BudgetPlannerPage.jsx'));

// Additional Career Tools
const SalaryNegotiationPage = lazy(() => import('./pages/SalaryNegotiationPage.jsx'));
const LinkedInOptimizerPage = lazy(() => import('./pages/LinkedInOptimizerPage.jsx'));
const InterviewPreparationPage = lazy(() => import('./pages/InterviewPreparationPage.jsx'));
const CareerPathPlannerPage = lazy(() => import('./pages/CareerPathPlannerPage.jsx'));
const SkillsAssessmentPage = lazy(() => import('./pages/SkillsAssessmentPage.jsx'));
const PortfolioBuilderPage = lazy(() => import('./pages/PortfolioBuilderPage.jsx'));

// Real Estate Tools
const RealEstateToolsPage = lazy(() => import('./pages/RealEstateToolsPage.jsx'));
const ConstructionCostCalculatorPage = lazy(() => import('./pages/ConstructionCostCalculatorPage.jsx'));
const PaintCalculatorPage = lazy(() => import('./pages/PaintCalculatorPage.jsx'));
const TileCalculatorPage = lazy(() => import('./pages/TileCalculatorPage.jsx'));
const CarpetAreaCalculatorPage = lazy(() => import('./pages/CarpetAreaCalculatorPage.jsx'));

// Invitations
const BirthdayInvitationsPage = lazy(() => import('./pages/BirthdayInvitationsPage.jsx'));
const WeddingInvitationsPage = lazy(() => import('./pages/WeddingInvitationsPage.jsx'));

// Additional PDF/Document Tools
const PDFTextAdderPage = lazy(() => import('./pages/PDFTextAdderPage.jsx'));
const ExcelToPDFPage = lazy(() => import('./pages/ExcelToPDFPage.jsx'));
const WordToPDFPage = lazy(() => import('./pages/WordToPDFPage.jsx'));
const WatermarkRemoverPage = lazy(() => import('./pages/WatermarkRemoverPage.jsx'));

// Utilities
const UtilitiesPage = lazy(() => import('./pages/UtilitiesPage.jsx'));
const GeneratorsPage = lazy(() => import('./pages/GeneratorsPage.jsx'));

const LoadingFallback = () => (
  <div className="min-h-[100dvh] flex items-center justify-center bg-background w-full">
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-center bg-white rounded-full shadow-lg border border-border/10 p-2 w-16 h-16 relative">
        <img
          src="/logo-transparent.png"
          alt="Toolisiya"
          className="w-12 h-12 object-contain animate-[spin_3s_linear_infinite]"
        />
      </div>
      <div className="h-5 w-32 bg-muted/50 rounded-md animate-pulse"></div>
    </div>
  </div>
);

const AppContent = () => {
  useAnalyticsTracker();
  
  useEffect(() => {
    // Log PWA Install Event
    const handleAppInstalled = async () => {
      try {
        await pb.collection('pwa_stats').create({
          event_type: 'install',
          user_agent: navigator.userAgent
        }, { $autoCancel: false });
        console.log('PWA installation logged to server.');
      } catch (err) {
        console.error('Failed to log PWA installation:', err);
      }
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const location = useLocation();
  const { inactiveUrls, inactiveCategorySlugs } = useActiveTools();

  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin-login';
  // Normalize pathname: remove trailing slash for comparison
  const normalizedPath = location.pathname.endsWith('/') && location.pathname !== '/'
    ? location.pathname.slice(0, -1)
    : location.pathname;

  // Check if this path represents an inactive tool
  const isInactiveTool = inactiveUrls.has(normalizedPath);

  // Check if this path represents an inactive category
  const categorySlug = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
  const isInactiveCategory = inactiveCategorySlugs.has(categorySlug);

  if (!isAdminRoute && (isInactiveTool || isInactiveCategory)) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background relative w-full overflow-x-hidden">
        <ScrollToTop />
        <GoogleScriptsInjector />
        <Toaster position="top-center" toastOptions={{ className: 'rounded-xl border-border shadow-lg' }} />
        <Header />
        <main className="flex-1 flex flex-col relative w-full">
          {location.pathname !== '/' && <StickyNavigation global={true} />}
          <NotFoundPage />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative w-full overflow-x-hidden">
      <ScrollToTop />
      <GoogleScriptsInjector />
      <OfflineBanner />
      <PwaInstallPrompt />
      <Toaster position="top-center" toastOptions={{ className: 'rounded-xl border-border shadow-lg' }} />
      
      {!isAdminRoute && <Header />}

      <main className="flex-1 flex flex-col relative w-full pb-16 md:pb-0">
        {!isAdminRoute && location.pathname !== '/' && <StickyNavigation global={true} />}
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/otp-login" element={<OTPLoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Legal & Info Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about-us" element={<Navigate to="/about" replace />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/terms-and-conditions" element={<Navigate to="/terms-of-service" replace />} />
            
            <Route path={import.meta.env.VITE_ADMIN_LOGIN_PATH || "/admin-a8f4c2e9"} element={<AdminLoginPage />} />
            <Route path="/admin-login" element={<Navigate to="/" replace />} />
            
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/browse-categories" element={<BrowseAllCategoriesPage />} />
            <Route path="/categories" element={<Navigate to="/browse-categories" replace />} />
            <Route path="/health-report" element={<HealthReportPage />} />
            <Route path="/verification" element={<VerificationTestPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/app" element={<PwaDashboardPage />} />
            <Route path="/app/dashboard" element={<Navigate to="/app" replace />} />
            <Route path="/settings" element={<PwaSettingsPage />} />
            <Route path="/download" element={<PwaDownloadPage />} />
            <Route path="/download-app" element={<Navigate to="/download" replace />} />

            <Route path="/best-free-online-tools" element={<BestFreeToolsPage />} />
            <Route path="/tools-for-students" element={<ToolsForStudentsPage />} />
            <Route path="/tools-for-developers" element={<ToolsForDevelopersPage />} />
            <Route path="/business-tools" element={<BusinessToolsPage />} />
            <Route path="/daily-life-tools" element={<DailyLifeToolsPage />} />
            <Route path="/india-tools" element={<IndiaToolsPage />} />

            <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminAnalyticsDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="tools" element={<ToolsManagement />} />
              <Route path="tool-control-panel" element={<AdminToolControlPanel />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="seo-settings" element={<SEOSettings />} />
              <Route path="seo-management" element={<SEOManagement />} />
              <Route path="seo-monitoring" element={<SEOMonitoring />} />
              <Route path="seo-dashboard" element={<SEODashboard />} />
              <Route path="seo" element={<Navigate to="/admin/seo-dashboard" replace />} />
              <Route path="google" element={<GoogleIntegrations />} />
              <Route path="social" element={<SocialMediaSettings />} />
              <Route path="settings" element={<GeneralSettings />} />
              <Route path="website-configuration" element={<WebsiteConfiguration />} />
              <Route path="menu-setup" element={<MenuSetup />} />
              <Route path="profile" element={<AdminProfilePage />} />
              <Route path="activity" element={<AuditLogPage />} />
              <Route path="backups" element={<DatabaseBackupPage />} />
            </Route>

            <Route path="/finance" element={<FinancePage />} />
            <Route path="/finance-tools" element={<Navigate to="/finance" replace />} />
            <Route path="/career" element={<CareerPage />} />
            <Route path="/career-tools" element={<Navigate to="/career" replace />} />
            <Route path="/developer" element={<DeveloperToolsPage />} />
            <Route path="/developer-tools" element={<Navigate to="/developer" replace />} />
            <Route path="/image" element={<ImagePhotoToolsPage />} />
            <Route path="/image-tools" element={<Navigate to="/image" replace />} />
            
            {/* Category routing */}
            <Route path="/tools/:toolId" element={<ToolRedirectHandler />} />
            <Route path="/tool/:toolId" element={<ToolRedirectHandler />} />
            <Route path="/document" element={<DocumentMediaToolsPage />} />
            <Route path="/document-tools" element={<Navigate to="/document" replace />} />
            <Route path="/documents" element={<Navigate to="/document" replace />} />
            <Route path="/pdf" element={<PDFToolsPage />} />
            <Route path="/pdf-tools" element={<Navigate to="/pdf" replace />} />
            <Route path="/science" element={<ScienceToolsPage />} />
            <Route path="/science-tools" element={<Navigate to="/science" replace />} />
            <Route path="/productivity" element={<ProductivityPage />} />
            <Route path="/productivity-tools" element={<Navigate to="/productivity" replace />} />
            <Route path="/converters" element={<ConvertersPage />} />
            <Route path="/converter-tools" element={<Navigate to="/converters" replace />} />
            <Route path="/utilities" element={<UtilitiesPage />} />
            <Route path="/utility-tools" element={<Navigate to="/utilities" replace />} />
            <Route path="/generators" element={<GeneratorsPage />} />
            <Route path="/generator-tools" element={<Navigate to="/generators" replace />} />
            <Route path="/real-estate" element={<RealEstateToolsPage />} />
            <Route path="/real-estate-tools" element={<Navigate to="/real-estate" replace />} />
            
            {/* Finance Tools */}
            <Route path="/finance/gst-calculator" element={<GstCalculatorPage />} />
            <Route path="/finance/emi-calculator" element={<EmiCalculatorPage />} />
            <Route path="/finance/loan-calculator" element={<LoanCalculatorPage />} />
            <Route path="/finance/investment-calculator" element={<InvestmentCalculatorPage />} />
            <Route path="/finance/salary-calculator" element={<SalaryCalculatorPage />} />
            <Route path="/finance/sip-calculator" element={<SIPCalculatorPage />} />
            <Route path="/finance/fd-calculator" element={<FDCalculatorPage />} />
            <Route path="/finance/discount-calculator" element={<DiscountCalculatorPage />} />
            <Route path="/finance/percentage-calculator" element={<PercentageCalculatorPage />} />
            <Route path="/finance/income-tax-calculator" element={<TaxCalculatorPage />} />
            <Route path="/finance/currency-converter" element={<CurrencyConverterPage />} />
            <Route path="/finance/advanced-scientific-calculator" element={<AdvancedScientificCalculatorPage />} />
            <Route path="/finance/age-calculator" element={<AgeCalculatorPage />} />
            <Route path="/finance/budget-planner" element={<BudgetPlannerPage />} />

            {/* Developer Tools */}
            <Route path="/developer/json-formatter" element={<JsonFormatterPage />} />
            <Route path="/developer/xml-formatter" element={<XmlFormatterPage />} />
            <Route path="/developer/code-beautifier" element={<CodeBeautifierPage />} />
            <Route path="/developer/color-picker" element={<ColorPickerPage />} />
            <Route path="/developer/base64-encoder-decoder" element={<Base64EncoderPage />} />
            <Route path="/developer/markdown-to-html" element={<MarkdownToHtmlPage />} />
            <Route path="/developer/html-preview" element={<HtmlPreviewPage />} />
            <Route path="/developer/url-encoder" element={<UrlEncoderPage />} />
            <Route path="/developer/word-counter" element={<WordCounterPage />} />
            <Route path="/developer/uuid-generator" element={<UuidGeneratorPage />} />
            <Route path="/developer/text-to-speech" element={<TextToSpeechPage />} />
            <Route path="/developer/speech-to-text" element={<SpeechToTextPage />} />

            {/* Career Tools */}
            <Route path="/career/resume-builder" element={<ResumeBuilderPage />} />
            <Route path="/career/cover-letter-generator" element={<CoverLetterGeneratorPage />} />
            <Route path="/career/job-application-tracker" element={<JobApplicationTrackerPage />} />
            <Route path="/career/salary-negotiation" element={<SalaryNegotiationPage />} />
            <Route path="/career/linkedin-optimizer" element={<LinkedInOptimizerPage />} />
            <Route path="/career/interview-preparation" element={<InterviewPreparationPage />} />
            <Route path="/career/career-path-planner" element={<CareerPathPlannerPage />} />
            <Route path="/career/skills-assessment" element={<SkillsAssessmentPage />} />
            <Route path="/career/portfolio-builder" element={<PortfolioBuilderPage />} />

            {/* Image Tools */}
            <Route path="/image/photo-editor" element={<PhotoEditorPage />} />
            <Route path="/image/image-metadata-viewer" element={<ImageMetadataViewerPage />} />
            <Route path="/image/qr-code-scanner" element={<QRCodeScannerPage />} />
            <Route path="/image/image-compressor" element={<ImageCompressorPage />} />
            <Route path="/image/image-converter" element={<ImageConverterPage />} />
            <Route path="/image/image-resizer" element={<ImageResizerPage />} />
            <Route path="/image/image-cropper" element={<ImageCropperPage />} />
            <Route path="/image/image-filter" element={<ImageFilterPage />} />
            <Route path="/image/image-watermark" element={<ImageWatermarkPage />} />
            <Route path="/image/image-metadata-remover" element={<ImageMetadataRemoverPage />} />
            <Route path="/image/image-batch-processor" element={<ImageBatchProcessorPage />} />
            <Route path="/image/batch-frame" element={<BatchFramePage />} />
            <Route path="/image/watermark-remover" element={<WatermarkRemoverPage />} />

            {/* Document Tools */}
            <Route path="/document/receipt-generator" element={<ReceiptGeneratorPage />} />
            <Route path="/document/certificate-generator" element={<CertificateGeneratorPage />} />
            <Route path="/document/letter-generator" element={<LetterGeneratorPage />} />
            <Route path="/document/contract-generator" element={<ContractGeneratorPage />} />
            <Route path="/document/proposal-generator" element={<ProposalGeneratorPage />} />
            <Route path="/document/quote-generator" element={<QuoteGeneratorPage />} />
            <Route path="/document/bill-generator" element={<BillGeneratorPage />} />
            <Route path="/document/invoice-generator" element={<InvoiceGeneratorPage />} />

            {/* PDF Tools */}
            <Route path="/pdf/document-scanner" element={<DocumentScannerPage />} />
            <Route path="/pdf/ocr-document-reader" element={<OCRDocumentReaderPage />} />
            <Route path="/document/document-scanner" element={<Navigate to="/pdf/document-scanner" replace />} />
            <Route path="/pdf/pdf-compressor" element={<PDFCompressorPage />} />
            <Route path="/pdf/pdf-merger" element={<PDFMergerPage />} />
            <Route path="/pdf/pdf-splitter" element={<PDFSplitterPage />} />
            <Route path="/pdf/pdf-page-rotator" element={<PDFPageRotatorPage />} />
            <Route path="/pdf/pdf-page-extractor" element={<PDFPageExtractorPage />} />
            <Route path="/pdf/pdf-watermark-adder" element={<PDFWatermarkAdderPage />} />
            <Route path="/pdf/pdf-to-image-converter" element={<PDFToImageConverterPage />} />
            <Route path="/pdf/pdf-blank-page-remover" element={<PDFBlankPageRemoverPage />} />
            <Route path="/pdf/pdf-page-number" element={<PDFPageNumbererPage />} />
            <Route path="/pdf/pdf-header-footer-adder" element={<PDFHeaderFooterAdderPage />} />
            <Route path="/pdf/pdf-qr-code-adder" element={<PDFQRCodeAdderPage />} />
            <Route path="/pdf/pdf-bookmark-creator" element={<PDFBookmarkCreatorPage />} />
            <Route path="/pdf/pdf-text-adder" element={<PDFTextAdderPage />} />
            <Route path="/pdf/excel-to-pdf" element={<ExcelToPDFPage />} />
            <Route path="/pdf/word-to-pdf" element={<WordToPDFPage />} />
            <Route path="/pdf/pdf-to-word" element={<PdfToWordPage />} />
            <Route path="/pdf/edit-pdf-online" element={<EditPdfOnlinePage />} />
            
            {/* Generator Tools */}
            <Route path="/generator/barcode-generator" element={<BarcodeGeneratorPage />} />
            <Route path="/generator/qr-code-generator" element={<QrCodeGeneratorPage />} />
            <Route path="/generator/password-generator" element={<PasswordGeneratorPage />} />
            <Route path="/generator/text-case-generator" element={<TextCaseConverterPage />} />
            <Route path="/generator/slug-generator" element={<SlugGeneratorPage />} />
            <Route path="/generator/random-name-generator" element={<RandomNameGeneratorPage />} />
            <Route path="/generator/number-to-words" element={<NumberToWordsPage />} />

            {/* Science Tools */}
            <Route path="/science/molarity-calculator" element={<MolarityCalculatorPage />} />
            <Route path="/science/normality-calculator" element={<NormalityCalculatorPage />} />
            <Route path="/science/dilution-calculator" element={<DilutionCalculatorPage />} />
            <Route path="/science/mole-fraction-calculator" element={<MoleFractionCalculatorPage />} />
            <Route path="/science/molality-calculator" element={<MolalityCalculatorPage />} />
            <Route path="/science/ph-calculator" element={<PHCalculatorPage />} />
            <Route path="/science/velocity-calculator" element={<VelocityCalculatorPage />} />
            <Route path="/science/force-calculator" element={<ForceCalculatorPage />} />
            <Route path="/science/work-calculator" element={<WorkCalculatorPage />} />
            <Route path="/science/power-calculator" element={<PowerCalculatorPage />} />
            <Route path="/science/kinetic-energy-calculator" element={<KineticEnergyCalculatorPage />} />
            <Route path="/science/potential-energy-calculator" element={<PotentialEnergyCalculatorPage />} />
            <Route path="/science/ohms-law-calculator" element={<OhmsLawCalculatorPage />} />
            <Route path="/science/pressure-calculator" element={<PressureCalculatorPage />} />
            <Route path="/science/wave-speed-calculator" element={<WaveSpeedCalculatorPage />} />
            <Route path="/science/dna-rna-converter" element={<DNARNAConverterPage />} />

            {/* Productivity Tools */}
            <Route path="/productivity/smart-todo-list" element={<SmartTodoListPage />} />
            <Route path="/productivity/task-board" element={<TaskBoardPage />} />
            <Route path="/productivity/daily-planner" element={<DailyPlannerPage />} />
            <Route path="/productivity/sticky-notes" element={<StickyNotesPage />} />
            <Route path="/productivity/meeting-notes" element={<MeetingNotesPage />} />
            <Route path="/productivity/countdown-timer" element={<CountdownTimerPage />} />
            <Route path="/productivity/pomodoro-timer" element={<PomodoroTimerPage />} />
            <Route path="/productivity/habit-streak" element={<HabitStreakPage />} />
            <Route path="/productivity/water-tracker" element={<WaterTrackerPage />} />
            <Route path="/productivity/mood-tracker" element={<MoodTrackerPage />} />
            <Route path="/productivity/expense-reminder" element={<ExpenseReminderPage />} />
            <Route path="/productivity/medicine-reminder" element={<MedicineReminderPage />} />
            <Route path="/productivity/meal-planner" element={<MealPlannerPage />} />
            <Route path="/productivity/routine-builder" element={<RoutineBuilderPage />} />

            {/* Converter Tools */}
            <Route path="/converters/length-converter" element={<LengthConverterPage />} />
            <Route path="/converters/weight-converter" element={<WeightConverterPage />} />
            <Route path="/converters/temperature-converter" element={<TemperatureConverterPage />} />
            <Route path="/converters/volume-converter" element={<VolumeConverterPage />} />
            <Route path="/converters/speed-converter" element={<SpeedConverterPage />} />
            <Route path="/converters/area-converter" element={<AreaConverterPage />} />
            <Route path="/converters/audio-converter" element={<AudioConverterPage />} />
            <Route path="/converters/video-converter" element={<VideoConverterPage />} />
            <Route path="/converters/subtitle-converter" element={<SubtitleConverterPage />} />

            {/* Real Estate Tools */}
            <Route path="/real-estate/construction-cost-calculator" element={<ConstructionCostCalculatorPage />} />
            <Route path="/real-estate/paint-calculator" element={<PaintCalculatorPage />} />
            <Route path="/real-estate/tile-calculator" element={<TileCalculatorPage />} />
            <Route path="/real-estate/carpet-area-calculator" element={<CarpetAreaCalculatorPage />} />

            {/* Invitations */}
            <Route path="/invitations/birthday-invitations" element={<BirthdayInvitationsPage />} />
            <Route path="/invitations/wedding-invitations" element={<WeddingInvitationsPage />} />

            {/* Catch-all for legacy root tool URLs (e.g. /gst-calculator) */}
            <Route path="/:toolId" element={<RootToolRedirectHandler />} />

            {/* Catch-all for legacy category/tool URLs with incorrect categories */}
            <Route path="/:oldCategory/:toolId" element={<CategoryToolRedirectHandler />} />

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute && <Footer />}
      {/* <AIAssistant /> */}
      {!isAdminRoute && <MobileBottomNav />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ActiveToolsProvider>
        <AppUsageProvider>
          <PwaProvider>
            <Router>
              <AppContent />
            </Router>
          </PwaProvider>
        </AppUsageProvider>
      </ActiveToolsProvider>
    </AuthProvider>
  );
}

export default App;
