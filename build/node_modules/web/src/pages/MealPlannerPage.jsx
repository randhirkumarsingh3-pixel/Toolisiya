import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Utensils, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const MealPlannerPage = () => {
  const { currentUser } = useAuth();
  const [meals, setMeals] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [mealType, setMealType] = useState('Breakfast');
  const [mealName, setMealName] = useState('');
  const [ingredientsStr, setIngredientsStr] = useState('');

  useEffect(() => {
    fetchMeals();
  }, [currentUser]);

  const fetchMeals = async () => {
    try {
      if (currentUser) {
        const records = await pb.collection('meals').getFullList({ $autoCancel: false });
        setMeals(records);
      } else {
        setMeals(JSON.parse(localStorage.getItem('localMeals') || '[]'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addMeal = async (e) => {
    e.preventDefault();
    if (!mealName) return;

    const ingredients = ingredientsStr.split(',').map(i => i.trim()).filter(i => i);
    const newMeal = {
      userId: currentUser?.id || null,
      dayOfWeek: selectedDay,
      mealType,
      mealName,
      ingredients,
      mealDate: new Date().toISOString().split('T')[0] + " 00:00:00.000Z" // mock date for schema
    };

    try {
      if (currentUser) {
        await pb.collection('meals').create(newMeal, { $autoCancel: false });
        fetchMeals();
      } else {
        const updated = [...meals, { ...newMeal, id: Date.now().toString() }];
        setMeals(updated);
        localStorage.setItem('localMeals', JSON.stringify(updated));
      }
      setMealName(''); setIngredientsStr('');
      toast.success('Meal added');
    } catch (error) {
      toast.error('Failed to add meal');
    }
  };

  const deleteMeal = async (id) => {
    try {
      if (currentUser) {
        await pb.collection('meals').delete(id, { $autoCancel: false });
        fetchMeals();
      } else {
        const updated = meals.filter(m => m.id !== id);
        setMeals(updated);
        localStorage.setItem('localMeals', JSON.stringify(updated));
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const currentDayMeals = meals.filter(m => m.dayOfWeek === selectedDay);
  
  const shoppingList = [...new Set(meals.flatMap(m => m.ingredients || []))];
  
  const copyList = () => {
    navigator.clipboard.writeText(shoppingList.join('\n'));
    toast.success('Shopping list copied to clipboard');
  };

  return (
    <CalculatorLayout title="Meal Planner" description="Organize your weekly meals & ingredients." category="Productivity" categoryPath="/productivity">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-1 space-y-2 flex overflow-x-auto lg:flex-col pb-4 lg:pb-0">
          {DAYS.map(day => (
            <Button 
              key={day} 
              variant={selectedDay === day ? 'default' : 'ghost'} 
              className={`justify-start shrink-0 ${selectedDay === day ? 'bg-meal-yellow text-meal-yellow-foreground hover:bg-meal-yellow/90 text-black' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </Button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-lg">Add to {selectedDay}</h3>
              <form onSubmit={addMeal} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MEAL_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input value={mealName} onChange={e => setMealName(e.target.value)} placeholder="Meal Name" required />
                </div>
                <Input value={ingredientsStr} onChange={e => setIngredientsStr(e.target.value)} placeholder="Ingredients (comma separated)" />
                <Button type="submit" className="w-full bg-meal-yellow text-black hover:bg-meal-yellow/90"><Plus className="mr-2 h-4 w-4" /> Save Meal</Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {MEAL_TYPES.map(type => {
              const typeMeals = currentDayMeals.filter(m => m.mealType === type);
              if (typeMeals.length === 0) return null;
              return (
                <div key={type} className="border rounded-xl overflow-hidden">
                  <div className="bg-muted px-4 py-2 font-semibold text-sm uppercase tracking-wider">{type}</div>
                  <div className="divide-y bg-card text-card-foreground">
                    {typeMeals.map(meal => (
                      <div key={meal.id} className="p-4 flex justify-between items-start group">
                        <div>
                          <p className="font-bold">{meal.mealName}</p>
                          {meal.ingredients && meal.ingredients.length > 0 && (
                            <p className="text-sm text-muted-foreground mt-1 text-balance">{meal.ingredients.join(', ')}</p>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10" onClick={() => deleteMeal(meal.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {currentDayMeals.length === 0 && (
              <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                <Utensils className="h-8 w-8 mx-auto text-muted-foreground mb-3 opacity-50" />
                <p className="text-muted-foreground text-sm">No meals planned for {selectedDay}.</p>
              </div>
            )}
          </div>
        </div>

        <Card className="lg:col-span-1 h-fit">
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-lg">Shopping List</CardTitle>
            <Button variant="ghost" size="icon" onClick={copyList} disabled={shoppingList.length===0} title="Copy list"><Copy className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            {shoppingList.length === 0 ? (
               <p className="text-muted-foreground text-sm">Add meals with ingredients to generate list.</p>
            ) : (
              <ul className="list-disc pl-4 space-y-1 text-sm">
                {shoppingList.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )}
          </CardContent>
        </Card>

      </div>
    </CalculatorLayout>
  );
};

export default MealPlannerPage;