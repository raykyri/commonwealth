import { ZodError, ZodSchema } from 'zod';
import { events } from '../schemas';
import {
  InvalidInput,
  type EventContext,
  type EventSchemas,
  type EventsHandlerMetadata,
} from './types';

/**
 * Generic event handler that adapts external protocols to conventional event context flows
 * - Protocol adapters should use this handler to enter the model
 * @param md event metadata
 * @param payload event payload
 * @param validate true to validate payload
 * @returns side effects
 * @throws {@link InvalidInput} when user invokes event with invalid payload, or rethrows internal domain errors
 */
export const event = async <
  Name extends events.Events,
  Input extends EventSchemas,
  Output extends ZodSchema,
>(
  { inputs, body }: EventsHandlerMetadata<Input, Output>,
  { name, payload }: EventContext<Name, typeof events.schemas[Name]>,
  validate = true,
): Promise<Partial<Output> | undefined> => {
  try {
    return (
      (await body[name]({
        name,
        payload: validate ? inputs[name]!.parse(payload) : payload,
      })) ?? undefined
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        const details = (error as ZodError).issues.map(
          ({ path, message }) => `${path.join('.')}: ${message}`,
        );
        throw new InvalidInput('Invalid event payload', details);
      }
      throw error;
    }
    throw new InvalidInput('Invalid event', [error as string]);
  }
};
