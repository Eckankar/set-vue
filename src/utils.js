import _ from 'lodash';

export function cartesianProduct() {
    let args = [...arguments];
    if (args.length == 0) return [[]];

    let rest = cartesianProduct( ...args.slice(1) );

    return _.flatMap(args[0], (a) => _.map(rest, (r) => [a, ...r]));
}

export function combinations(elements, n) {
    if (n == 0) return [[]];

    let result = [];

    for (const [i, v] of elements.entries()) {
        let newElements = combinations(elements.slice(i+1), n-1);
        result = result.concat(_.map(newElements, (e) => [v, ...e]));
    }
    return result;
}
