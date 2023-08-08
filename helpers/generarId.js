const generarId = () => {
    const random =Math.random().toString(36).substring(2);
    const date = new Date().getTime().toString(36);
    return `${random}${date}`; 
}

export default generarId;