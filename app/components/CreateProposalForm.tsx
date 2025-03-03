import { useState } from 'react';

interface CreateProposalFormProps {
  onSubmit: (title: string, description: string, durationInDays: number) => Promise<void>;
  isLoading: boolean;
}

export function CreateProposalForm({ onSubmit, isLoading }: CreateProposalFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationInDays, setDurationInDays] = useState(7);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(title, description, durationInDays);
    setTitle('');
    setDescription('');
    setDurationInDays(7);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
          placeholder="Enter proposal title"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
          placeholder="Enter proposal description"
        />
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">
          Duration (days)
        </label>
        <input
          type="number"
          id="duration"
          value={durationInDays}
          onChange={(e) => setDurationInDays(Number(e.target.value))}
          required
          min={1}
          max={30}
          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating Proposal...' : 'Create Proposal'}
      </button>
    </form>
  );
}