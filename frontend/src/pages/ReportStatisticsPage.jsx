import { useEffect, useState } from 'react'
import { getReportStatistics } from '../api/reports'

export default function ReportStatisticsPage() {
    const [statistics, setStatistics] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getReportStatistics()
            .then((response) => setStatistics(response.data))
            .catch(() => setError('Грешка при вчитување статистика.'))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="text-center py-16 text-gray-400">Вчитување статистика...</div>
    }

    if (error) {
        return <div className="text-center py-16 text-red-500">{error}</div>
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Статистика / Statistics
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Преглед на бројот на пријави по тип, статус и училиште
                </p>
            </div>

            <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-2xl p-6 mb-6 shadow-sm">
                <p className="text-blue-100 text-sm">Вкупно пријави / Total Reports</p>
                <p className="text-4xl font-bold mt-2">{statistics.totalReports}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <StatisticCard
                    title="Пријави по тип / Reports by Type"
                    items={statistics.byType}
                    icon=""
                />

                <StatisticCard
                    title="Пријави по статус / Reports by Status"
                    items={statistics.byStatus}
                    icon=""
                />

                <StatisticCard
                    title="Пријави по училиште / Reports by School"
                    items={statistics.bySchool}
                    icon=""
                />
            </div>
        </div>
    )
}

function StatisticCard({ title, items, icon }) {
    const maxCount = Math.max(...items.map((item) => item.count), 1)

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4">
                {icon} {title}
            </h2>

            {items.length === 0 ? (
                <p className="text-sm text-gray-400">Нема податоци.</p>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => {
                        const percentage = (item.count / maxCount) * 100

                        return (
                            <div key={item.label}>
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{item.label}</span>
                                    <span className="text-gray-500">{item.count}</span>
                                </div>

                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}