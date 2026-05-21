import React, { useState, useEffect } from 'react';
import { Clock, Trash2, Download, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

const CalculationHistory = ({ storageKey, onLoadHistory }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    };
    loadData();
    window.addEventListener(`${storageKey}-updated`, loadData);
    return () => window.removeEventListener(`${storageKey}-updated`, loadData);
  }, [storageKey]);

  const handleDelete = (id) => {
    const newHistory = history.filter(item => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(newHistory));
    setHistory(newHistory);
    toast.success("Item removed from history");
  };

  const handleClearAll = () => {
    localStorage.removeItem(storageKey);
    setHistory([]);
    toast.success("History cleared");
  };

  const exportCSV = () => {
    if (!history.length) return;
    const headers = Object.keys(history[0]).filter(k => k !== 'id');
    const csvContent = [
      headers.join(','),
      ...history.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${storageKey}_history.csv`;
    link.click();
    toast.success("History exported as CSV");
  };

  if (!history.length) return null;

  return (
    <Card className="mt-8 shadow-md">
      <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" /> Recent Calculations
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleClearAll}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {item.summary || JSON.stringify(item.inputs)}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button variant="ghost" size="icon" onClick={() => onLoadHistory(item)} title="Load inputs">
                      <RotateCcw className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} title="Delete">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculationHistory;