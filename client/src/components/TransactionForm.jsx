import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';

const categories = [
  'Food',
  'Housing',
  'Transport',
  'Utilities',
  'Entertainment',
  'Health',
  'Other',
];

function TransactionForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    amount: '',
    date: '',
    description: '',
    category: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  function validate() {
    const errs = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Date required';
    if (!form.description) errs.description = 'Description required';
    if (!form.category) errs.category = 'Category required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSelectChange(value) {
    setForm({ ...form, category: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, amount: Number(form.amount) });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <Input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          min="0"
          step="0.01"
          className={errors.amount ? 'border-red-500' : ''}
        />
        {errors.amount && <div className="text-red-500 text-xs mt-1">{errors.amount}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <Input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className={errors.date ? 'border-red-500' : ''}
        />
        {errors.date && <div className="text-red-500 text-xs mt-1">{errors.date}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <Select value={form.category} onValueChange={handleSelectChange}>
          <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <div className="text-red-500 text-xs mt-1">{errors.category}</div>}
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
        {onCancel && <Button type="button" onClick={onCancel} variant="secondary">Cancel</Button>}
      </div>
    </form>
  );
}

export default TransactionForm; 