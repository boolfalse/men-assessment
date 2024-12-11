
module.exports = {
    is_natural: (n) => {
        n = n.toString(); // force the value in case it is not
        let n1 = Math.abs(n),
            n2 = parseInt(n, 10);

        return !isNaN(n1) && n2 === n1 && n1.toString() === n;
    },
};