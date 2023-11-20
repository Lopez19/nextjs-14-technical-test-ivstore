'use client';
import {Chart} from 'primereact/chart';

interface ChartBarComponentProps {
    chartData: any;
    chartOptions: any;
}

function ChartBarComponent({chartData, chartOptions}: ChartBarComponentProps) {
    return (
        <Chart type="bar" data={chartData} options={chartOptions}/>
    );
}

export default ChartBarComponent;