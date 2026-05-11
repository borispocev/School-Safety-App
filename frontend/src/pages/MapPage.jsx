import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { getSchools } from '../api/schools'
import { getReports } from '../api/reports'

const SKOPJE_CENTER = [41.9981, 21.4254]

export default function MapPage() {
    const [schools, setSchools] = useState([])
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        Promise.all([getSchools(), getReports()])
            .then(([schoolsResponse, reportsResponse]) => {
                setSchools(schoolsResponse.data)
                setReports(reportsResponse.data)
            })
            .catch(() => setError('Грешка при вчитување на мапата.'))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="text-center py-16 text-gray-400">Вчитување мапа...</div>
    }

    if (error) {
        return <div className="text-center py-16 text-red-500">{error}</div>
    }

    const schoolsWithCoordinates = schools.filter(
        (school) => school.latitude && school.longitude
    )

    const reportsWithCoordinates = reports.filter(
        (report) => report.latitude && report.longitude
    )

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Мапа / Map
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Визуелен приказ на училишта и пријавени безбедносни проблеми
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <MapContainer
                        center={SKOPJE_CENTER}
                        zoom={12}
                        scrollWheelZoom={true}
                        className="h-[650px] w-full"
                    >
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {schoolsWithCoordinates.map((school) => (
                            <CircleMarker
                                key={`school-${school.id}`}
                                center={[Number(school.latitude), Number(school.longitude)]}
                                radius={9}
                                pathOptions={{
                                    color: '#2563eb',
                                    fillColor: '#2563eb',
                                    fillOpacity: 0.8,
                                }}
                            >
                                <Popup>
                                    <div className="text-sm">
                                        <p className="font-semibold">🏫 {school.name}</p>
                                        <p>{school.city}</p>
                                        <p className="text-gray-500">{school.addressLine1}</p>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}

                        {reportsWithCoordinates.map((report) => (
                            <CircleMarker
                                key={`report-${report.id}`}
                                center={[Number(report.latitude), Number(report.longitude)]}
                                radius={7}
                                pathOptions={{
                                    color: '#dc2626',
                                    fillColor: '#ef4444',
                                    fillOpacity: 0.8,
                                }}
                            >
                                <Popup>
                                    <div className="text-sm max-w-xs">
                                        <p className="font-semibold">🚨 {report.title}</p>
                                        <p className="text-gray-600">{report.reportTypeName}</p>
                                        <p className="text-gray-500 mt-1">{report.locationDetails}</p>
                                        <Link
                                            to={`/reports/${report.id}`}
                                            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                                        >
                                            Отвори пријава
                                        </Link>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>

                <div className="space-y-4">
                    <MapLegend />

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                        <h2 className="font-semibold text-gray-800 mb-3">
                            Статистика / Summary
                        </h2>
                        <div className="space-y-2 text-sm">
                            <p className="flex justify-between">
                                <span className="text-gray-500">Училишта</span>
                                <span className="font-semibold">{schoolsWithCoordinates.length}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-500">Пријави</span>
                                <span className="font-semibold">{reportsWithCoordinates.length}</span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-800">
                        Кликни на marker за да видиш детали за училиште или пријава.
                    </div>
                </div>
            </div>
        </div>
    )
}

function MapLegend() {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-3">
                Легенда / Legend
            </h2>

            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-600 inline-block" />
                    <span>Училиште / School</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-500 inline-block" />
                    <span>Пријава / Report</span>
                </div>
            </div>
        </div>
    )
}