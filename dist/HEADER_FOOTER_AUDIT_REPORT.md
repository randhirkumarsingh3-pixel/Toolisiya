# Codebase Audit Report: Header & Footer Duplicates
**Date:** 2026-04-21
**Objective:** Identify all duplicate `Header` and `Footer` imports and renders across the codebase to ensure they are strictly controlled by `App.jsx`.

---

## 1. Verified Global Layout Structure (CORRECT)
**File:** `apps/web/src/App.jsx`
- **Status:** **✅ CORRECT & VERIFIED**
- **Structure:** 
  - `import Header from '@/components/Header.jsx'` is present.
  - `import Footer from '@/components/Footer.jsx'` is present.
  - `<Header />` renders exactly once, directly above the `<Suspense>` boundary containing `<Routes>`.
  - `<Footer />` renders exactly once, directly below the `<Suspense>` boundary containing `<Routes>`.
  - Global `Toaster` and `ScrollToTop` are correctly positioned.

---

## 2. Layout & Wrapper Components (CORRECT)
The following layout wrapper files were audited and confirmed to be **CLEAN** (No Header/Footer imports or renders). They correctly rely on `App.jsx` for global navigation:

- `apps/web/src/components/CalculatorLayout.jsx` **✅ CLEAN**
- `apps/web/src/components/admin/AdminLayout.jsx` **✅ CLEAN**
- `apps/web/src/components/ProtectedRoute.jsx` **✅ CLEAN**
- `apps/web/src/components/AdminProtectedRoute.jsx` **✅ CLEAN**
- `apps/web/src/components/ProtectedProductivityRoute.jsx` **✅ CLEAN**

---

## 3. Page Components Already Cleaned (CORRECT)
The following pages were cleaned in the previous task and are verified to be **CLEAN**:
- `apps/web/src/pages/ImageConverterPage.jsx` **✅ CLEAN**
- `apps/web/src/pages/IncomeTaxCalculatorPage.jsx` **✅ CLEAN**
- `apps/web/src/pages/LoginPage.jsx` **✅ CLEAN**
- `apps/web/src/pages/TextToSpeechPage.jsx` **✅ CLEAN**

---

## 4. Files Needing Fixes (INCORRECT - To Be Removed in Task 2)
The following files currently contain duplicate `import Header`, `import Footer`, `<Header />`, and/or `<Footer />` declarations that bypass the global `App.jsx` layout. 

**Action Required for EVERY file below:**
1. Remove `import Header from '@/components/Header.jsx';`
2. Remove `import Footer from '@/components/Footer.jsx';`
3. Remove `<Header />` from the JSX tree.
4. Remove `<Footer />` from the JSX tree.

### Core Pages
- `apps/web/src/pages/HomePage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/AboutPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/SignUpPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/OTPLoginPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ForgotPasswordPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/AdminLoginPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/NotFoundPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ProfilePage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PrivacyPolicyPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/TermsOfServicePage.jsx` ❌ NEEDS FIX

### Listing & Category Pages
- `apps/web/src/pages/BestFreeToolsPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/BrowseAllCategoriesPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/BusinessToolsPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/CareerPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ConvertersPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/DailyLifeToolsPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/DeveloperToolsPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/DocumentMediaToolsPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/FinancePage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/GeneratorsPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ImagePhotoToolsPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/IndiaToolsPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ProductivityPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/RealEstateToolsPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ScienceToolsPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ToolsForDevelopersPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ToolsForStudentsPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/UtilitiesPage.jsx` ❌ NEEDS FIX

