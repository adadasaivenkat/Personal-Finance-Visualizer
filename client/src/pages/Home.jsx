import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TransactionForm from '../components/TransactionForm';
import {
  getTransactions,
  addTransaction,
  editTransaction,
  deleteTransaction,
  getBudgets,
  addBudget,
  editBudget,
  deleteBudget,
} from '../api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { FiLinkedin, FiInstagram, FiGithub, FiMail } from 'react-icons/fi';

const categories = [
  'Food',
  'Housing',
  'Transport',
  'Utilities',
  'Entertainment',
  'Health',
  'Other',
];
const COLORS = ['#60a5fa', '#fbbf24', '#34d399', '#f87171', '#a78bfa', '#f472b6', '#6b7280'];

function getMonth(date) {
  return date.slice(0, 7); // YYYY-MM
}

function Home() {
  const { isSignedIn, user } = useUser();
  const ownerId = isSignedIn && user ? user.id : 'public';
  // State
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetEdit, setBudgetEdit] = useState(null);
  // Add selectedMonth state
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [ownerId]);

  async function fetchData() {
    setTransactions(await getTransactions(ownerId));
    setBudgets(await getBudgets(ownerId));
  }

  // Transaction handlers
  async function handleAdd(tx) {
    setLoading(true);
    try {
      await addTransaction(tx, ownerId);
      toast.success('Transaction added!');
      setShowForm(false);
      setEditTx(null);
      await fetchData();
    } catch (e) {
      toast.error('Failed to add transaction');
    }
    setLoading(false);
  }
  async function handleEdit(tx) {
    setLoading(true);
    try {
      await editTransaction(editTx._id, tx, ownerId);
      toast.success('Transaction updated!');
      setShowForm(false);
      setEditTx(null);
      await fetchData();
    } catch (e) {
      toast.error('Failed to update transaction');
    }
    setLoading(false);
  }
  async function handleDelete(id) {
    toast((t) => (
      <div>
        <div>Delete this transaction?</div>
        <div className="mt-3 flex justify-center gap-3">
          <button
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteTransaction(id, ownerId);
                toast.success('Transaction deleted!');
                await fetchData();
              } catch (e) {
                toast.error('Failed to delete transaction');
              }
            }}
          >Confirm</button>
          <button
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
            onClick={() => toast.dismiss(t.id)}
          >Cancel</button>
        </div>
      </div>
    ), { duration: 6000 });
  }

  // Budget handlers
  async function handleAddBudget(b) {
    setLoading(true);
    try {
      await addBudget(b, ownerId);
      toast.success('Budget added!');
      setShowBudgetForm(false);
      setBudgetEdit(null);
      await fetchData();
    } catch (e) {
      toast.error('Failed to add budget');
    }
    setLoading(false);
  }
  async function handleEditBudget(b) {
    setLoading(true);
    try {
      await editBudget(budgetEdit._id, b, ownerId);
      toast.success('Budget updated!');
      setShowBudgetForm(false);
      setBudgetEdit(null);
      await fetchData();
    } catch (e) {
      toast.error('Failed to update budget');
    }
    setLoading(false);
  }
  async function handleDeleteBudget(id) {
    toast((t) => (
      <div>
        <div>Delete this budget?</div>
        <div className="mt-3 flex justify-center gap-3">
          <button
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteBudget(id, ownerId);
                toast.success('Budget deleted!');
                await fetchData();
              } catch (e) {
                toast.error('Failed to delete budget');
              }
            }}
          >Confirm</button>
          <button
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
            onClick={() => toast.dismiss(t.id)}
          >Cancel</button>
        </div>
      </div>
    ), { duration: 6000 });
  }

  // Aggregations
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0); // NEW: total budget for all budgets
  // Only show transactions for the selected month in the table and recent list
  const monthlyTx = transactions.filter(t => getMonth(t.date) === selectedMonth);
  const recentTx = monthlyTx.slice(0, 5);
  // Use selectedMonth instead of current month
  const monthlyTotal = monthlyTx.reduce((sum, t) => sum + t.amount, 0);
  const budgetsThisMonth = budgets.filter(b => b.month === selectedMonth);
  const budgetMap = Object.fromEntries(budgetsThisMonth.map(b => [b.category, b.amount]));
  const spentByCat = categories.map(cat => ({
    category: cat,
    value: monthlyTx.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0),
    budget: budgetMap[cat] || 0,
  }));
  const overspent = spentByCat.filter(c => c.budget > 0 && c.value > c.budget);

  // Chart data
  const pieData = spentByCat.filter(c => c.value > 0);
  const barData = Array.from(new Set(transactions.map(t => getMonth(t.date)))).sort().map(m => ({
    month: m,
    total: transactions.filter(t => getMonth(t.date) === m).reduce((sum, t) => sum + t.amount, 0),
  }));
  const filteredBarData = barData.filter(d => d.total > 0); // Only months with expenses
  const budgetBarData = spentByCat.map(c => ({ category: c.category, Spent: c.value, Budget: c.budget }));

  return (
    <>
      {/* Header with Clerk Auth */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white border-b flex flex-row items-center justify-between py-3 px-2 md:px-6">
        <div className="flex flex-row items-center">
          <h1 className="text-base sm:text-2xl font-bold tracking-tight leading-tight flex-shrink-0">
            <span className="block sm:inline whitespace-nowrap">Personal Finance</span>
            <span className="block sm:inline whitespace-nowrap"> Visualizer</span>
          </h1>
        </div>
        <div className="flex flex-row gap-2 sm:gap-4 items-center">
          <button
            className="text-sm underline text-blue-600 hover:text-blue-800 focus:outline-none ml-3"
            onClick={() => setShowHowItWorks(true)}
            style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
            type="button"
          >
            How it works
          </button>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="outline">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Sign Up</Button>
              </SignUpButton>
            </>
          )}
        </div>
      </header>
      {/* How it works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4 sm:p-6 text-gray-800 relative">
            <div className="text-lg font-bold mb-2 text-center">How this app works</div>
            <ul className="text-sm text-left list-disc pl-5 mb-4">
              <li>Use all features whether you are logged in or not.</li>
              <li><b>Not logged in:</b> You access and manage public/shared data.</li>
              <li><b>Logged in:</b> You access your own private data.</li>
              <li>Logging in or out switches between your personal and public data.</li>
              <li>All features are available in both modes; only the data is different.</li>
            </ul>
            <button
              className="block mx-auto mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setShowHowItWorks(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto py-6 px-2 sm:px-4 pt-24">
        {/* Welcome message in body */}
        <div className="mb-4">
          <span className="text-xl sm:text-2xl font-bold text-blue-700">
            {isSignedIn
              ? `Welcome, ${user?.firstName || user?.emailAddress || 'User'}`
              : 'Welcome, Guest'}
          </span>
        </div>
        {/* Month Selector */}
        <div className="mb-6 flex flex-col sm:flex-row items-center gap-2 justify-center">
          <label className="font-semibold">Month:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="border rounded px-2 py-1 w-full sm:w-auto"
          />
        </div>
        {/* Dashboard summary cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">₹{totalBudget}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">₹{totalExpenses}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>This Month's Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">₹{monthlyTotal}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Overspending Alert</CardTitle>
            </CardHeader>
            <CardContent>
              {overspent.length > 0 ? (
                <span className="text-red-600 font-semibold">{overspent.map(c => c.category).join(', ')}</span>
              ) : <span className="text-muted-foreground">None</span>}
            </CardContent>
          </Card>
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card className="p-2">
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={60} label>
                      {pieData.map((entry, i) => <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-400 py-10">No data available</div>
              )}
            </CardContent>
          </Card>
          <Card className="p-2">
            <CardHeader>
              <CardTitle>Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200} style={{ background: 'white' }}>
                  <BarChart
                    data={filteredBarData}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                    barCategoryGap={0}
                    barGap={0}
                  >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" minPointSize={10} background={{ fill: '#fff' }}>
                      {filteredBarData.map((entry, index) => (
                        <Cell key={`cell-${entry.month}`}
                          fill={entry.month === selectedMonth ? '#fbbf24' : '#60a5fa'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-400 py-10">No data available</div>
              )}
            </CardContent>
          </Card>
          <Card className="p-2">
            <CardHeader>
              <CardTitle>Budget vs Actual</CardTitle>
            </CardHeader>
            <CardContent>
              {budgetBarData.length > 0 && budgetBarData.some(d => d.Spent > 0 || d.Budget > 0) ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={budgetBarData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Budget" fill="#a7f3d0" />
                    <Bar dataKey="Spent" fill="#f87171" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-400 py-10">No data available</div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Budgets */}
        <Card className="mb-8">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <CardTitle>Budgets ({selectedMonth})</CardTitle>
            <Button onClick={() => { setShowBudgetForm(true); setBudgetEdit(null); }} className="w-full sm:w-auto">Add Budget</Button>
          </CardHeader>
          <CardContent>
            {showBudgetForm && (
              <BudgetForm
                initial={budgetEdit}
                onSubmit={budgetEdit ? handleEditBudget : handleAddBudget}
                onCancel={() => { setShowBudgetForm(false); setBudgetEdit(null); }}
                loading={loading}
              />
            )}
            <div className="overflow-x-auto rounded-lg border mt-2">
              {budgetsThisMonth.length === 0 ? (
                <div className="text-center text-gray-400 py-10">No data available</div>
              ) : (
                <table className="min-w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-2 py-2 text-left font-semibold">Category</th>
                      <th className="px-2 py-2 text-left font-semibold">Amount</th>
                      <th className="px-2 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetsThisMonth.map(b => (
                      <tr key={b._id} className="border-b last:border-b-0">
                        <td className="px-2 py-2">{b.category}</td>
                        <td className="px-2 py-2">₹{b.amount}</td>
                        <td className="px-2 py-2 flex flex-col sm:flex-row gap-2">
                          <Button onClick={() => { setShowBudgetForm(true); setBudgetEdit(b); }} variant="outline" className="w-full sm:w-auto">Edit</Button>
                          <Button onClick={() => handleDeleteBudget(b._id)} variant="destructive" className="w-full sm:w-auto">Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Transactions */}
        <Card className="mb-8">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <CardTitle>Transactions</CardTitle>
            <Button onClick={() => { setShowForm(true); setEditTx(null); }} className="w-full sm:w-auto">Add Transaction</Button>
          </CardHeader>
          <CardContent>
            {showForm && (
              <TransactionForm
                initial={editTx}
                onSubmit={editTx ? handleEdit : handleAdd}
                onCancel={() => { setShowForm(false); setEditTx(null); }}
                loading={loading}
              />
            )}
            <div className="overflow-x-auto rounded-lg border mt-2">
              {monthlyTx.length === 0 ? (
                <div className="text-center text-gray-400 py-10">No data available</div>
              ) : (
                <table className="min-w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-2 py-2 text-left font-semibold">Date</th>
                      <th className="px-2 py-2 text-left font-semibold">Description</th>
                      <th className="px-2 py-2 text-left font-semibold">Category</th>
                      <th className="px-2 py-2 text-left font-semibold">Amount</th>
                      <th className="px-2 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyTx.map(t => (
                      <tr key={t._id} className={overspent.some(c => c.category === t.category) ? 'bg-red-50' : ''}>
                        <td className="px-2 py-2">{t.date.slice(0, 10)}</td>
                        <td className="px-2 py-2">{t.description}</td>
                        <td className="px-2 py-2">{t.category}</td>
                        <td className="px-2 py-2">₹{t.amount}</td>
                        <td className="px-2 py-2 flex flex-col sm:flex-row gap-2">
                          <Button onClick={() => { setShowForm(true); setEditTx(t); }} variant="outline" className="w-full sm:w-auto">Edit</Button>
                          <Button onClick={() => handleDelete(t._id)} variant="destructive" className="w-full sm:w-auto">Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Recent Transactions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {recentTx.map(t => (
                <li key={t._id} className="py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
                  <span>{t.date.slice(0, 10)} - {t.description} ({t.category})</span>
                  <span className="font-semibold">₹{t.amount}</span>
                </li>
              ))}
              {recentTx.length === 0 && <li className="py-2 text-muted-foreground">No transactions yet.</li>}
            </ul>
          </CardContent>
        </Card>
      </div>
      <footer className="w-full bg-gray-100 border-t py-2 mt-8 text-center text-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center gap-4 sm:gap-6 mt-2 sm:mt-4">
            <a
              href="https://www.linkedin.com/in/adadasaivenkat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary-600 transition-colors"
              aria-label="LinkedIn"
            >
              <FiLinkedin className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/saivenkatadada?igsh=NXUwY3R2MGxpdzEy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary-600 transition-colors"
              aria-label="Instagram"
            >
              <FiInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/adadasaivenkat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary-600 transition-colors"
              aria-label="GitHub"
            >
              <FiGithub className="h-5 w-5" />
            </a>
            <a
              href="mailto:adadasaivenkat0109@gmail.com"
              className="text-gray-500 hover:text-primary-600 transition-colors"
              aria-label="Gmail"
            >
              <FiMail className="h-5 w-5" />
            </a>
          </div>
          <div className="mt-2 text-xs text-gray-400">© {new Date().getFullYear()} Personal Finance Visualizer. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
}

// BudgetForm component (polished with shadcn/ui)
import { Input } from '../components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';

function BudgetForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || { category: '', month: new Date().toISOString().slice(0, 7), amount: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => { if (initial) setForm(initial); }, [initial]);

  function validate() {
    const errs = {};
    if (!form.category) errs.category = 'Category required';
    if (!form.month) errs.month = 'Month required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }
  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function handleSelectChange(value) { setForm({ ...form, category: value }); }
  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, amount: Number(form.amount) });
  }
  return (
    <form className="space-y-4 mb-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <Select value={form.category} onValueChange={handleSelectChange}>
          <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>
        {errors.category && <div className="text-red-500 text-xs mt-1">{errors.category}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Month</label>
        <Input type="month" name="month" value={form.month} onChange={handleChange} className={errors.month ? 'border-red-500' : ''} />
        {errors.month && <div className="text-red-500 text-xs mt-1">{errors.month}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <Input type="number" name="amount" value={form.amount} onChange={handleChange} className={errors.amount ? 'border-red-500' : ''} min="0" step="0.01" />
        {errors.amount && <div className="text-red-500 text-xs mt-1">{errors.amount}</div>}
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
        {onCancel && <Button type="button" onClick={onCancel} variant="secondary">Cancel</Button>}
      </div>
    </form>
  );
}

export default Home; 