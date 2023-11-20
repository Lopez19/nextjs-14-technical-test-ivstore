import React from 'react';

interface CardComponentSmallProps {
    title: string;
    value: string;
    icon: string;
    color: string;
    nuevoValue?: string;
    textDescription?: string;
    nuevoValueColor?: string;
}

const CardComponentSmall = (
    {
        title,
        value,
        icon,
        color,
        nuevoValue,
        textDescription,
        nuevoValueColor = 'gray'
    }: CardComponentSmallProps
) => {
    return (
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">{title}</span>
                        <div className="text-900 font-medium text-xl">{value}</div>
                    </div>
                    <div className={`flex align-items-center justify-content-center bg-${color}-100 border-round`}
                         style={{width: '2.5rem', height: '2.5rem'}}>
                        <i className={`pi ${icon} text-${color}-500 text-xl`}/>
                    </div>
                </div>
                <span className={`text-${nuevoValueColor}-500 font-medium`}>{nuevoValue} </span>
                <span className="text-500">{textDescription}</span>
            </div>
        </div>
    );
};

export default CardComponentSmall;