import { CounterSchema } from 'app/entities/Counter';
import { createSelector } from '@reduxjs/toolkit';
import { getCounter } from '../getCounter/getCounter';

export const getCounterValue = createSelector(
    getCounter,
    (counter:CounterSchema) => counter.value,
);
