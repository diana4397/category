import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import IntlMessages from '../../helpers/IntlMessages';

const IconCardTable = ({ className = 'mb-4', title, children, action }) => {
    return (
        <div className={`icon-row-item ${className}`}>
            <Card>
                <CardBody>
                    <CardTitle>
                        <IntlMessages id={title} />
                    </CardTitle>
                    {children}
                </CardBody>
            </Card>
        </div>
    );
};

export default IconCardTable;
