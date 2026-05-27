import React from 'react';
import {
  Wrench, Calculator, FileText, Image as ImageIcon, Code2, QrCode, Search, 
  Video, Music, Settings, Link as LinkIcon, Download, Upload, Type, File, 
  FileCode, FileJson, FileArchive, Scissors, Minimize, Maximize, Crop, 
  Palette, Camera, Hash, AlignLeft, FileEdit, Printer, Briefcase, Clock, 
  Calendar, List, CheckSquare, Activity, Thermometer, Zap, Ruler, Scale, 
  MessageSquare, Map, Globe, Shield, Lock, Key, CreditCard, DollarSign, 
  Percent, PieChart, BarChart, TrendingUp, Smartphone, Laptop, Monitor, 
  Cpu, Database, Save, Share, Mail, FileAudio, FileVideo, FileSpreadsheet, 
  Play, Wand2, ArrowRight, LayoutTemplate, MonitorPlay, HelpCircle, Star, 
  CheckCircle2, ShieldCheck, MoveRight, ChevronDown, AlignRight, AlignCenter,
  AlignJustify, Bold, Italic, Underline, Strikethrough, PenTool, LayoutGrid,
  FileCheck2, Github, Twitter, Linkedin, ExternalLink, Moon, Sun, Menu, X, LogOut, LayoutDashboard
} from 'lucide-react';

const iconMap = {
  Wrench, Calculator, FileText, Image: ImageIcon, ImageIcon, Code2, QrCode, Search, 
  Video, Music, Settings, Link: LinkIcon, Download, Upload, Type, File, 
  FileCode, FileJson, FileArchive, Scissors, Minimize, Maximize, Crop, 
  Palette, Camera, Hash, AlignLeft, FileEdit, Printer, Briefcase, Clock, 
  Calendar, List, CheckSquare, Activity, Thermometer, Zap, Ruler, Scale, 
  MessageSquare, Map, Globe, Shield, Lock, Key, CreditCard, DollarSign, 
  Percent, PieChart, BarChart, TrendingUp, Smartphone, Laptop, Monitor, 
  Cpu, Database, Save, Share, Mail, FileAudio, FileVideo, FileSpreadsheet, 
  Play, Wand2, ArrowRight, LayoutTemplate, MonitorPlay, HelpCircle, Star, 
  CheckCircle2, ShieldCheck, MoveRight, ChevronDown, AlignRight, AlignCenter,
  AlignJustify, Bold, Italic, Underline, Strikethrough, PenTool, LayoutGrid,
  FileCheck2, Github, Twitter, Linkedin, ExternalLink, Moon, Sun, Menu, X, LogOut, LayoutDashboard
};

const DynamicIcon = ({ name, className, ...props }) => {
  const IconComponent = iconMap[name] || Wrench;
  return <IconComponent className={className} {...props} />;
};

export default DynamicIcon;
