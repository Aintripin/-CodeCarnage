import { CounterSchema } from 'entities/Counter';
import { UserSchema } from 'app/entities/User';

export interface StateSchema {
    counter: CounterSchema;
    user: UserSchema;
}
