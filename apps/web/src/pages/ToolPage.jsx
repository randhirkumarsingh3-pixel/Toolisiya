import React from 'react';
import { useParams } from 'react-router-dom';
import { toolPageContent } from '@/data/toolPageContent.js';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto p-8 mt-10 max-w-3xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong loading this tool</AlertTitle>
            <AlertDescription>
              {this.state.error?.message || 'An unexpected error occurred while rendering the tool page.'}
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    return this.props.children;
  }
}

function ToolPageContent() {
  const { slug } = useParams();
  
  const toolData = toolPageContent.find(tool => tool.slug === slug);

  if (!toolData) {
    console.warn(`Tool with slug '${slug}' not found in toolPageContent`);
    return <NotFoundPage />;
  }

  // Basic validation warning (doesn't stop render, just logs)
  const requiredFields = ['toolName', 'description', 'whatItDoes', 'steps', 'howItWorks', 'features', 'useCases', 'faqs', 'seoContent'];
  const missingFields = requiredFields.filter(field => !toolData[field]);
  if (missingFields.length > 0) {
    console.warn(`Tool '${slug}' is missing required fields:`, missingFields);
  }

  const toolInterfacePlaceholder = (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-4">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
        <span className="text-2xl font-bold text-primary">{toolData.toolName?.charAt(0) || 'T'}</span>
      </div>
      <div>
        <h3 className="text-xl font-bold">{toolData.toolName} Interface</h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          This is a dynamic template page. The actual interactive tool component for {toolData.toolName} would be rendered in this space.
        </p>
      </div>
    </div>
  );

  return (
    <ToolPageTemplate 
      {...toolData}
      toolInterface={toolInterfacePlaceholder}
    />
  );
}

export default function ToolPage() {
  return (
    <ErrorBoundary>
      <ToolPageContent />
    </ErrorBoundary>
  );
}