### Calculator & Finance Tools
- `apps/web/src/pages/AdvancedScientificCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/AgeCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/BillGeneratorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/BudgetPlannerPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/CarpetAreaCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ConstructionCostCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/CurrencyConverterPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/DilutionCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/DiscountCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/EmiCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/FDCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ForceCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/GstCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/InvestmentCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/InvoiceGeneratorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/KineticEnergyCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/LoanCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/MolalityCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/MolarityCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/MoleFractionCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/NormalityCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/OhmsLawCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PHCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PaintCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PercentageCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PotentialEnergyCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PowerCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PressureCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/SIPCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/SalaryCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/TaxCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/TileCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/VelocityCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/WaveSpeedCalculatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/WorkCalculatorPage.jsx` ❌ NEEDS FIX

### Generators & Developer Utilities
- `apps/web/src/pages/BarcodeGeneratorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/Base64EncoderDecoderPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/Base64EncoderPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/CertificateGeneratorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/CodeBeautifierPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ColorPickerPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ContractGeneratorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/CoverLetterGeneratorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/HTMLPreviewPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/JSONFormatterPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/JsonFormatterPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/LetterGeneratorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/MarkdownToHtmlPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PasswordGeneratorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ProposalGeneratorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/QRCodeGeneratorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/QrCodeGeneratorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/QuoteGeneratorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/RandomNameGeneratorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ReceiptGeneratorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ResumeBuilderPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/SlugGeneratorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/URLEncoderDecoderPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/UrlEncoderPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/UuidGeneratorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/XmlFormatterPage.jsx` ❌ NEEDS FIX

### Converters
- `apps/web/src/pages/AreaConverterPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/AudioConverterPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/DNARNAConverterPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/LengthConverterPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/SpeedConverterPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/SubtitleConverterPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/TemperatureConverterPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/TextCaseConverterPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/VideoConverterPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/VolumeConverterPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/WeightConverterPage.jsx` ❌ NEEDS FIX

### Image & Media Tools
- `apps/web/src/pages/ImageBatchProcessorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ImageCompressorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ImageCropperPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ImageFilterPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ImageMetadataRemoverPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ImageMetadataViewerPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ImageResizerPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ImageWatermarkPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PhotoEditorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/QRCodeScannerPage.jsx` ❌ NEEDS FIX

### Productivity & Personal Tools
- `apps/web/src/pages/CountdownTimerPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/DailyPlannerPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/ExpenseReminderPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/HabitStreakPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/JobApplicationTrackerPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/MealPlannerPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/MedicineReminderPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/MeetingNotesPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/MoodTrackerPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PomodorTimerPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/RoutineBuilderPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/SmartTodoListPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/SpeechToTextPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/StickyNotesPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/TaskBoardPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/WaterTrackerPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/WordCounterPage.jsx` ❌ NEEDS FIX

### PDF Tools
- `apps/web/src/pages/ExcelToPDFPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PDFBlankPageRemoverPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PDFBookmarkCreatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PDFCompressorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PDFHeaderFooterAdderPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PDFMergerPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PDFPageExtractorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PDFPageNumbererPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PDFPageRotatorPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PDFQRCodeAdderPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PDFSplitterPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PDFTextAdderPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PDFToImageConverterPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PDFWatermarkAdderPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/WordToPDFPage.jsx` ❌ NEEDS FIX

### Invitations
- `apps/web/src/pages/BirthdayInvitationsPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/WeddingInvitationsPage.jsx` ❌ NEEDS FIX

### Other / Deprecated
- `apps/web/src/pages/CareerPathPlannerPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/HealthReportPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/InterviewPreparationGuidePage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/InterviewPreparationPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/LinkedInOptimizerPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/NumberToWordsPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/PortfolioBuilderPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/SalaryNegotiationPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/SkillsAssessmentPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/SkillsAssessmentToolPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/VerificationTestPage.jsx` ❌ NEEDS FIX
- `apps/web/src/pages/WatermarkRemoverPage.jsx` ❌ NEEDS FIX

---

## 5. Summary & Next Steps
This audit has identified all instances where duplicate navigation wrappers likely exist based on the legacy codebase structure prior to the `App.jsx` global wrapper implementation.

**For Task 2, a bulk replacement or sequential removal process should be executed against the list of files in Section 4 to strip out:**