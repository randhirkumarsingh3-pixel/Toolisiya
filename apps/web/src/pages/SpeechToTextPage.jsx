import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Copy, FileText, RefreshCcw, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const SpeechToTextPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [supportError, setSupportError] = useState('');
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSupportError("Your browser doesn't support speech recognition. Please try Chrome, Edge, or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
      let currentInterim = '';
      let finalTranscriptChunk = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptChunk += result[0].transcript + ' ';
        } else {
          currentInterim += result[0].transcript;
        }
      }

      if (finalTranscriptChunk) {
        setTranscript(prev => prev + finalTranscriptChunk);
      }
      setInterimTranscript(currentInterim);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      if (event.error !== 'no-speech') {
        toast.error(`Error: ${event.error}`);
        setIsRecording(false);
      }
    };

    recognition.onend = () => {
      if (isRecording) {
        // Auto-restart if it stops unexpectedly while supposed to be recording
        try { recognition.start(); } catch(e) {}
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
      if (isRecording) {
        recognitionRef.current.stop();
        setTimeout(() => {
          try { recognitionRef.current.start(); } catch(e) {}
        }, 100);
      }
    }
  }, [language]);

  const toggleRecording = () => {
    if (supportError) {
      toast.error(supportError);
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setInterimTranscript('');
      toast('Recording stopped');
    } else {
      setInterimTranscript('');
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
        toast.success('Listening... Speak into your microphone');
      } catch (e) {
        toast.error('Microphone access denied or error starting');
      }
    }
  };

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    toast.success('Transcript copied to clipboard');
  };

  const handleDownload = (format) => {
    if (!transcript) return;
    let content = transcript;
    let type = 'text/plain';
    
    if (format === 'json') {
      content = JSON.stringify({ transcript, date: new Date().toISOString(), language }, null, 2);
      type = 'application/json';
    }
    
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript_${Date.now()}.${format === 'json' ? 'json' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Transcript downloaded');
  };

  return (
    <ToolPageTemplate toolData={toolPageData['speech-to-text']}>
      {supportError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8 text-center font-medium border border-destructive/20">
          {supportError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <Card className="lg:col-span-8 shadow-md border-border flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col relative">
            <div className="min-h-[400px] p-6 text-lg md:text-xl leading-relaxed whitespace-pre-wrap flex flex-col">
              {transcript === '' && !interimTranscript && !isRecording && (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                  <Mic className="h-16 w-16 mb-4" />
                  <p>Click the microphone button to start dictating</p>
                </div>
              )}
              
              <span className="text-foreground">{transcript}</span>
              <span className="text-muted-foreground">{interimTranscript}</span>
            </div>

            <div className="p-4 bg-muted/10 border-t flex flex-wrap justify-between items-center gap-4 rounded-b-xl">
              <div className="flex gap-2">
                <Button 
                  size="lg" 
                  variant={isRecording ? "destructive" : "default"} 
                  onClick={toggleRecording}
                  className="rounded-full w-14 h-14 p-0 shadow-lg"
                >
                  {isRecording ? <Square className="h-5 w-5 fill-current" /> : <Mic className="h-6 w-6" />}
                </Button>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button variant="ghost" onClick={() => {setTranscript(''); setInterimTranscript('');}}><RefreshCcw className="h-4 w-4 mr-2"/> Clear</Button>
                <Button variant="outline" onClick={handleCopy} disabled={!transcript}><Copy className="h-4 w-4 mr-2"/> Copy</Button>
                <Button variant="outline" onClick={() => handleDownload('txt')} disabled={!transcript}><FileText className="h-4 w-4 mr-2"/> Save TXT</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader><CardTitle>Recording Settings</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-muted/20 border">
                <Activity className={`h-5 w-5 ${isRecording ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
                <span className="font-medium">{isRecording ? 'Listening...' : 'Ready to record'}</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Spoken Language</label>
                <Select value={language} onValueChange={setLanguage} disabled={isRecording}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="es-ES">Spanish</SelectItem>
                    <SelectItem value="fr-FR">French</SelectItem>
                    <SelectItem value="de-DE">German</SelectItem>
                    <SelectItem value="it-IT">Italian</SelectItem>
                    <SelectItem value="hi-IN">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button 
                  size="lg" 
                  variant={isRecording ? "destructive" : "default"} 
                  className="w-full h-14 text-lg" 
                  onClick={toggleRecording}
                >
                  {isRecording ? <><Square className="h-5 w-5 mr-2 fill-current" /> Stop Recording</> : <><Mic className="h-5 w-5 mr-2" /> Start Recording</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default SpeechToTextPage;