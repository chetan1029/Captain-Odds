function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms*1000));
}
export {sleep}