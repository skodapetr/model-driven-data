import {useRef} from "react";

/**
 * If the `live` is true, it returns the `value`. Otherwise, it returns the `value` from the last state when the `live` was true.
 * @param live Whether the `value` is up-to-date.
 * @param value The value to return and remember.
 */
export function usePreviousValue<T>(live: boolean, value: T): T {
    const ref = useRef<T>(value);
    if (live) {
        ref.current = value;
    }
    return ref.current;
}
