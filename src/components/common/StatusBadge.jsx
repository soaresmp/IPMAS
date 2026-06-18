const configs = {
  Registered: 'bg-green-100 text-green-700',
  Active: 'bg-green-100 text-green-700',
  Completed: 'bg-green-100 text-green-700',
  Closed: 'bg-gray-100 text-gray-600',
  Acquitted: 'bg-gray-100 text-gray-600',
  Pending: 'bg-amber-100 text-amber-700',
  Scheduled: 'bg-blue-100 text-blue-700',
  'Under Review': 'bg-blue-100 text-blue-700',
  'Under Investigation': 'bg-orange-100 text-orange-700',
  Prosecution: 'bg-purple-100 text-purple-700',
  Suspended: 'bg-red-100 text-red-700',
  Open: 'bg-sky-100 text-sky-700',
}

export default function StatusBadge({ status }) {
  const cls = configs[status] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  )
}
