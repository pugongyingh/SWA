const socket = io.connect();

const validMessage = (arg) => {
    return (null != arg &&
        undefined != arg &&
        (typeof arg === 'string' &&
            arg.length > 0));
};