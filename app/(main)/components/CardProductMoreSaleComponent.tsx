import {Card} from 'primereact/card';
import React from 'react';

interface IProps {
    title: string,
    content: string
    header?: React.JSX.Element,
    footer?: React.JSX.Element,
    subtitle?: string,
}

const CardProductMoreSaleComponent = (
    {
        header,
        footer,
        title,
        subtitle,
        content
    }: IProps
) => {

    return (
        <div className="flex justify-content-center">
            <Card title={title} subTitle={subtitle} footer={footer} header={header} className="md:w-25rem">
                <p className="m-0">
                    {content}
                </p>
            </Card>
        </div>
    )
};

export default CardProductMoreSaleComponent;