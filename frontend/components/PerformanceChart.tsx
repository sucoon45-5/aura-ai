"use client";
import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const PerformanceChart = () => {
    const [chartData, setChartData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                const token = localStorage.getItem('aura_token');
                const response = await fetch(`${API_BASE_URL}/dashboard/performance`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch performance data');
                const data = await response.json();

                setChartData({
                    labels: data.map((d: any) => d.date),
                    datasets: [
                        {
                            fill: true,
                            label: 'Portfolio Value ($)',
                            data: data.map((d: any) => d.value),
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderWidth: 2,
                        },
                    ],
                });
                setError(null);
            } catch (err: any) {
                console.error("Chart fetch error:", err);
                setError(err.message);
            }
        };

        fetchPerformanceData();
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: '#141417',
                borderColor: '#232328',
                borderWidth: 1,
                titleColor: '#71717a',
                bodyColor: '#f8f9fa',
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                grid: {
                    color: 'rgba(113, 113, 122, 0.1)',
                },
                ticks: {
                    color: '#71717a',
                    font: {
                        size: 11,
                    },
                },
            },
        },
        elements: {
            line: {
                tension: 0.4,
            },
            point: {
                radius: 0,
            },
        },
    };

    if (error) return <div className="h-[300px] flex items-center justify-center text-red-400 text-sm">Error loading chart: {error}</div>;
    if (!chartData) return <div className="h-[300px] flex items-center justify-center text-muted">Loading chart...</div>;

    return (
        <div className="h-[300px] w-full mt-6">
            <Line options={options as any} data={chartData} />
        </div>
    );
};

export default PerformanceChart;
