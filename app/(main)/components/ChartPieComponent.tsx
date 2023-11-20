import {Chart} from 'primereact/chart';
import React from 'react';

interface IProps {
    chartData: any;
    chartOptions: any;
}

const ChartPieComponent = ({chartOptions, chartData}: IProps) => {
    return (
        <div className={`col-12 lg:col-3 xl:col-3`}>
            <div className="card flex justify-content-center">
                <Chart type="pie" data={chartData} options={chartOptions} className="w-100 md:w-30rem"/>
            </div>
        </div>
    );
};

export default ChartPieComponent;