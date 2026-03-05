import { Suspense } from 'react';
import { HandBook } from '../../models/HandBook';

export const BookGeometry = () => {
    return (
        <Suspense fallback={null}>
            <HandBook />
        </Suspense>
    );
};
