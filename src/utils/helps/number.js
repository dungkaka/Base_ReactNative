export const Int = (value) => {
    if (Number.isInteger(value)) return value;
    // const intValue = parseInt(String(value));
    // if (intValue != Number(value)) {
    //     throw new Exe(400, "Cast to Int fail !");
    // }
    return Math.round(Float(value));
};

export const Float = (value) => {
    const floatValue = parseFloat(value);
    // if (floatValue != Number(value)) {
    //     throw new HttpException(400, "Cast to Float fail !");
    // }
    return floatValue;
};
