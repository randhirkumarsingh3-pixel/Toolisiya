import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pill, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const MedicineReminderPage = () => {
  const { currentUser } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once');
  const [time, setTime] = useState('08:00');
  
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchMedicines();
  }, [currentUser]);

  const fetchMedicines = async () => {
    try {
      if (currentUser) {
        const records = await pb.collection('medicines').getFullList({ sort: 'medicineTime', $autoCancel: false });
        setMedicines(records);
      } else {
        setMedicines(JSON.parse(localStorage.getItem('localMedicines') || '[]'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addMedicine = async (e) => {
    e.preventDefault();
    if (!name || !dosage || !time) return;

    const newMed = {
      userId: currentUser?.id || null,
      medicineName: name,
      dosage,
      frequency,
      medicineTime: time,
      takenToday: false,
      lastTakenDate: null
    };

    try {
      if (currentUser) {
        await pb.collection('medicines').create(newMed, { $autoCancel: false });
        fetchMedicines();
      } else {
        const updated = [...medicines, { ...newMed, id: Date.now().toString() }].sort((a,b)=> a.medicineTime.localeCompare(b.medicineTime));
        setMedicines(updated);
        localStorage.setItem('localMedicines', JSON.stringify(updated));
      }
      setName(''); setDosage('');
      toast.success('Medicine added');
    } catch (error) {
      toast.error('Failed to add medicine');
    }
  };

  const toggleTaken = async (med) => {
    const isTaken = med.lastTakenDate?.startsWith(todayStr);
    const updates = {
      takenToday: !isTaken,
      lastTakenDate: isTaken ? null : todayStr + " 00:00:00.000Z"
    };

    try {
      if (currentUser) {
        await pb.collection('medicines').update(med.id, updates, { $autoCancel: false });
        fetchMedicines();
      } else {
        const updated = medicines.map(m => m.id === med.id ? { ...m, ...updates } : m);
        setMedicines(updated);
        localStorage.setItem('localMedicines', JSON.stringify(updated));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteMedicine = async (id) => {
    try {
      if (currentUser) {
        await pb.collection('medicines').delete(id, { $autoCancel: false });
        fetchMedicines();
      } else {
        const updated = medicines.filter(m => m.id !== id);
        setMedicines(updated);
        localStorage.setItem('localMedicines', JSON.stringify(updated));
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <CalculatorLayout title="Medicine Reminder" description="Keep track of your medication schedule." category="Productivity" categoryPath="/productivity">
      <Card className="mb-8 border-medicine-red/20 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={addMedicine} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Medicine Name" className="md:col-span-2" required />
            <Input value={dosage} onChange={e => setDosage(e.target.value)} placeholder="Dosage (e.g. 1 pill)" required />
            <Input type="time" value={time} onChange={e => setTime(e.target.value)} required />
            <Button type="submit" className="bg-medicine-red hover:bg-medicine-red/90 text-white"><Plus className="mr-2 h-4 w-4" /> Add</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4 max-w-4xl mx-auto">
        {medicines.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed">
            <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No medicines scheduled.</p>
          </div>
        ) : (
          medicines.map(med => {
            const isTaken = med.lastTakenDate?.startsWith(todayStr);
            return (
              <Card key={med.id} className={`transition-smooth ${isTaken ? 'opacity-60 bg-muted/50 border-transparent' : 'border-border'}`}>
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleTaken(med)} className={`text-3xl transition-transform hover:scale-110 ${isTaken ? 'text-green-500' : 'text-muted-foreground hover:text-medicine-red'}`}>
                      {isTaken ? <CheckCircle2 className="h-8 w-8" /> : <Circle className="h-8 w-8" />}
                    </button>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h3 className={`text-xl font-bold ${isTaken ? 'line-through' : ''}`}>{med.medicineName}</h3>
                        <span className="text-sm font-medium px-2 py-0.5 bg-muted rounded-full">{med.medicineTime}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">{med.dosage} • {med.frequency}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteMedicine(med.id)} className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </CalculatorLayout>
  );
};

export default MedicineReminderPage;